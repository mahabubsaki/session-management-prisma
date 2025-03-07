"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = __importDefault(require("../controllers"));
const divisonsRouter = express_1.default.Router();
divisonsRouter.get('/', controllers_1.default.allDivisonsController);
divisonsRouter.post('/', controllers_1.default.postDivisonsController);
exports.default = divisonsRouter;
