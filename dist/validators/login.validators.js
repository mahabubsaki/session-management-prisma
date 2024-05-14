"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const zod_1 = require("zod");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).regex(/[a-zA-Z0-9]/, { message: 'Password must contain at least one letter and one number' }),
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
        res.statusCode = 400;
        next({ message: messageString });
    }
});
exports.default = loginValidator;
