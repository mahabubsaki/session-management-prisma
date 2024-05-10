import express, { Request, Response } from 'express';
import router from './routes';
import globalErrorHandler from './errors/global';
import notFoundErrorHandler from './errors/not-found';
import { AppResponse } from './types';
import { CustomResponse } from './interface';
import cors from 'cors';
import session from "express-session";
import envConfig from './configs/env/env.config';
import redisStore from './configs/redis/redis.store';
import cookieParser from 'cookie-parser';
import redisClient from './configs/redis/redis.config';
import util from 'util';
import decodeSessionId from './middlewares/decodeSessionId';






const app = express();

app.use(cookieParser(envConfig.cookieSecret));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));
app.use(session({
    secret: envConfig.sessionSecret,
    resave: false,
    store: redisStore,
    name: 'session_id',
    saveUninitialized: false,
    cookie: {
        domain: envConfig.env === 'production' ? '.vercel.com' : '.localhost',
        httpOnly: true, // safe from XSS attacks
        maxAge: 1000 * 60 * 60 * envConfig.cookieExpiration,
        path: '/', // cookie will be sent to all routes,
        sameSite: 'strict',
        secure: envConfig.env === 'production' ? true : false,
        priority: 'high',
        signed: true,
    }
}));



app.get('/', (_: Request, res: CustomResponse<AppResponse>) => {


    res.json({
        success: true,
        message: 'Welcome to the API',
        statusCode: 200,
        data: []
    });
});


app.use('/api/v1', router);

app.use(globalErrorHandler);
app.use(notFoundErrorHandler);



export default app;