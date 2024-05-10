import RedisStore from "connect-redis";
import redisClient from "./redis.config";

const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'session:'
});

export default redisStore;