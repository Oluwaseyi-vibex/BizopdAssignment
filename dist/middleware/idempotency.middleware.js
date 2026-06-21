import { redisClient } from '../lib/redis.js';
const TTL_SECONDS = 60 * 60 * 24;
export const idempotency = async (req, res, next) => {
    const key = req.headers['idempotency-key'];
    if (!key || typeof key !== 'string') {
        res.status(400).json({
            error: 'Missing required header: Idempotency-Key',
        });
        return;
    }
    const redisKey = `idempotency:${key}`;
    const cached = await redisClient.get(redisKey).catch(() => null);
    if (cached) {
        const { statusCode, body } = JSON.parse(cached);
        res.status(statusCode).json(body);
        return;
    }
    const originalJson = res.json.bind(res);
    res.json = (body) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            const payload = { statusCode: res.statusCode, body };
            redisClient
                .setEx(redisKey, TTL_SECONDS, JSON.stringify(payload))
                .catch((err) => console.error('[Idempotency] Failed to cache response:', err));
        }
        return originalJson(body);
    };
    next();
};
//# sourceMappingURL=idempotency.middleware.js.map