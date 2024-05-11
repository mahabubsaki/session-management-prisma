"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("../modules/divisons/routes"));
const routes_2 = __importDefault(require("../modules/users/routes"));
const router = express_1.default.Router();
const allRoutes = [
    {
        path: '/divisons',
        controller: routes_1.default
    },
    {
        path: '/auth',
        controller: routes_2.default
    }
];
allRoutes.forEach(route => {
    router.use(route.path, route.controller);
});
exports.default = router;
