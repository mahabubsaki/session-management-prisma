"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_config_1 = __importDefault(require("../configs/db/db.config"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const removePreviousSession = (0, catchAsync_1.default)(async (req, res, next) => {
    const hash = req.fingerprint?.hash;
    const sessionId = req.sessionID;
    if (!hash) {
        res.statusCode = 426;
        return next({ message: 'Please update your browser' });
    }
    await db_config_1.default.sessions.deleteMany({
        where: {
            AND: [
                { browserHash: hash },
                { NOT: { sessionId: sessionId } },
            ]
        }
    });
    next();
});
exports.default = removePreviousSession;
