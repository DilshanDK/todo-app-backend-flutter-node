import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todoRoutes.js';

const app = express();

// CORS Configuration
app.use(cors());
app.use(express.json());

// =============================================================================
// API KEY MIDDLEWARE (Simple Protection)
// =============================================================================
const API_KEY = process.env.API_KEY || 'your-secret-api-key-here';

const apiKeyMiddleware = (req, res, next) => {
    const clientApiKey = req.headers['x-api-key'];

    if (!clientApiKey) {
        return res.status(401).json({
            success: false,
            message: 'API key is required. Add x-api-key header.',
        });
    }

    if (clientApiKey !== API_KEY) {
        return res.status(403).json({
            success: false,
            message: 'Invalid API key.',
        });
    }

    next();
};

// Apply API key protection to all /api routes
app.use('/api', apiKeyMiddleware);

// Routes
app.use('/api/todos', todoRoutes);

// Health check (public)
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

export default app;
