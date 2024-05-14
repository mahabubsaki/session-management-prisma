import redisClient from "../configs/redis/redis.config";
import catchAsync from "../utils/catchAsync";

const tempTokenValidate = catchAsync(async (req, res, next) => {
    const { tempToken } = req.body;
    if (!tempToken) {
        res.statusCode = 400;
        return next({ message: 'Temporary token is not found' });
    }
    const storedToken = await redisClient.get('temporary_token' + tempToken);
    if (storedToken !== tempToken) {
        res.statusCode = 400;
        return next({ message: 'Temporary token is invalid or its expired. Make sure you are completing the process in 5 minutes' });
    }
    await redisClient.del('temporary_token' + tempToken);
    next();
});

export default tempTokenValidate;