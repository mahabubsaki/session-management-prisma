"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const services_1 = __importDefault(require("../services"));
const allDivisonsController = (0, catchAsync_1.default)(async (_, res, __) => {
    const result = await services_1.default.getAllDivisons();
    res.status(200).json({
        statusCode: 200,
        success: true,
        message: 'Divisons Controller',
        data: result
    });
});
const postDivisonsController = (0, catchAsync_1.default)(async (req, res, _) => {
    const { unique_name, name, nameBn, latitude, longitude, population, area, density, literacyRate, website } = req.body;
    const result = await services_1.default.createDivision({
        unique_name,
        name,
        nameBn,
        latitude,
        longitude,
        population,
        area,
        density,
        literacyRate,
        website
    });
    res.status(201).json({
        success: true,
        message: 'Divisons Controller',
        data: result,
        statusCode: 201
    });
});
exports.default = { allDivisonsController, postDivisonsController };
