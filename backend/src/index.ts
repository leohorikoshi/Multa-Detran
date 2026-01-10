import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { errorHandler } from './middleware/error.middleware';

// Carrega as variáveis de ambiente
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de requisições
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Pasta pública para arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/detran-denuncia')
  .then(() => {
    console.log('📦 Conectado ao MongoDB');
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar ao MongoDB:', err);
  });

// Rotas
import authRoutes from './routes/auth.routes';
import violationRoutes from './routes/violation.routes';
import notificationRoutes from './routes/notification.routes';
import gamificationRoutes from './routes/gamification.routes';
import adminRoutes from './routes/admin';

app.use('/api/auth', authRoutes);
app.use('/api/violations', violationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/admin', adminRoutes);

// Middleware de erro global
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err: Error) => {
  console.error('❌ Unhandled Rejection:', err.message);
  console.error(err.stack);
});

process.on('uncaughtException', (err: Error) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.error(err.stack);
  process.exit(1);
});