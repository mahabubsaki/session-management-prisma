"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
exports.signupSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6).regex(/[a-zA-Z0-9]/, { message: 'Password must contain at least one letter and one number' }),
    name: zod_1.default.string().min(2).max(20),
});
exports.loginSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6).regex(/[a-zA-Z0-9]/, { message: 'Password must contain at least one letter and one number' }),
});
const loginValidator = (0, catchAsync_1.default)(async (req, res, next) => {
    try {
        await exports.loginSchema.parseAsync(req.body);
        next();
    }
    catch (error) {
        const messageString = error.errors.reduce((acc, curr) => {
            return acc + curr.message + ',';
        }, '');
        next({ message: messageString });
    }
});
const signupValidator = (0, catchAsync_1.default)(async (req, res, next) => {
    try {
        await exports.signupSchema.parseAsync(req.body);
        next();
    }
    catch (error) {
        const messageString = error.errors.reduce((acc, curr) => {
            return acc + curr.message + ',';
        }, '');
        next({ message: messageString });
    }
});
exports.default = signupValidator;
