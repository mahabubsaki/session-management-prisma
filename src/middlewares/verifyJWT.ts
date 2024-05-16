
import prisma from "../configs/db/db.config";
import cookieConfig from "../configs/env/cookie.config";
import envConfig from "../configs/env/env.config";
import catchAsync from "../utils/catchAsync";
import jwt, { VerifyErrors, } from 'jsonwebtoken';
import clearAuthCookie from "../utils/clearAuthCookie";


const verifyRefreshToken = async (refreshToken: string): Promise<void> => {
    await new Promise((resolve, reject) => {
        jwt.verify(refreshToken, envConfig.jwtSecret, (err: VerifyErrors | null, _: {} | undefined) => {

            if (err) {
                reject('Unauthorized');
            }
            resolve('Refresh token verified');
        });
    });
};


const verifyAccessToken = async (token: string, storedSession: string, refreshToken: string) => {
    const decoded = await new Promise<{ email: string; newAccessToken?: string; }>((resolve, reject) => {
        jwt.verify(token, envConfig.jwtSecret, async (err: VerifyErrors | null, decoded: {} | undefined) => {
            console.log(err, decoded, new Date().getTime());
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    console.log('Token expired');

                    const session = await prisma.sessions.findUnique({
                        where: {
                            sessionId: storedSession
                        },
                        include: {
                            user: true
                        }
                    });
                    if (!session) {
                        console.log('No session found in db');
                        return reject(err);
                    }

                    if (session.user.token !== refreshToken) {
                        console.log('Refresh token does not match');
                        return reject(err);
                    }

                    const newAccessToken = jwt.sign({ email: session.user.email }, envConfig.jwtSecret, {
                        expiresIn: envConfig.cookieExpiration * 60 * 60, // 4 hours
                    });

                    console.log('New access token generated');
                    resolve({ email: session.user.email, newAccessToken });

                }
                return reject(err);
            }
            resolve(decoded as { email: string; });
        }
        );
    }
    );
    return decoded;
};




const verifyJWT = catchAsync(async (req, res, next) => {

    const token = req.signedCookies.access_token;

    const refreshToken = req.signedCookies.refresh_token;

    const storedSession = req.sessionID;



    try {
        if (!token || !refreshToken || !storedSession) {
            res.statusCode = 401;
            throw new Error('Unauthorized');
        }
        await verifyRefreshToken(refreshToken);
        const decoded = await verifyAccessToken(token, storedSession, refreshToken);
        if (decoded.newAccessToken) {
            res.cookie('access_token', decoded.newAccessToken, cookieConfig);
        }

        req.user = decoded;
        next();
    } catch (error) {
        //@ts-ignore
        const loggedIn = req.session.loggedIn;
        console.log('Error in verifyJWT');
        req.session.destroy(async (err) => {
            if (err) {
                console.log(err);
            }

            if (loggedIn) {
                try {
                    await prisma.sessions.delete({
                        where: {
                            sessionId: req.sessionID
                        },

                    });
                } catch (err) {

                }
            }

        });
        clearAuthCookie(res);
        res.statusCode = 401;
        return next({ message: (error as VerifyErrors).message || 'Something went wrong in cookie' });
    }


}
);

export default verifyJWT;