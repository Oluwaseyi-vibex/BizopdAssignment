import type { Request, Response, NextFunction } from 'express';
import type { ZodObject } from 'zod';
export declare const validate: (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=validate.middleware.d.ts.map