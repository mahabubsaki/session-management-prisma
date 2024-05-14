"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_config_1 = __importDefault(require("../configs/env/cookie.config"));
const clearAuthCookie = (res) => {
    res.clearCookie('access_token', { ...cookie_config_1.default, maxAge: 0 });
    res.clearCookie('refresh_token', { ...cookie_config_1.default, maxAge: 0 });
    res.clearCookie('session_id', { ...cookie_config_1.default, maxAge: 0 });
};
exports.default = clearAuthCookie;
