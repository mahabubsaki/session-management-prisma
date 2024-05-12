"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const env_config_1 = __importDefault(require("../env/env.config"));
const redisClient = (0, redis_1.createClient)({
    url: env_config_1.default.redisUrl
});
redisClient.on('error', (err) => {
    console.log('Redis Err', err);
});
redisClient.on('connect', () => {
    console.log('Redis Connected');
});
exports.default = redisClient;
