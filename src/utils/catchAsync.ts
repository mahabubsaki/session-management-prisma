import { Request, Response, NextFunction } from 'express';
import { CustomResponse } from '../interface';
import { AppResponse } from '../types';

const catchAsync = (fn: (req: Request, res: CustomResponse<AppResponse>, next: NextFunction) => Promise<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((err: any) => next(err));
    };

export default catchAsync;
