const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/detran-denuncia')
  .then(async () => {
    console.log('✅ Conectado ao MongoDB');
    
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      cpf: String,
      role: String,
      createdAt: Date,
      updatedAt: Date
    }, { timestamps: true }));
    
    // Verificar se já existe
    const existing = await User.findOne({ 
      $or: [
        { email: 'kaique.rush@gmail.com' },
        { cpf: '44065679842' }
      ]
    });
    
    if (existing) {
      console.log('⚠️  Usuário já existe:');
      console.log('   Nome:', existing.name);
      console.log('   Email:', existing.email);
      console.log('   CPF:', existing.cpf);
      console.log('   Criado em:', existing.createdAt);
      await mongoose.disconnect();
      process.exit(0);
    }
    
    // Criar novo usuário
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Migracao@23', salt);
    
    const kaique = await User.create({
      name: 'Kaique Gustavo Reis Santos',
      email: 'kaique.rush@gmail.com',
      password: hashedPassword,
      cpf: '44065679842',
      role: 'user'
    });
    
    console.log('✅ Usuário Kaique criado com sucesso!');
    console.log('   ID:', kaique._id);
    console.log('   Nome:', kaique.name);
    console.log('   Email:', kaique.email);
    console.log('   CPF:', kaique.cpf);
    console.log('   Criado em:', kaique.createdAt);
    
    // Contar todos os usuários
    const total = await User.countDocuments();
    console.log('\n📊 Total de usuários no banco:', total);
    
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Erro:', err);
    process.exit(1);
  });
