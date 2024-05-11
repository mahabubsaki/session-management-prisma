import prisma from "../configs/db/db.config";
import cookieConfig from "../configs/env/cookie.config";
import envConfig from "../configs/env/env.config";
import catchAsync from "../utils/catchAsync";
import jwt, { VerifyErrors, } from 'jsonwebtoken';




const verifyJWT = catchAsync(async (req, res, next) => {
    const token = req.signedCookies.access_token;




    try {
        if (!token) {
            throw new Error('Unauthorized');
        }
        const decoded = await new Promise<{ email: string; }>((resolve, reject) => {
            jwt.verify(token, envConfig.jwtSecret, async (err: VerifyErrors | null, decoded: {} | undefined) => {
                console.log(err, decoded, new Date().getTime());
                if (err) {
                    if (err.name === 'TokenExpiredError') {
                        console.log('Token expired');
                        // @ts-ignore
                        const storedSession = req.sessionID;
                        const refreshToken = req.signedCookies.refresh_token;
                        if (!storedSession || !refreshToken) {
                            console.log('No stored session or refresh token');
                            return reject(err);
                        }


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

                        jwt.verify(refreshToken, envConfig.jwtSecret, (err: VerifyErrors | null, _: {} | undefined) => {
                            if (err) {
                                console.log('Refresh token expired');
                                return reject(err);
                            }


                        }
                        );

                        const newAccessToken = jwt.sign({ email: session.user.email }, envConfig.jwtSecret, {
                            expiresIn: envConfig.cookieExpiration, // 4 hours
                        });
                        res.cookie('access_token', newAccessToken, cookieConfig);
                        console.log('New access token generated');
                        resolve({ email: session.user.email });

                    }
                    return reject(err);
                }
                resolve(decoded as { email: string; });
            }
            );
        }
        );
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
        return next((error as VerifyErrors).message);
    }


}
);

export default verifyJWT;