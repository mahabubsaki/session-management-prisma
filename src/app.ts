import express from 'express';
import router from './routes';
import globalErrorHandler from './errors/global';
import notFoundErrorHandler from './errors/not-found';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (_, res) => {
    res.send({
        statusCode: 200,
        message: "Server is running perfectly!",
        error: "OK",
        success: true,
    });
});
app.use('/api/v1', router);

app.use(globalErrorHandler);
app.use(notFoundErrorHandler);



export default app;