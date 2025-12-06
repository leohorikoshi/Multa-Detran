const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/detran-denuncia')
  .then(async () => {
    console.log('✅ Conectado ao MongoDB\n');
    
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      cpf: String,
      role: String,
      createdAt: Date,
      updatedAt: Date
    }, { timestamps: true }));
    
    const users = await User.find().sort({ createdAt: -1 });
    
    console.log('📊 Total de usuários:', users.length);
    console.log('═══════════════════════════════════════════════\n');
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.role === 'admin' ? '👨‍💼 ADMIN' : '👤 USUÁRIO'}`);
      console.log(`   Nome: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   CPF: ${user.cpf}`);
      console.log(`   Criado em: ${user.createdAt.toLocaleString('pt-BR')}`);
      console.log('');
    });
    
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Erro:', err);
    process.exit(1);
  });
