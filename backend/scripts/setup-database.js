// Script para configurar e popular o banco de dados MongoDB
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://localhost:27017/detran-denuncia';

// Schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  cpf: String,
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

const violationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: String,
  description: String,
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  images: [String],
  vehiclePlate: String,
  vehicleModel: String,
  vehicleColor: String,
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNotes: String,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: Date
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Violation = mongoose.model('Violation', violationSchema);

async function setupDatabase() {
  try {
    console.log('🔌 Conectando ao MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado ao MongoDB!');

    // Limpar banco (cuidado em produção!)
    console.log('\n🗑️  Limpando banco de dados...');
    await User.deleteMany({});
    await Violation.deleteMany({});
    console.log('✅ Banco limpo!');

    // Criar usuários
    console.log('\n👥 Criando usuários...');
    
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    const admin = await User.create({
      name: 'Administrador DETRAN',
      email: 'admin@detran.sp.gov.br',
      cpf: '111.111.111-11',
      password: adminPassword,
      role: 'admin'
    });
    console.log('✅ Admin criado:', admin.email);

    const user1 = await User.create({
      name: 'João Silva',
      email: 'joao.silva@email.com',
      cpf: '222.222.222-22',
      password: userPassword,
      role: 'user'
    });
    console.log('✅ Usuário 1 criado:', user1.email);

    const user2 = await User.create({
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      cpf: '333.333.333-33',
      password: userPassword,
      role: 'user'
    });
    console.log('✅ Usuário 2 criado:', user2.email);

    const user3 = await User.create({
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@email.com',
      cpf: '444.444.444-44',
      password: userPassword,
      role: 'user'
    });
    console.log('✅ Usuário 3 criado:', user3.email);

    // Criar denúncias
    console.log('\n📋 Criando denúncias de exemplo...');

    const violations = [
      {
        userId: user1._id,
        type: 'ESTACIONAMENTO_IRREGULAR',
        description: 'Veículo estacionado em vaga para deficientes sem autorização',
        location: {
          latitude: -23.5505,
          longitude: -46.6333,
          address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP'
        },
        images: [],
        vehiclePlate: 'ABC-1234',
        vehicleModel: 'Honda Civic',
        vehicleColor: 'Preto',
        status: 'pending'
      },
      {
        userId: user1._id,
        type: 'EXCESSO_VELOCIDADE',
        description: 'Veículo em alta velocidade em zona escolar',
        location: {
          latitude: -23.5489,
          longitude: -46.6388,
          address: 'Rua da Consolação, 500 - Consolação, São Paulo - SP'
        },
        images: [],
        vehiclePlate: 'DEF-5678',
        vehicleModel: 'Toyota Corolla',
        vehicleColor: 'Branco',
        status: 'approved',
        reviewedBy: admin._id,
        reviewedAt: new Date(),
        adminNotes: 'Denúncia procedente. Multa aplicada conforme CTB Art. 218.'
      },
      {
        userId: user2._id,
        type: 'BLOQUEIO_CICLOVIA',
        description: 'Caminhão parado na ciclovia descarregando mercadoria',
        location: {
          latitude: -23.5558,
          longitude: -46.6396,
          address: 'Av. Brigadeiro Faria Lima, 2000 - Jardim Paulistano, São Paulo - SP'
        },
        images: [],
        vehiclePlate: 'GHI-9012',
        vehicleModel: 'Mercedes-Benz Atego',
        vehicleColor: 'Branco',
        status: 'under_review'
      },
      {
        userId: user2._id,
        type: 'ESTACIONAMENTO_FILA_DUPLA',
        description: 'Veículo em fila dupla causando congestionamento',
        location: {
          latitude: -23.5629,
          longitude: -46.6544,
          address: 'R. Augusta, 2690 - Jardins, São Paulo - SP'
        },
        images: [],
        vehiclePlate: 'JKL-3456',
        vehicleModel: 'Volkswagen Gol',
        vehicleColor: 'Vermelho',
        status: 'rejected',
        reviewedBy: admin._id,
        reviewedAt: new Date(),
        adminNotes: 'Imagem sem qualidade suficiente para identificar placa.'
      },
      {
        userId: user3._id,
        type: 'AVANCO_SINAL_VERMELHO',
        description: 'Motocicleta avançou sinal vermelho',
        location: {
          latitude: -23.5475,
          longitude: -46.6361,
          address: 'Av. Ipiranga, 200 - República, São Paulo - SP'
        },
        images: [],
        vehiclePlate: 'MNO-7890',
        vehicleModel: 'Honda CG 160',
        vehicleColor: 'Azul',
        status: 'pending'
      },
      {
        userId: user3._id,
        type: 'USO_CELULAR_DIRIGINDO',
        description: 'Motorista usando celular enquanto dirigia',
        location: {
          latitude: -23.5336,
          longitude: -46.6253,
          address: 'Av. Tiradentes, 900 - Luz, São Paulo - SP'
        },
        images: [],
        vehiclePlate: 'PQR-2468',
        vehicleModel: 'Fiat Uno',
        vehicleColor: 'Prata',
        status: 'approved',
        reviewedBy: admin._id,
        reviewedAt: new Date(),
        adminNotes: 'Infração confirmada. CTB Art. 252, inciso VI.'
      },
      {
        userId: user1._id,
        type: 'BLOQUEIO_FAIXA_PEDESTRE',
        description: 'Veículo parado sobre faixa de pedestres no semáforo',
        location: {
          latitude: -23.5614,
          longitude: -46.6559,
          address: 'Al. Santos, 1000 - Jardim Paulista, São Paulo - SP'
        },
        images: [],
        vehiclePlate: 'STU-1357',
        vehicleModel: 'Renault Sandero',
        vehicleColor: 'Preto',
        status: 'pending'
      },
      {
        userId: user2._id,
        type: 'SEM_CINTO_SEGURANCA',
        description: 'Motorista sem cinto de segurança',
        location: {
          latitude: -23.5441,
          longitude: -46.6415,
          address: 'R. Maria Antônia, 294 - Vila Buarque, São Paulo - SP'
        },
        images: [],
        vehiclePlate: 'VWX-9753',
        vehicleModel: 'Chevrolet Onix',
        vehicleColor: 'Branco',
        status: 'approved',
        reviewedBy: admin._id,
        reviewedAt: new Date(),
        adminNotes: 'Flagrante confirmado. CTB Art. 167.'
      }
    ];

    const createdViolations = await Violation.insertMany(violations);
    console.log(`✅ ${createdViolations.length} denúncias criadas!`);

    // Criar índices para performance
    console.log('\n⚡ Criando índices...');
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ cpf: 1 }, { unique: true });
    await Violation.collection.createIndex({ userId: 1 });
    await Violation.collection.createIndex({ status: 1 });
    await Violation.collection.createIndex({ createdAt: -1 });
    await Violation.collection.createIndex({ 'location.latitude': 1, 'location.longitude': 1 });
    console.log('✅ Índices criados!');

    // Estatísticas
    console.log('\n📊 Estatísticas do Banco:');
    const userCount = await User.countDocuments();
    const violationCount = await Violation.countDocuments();
    const pendingCount = await Violation.countDocuments({ status: 'pending' });
    const approvedCount = await Violation.countDocuments({ status: 'approved' });
    const rejectedCount = await Violation.countDocuments({ status: 'rejected' });
    const underReviewCount = await Violation.countDocuments({ status: 'under_review' });

    console.log(`  👥 Usuários: ${userCount} (1 admin, ${userCount - 1} cidadãos)`);
    console.log(`  📋 Denúncias: ${violationCount}`);
    console.log(`     - Pendentes: ${pendingCount}`);
    console.log(`     - Em Análise: ${underReviewCount}`);
    console.log(`     - Aprovadas: ${approvedCount}`);
    console.log(`     - Rejeitadas: ${rejectedCount}`);

    console.log('\n✅ ═══════════════════════════════════════════');
    console.log('   🎉 BANCO DE DADOS CONFIGURADO COM SUCESSO!');
    console.log('   ═══════════════════════════════════════════');
    console.log('\n📝 Credenciais de Acesso:');
    console.log('\n   👨‍💼 ADMIN:');
    console.log('      Email: admin@detran.sp.gov.br');
    console.log('      Senha: admin123');
    console.log('\n   👤 USUÁRIOS:');
    console.log('      Email: joao.silva@email.com');
    console.log('      Email: maria.santos@email.com');
    console.log('      Email: pedro.oliveira@email.com');
    console.log('      Senha: user123 (para todos)');
    console.log('\n   🔗 MongoDB URI: mongodb://localhost:27017/detran-denuncia');
    console.log('   📊 Banco: detran-denuncia\n');

  } catch (error) {
    console.error('❌ Erro ao configurar banco:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Conexão fechada.');
    process.exit(0);
  }
}

setupDatabase();
