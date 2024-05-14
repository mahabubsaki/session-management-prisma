import RedisStore from "connect-redis";
import redisClient from "./redis.config";
import envConfig from "../env/env.config";

const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'session:',
    ttl: envConfig.redisExpiration * 60
});

export default redisStore;