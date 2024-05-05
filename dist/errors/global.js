"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globalErrorHandler = (err, req, res, next) => {
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
exports.default = globalErrorHandler;
