import { Response } from "express";

interface SuccessResponse {
    success: boolean;
    message: string;
    statusCode: number;
    data: any;
}
interface ErrorResponse {
    success: boolean;
    message: string;
    statusCode: number;
    error: any;
}

type AppResponse = SuccessResponse | ErrorResponse;

export {
    AppResponse
};