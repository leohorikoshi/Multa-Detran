import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/detran';
    
    console.log('🔄 Conectando ao MongoDB...');
    
    await mongoose.connect(MONGODB_URI);
    
    console.log('✅ MongoDB conectado com sucesso!');
    console.log('📊 Database:', mongoose.connection.db?.databaseName || 'detran');
  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error);
    console.log('⚠️ Continuando com mock-db em memória...');
    // Não mata o processo - permite fallback para mock-db
  }
};

// Event listeners para monitorar conexão
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB desconectado');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ Erro MongoDB:', error);
});

export default connectDatabase;
