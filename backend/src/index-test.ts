import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { errorHandler } from './middleware/error.middleware';

// Carrega as variáveis de ambiente
dotenv.config();

export const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pasta pública para arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

console.log('🧪 Modo de teste: Rodando SEM MongoDB (dados em memória)');

// Rotas
import authRoutes from './routes/auth.routes';
import violationRoutes from './routes/violation.routes';

app.use('/api/auth', authRoutes);
app.use('/api/violations', violationRoutes);

// Rota de health check
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Servidor rodando em modo de teste (sem MongoDB)',
    timestamp: new Date().toISOString()
  });
});

// Middleware de erro global
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 API disponível em: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});
