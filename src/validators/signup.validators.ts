
import z, { ZodIssue } from 'zod';
import catchAsync from '../utils/catchAsync';

export const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).regex(/[a-zA-Z0-9]/, { message: 'Password must contain at least one letter and one number' }),
    name: z.string().min(2).max(20),
});



const signupValidator = catchAsync(async (req, res, next) => {
    try {
        await signupSchema.parseAsync(req.body);
        next();
    } catch (error) {

        const messageString = ((error as z.ZodError).errors as ZodIssue[]).reduce((acc, curr) => {

            return acc + curr.message + ',';
        }, '');

        res.statusCode = 400;
        next({ message: messageString });
    }
});
export default signupValidator;