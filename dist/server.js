"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_config_1 = __importDefault(require("./configs/db/db.config"));
const app_1 = __importDefault(require("./app"));
const env_config_1 = __importDefault(require("./configs/env/env.config"));
let server;
process.on('uncaughtException', (err) => {
    console.log(err);
    if (server)
        server.close(() => process.exit(1));
    else
        process.exit(1);
});
async function startServer() {
    try {
        await db_config_1.default.$connect();
        server = app_1.default.listen(env_config_1.default.port, () => {
            console.log(`Server is running on port ${env_config_1.default.port}`);
        });
    }
    catch (err) {
        await db_config_1.default.$disconnect();
        console.log(err);
    }
    process.on('unhandledRejection', (err) => {
        console.log(err);
        if (server)
            server.close(() => process.exit(1));
        else
            process.exit(1);
    });
}
startServer();
process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    if (server)
        server.close(() => process.exit(1));
    else
        process.exit(1);
});
