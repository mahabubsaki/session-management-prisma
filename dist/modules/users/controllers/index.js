"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const db_config_1 = __importDefault(require("../../../configs/db/db.config"));
const env_config_1 = __importDefault(require("../../../configs/env/env.config"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../../../errors/prisma"));
const cookie_config_1 = __importDefault(require("../../../configs/env/cookie.config"));
const signUpController = (0, catchAsync_1.default)(async (req, res, next) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const accessToken = jsonwebtoken_1.default.sign({ email }, env_config_1.default.jwtSecret, {
        expiresIn: env_config_1.default.cookieExpiration * 1000 * 60 * 60, // 4 hours
    });
    const refreshToken = jsonwebtoken_1.default.sign({ email }, env_config_1.default.jwtSecret, {
        expiresIn: env_config_1.default.cookieExpiration * 1000 * 60 * 60 * 6 * 30 * 2, // 2 months
    });
    try {
        const data = await db_config_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                token: refreshToken,
            },
            select: {
                email: true,
                id: true,
                name: true,
            }
        });
        const session = await db_config_1.default.sessions.create({
            data: {
                sessionId: req.sessionID,
                userId: data.id,
            }
        });
        await db_config_1.default.refreshToken.create({
            data: {
                expiresAt: new Date(Date.now() + env_config_1.default.cookieExpiration * 1000 * 60 * 60 * 6 * 30 * 2),
                token: refreshToken,
                userId: data.id
            }
        });
        // @ts-ignore
        req.session.user = data;
        // @ts-ignore
        req.session.storedSession = session.id;
    }
    catch (err) {
        if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            (0, prisma_1.default)(err);
        }
        throw new Error('An error occurred while signing up');
    }
    res.cookie('access_token', accessToken, cookie_config_1.default);
    res.cookie('refresh_token', refreshToken, cookie_config_1.default);
    res.status(201).json({
        data: { name, email, password },
        statusCode: 201,
        message: 'Signed up successfully',
        success: true,
    });
});
const loginController = (0, catchAsync_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await db_config_1.default.user.findUnique({
        where: {
            email
        }
    });
    if (!user) {
        return res.status(401).json({
            statusCode: 401,
            message: 'Unauthorized',
            success: false,
            error: 'User not found'
        });
    }
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({
            statusCode: 401,
            message: 'Unauthorized',
            success: false,
            error: 'Invalid password'
        });
    }
    const accessToken = jsonwebtoken_1.default.sign({ email }, env_config_1.default.jwtSecret, {
        expiresIn: env_config_1.default.cookieExpiration * 1000 * 60 * 60, // 4 hours
    });
    const refreshToken = jsonwebtoken_1.default.sign({ email }, env_config_1.default.jwtSecret, {
        expiresIn: env_config_1.default.cookieExpiration * 1000 * 60 * 60 * 6 * 30 * 2, // 2 months
    });
    const session = await db_config_1.default.sessions.create({
        data: {
            sessionId: req.sessionID,
            userId: user.id,
        }
    });
    await db_config_1.default.refreshToken.upsert({
        where: {
            userId: user.id
        },
        create: {
            expiresAt: new Date(Date.now() + env_config_1.default.cookieExpiration * 1000 * 60 * 60 * 6 * 30 * 2),
            token: refreshToken,
            userId: user.id
        },
        update: {
            expiresAt: new Date(Date.now() + env_config_1.default.cookieExpiration * 1000 * 60 * 60 * 6 * 30 * 2),
            token: refreshToken,
        }
    });
    // @ts-ignore
    req.session.user = user;
    // @ts-ignore
    req.session.storedSession = session.id;
    res.cookie('access_token', accessToken, cookie_config_1.default);
    res.cookie('refresh_token', refreshToken, cookie_config_1.default);
    res.status(200).json({
        data: { email, password },
        statusCode: 200,
        message: 'Logged in successfully',
        success: true,
    });
});
const profileController = (0, catchAsync_1.default)(async (req, res, next) => {
    // @ts-ignore
    const { user } = req.session;
    if (!user) {
        return res.status(401).json({
            statusCode: 401,
            message: 'Unauthorized',
            success: false,
            error: 'User not found'
        });
    }
    res.json({
        data: user,
        statusCode: 200,
        message: 'Profile fetched successfully',
        success: true,
    });
});
const logoutController = (0, catchAsync_1.default)(async (req, res, next) => {
    // @ts-ignore
    const sessionId = await db_config_1.default.sessions.delete({
        where: {
            sessionId: req.sessionID,
            // @ts-ignore
            id: req.session.storedSession
        }
    });
    console.log(sessionId, 'Deleted session');
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
    });
    res.clearCookie('access_token', { ...cookie_config_1.default, maxAge: 0 });
    res.clearCookie('refresh_token', { ...cookie_config_1.default, maxAge: 0 });
    res.clearCookie('session_id', { ...cookie_config_1.default, maxAge: 0 });
    res.json({
        statusCode: 200,
        message: 'Logged out successfully',
        success: true,
        data: []
    });
});
exports.default = {
    signUpController, profileController, logoutController, loginController
};
