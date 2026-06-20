import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { redisClient } from '../lib/redis.js';
import { validateStageTransition } from '../config/stages.js';
import { OrderStage } from '../../generated/prisma/client';

const CACHE_KEY = 'dashboard:stats';

// POST /orders
export const createOrder = async (req: Request, res: Response) => {
    try {
        const { customerName, phone, product, stage } = req.body;

        const order = await prisma.order.create({
            data: {
                customerName,
                phone,
                product,
                stage: stage ? (stage as OrderStage) : undefined,
            },
        });

        await redisClient.del(CACHE_KEY);
        return res.status(201).json(order);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create order.' });
    }
};

// PATCH /orders/:id/stage
export const updateOrderStage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { newStage } = req.body;

        const order = await prisma.order.findUnique({ where: { id: id as string } });
        if (!order) {
            return res.status(404).json({ error: "Order not found." });
        }

        const verification = validateStageTransition(order.stage, newStage as OrderStage);
        if (!verification.valid) {
            return res.status(422).json({ error: verification.message });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: id as string },
            data: { stage: newStage as OrderStage },
        });

        await redisClient.del(CACHE_KEY);
        return res.json(updatedOrder);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update order stage.' });
    }
};

// GET /dashboard
export const getDashboard = async (req: Request, res: Response) => {
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

        return res.json(stats);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch dashboard stats.' });
    }
};

// GET /orders
export const getOrders = async (req: Request, res: Response) => {
    try {
        const { search } = req.query;

        const orders = await prisma.order.findMany({
            where: search ? {
                OR: [
                    { customerName: { contains: String(search), mode: 'insensitive' } },
                    { phone: { contains: String(search), mode: 'insensitive' } }
                ]
            } : {},
            orderBy: { createdAt: 'desc' }
        });

        return res.json(orders);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve orders.' });
    }
};