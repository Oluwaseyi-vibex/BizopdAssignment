import { Router } from 'express';
import { createOrder, updateOrderStage, getDashboard, getOrders } from '../controllers/order.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { createOrderSchema, updateStageSchema, searchOrderSchema } from '../shcmas/order.schema.js';
import { idempotency } from '../middleware/idempotency.middleware.js';
const router = Router();
router.post('/orders', idempotency, validate(createOrderSchema), createOrder);
router.patch('/orders/:id/stage', idempotency, validate(updateStageSchema), updateOrderStage);
router.get('/dashboard', getDashboard);
router.get('/orders', validate(searchOrderSchema), getOrders);
export default router;
//# sourceMappingURL=order.routes.js.map