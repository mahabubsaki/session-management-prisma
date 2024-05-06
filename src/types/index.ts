type AppResponse = {
    success: boolean;
    message: string;
    data?: any;
    error?: any;
    statusCode: number;
};

export {
    AppResponse
};