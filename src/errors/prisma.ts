import { Prisma } from "@prisma/client";

const prismaErrorHandler = (code: Prisma.PrismaClientKnownRequestError) => {
    let message, statusCode;
    console.log({ prismaCode: code.code }, 'prismaErrorHandler');
    switch (code.code) {
        case 'P2002':
            message = 'There is a unique constraint violation, a new user cannot be created with this email';
            statusCode = 409;
            break;
        default:
            message = 'Something went wrong with the database';
            statusCode = 500;
            break;
    }

    return { message, statusCode };

};

export default prismaErrorHandler;