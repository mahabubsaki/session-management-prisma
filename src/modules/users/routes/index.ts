import express from 'express';
import controller from '../controllers';
import signupValidator from '../../../validators/signup.validators';
import verifyJWT from '../../../middlewares/verifyJWT';
import sessionDetector from '../../../middlewares/sessionDetector';
import removePreviousSession from '../../../middlewares/removePreviousSession';
const userRouter = express.Router();


userRouter.post('/signup', signupValidator, controller.signUpController);
userRouter.get('/profile', sessionDetector, verifyJWT, removePreviousSession, controller.profileController);
userRouter.post('/logout', controller.logoutController);
userRouter.post('/login', controller.loginController);

export default userRouter;