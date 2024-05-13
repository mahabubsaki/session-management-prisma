import prisma from "../configs/db/db.config";
import catchAsync from "../utils/catchAsync";

const removePreviousSession = catchAsync(async (req, res, next) => {

    const hash = req.fingerprint?.hash!;
    const sessionId = req.sessionID;
    if (!hash) {
        return next('Please update your browser');
    }
    const data = await prisma.sessions.deleteMany({
        where: {
            AND: [
                { browserHash: hash },
                { NOT: { sessionId: sessionId } }
            ]
        }
    });
    next();
});

export default removePreviousSession;