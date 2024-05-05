import express from 'express';
import divisonsRouter from '../modules/divisons/routes';

const router = express.Router();

const allRoutes = [
    {
        path: '/divisons',
        controller: divisonsRouter
    }
];

allRoutes.forEach(route => {
    router.use(route.path, route.controller);
});

export default router;