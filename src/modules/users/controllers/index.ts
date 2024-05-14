import { Prisma } from "@prisma/client";
import prisma from "../../../configs/db/db.config";
import envConfig from "../../../configs/env/env.config";
import catchAsync from "../../../utils/catchAsync";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prismaErrorHandler from "../../../errors/prisma";
import cookieConfig from "../../../configs/env/cookie.config";
import randomString from "../../../utils/randomString";
import redisClient from "../../../configs/redis/redis.config";


const signUpController = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;


    const hashedPassword = await bcrypt.hash(password, 10);
    const accessToken = jwt.sign({ email }, envConfig.jwtSecret, {
        expiresIn: envConfig.cookieExpiration * 60 * 60, // 4 hours

    });
    const refreshToken = jwt.sign({ email }, envConfig.jwtSecret, {
        expiresIn: envConfig.cookieExpiration * 60 * 60 * 6 * 30 * 2, // 2 months
    });


    try {
        const data = await prisma.user.create({
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
        await Promise.all([await prisma.sessions.create({
            data: {
                sessionId: req.sessionID,
                userId: data.id,
                browser: req.headers['user-agent']!,
                browserHash: req.fingerprint?.hash || Math.random().toString(36).substring(7)
            }
        }),
        await prisma.refreshToken.create({
            data: {
                expiresAt: new Date(Date.now() + envConfig.cookieExpiration * 1000 * 60 * 60 * 6 * 30 * 2),
                token: refreshToken,
                userId: data.id

            }
        })]);

        // @ts-ignore
        req.session.loggedIn = true;
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {

            prismaErrorHandler(err);
        }
        else {
            throw new Error('An error occurred while signing up');
        }

    }


    res.cookie('access_token', accessToken, cookieConfig);

    res.cookie('refresh_token', refreshToken, cookieConfig);

    res.status(201).json({
        data: { name, email, password },
        statusCode: 201,
        message: 'Signed up successfully',
        success: true,
        sessionID: req.sessionID
    });
});


const clearSessionController = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    const data = await prisma.user.findFirst({
        where: {
            email
        }
    });
    if (!data) {
        res.statusCode = 404;
        throw new Error('User not found with given email');
    }
    await prisma.sessions.deleteMany({
        where: {
            userId: data?.id
        }
    });
    next();
});

const loginController = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;


    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        res.statusCode = 404;
        throw new Error('User not found with given email');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        res.statusCode = 401;
        throw new Error('Invalid password');
    }

    const accessToken = jwt.sign({ email }, envConfig.jwtSecret, {
        expiresIn: envConfig.cookieExpiration * 60 * 60, // 4 Hours

    });
    const refreshToken = jwt.sign({ email }, envConfig.jwtSecret, {
        expiresIn: envConfig.cookieExpiration * 60 * 60 * 6 * 30 * 2, // 2 months
    });
    console.log(req.sessionID, 'Session ID');
    console.log(new Date(Date.now() + envConfig.cookieExpiration * 1000 * 60 * 60 * 6 * 30 * 2));
    const totalSessions = await prisma.sessions.findMany({
        where: {
            userId: user.id
        },

    });
    console.log(totalSessions, 'Total sessions');
    if (totalSessions.length >= 3) {
        res.statusCode = 403;
        const random = randomString();
        await redisClient.set('temporary_token' + random, random, {
            EX: envConfig.redisExpiration * 60
        });
        throw new Error('Session limit exceeded , Please logout from here or logout from all session, Temporary token:' + random);
    }
    await Promise.all([await prisma.sessions.create({
        data: {
            sessionId: req.sessionID,
            userId: user.id,
            browser: req.headers['user-agent']!,
            browserHash: req.fingerprint?.hash || Math.random().toString(36).substring(7)
        }
    }),

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            token: refreshToken
        }

    }),


    await prisma.refreshToken.upsert({
        where: {
            userId: user.id
        },
        create: {
            expiresAt: new Date(Date.now() + envConfig.cookieExpiration * 1000 * 60 * 60 * 6 * 30 * 2),
            token: refreshToken,
            userId: user.id
        },
        update: {
            expiresAt: new Date(Date.now() + envConfig.cookieExpiration * 1000 * 60 * 60 * 6 * 30 * 2),
            token: refreshToken,
        }
    })]);

    // @ts-ignore
    req.session.loggedIn = true;

    res.cookie('access_token', accessToken, cookieConfig);

    res.cookie('refresh_token', refreshToken, cookieConfig);

    res.status(200).json({
        data: { email, password, sessionLimitExceeded: totalSessions.length >= 3 },
        statusCode: 200,
        message: 'Logged in successfully',
        success: true,
    });
});



const profileController = catchAsync(async (req, res, next) => {
    // @ts-ignore
    console.log(req.sessionID, 'Session ID', req.fingerprint?.hash, 'Fingerprint hash');
    res.json({
        data: req.user,
        statusCode: 200,
        message: 'Profile fetched successfully',
        success: true,
    });
});

const logoutController = catchAsync(async (req, res, next) => {
    // @ts-ignore

    const sessionId =
        await prisma.sessions.delete({
            where: {
                sessionId: req.sessionID,

            }
        });
    console.log(sessionId, 'Deleted session');
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
    });
    res.clearCookie('access_token', { ...cookieConfig, maxAge: 0 });
    res.clearCookie('refresh_token', { ...cookieConfig, maxAge: 0 });
    res.clearCookie('session_id', { ...cookieConfig, maxAge: 0 });
    res.json({
        statusCode: 200,
        message: 'Logged out successfully',
        success: true,
        data: [],
        sessionID: req.sessionID
    });
});


export default {
    signUpController, profileController, logoutController, loginController, clearSessionController
};