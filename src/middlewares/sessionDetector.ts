import prisma from "../configs/db/db.config";
import catchAsync from "../utils/catchAsync";
import cookieConfig from "../configs/env/cookie.config";
import clearAuthCookie from "../utils/clearAuthCookie";

const sessionDetector = catchAsync(async (req, res, next) => {
    const sessionId = req.sessionID;
    const fingerprint = req.fingerprint?.hash;
    const data = await prisma.sessions.findUnique({
        where: {
            sessionId: sessionId,
            browserHash: fingerprint
        }
    });
    if (!data) {
        res.statusCode = 403;
        clearAuthCookie(res);
        return next({ message: 'Unauthorized Access' });
    }
    if (data.browser !== req.headers['user-agent']) {
        res.statusCode = 401;
        clearAuthCookie(res);
        return next({ message: 'Credentials Exposed to Unauthorized User' });
    }
    next();
});

export default sessionDetector;