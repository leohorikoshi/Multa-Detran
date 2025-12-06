const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/detran-denuncia')
  .then(async () => {
    console.log('✅ Conectado ao MongoDB');
    
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: { type: String, select: false },
      cpf: String,
      role: String
    }, { timestamps: true }));
    
    // Buscar usuário
    const user = await User.findOne({ email: 'joao.silva@email.com' }).select('+password');
    
    if (!user) {
      console.log('❌ Usuário não encontrado');
      process.exit(1);
    }
    
    console.log('✅ Usuário encontrado:', user.email);
    console.log('Password hash:', user.password);
    
    // Testar senha
    const isMatch = await bcrypt.compare('user123', user.password);
    console.log('Senha correta?', isMatch);
    
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Erro:', err);
    process.exit(1);
  });
