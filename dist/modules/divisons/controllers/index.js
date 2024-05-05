"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const divisonsController = (0, catchAsync_1.default)(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        message: 'Divisons Controller'
    });
});
exports.default = divisonsController;
