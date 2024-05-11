"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const global_1 = __importDefault(require("./errors/global"));
const not_found_1 = __importDefault(require("./errors/not-found"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const env_config_1 = __importDefault(require("./configs/env/env.config"));
const redis_store_1 = __importDefault(require("./configs/redis/redis.store"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)(env_config_1.default.cookieSecret));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173'],
    credentials: true
}));
app.use((0, express_session_1.default)({
    secret: env_config_1.default.sessionSecret,
    resave: false,
    store: redis_store_1.default,
    name: 'session_id',
    saveUninitialized: false,
    cookie: {
        domain: env_config_1.default.env === 'production' ? '.vercel.com' : '.localhost',
        httpOnly: true, // safe from XSS attacks
        maxAge: 1000 * 60 * 60 * env_config_1.default.cookieExpiration,
        path: '/', // cookie will be sent to all routes,
        sameSite: 'strict',
        secure: env_config_1.default.env === 'production' ? true : false,
        priority: 'high',
        signed: true,
    }
}));
app.get('/', (_, res) => {
    res.json({
        success: true,
        message: 'Welcome to the API',
        statusCode: 200,
        data: []
    });
});
app.use('/api/v1', routes_1.default);
app.use(global_1.default);
app.use(not_found_1.default);
exports.default = app;
