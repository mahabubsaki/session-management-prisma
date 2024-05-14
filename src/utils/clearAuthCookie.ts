import { Response } from "express";
import cookieConfig from "../configs/env/cookie.config";

const clearAuthCookie = (res: Response) => {
    res.clearCookie('access_token', { ...cookieConfig, maxAge: 0 });
    res.clearCookie('refresh_token', { ...cookieConfig, maxAge: 0 });
    res.clearCookie('session_id', { ...cookieConfig, maxAge: 0 });
};
export default clearAuthCookie;