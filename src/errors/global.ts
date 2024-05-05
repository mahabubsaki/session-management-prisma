import { error } from "console";
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

const globalErrorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const responseObj = {
        statusCode: 500,
        message: "Something went wrong!",
        error: err.message,
        success: false,
    };
    console.log(err);
    res.status(500).json(responseObj);
    next();
};
export default globalErrorHandler;