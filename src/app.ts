import express, { Response } from 'express';
import router from './routes';
import globalErrorHandler from './errors/global';
import notFoundErrorHandler from './errors/not-found';
import { AppResponse } from './types';
import { CustomResponse } from './interface';
import cors from 'cors';







const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());




app.get('/', (_, res: CustomResponse<AppResponse>) => {
    res.json({
        success: true,
        message: 'Welcome to the API',
        statusCode: 200,
        data: []
    });
});
app.use('/api/v1', router);

app.use(globalErrorHandler);
app.use(notFoundErrorHandler);



export default app;