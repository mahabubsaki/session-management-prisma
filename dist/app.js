"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const global_1 = __importDefault(require("./errors/global"));
const not_found_1 = __importDefault(require("./errors/not-found"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (_, res) => {
    res.send({
        statusCode: 200,
        message: "Server is running perfectly!",
        error: "OK",
        success: true,
    });
});
app.use('/api/v1', routes_1.default);
app.use(global_1.default);
app.use(not_found_1.default);
exports.default = app;
