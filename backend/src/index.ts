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

app.use('/api/auth', authRoutes);
app.use('/api/violations', violationRoutes);

// Middleware de erro global
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});