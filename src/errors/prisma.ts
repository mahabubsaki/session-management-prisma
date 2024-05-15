import { Prisma } from "@prisma/client";

const prismaErrorHandler = (code: Prisma.PrismaClientKnownRequestError) => {
    let message = '';

    console.log({ prismaCode: code.code }, 'prismaErrorHandler');
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

export default prismaErrorHandler;