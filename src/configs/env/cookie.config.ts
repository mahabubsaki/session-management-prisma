import { CookieOptions } from "express";
import envConfig from "./env.config";

const cookieConfig: CookieOptions = {
    domain: envConfig.env === 'production' ? '.vercel.com' : '.localhost',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * envConfig.cookieExpiration * 6 * 30 * 2,
    path: '/',
    sameSite: 'strict',
    secure: envConfig.env === 'production' ? true : false,
    priority: 'high',
    signed: true,
};

export default cookieConfig;