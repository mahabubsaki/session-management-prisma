import { Request, Response } from "express";


const notFoundErrorHandler = (req: Request, res: Response) => {

    if (!res.headersSent) {
        res.status(404).json({
            statusCode: 404,
            message: "This route does not exist!",
            error: "Not Found",
            success: false,
        });
    }
};
export default notFoundErrorHandler;