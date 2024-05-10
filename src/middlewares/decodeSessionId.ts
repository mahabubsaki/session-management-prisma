import { NextFunction, Request } from "express";
import { CustomResponse } from "../interface";
import { AppResponse } from "../types";
import catchAsync from "../utils/catchAsync";
import redisClient from "../configs/redis/redis.config";

const decodeSessionId = catchAsync(async (req: Request, _: CustomResponse<AppResponse>, next: NextFunction) => {
    if (!req.cookies.session_id) throw new Error('Session ID not found');
    const token = req.cookies.session_id.split('.')[0].split(':')[1];
    if (!token) throw new Error('Token not found');
    const data = await redisClient.get('session:' + token);
    if (!data) throw new Error('No data found');
    try {
        const token = JSON.parse(data);
        req.cookies.token = token.token;
    } catch (err) {
        throw new Error('Invalid data');
    }
    next();
});

export default decodeSessionId;