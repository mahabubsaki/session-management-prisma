"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFoundErrorHandler = (req, res) => {
    if (!res.headersSent) {
        res.status(404).json({
            statusCode: 404,
            message: "This route does not exist!",
            error: "Not Found",
            success: false,
        });
    }
};
exports.default = notFoundErrorHandler;
