import express from 'express';
import controller from '../controllers';
const userRouter = express.Router();


userRouter.post('/signup', controller.signUpController);

export default userRouter;