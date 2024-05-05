import express from 'express';
import controller from '../controllers';
const divisonsRouter = express.Router();

divisonsRouter.get('/', controller.allDivisonsController);
divisonsRouter.post('/', controller.postDivisonsController);
export default divisonsRouter;