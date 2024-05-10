"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const redis_config_1 = __importDefault(require("../configs/redis/redis.config"));
const decodeSessionId = (0, catchAsync_1.default)(async (req, _, next) => {
    if (!req.cookies.session_id)
        throw new Error('Session ID not found');
    const token = req.cookies.session_id.split('.')[0].split(':')[1];
    if (!token)
        throw new Error('Token not found');
    const data = await redis_config_1.default.get('session:' + token);
    if (!data)
        throw new Error('No data found');
    try {
        const token = JSON.parse(data);
        req.cookies.token = token.token;
    }
    catch (err) {
        throw new Error('Invalid data');
    }
    next();
});
exports.default = decodeSessionId;
