"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = __importDefault(require("../controllers"));
const signup_validators_1 = __importDefault(require("../../../validators/signup.validators"));
const userRouter = express_1.default.Router();
userRouter.post('/signup', signup_validators_1.default, controllers_1.default.signUpController);
userRouter.get('/profile', controllers_1.default.profileController);
userRouter.post('/logout', controllers_1.default.logoutController);
userRouter.post('/login', controllers_1.default.loginController);
exports.default = userRouter;
