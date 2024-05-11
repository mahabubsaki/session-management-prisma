"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prismaErrorHandler = (code) => {
    let message = '';
    console.log({ prismaCode: code.code });
    switch (code.code) {
        case 'P2002':
            message = 'There is a unique constraint violation, a new user cannot be created with this email';
            break;
        default:
            message = 'Something went wrong with the database';
            break;
    }
    throw new Error(message);
};
exports.default = prismaErrorHandler;
