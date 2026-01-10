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

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor rodando em ${HOST}:${PORT}`);
  console.log(`📡 API disponível em: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
}).on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Porta ${PORT} já está em uso`);
    process.exit(1);
  } else {
    console.error('❌ Erro ao iniciar servidor:', err);
    process.exit(1);
  }
});
