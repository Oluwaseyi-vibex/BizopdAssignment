import { prisma } from '../lib/prisma.js';
import { redisClient } from '../lib/redis.js';
import { validateStageTransition } from '../config/stages.js';
import { OrderStage } from '../../generated/prisma/client';
import { AppError } from '../middleware/error.middleware.js';
const CACHE_KEY = 'dashboard:stats';
// POST /api/orders
export const createOrder = async (req, res, next) => {
    try {
        const { customerName, phone, product, stage } = req.body;
        const order = await prisma.order.create({
            data: {
                customerName,
                phone,
                product,
                stage: stage ? stage : undefined,
            },
        });
        await redisClient.del(CACHE_KEY);
        res.status(201).json(order);
    }
    catch (error) {
        next(error); // passes full error to errorHandler
    }
};
// PATCH /api/orders/:id/stage
export const updateOrderStage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { newStage } = req.body;
        const order = await prisma.order.findUnique({ where: { id: String(id) } });
        if (!order) {
            throw new AppError(404, `Order with id "${id}" not found.`);
        }
        const verification = validateStageTransition(order.stage, newStage);
        if (!verification.valid) {
            throw new AppError(422, verification.message ?? 'Invalid stage transition.');
        }
        const updatedOrder = await prisma.order.update({
            where: { id: String(id) },
            data: { stage: newStage },
        });
        await redisClient.del(CACHE_KEY);
        res.json(updatedOrder);
    }
    catch (error) {
        next(error);
    }
};
// GET /api/dashboard
export const getDashboard = async (req, res, next) => {
    try {
        const cachedStats = await redisClient.get(CACHE_KEY);
        if (cachedStats) {
            return res.json(JSON.parse(cachedStats));
        }
        const totalOrders = await prisma.order.count();
        const delivered = await prisma.order.count({ where: { stage: OrderStage.DELIVERED } });
        const inProduction = totalOrders - delivered;
        const stats = { totalOrders, inProduction, delivered };
        await redisClient.setEx(CACHE_KEY, 60, JSON.stringify(stats));
        res.json(stats);
    }
    catch (error) {
        next(error);
    }
};
// GET /api/orders
export const getOrders = async (req, res, next) => {
    try {
        const { search } = req.query;
        const orders = await prisma.order.findMany({
            where: search ? {
                OR: [
                    { customerName: { contains: String(search), mode: 'insensitive' } },
                    { phone: { contains: String(search), mode: 'insensitive' } },
                ],
            } : {},
            orderBy: { createdAt: 'desc' },
        });
        res.json(orders);
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=order.controller.js.map