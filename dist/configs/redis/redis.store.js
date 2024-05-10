"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connect_redis_1 = __importDefault(require("connect-redis"));
const redis_config_1 = __importDefault(require("./redis.config"));
const redisStore = new connect_redis_1.default({
    client: redis_config_1.default,
    prefix: 'session:'
});
exports.default = redisStore;
