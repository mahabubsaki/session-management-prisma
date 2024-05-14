"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler = (err, req, res, next) => {
    const responseObj = {
        statusCode: res.statusCode || 500,
        // @ts-ignore
        message: http_status_1.default[res.statusCode || '500'],
        error: err.message,
        success: false,
    };
    console.dir(err);
    res.status(responseObj.statusCode).json(responseObj);
    next();
};
exports.default = globalErrorHandler;
