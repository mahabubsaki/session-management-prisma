import { createClient } from 'redis';
import envConfig from '../env/env.config';




const redisClient = createClient({
    url: envConfig.redisUrl
});

redisClient.on('error', (err) => {
    console.log('Redis Err', err);
});

redisClient.on('connect', () => {
    console.log('Redis Connected');
});


export default redisClient;