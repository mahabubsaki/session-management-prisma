import express from 'express';
import divisonsRouter from '../modules/divisons/routes';
import userRouter from '../modules/users/routes';

const router = express.Router();

const allRoutes = [
    {
        path: '/divisons',
        controller: divisonsRouter
    },
    {
        path: '/auth',
        controller: userRouter

    }
];

allRoutes.forEach(route => {
    router.use(route.path, route.controller);
});

export default router;