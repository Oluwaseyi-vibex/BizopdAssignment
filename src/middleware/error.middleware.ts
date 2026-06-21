import type { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string,
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    const isDev = process.env.NODE_ENV !== 'production';

    console.error(`\n[ERROR] ${req.method} ${req.originalUrl}`);
    console.error(err);

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: err.message,
        });
        return;
    }

    // Unknown / unexpected errors
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({
        error: 'Internal server error.',
        ...(isDev && { details: message }),
    });
};
