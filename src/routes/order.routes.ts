import { Router } from 'express';
import { createOrder, updateOrderStage, getDashboard, getOrders } from '../controllers/order.controller';
import { validate } from '../middleware/validate.middleware';
import { createOrderSchema, updateStageSchema, searchOrderSchema } from '../shcmas/order.schema';

const router = Router();

router.post('/orders', validate(createOrderSchema), createOrder);
router.patch('/orders/:id/stage', validate(updateStageSchema), updateOrderStage);
router.get('/dashboard', getDashboard);
router.get('/orders', validate(searchOrderSchema), getOrders);

export default router;