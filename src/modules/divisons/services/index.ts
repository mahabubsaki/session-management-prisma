import { Prisma } from "@prisma/client";
import prisma from "../../../configs/db/db.config";

const createDivision = async (data: Prisma.DivisonsCreateInput) => {
    const result = await prisma.divisons.create({
        data: {
            ...data,
        },
    });
    console.log(result);
    return true;
};

const getAllDivisons = async () => {
    const result = await prisma.divisons.findMany();
    return result;
};

export default { createDivision, getAllDivisons };