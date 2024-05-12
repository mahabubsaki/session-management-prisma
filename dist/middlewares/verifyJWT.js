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
const verifyJWT = (0, catchAsync_1.default)(async (req, res, next) => {
    const token = req.signedCookies.access_token;
    const refreshToken = req.signedCookies.refresh_token;
    try {
        if (!token || !refreshToken) {
            throw new Error('Unauthorized');
        }
        const decoded = await new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, env_config_1.default.jwtSecret, async (err, decoded) => {
                console.log(err, decoded, new Date().getTime());
                if (err) {
                    if (err.name === 'TokenExpiredError') {
                        console.log('Token expired');
                        // @ts-ignore
                        const storedSession = req.sessionID;
                        const refreshToken = req.signedCookies.refresh_token;
                        if (!storedSession || !refreshToken) {
                            console.log('No stored session or refresh token');
                            return reject(err);
                        }
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
                        jsonwebtoken_1.default.verify(refreshToken, env_config_1.default.jwtSecret, (err, _) => {
                            if (err) {
                                console.log('Refresh token expired');
                                return reject(err);
                            }
                        });
                        const newAccessToken = jsonwebtoken_1.default.sign({ email: session.user.email }, env_config_1.default.jwtSecret, {
                            expiresIn: env_config_1.default.cookieExpiration * 60 * 60, // 4 hours
                        });
                        res.cookie('access_token', newAccessToken, cookie_config_1.default);
                        console.log('New access token generated');
                        resolve({ email: session.user.email });
                    }
                    return reject(err);
                }
                resolve(decoded);
            });
        });
        jsonwebtoken_1.default.verify(refreshToken, env_config_1.default.jwtSecret, (err, _) => {
            if (err) {
                throw new Error('Unauthorized');
            }
        });
        req.user = decoded;
        next();
    }
    catch (error) {
        //@ts-ignore
        const loggedIn = req.session.loggedIn;
        console.log(loggedIn, req.headers);
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
        return next(error.message);
    }
});
exports.default = verifyJWT;
