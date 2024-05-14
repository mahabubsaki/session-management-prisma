import prisma from "../configs/db/db.config";
import catchAsync from "../utils/catchAsync";

const removePreviousSession = catchAsync(async (req, res, next) => {

    const hash = req.fingerprint?.hash!;
    const sessionId = req.sessionID;
    if (!hash) {
        res.statusCode = 426;
        return next({ message: 'Please update your browser' });
    }
    await prisma.sessions.deleteMany({
        where: {
            AND: [
                { browserHash: hash },
                { NOT: { sessionId: sessionId } },
            ]
        }
    });
    next();
});

export default removePreviousSession;