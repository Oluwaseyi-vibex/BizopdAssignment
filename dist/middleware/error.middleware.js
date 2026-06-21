export class AppError extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}
export const errorHandler = (err, req, res, _next) => {
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
//# sourceMappingURL=error.middleware.js.map