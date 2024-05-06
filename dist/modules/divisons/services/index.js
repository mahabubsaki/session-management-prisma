"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_config_1 = __importDefault(require("../../../configs/db/db.config"));
const createDivision = async (data) => {
    const result = await db_config_1.default.divisons.create({
        data: {
            ...data,
        },
    });
    console.log(result);
    return true;
};
const getAllDivisons = async () => {
    const result = await db_config_1.default.divisons.findMany();
    return result;
};
exports.default = { createDivision, getAllDivisons };
