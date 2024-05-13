import prisma from "../configs/db/db.config";
import catchAsync from "../utils/catchAsync";

const sessionDetector = catchAsync(async (req, res, next) => {
    const sessionId = req.sessionID;
    const fingerprint = req.fingerprint?.hash;
    const data = await prisma.sessions.findUnique({
        where: {
            sessionId: sessionId,
            browserHash: fingerprint
        }
    });
    if (!data || data.browser !== req.headers['user-agent']) {
        return next('Credentials Exposed to Unauthorized User');
    }
    next();
});

export default sessionDetector;