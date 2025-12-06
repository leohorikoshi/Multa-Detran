const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Cores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

let authToken = '';
let userId = '';
let violationId = '';

// ============================================
// TESTE 1: REGISTRAR USUÁRIO
// ============================================
async function testRegister() {
  console.log(`\n${colors.cyan}🧪 TESTE 1: Registrar Usuário${colors.reset}\n`);
  
  // Gerar CPF único para cada teste
  const randomCpf = Math.floor(10000000000 + Math.random() * 90000000000).toString();
  
  const testUser = {
    name: 'Teste E2E',
    email: `teste.e2e.${Date.now()}@example.com`,
    cpf: randomCpf,
    password: 'Senha123!',
    role: 'user'
  };
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, testUser);
    
    // A resposta vem em response.data.data
    const data = response.data.data || response.data;
    authToken = data.token;
    userId = data.user.id;
    
    console.log(`${colors.green}✅ SUCESSO${colors.reset}`);
    console.log(`   → Nome: ${data.user.name}`);
    console.log(`   → Email: ${data.user.email}`);
    console.log(`   → ID: ${userId}`);
    console.log(`   → Token: ${authToken.substring(0, 30)}...`);
    
    return { success: true, data: data };
  } catch (error) {
    console.error(`${colors.red}❌ ERRO${colors.reset}`, error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

// ============================================
// TESTE 2: LOGIN
// ============================================
async function testLogin(email, password) {
  console.log(`\n${colors.cyan}🧪 TESTE 2: Login${colors.reset}\n`);
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password
    });
    
    const data = response.data.data || response.data;
    authToken = data.token;
    
    console.log(`${colors.green}✅ SUCESSO${colors.reset}`);
    console.log(`   → Usuário: ${data.user.name}`);
    console.log(`   → Token atualizado`);
    
    return { success: true, data: data };
  } catch (error) {
    console.error(`${colors.red}❌ ERRO${colors.reset}`, error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

// ============================================
// TESTE 3: VERIFICAR AUTENTICAÇÃO
// ============================================
async function testAuth() {
  console.log(`\n${colors.cyan}🧪 TESTE 3: Verificar Autenticação${colors.reset}\n`);
  
  try {
    const response = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    const data = response.data.data || response.data;
    
    console.log(`${colors.green}✅ SUCESSO${colors.reset}`);
    console.log(`   → ID: ${data.id}`);
    console.log(`   → Nome: ${data.name}`);
    console.log(`   → Email: ${data.email}`);
    console.log(`   → Role: ${data.role}`);
    
    return { success: true, data: data };
  } catch (error) {
    console.error(`${colors.red}❌ ERRO${colors.reset}`, error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

// ============================================
// TESTE 4: LISTAR DENÚNCIAS
// ============================================
async function testListViolations() {
  console.log(`\n${colors.cyan}🧪 TESTE 4: Listar Minhas Denúncias${colors.reset}\n`);
  
  try {
    const response = await axios.get(`${BASE_URL}/violations/my`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    const violations = response.data.violations || response.data;
    
    console.log(`${colors.green}✅ SUCESSO${colors.reset}`);
    console.log(`   → Total: ${violations.length}`);
    
    if (violations.length > 0) {
      console.log(`\n   ${colors.yellow}DENÚNCIAS:${colors.reset}`);
      violations.slice(0, 3).forEach((v, i) => {
        const statusEmoji = v.status === 'approved' ? '✅' : v.status === 'rejected' ? '❌' : '⏳';
        console.log(`   ${statusEmoji} [${v.status.toUpperCase()}] ${v.type} - ${v.address || 'Sem endereço'}`);
      });
    }
    
    return { success: true, data: violations };
  } catch (error) {
    console.error(`${colors.red}❌ ERRO${colors.reset}`, error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

// ============================================
// TESTE 5: ESTATÍSTICAS DE GAMIFICAÇÃO
// ============================================
async function testGamificationStats() {
  console.log(`\n${colors.cyan}🧪 TESTE 5: Estatísticas de Gamificação${colors.reset}\n`);
  
  try {
    const response = await axios.get(`${BASE_URL}/gamification/stats`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    const stats = response.data.data || response.data;
    
    console.log(`${colors.green}✅ SUCESSO${colors.reset}`);
    console.log(`   → Pontos: ${stats.points || 0}`);
    console.log(`   → Nível: ${stats.level || 1}`);
    console.log(`   → Badges: ${stats.badges?.length || 0}`);
    
    if (stats.badges && stats.badges.length > 0) {
      console.log(`\n   ${colors.yellow}BADGES DESBLOQUEADOS:${colors.reset}`);
      stats.badges.forEach(badge => {
        console.log(`   ${badge.icon} ${badge.name} - ${badge.description}`);
      });
    }
    
    if (stats.stats) {
      console.log(`\n   ${colors.yellow}ESTATÍSTICAS:${colors.reset}`);
      console.log(`   → Total de denúncias: ${stats.stats.totalViolations || 0}`);
      console.log(`   → Aprovadas: ${stats.stats.approvedViolations || 0}`);
      console.log(`   → Rejeitadas: ${stats.stats.rejectedViolations || 0}`);
      console.log(`   → Compartilhamentos: ${stats.stats.sharedViolations || 0}`);
      console.log(`   → Streak: ${stats.stats.streak || 0} dias`);
    }
    
    if (stats.ranking) {
      console.log(`\n   ${colors.magenta}RANKING:${colors.reset}`);
      console.log(`   → Posição: #${stats.ranking.position || 'N/A'}`);
    }
    
    return { success: true, data: stats };
  } catch (error) {
    console.error(`${colors.red}❌ ERRO${colors.reset}`, error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

// ============================================
// TESTE 6: LEADERBOARD
// ============================================
async function testLeaderboard() {
  console.log(`\n${colors.cyan}🧪 TESTE 6: Leaderboard (Top 10)${colors.reset}\n`);
  
  try {
    const response = await axios.get(`${BASE_URL}/gamification/leaderboard?limit=10`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    const data = response.data.data || response.data;
    const leaderboard = data.leaderboard || data;
    
    console.log(`${colors.green}✅ SUCESSO${colors.reset}`);
    console.log(`   → Total de usuários: ${data.total || leaderboard.length}`);
    
    if (leaderboard.length > 0) {
      console.log(`\n   ${colors.yellow}TOP 10:${colors.reset}`);
      leaderboard.slice(0, 10).forEach((user, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
        const position = user.ranking?.position || (index + 1);
        console.log(`   ${medal} #${position} - ${user.points || 0} pts (Nv. ${user.level || 1})`);
      });
    }
    
    return { success: true, data: leaderboard };
  } catch (error) {
    console.error(`${colors.red}❌ ERRO${colors.reset}`, error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

// ============================================
// TESTE 7: REGISTRAR TOKEN DE NOTIFICAÇÃO
// ============================================
async function testRegisterNotificationToken() {
  console.log(`\n${colors.cyan}🧪 TESTE 7: Registrar Token de Notificação${colors.reset}\n`);
  
  const mockToken = `ExponentPushToken[${Math.random().toString(36).substring(7)}]`;
  
  try {
    const response = await axios.post(`${BASE_URL}/notifications/register-token`, {
      token: mockToken,
      platform: 'web',
      deviceId: 'test-device-001'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log(`${colors.green}✅ SUCESSO${colors.reset}`);
    console.log(`   → Token registrado: ${mockToken}`);
    console.log(`   → Plataforma: web`);
    
    return { success: true, data: response.data, token: mockToken };
  } catch (error) {
    console.error(`${colors.red}❌ ERRO${colors.reset}`, error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

// ============================================
// TESTE 8: LISTAR TOKENS DE NOTIFICAÇÃO
// ============================================
async function testListNotificationTokens() {
  console.log(`\n${colors.cyan}🧪 TESTE 8: Listar Tokens de Notificação${colors.reset}\n`);
  
  try {
    const response = await axios.get(`${BASE_URL}/notifications/tokens`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    const tokens = response.data.tokens || response.data;
    
    console.log(`${colors.green}✅ SUCESSO${colors.reset}`);
    console.log(`   → Total de tokens: ${tokens.length}`);
    
    if (tokens.length > 0) {
      console.log(`\n   ${colors.yellow}TOKENS:${colors.reset}`);
      tokens.forEach((t, i) => {
        console.log(`   ${i + 1}. ${t.platform.toUpperCase()} - ${t.token.substring(0, 30)}...`);
      });
    }
    
    return { success: true, data: tokens };
  } catch (error) {
    console.error(`${colors.red}❌ ERRO${colors.reset}`, error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

// ============================================
// EXECUTAR TODOS OS TESTES
// ============================================
async function runAllTests() {
  console.log(`${colors.magenta}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.magenta}🧪 TESTES END-TO-END - DetranDenuncia v2.0.0${colors.reset}`);
  console.log(`${colors.magenta}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}📡 Base URL: ${BASE_URL}${colors.reset}`);
  console.log(`${colors.blue}📅 Data: ${new Date().toLocaleString('pt-BR')}${colors.reset}`);
  console.log(`${colors.magenta}═══════════════════════════════════════════════════════${colors.reset}`);
  
  const results = [];
  let testEmail = '';
  let testPassword = '';
  
  // Teste 1: Registrar usuário
  const registerResult = await testRegister();
  results.push({ name: 'Registrar Usuário', ...registerResult });
  
  if (registerResult.success) {
    testEmail = registerResult.data.user.email;
    testPassword = 'Senha123!';
    
    // Teste 2: Login
    const loginResult = await testLogin(testEmail, testPassword);
    results.push({ name: 'Login', ...loginResult });
    
    // Teste 3: Verificar autenticação
    const authResult = await testAuth();
    results.push({ name: 'Verificar Autenticação', ...authResult });
    
    // Teste 4: Listar denúncias
    const listResult = await testListViolations();
    results.push({ name: 'Listar Denúncias', ...listResult });
    
    // Teste 5: Estatísticas de gamificação
    const statsResult = await testGamificationStats();
    results.push({ name: 'Estatísticas de Gamificação', ...statsResult });
    
    // Teste 6: Leaderboard
    const leaderboardResult = await testLeaderboard();
    results.push({ name: 'Leaderboard', ...leaderboardResult });
    
    // Teste 7: Registrar token de notificação
    const tokenResult = await testRegisterNotificationToken();
    results.push({ name: 'Registrar Token de Notificação', ...tokenResult });
    
    // Teste 8: Listar tokens
    const listTokensResult = await testListNotificationTokens();
    results.push({ name: 'Listar Tokens de Notificação', ...listTokensResult });
  }
  
  // Resumo final
  console.log(`\n${colors.magenta}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.magenta}📊 RESUMO DOS TESTES${colors.reset}`);
  console.log(`${colors.magenta}═══════════════════════════════════════════════════════${colors.reset}\n`);
  
  results.forEach((result, index) => {
    const icon = result.success ? `${colors.green}✅${colors.reset}` : `${colors.red}❌${colors.reset}`;
    console.log(`${icon} Teste ${index + 1}: ${result.name}`);
  });
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  const percentage = ((successCount / totalCount) * 100).toFixed(0);
  
  console.log(`\n${colors.magenta}═══════════════════════════════════════════════════════${colors.reset}`);
  
  if (successCount === totalCount) {
    console.log(`${colors.green}🎉 RESULTADO: ${successCount}/${totalCount} testes passaram (${percentage}%)${colors.reset}`);
    console.log(`${colors.green}🎊 PARABÉNS! Todos os testes passaram!${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠️  RESULTADO: ${successCount}/${totalCount} testes passaram (${percentage}%)${colors.reset}`);
    console.log(`${colors.yellow}Alguns testes falharam. Verifique os erros acima.${colors.reset}`);
  }
  
  console.log(`${colors.magenta}═══════════════════════════════════════════════════════${colors.reset}\n`);
  
  // Salvar credenciais para testes manuais
  if (authToken) {
    console.log(`${colors.cyan}📝 CREDENCIAIS PARA TESTES MANUAIS:${colors.reset}`);
    console.log(`   Email: ${testEmail}`);
    console.log(`   Senha: ${testPassword}`);
    console.log(`   Token: ${authToken.substring(0, 50)}...`);
    console.log(`   UserID: ${userId}\n`);
  }
}

// Executar
runAllTests().catch(error => {
  console.error(`\n${colors.red}💥 ERRO FATAL:${colors.reset}`, error.message);
  process.exit(1);
});
