import express from 'express';
import controller from '../controllers';
import signupValidator from '../../../validators/signup.validators';
const userRouter = express.Router();


userRouter.post('/signup', signupValidator, controller.signUpController);
userRouter.get('/profile', controller.profileController);
userRouter.post('/logout', controller.logoutController);
userRouter.post('/login', controller.loginController);

export default userRouter;