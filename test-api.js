const axios = require('axios');

// CONFIGURAÇÃO
const BASE_URL = 'http://localhost:3000/api';

// Substitua pelo token JWT após fazer login
const TOKEN = 'COLE_SEU_TOKEN_JWT_AQUI';

// FUNÇÃO AUXILIAR
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`
  }
});

// ============================================
// TESTE 1: ENVIAR NOTIFICAÇÃO DE TESTE
// ============================================
async function testSendNotification() {
  console.log('\n🔔 TESTE: Enviar Notificação de Teste\n');
  
  try {
    const response = await api.post('/notifications/send-test', {
      title: '🎉 Teste de Notificação',
      body: 'Esta notificação foi enviada via script de teste!',
      data: {
        type: 'test',
        timestamp: new Date().toISOString()
      }
    });
    
    console.log('✅ SUCESSO:', response.data);
    console.log(`   → Notificações enviadas: ${response.data.successCount}`);
    console.log(`   → Falhas: ${response.data.failureCount}`);
    
    return true;
  } catch (error) {
    console.error('❌ ERRO:', error.response?.data || error.message);
    return false;
  }
}

// ============================================
// TESTE 2: VERIFICAR ESTATÍSTICAS DE GAMIFICAÇÃO
// ============================================
async function testGamificationStats() {
  console.log('\n🎮 TESTE: Estatísticas de Gamificação\n');
  
  try {
    const response = await api.get('/gamification/stats');
    
    console.log('✅ SUCESSO:', response.data);
    console.log(`   → Pontos: ${response.data.points}`);
    console.log(`   → Nível: ${response.data.level}`);
    console.log(`   → Badges: ${response.data.badges.length}`);
    console.log(`   → Denúncias: ${response.data.stats.totalViolations}`);
    console.log(`   → Ranking: #${response.data.ranking?.position || 'N/A'}`);
    
    return true;
  } catch (error) {
    console.error('❌ ERRO:', error.response?.data || error.message);
    return false;
  }
}

// ============================================
// TESTE 3: VERIFICAR LEADERBOARD
// ============================================
async function testLeaderboard() {
  console.log('\n🏆 TESTE: Leaderboard (Top 10)\n');
  
  try {
    const response = await api.get('/gamification/leaderboard?limit=10');
    
    console.log('✅ SUCESSO:', response.data);
    console.log(`   → Total de usuários: ${response.data.total}`);
    console.log('\n   TOP 10:');
    
    response.data.leaderboard.forEach((user, index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
      console.log(`   ${medal} #${user.ranking.position} - ${user.userId} - ${user.points} pts (Nv. ${user.level})`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ ERRO:', error.response?.data || error.message);
    return false;
  }
}

// ============================================
// TESTE 4: REGISTRAR COMPARTILHAMENTO
// ============================================
async function testRecordShare() {
  console.log('\n📢 TESTE: Registrar Compartilhamento\n');
  
  try {
    const response = await api.post('/gamification/share', {
      violationId: '675409bbc8751ce5742f0d92', // Substitua por ID real
      platform: 'whatsapp'
    });
    
    console.log('✅ SUCESSO:', response.data);
    console.log(`   → Mensagem: ${response.data.message}`);
    console.log(`   → Pontos ganhos: ${response.data.pointsEarned || 5}`);
    
    return true;
  } catch (error) {
    console.error('❌ ERRO:', error.response?.data || error.message);
    return false;
  }
}

// ============================================
// TESTE 5: LISTAR DENÚNCIAS
// ============================================
async function testListViolations() {
  console.log('\n📋 TESTE: Listar Minhas Denúncias\n');
  
  try {
    const response = await api.get('/violations/my');
    
    console.log('✅ SUCESSO:', response.data);
    console.log(`   → Total: ${response.data.total || response.data.length}`);
    
    if (response.data.violations || response.data.length > 0) {
      const violations = response.data.violations || response.data;
      console.log('\n   DENÚNCIAS:');
      violations.slice(0, 5).forEach((v, i) => {
        const statusEmoji = v.status === 'approved' ? '✅' : v.status === 'rejected' ? '❌' : '⏳';
        console.log(`   ${statusEmoji} [${v.status.toUpperCase()}] ${v.type} - ${v.address || 'Sem endereço'}`);
      });
    }
    
    return true;
  } catch (error) {
    console.error('❌ ERRO:', error.response?.data || error.message);
    return false;
  }
}

// ============================================
// EXECUTAR TODOS OS TESTES
// ============================================
async function runAllTests() {
  console.log('════════════════════════════════════════════════════');
  console.log('🧪 TESTES DE API - DetranDenuncia v2.0.0');
  console.log('════════════════════════════════════════════════════');
  console.log(`📡 Base URL: ${BASE_URL}`);
  console.log(`🔑 Token: ${TOKEN.substring(0, 20)}...`);
  console.log('════════════════════════════════════════════════════');
  
  if (TOKEN === 'COLE_SEU_TOKEN_JWT_AQUI') {
    console.error('\n❌ ERRO: Token JWT não configurado!');
    console.log('\n📝 INSTRUÇÕES:');
    console.log('1. Fazer login via app ou API');
    console.log('2. Copiar o token JWT retornado');
    console.log('3. Colar no topo deste arquivo (variável TOKEN)');
    console.log('4. Executar novamente: node test-api.js\n');
    return;
  }
  
  const results = [];
  
  // Executar testes sequencialmente
  results.push({ name: 'Notificação de Teste', success: await testSendNotification() });
  results.push({ name: 'Estatísticas de Gamificação', success: await testGamificationStats() });
  results.push({ name: 'Leaderboard', success: await testLeaderboard() });
  results.push({ name: 'Registrar Compartilhamento', success: await testRecordShare() });
  results.push({ name: 'Listar Denúncias', success: await testListViolations() });
  
  // Resumo final
  console.log('\n════════════════════════════════════════════════════');
  console.log('📊 RESUMO DOS TESTES');
  console.log('════════════════════════════════════════════════════\n');
  
  results.forEach((result, index) => {
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} Teste ${index + 1}: ${result.name}`);
  });
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  const percentage = ((successCount / totalCount) * 100).toFixed(0);
  
  console.log('\n════════════════════════════════════════════════════');
  console.log(`🎯 RESULTADO: ${successCount}/${totalCount} testes passaram (${percentage}%)`);
  console.log('════════════════════════════════════════════════════\n');
  
  if (successCount === totalCount) {
    console.log('🎉 PARABÉNS! Todos os testes passaram!\n');
  } else {
    console.log('⚠️  Alguns testes falharam. Verifique os erros acima.\n');
  }
}

// Executar
runAllTests().catch(console.error);
