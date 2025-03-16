import express from 'express';
import { UrlStorage } from './utils/storage';
import { LocalStorage } from 'node-localstorage';
import shortenerRoutes from './routes/shortener.routes';
import htmlProcessorRouter from './routes/html-processor.routes';
import analyticsRoutes from './routes/analytics.routes';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();
export { app };

const storagePath = './storage';
const localStorage = new LocalStorage(storagePath);
const storage = new UrlStorage(localStorage);

// Middleware
app.use(express.json());

// Routes - Mounting shortener at root level for redirects
app.use('/', shortenerRoutes); // Ensure this is mounted at the root level
app.use('/process', htmlProcessorRouter);
app.use('/analytics', analyticsRoutes); // Add analytics routes

// Error handling
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.locals.storage = storage;