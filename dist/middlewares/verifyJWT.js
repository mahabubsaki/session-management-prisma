"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_config_1 = __importDefault(require("../configs/db/db.config"));
const cookie_config_1 = __importDefault(require("../configs/env/cookie.config"));
const env_config_1 = __importDefault(require("../configs/env/env.config"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const clearAuthCookie_1 = __importDefault(require("../utils/clearAuthCookie"));
const verifyRefreshToken = async (refreshToken) => {
    await new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(refreshToken, env_config_1.default.jwtSecret, (err, _) => {
            if (err) {
                reject('Unauthorized');
            }
            resolve('Refresh token verified');
        });
    });
};
const verifyAccessToken = async (token, storedSession, refreshToken) => {
    const decoded = await new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, env_config_1.default.jwtSecret, async (err, decoded) => {
            console.log(err, decoded, new Date().getTime());
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    console.log('Token expired');
                    const session = await db_config_1.default.sessions.findUnique({
                        where: {
                            sessionId: storedSession
                        },
                        include: {
                            user: true
                        }
                    });
                    if (!session) {
                        console.log('No session found in db');
                        return reject(err);
                    }
                    if (session.user.token !== refreshToken) {
                        console.log('Refresh token does not match');
                        return reject(err);
                    }
                    const newAccessToken = jsonwebtoken_1.default.sign({ email: session.user.email }, env_config_1.default.jwtSecret, {
                        expiresIn: env_config_1.default.cookieExpiration * 60 * 60, // 4 hours
                    });
                    console.log('New access token generated');
                    resolve({ email: session.user.email, newAccessToken });
                }
                return reject(err);
            }
            resolve(decoded);
        });
    });
    return decoded;
};
const verifyJWT = (0, catchAsync_1.default)(async (req, res, next) => {
    const token = req.signedCookies.access_token;
    const refreshToken = req.signedCookies.refresh_token;
    const storedSession = req.sessionID;
    try {
        if (!token || !refreshToken || !storedSession) {
            throw new Error('Unauthorized');
        }
        await verifyRefreshToken(refreshToken);
        const decoded = await verifyAccessToken(token, storedSession, refreshToken);
        if (decoded.newAccessToken) {
            res.cookie('access_token', decoded.newAccessToken, cookie_config_1.default);
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        //@ts-ignore
        const loggedIn = req.session.loggedIn;
        console.log('Error in verifyJWT');
        req.session.destroy(async (err) => {
            if (err) {
                console.log(err);
            }
            if (loggedIn) {
                try {
                    await db_config_1.default.sessions.delete({
                        where: {
                            sessionId: req.sessionID
                        },
                    });
                }
                catch (err) {
                }
            }
        });
        (0, clearAuthCookie_1.default)(res);
        res.statusCode = 401;
        return next({ message: error.message || 'Something went wrong in cookie' });
    }
});
exports.default = verifyJWT;
