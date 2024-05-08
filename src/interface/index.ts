import { Response } from "express";

type Send<ResBody = any, T = Response<ResBody>> = (body?: ResBody) => T;
interface CustomResponse<T> extends Response {
    json: Send<T, this>;
}



export {
    CustomResponse
};