import { Server } from 'http';
import prisma from './configs/db/db.config';
import app from './app';
import envs from './configs/env/env.config';
import redisClient from './configs/redis/redis.config';
let server: Server;

process.on('uncaughtException', (err) => {
    console.log(err);
    if (server) server.close(() => process.exit(1));
    else process.exit(1);
});

async function startServer() {

    try {
        await prisma.$connect();
        await redisClient.connect();
        server = app.listen(envs.port, () => {
            console.log(`Server is running on port ${envs.port}`);

        });
    } catch (err) {
        await prisma.$disconnect();
        console.log(err);
    }


    process.on('unhandledRejection', (err) => {
        console.log(err);
        if (server) server.close(() => process.exit(1));
        else process.exit(1);
    });
}

startServer();

process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    if (server) server.close(() => process.exit(1));
    else process.exit(1);
});