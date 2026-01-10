// Script para testar conexão com MongoDB
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/detran-denuncia';

console.log('🔄 Tentando conectar ao MongoDB...');
console.log('📍 URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')); // Esconde a senha

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado ao MongoDB com sucesso!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    return mongoose.connection.close();
  })
  .then(() => {
    console.log('👋 Conexão fechada.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar:', err.message);
    process.exit(1);
  });
