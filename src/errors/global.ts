
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    const responseObj = {
        statusCode: res.statusCode || 500,
        // @ts-ignore
        message: httpStatus[res.statusCode || '500'],
        error: err.message,
        success: false,
    };
    console.dir(err);
    return res.status(responseObj.statusCode).json(responseObj);
    // next();
};
export default globalErrorHandler;