import { z } from 'zod';
export declare const createOrderSchema: z.ZodObject<{
    body: z.ZodObject<{
        customerName: z.ZodString;
        phone: z.ZodString;
        product: z.ZodString;
        stage: z.ZodOptional<z.ZodEnum<{
            [x: string]: string;
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const updateStageSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        newStage: z.ZodEnum<{
            [x: string]: string;
        }>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const searchOrderSchema: z.ZodObject<{
    query: z.ZodObject<{
        search: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=order.schema.d.ts.map