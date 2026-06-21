import { z } from 'zod';
import { OrderStage } from '@prisma/client';

const orderStages = Object.values(OrderStage) as [string, ...string[]];

export const createOrderSchema = z.object({
    body: z.object({
        customerName: z.string({ error: "customerName is required." }).min(2, "Name is too short."),
        phone: z.string({ error: "phone is required." }).min(5, "Invalid phone number length."),
        product: z.string({ error: "product is required." }).min(1, "Product description cannot be empty."),
        stage: z.enum(orderStages).optional(),
    }),
});

export const updateStageSchema = z.object({
    params: z.object({
        id: z.string().uuid("Invalid order ID format."),
    }),
    body: z.object({
        newStage: z.enum(orderStages, {
            error: "Invalid stage. Must be one of: " + orderStages.join(', '),
        }),
    }),
});

export const searchOrderSchema = z.object({
    query: z.object({
        search: z.string().optional(),
    }),
});