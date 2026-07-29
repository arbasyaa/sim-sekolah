import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { globalErrorHandler } from './middlewares/error.middleware';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Global middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes — semua berawalan /api
app.use('/api', routes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint tidak ditemukan.',
    data: null,
  });
});

// Global error handler (harus terakhir)
app.use(globalErrorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});

export default app;