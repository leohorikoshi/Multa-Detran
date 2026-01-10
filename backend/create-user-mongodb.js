// Cria um usuário de teste no MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;

// Schema do usuário
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  cpf: { type: String, unique: true },
  role: { type: String, default: 'user' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createTestUser() {
  try {
    console.log('🔄 Conectando ao MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado!');

    // Limpa usuários existentes com esse email
    await User.deleteMany({ email: 'teste@teste.com' });

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    // Cria o usuário
    const user = await User.create({
      name: 'Usuário Teste',
      email: 'teste@teste.com',
      password: hashedPassword,
      cpf: '12345678901',
      role: 'user'
    });

    console.log('✅ Usuário criado com sucesso!');
    console.log('📧 Email:', user.email);
    console.log('🔑 Senha: 123456');
    console.log('👤 ID:', user._id);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

createTestUser();
