"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_config_1 = __importDefault(require("../configs/db/db.config"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const clearAuthCookie_1 = __importDefault(require("../utils/clearAuthCookie"));
const sessionDetector = (0, catchAsync_1.default)(async (req, res, next) => {
    const sessionId = req.sessionID;
    const fingerprint = req.fingerprint?.hash;
    const data = await db_config_1.default.sessions.findUnique({
        where: {
            sessionId: sessionId,
            browserHash: fingerprint
        }
    });
    if (!data) {
        res.statusCode = 403;
        (0, clearAuthCookie_1.default)(res);
        return next({ message: 'Unauthorized Access' });
    }
    if (data.browser !== req.headers['user-agent']) {
        res.statusCode = 401;
        (0, clearAuthCookie_1.default)(res);
        return next({ message: 'Credentials Exposed to Unauthorized User' });
    }
    next();
});
exports.default = sessionDetector;
