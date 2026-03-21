import { Router } from 'express';
import PlaneRouter from '../controllers/plane.controller';

const router = Router();

router.use('/plane', PlaneRouter);

export default router;
