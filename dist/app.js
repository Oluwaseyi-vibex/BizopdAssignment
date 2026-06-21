import express, {} from 'express';
import "dotenv/config";
import orderRouter from './routes/order.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { connectRedis } from './lib/redis.js';
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.get('/', (req, res) => {
    res.json({ message: "Backend is running beautifully with TypeScript!" });
});
app.use('/api', orderRouter);
app.use(errorHandler);
async function bootstrap() {
    await connectRedis();
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
bootstrap().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
//# sourceMappingURL=app.js.map