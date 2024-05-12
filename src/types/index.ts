import { Response } from "express";

interface SuccessResponse {
    success: boolean;
    message: string;
    sessionID?: string;
    statusCode: number;
    data: any;
}
interface ErrorResponse {
    success: boolean;
    message: string;
    statusCode: number;
    sessionID?: string;
    error: any;
}

type AppResponse = SuccessResponse | ErrorResponse;

export {
    AppResponse
};