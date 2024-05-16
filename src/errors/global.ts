
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler: ErrorRequestHandler = (err: Error, _: Request, res: Response, __: NextFunction) => {

    const responseObj = {
        statusCode: res.statusCode || 500,
        // @ts-ignore
        message: httpStatus[res.statusCode || '500'],
        error: err.message,
        success: false,
    };
    console.dir(err);
    return res.status(responseObj.statusCode).json(responseObj);

};
export default globalErrorHandler;