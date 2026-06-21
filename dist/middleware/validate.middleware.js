import { ZodError } from 'zod';
export const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    error: "Validation failed.",
                    details: error.issues.map((err) => ({
                        field: err.path.slice(1).join('.'),
                        message: err.message,
                    })),
                });
                return;
            }
            res.status(500).json({ error: "Internal validation failure." });
        }
    };
};
//# sourceMappingURL=validate.middleware.js.map