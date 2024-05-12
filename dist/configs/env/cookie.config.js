"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_config_1 = __importDefault(require("./env.config"));
const cookieConfig = {
    domain: env_config_1.default.env === 'production' ? '.vercel.com' : '.localhost',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * env_config_1.default.cookieExpiration * 6 * 30 * 2,
    path: '/',
    sameSite: 'strict',
    secure: env_config_1.default.env === 'production' ? true : false,
    priority: 'high',
    signed: true,
};
exports.default = cookieConfig;
