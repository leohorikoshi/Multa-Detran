# 🧪 GUIA DE TESTES END-TO-END - DetranDenuncia v2.0.0

**Data**: 7 de Dezembro de 2025  
**Versão**: v2.0.0  
**Objetivo**: Testar todas as 10 features implementadas

---

## 📋 PRÉ-REQUISITOS

### Backend
- [ ] Node.js 18+ instalado
- [ ] MongoDB rodando (ou usar modo mock com `npm run dev:test`)
- [ ] Porta 3000 disponível
- [ ] Dependências instaladas: `cd backend && npm install`

### Frontend
- [ ] Expo CLI configurado
- [ ] Dependências instaladas: `npm install --legacy-peer-deps`
- [ ] Dispositivo físico com Expo Go OU emulador configurado
- [ ] Mesma rede Wi-Fi (device e computador)

---

## 🚀 PASSO 1: INICIAR SERVIDORES

### Backend (Terminal 1)

```powershell
cd backend
npm run dev
# OU sem MongoDB:
npm run dev:test
```

✅ **Verificar**:
- [ ] Servidor rodando na porta 3000
- [ ] "MongoDB Connected" (ou "Using Mock Database")
- [ ] Sem erros no console

### Frontend (Terminal 2)

```powershell
npx expo start --tunnel
```

✅ **Verificar**:
- [ ] QR Code exibido
- [ ] Metro bundler ativo
- [ ] Opções: `w` (web), `a` (android), `i` (ios)

**Para testar no navegador** (mais rápido):
```powershell
npx expo start --web
```

---

## 🧪 PASSO 2: TESTES FUNCIONAIS

### ✅ 2.1 - Autenticação

#### Registro de Usuário
1. Abrir app → Tela de Boas-vindas
2. Clicar "Começar"
3. Clicar "Criar Conta"
4. Preencher:
   - Nome: "Teste Usuario"
   - Email: "teste@example.com"
   - Senha: "Senha123!"
5. Submeter formulário

**Esperar**:
- [ ] Loading spinner aparece
- [ ] Registro bem-sucedido
- [ ] Redirecionamento para HomeScreen
- [ ] Token JWT salvo (verificar AsyncStorage)

#### Login
1. Fazer logout (Settings → Sair)
2. Voltar para LoginScreen
3. Entrar com credenciais criadas
4. Verificar autenticação

**Esperar**:
- [ ] Login bem-sucedido
- [ ] Dados do usuário no Redux
- [ ] Token persistido

#### Persistência de Sessão
1. Fechar app completamente
2. Reabrir app
3. Verificar se continua autenticado

**Esperar**:
- [ ] Não volta para tela de login
- [ ] Usuário ainda autenticado

---

### ✅ 2.2 - CRUD de Denúncias

#### Criar Denúncia
1. HomeScreen → "Nova Denúncia"
2. ReportViolationScreen:
   - Tipo: "Estacionamento Irregular"
   - Descrição: "Veículo obstruindo calçada"
   - Tirar foto (ou selecionar da galeria)
   - Placa: "ABC-1234"
   - Permitir acesso à localização
3. Enviar denúncia

**Esperar**:
- [ ] Loading durante upload
- [ ] Sucesso confirmado
- [ ] Denúncia aparece em "Minhas Denúncias"

#### Listar Denúncias
1. HomeScreen → "Minhas Denúncias"
2. Ver lista de denúncias criadas

**Esperar**:
- [ ] Lista carregada corretamente
- [ ] Status exibido (Pendente/Aprovada/Rejeitada)
- [ ] Foto em miniatura

#### Detalhes da Denúncia
1. Clicar em uma denúncia
2. Ver ViolationDetailsScreen

**Esperar**:
- [ ] Foto em tamanho completo
- [ ] Todas as informações exibidas
- [ ] Mapa com marcador de localização
- [ ] Status colorido

---

### ✅ 2.3 - Feature #1: Dark Mode

1. Settings → Theme
2. Alternar entre Light/Dark/Auto
3. Verificar mudança em todas as telas

**Esperar**:
- [ ] Cores mudam instantaneamente
- [ ] Persistência após recarregar app
- [ ] Contraste adequado (WCAG AA)
- [ ] Todas as telas adaptadas

**Telas para verificar**:
- [ ] HomeScreen
- [ ] LoginScreen
- [ ] MyReportsScreen
- [ ] ViolationDetailsScreen
- [ ] SettingsScreen

---

### ✅ 2.4 - Feature #2: Social Sharing

1. ViolationDetailsScreen → Botão "Compartilhar"
2. Selecionar opção de compartilhamento:
   - WhatsApp
   - Facebook
   - Twitter
   - Instagram
   - Email
   - SMS
   - Copiar Link

**Esperar**:
- [ ] ShareModal abre
- [ ] Todas as 7 opções visíveis
- [ ] Texto formatado corretamente
- [ ] Deep link funcional: `detrandenuncia://violation/{id}`
- [ ] Compartilhamento registrado no backend

**Testar Deep Link**:
```
detrandenuncia://violation/675409bbc8751ce5742f0d92
```
- [ ] Abre app
- [ ] Navega para detalhes da denúncia

---

### ✅ 2.5 - Feature #3: Push Notifications

#### Registro de Token
1. Abrir app pela primeira vez
2. Permitir notificações quando solicitado

**Esperar**:
- [ ] Permissão de notificação solicitada
- [ ] Token Expo registrado no backend
- [ ] Confirmação no console

#### Enviar Notificação de Teste (Backend)

**Opção 1: Via API** (usar Postman/Insomnia/Thunder Client):
```http
POST http://localhost:3000/api/notifications/send-test
Authorization: Bearer {seu_token_jwt}
Content-Type: application/json

{
  "title": "Teste de Notificação",
  "body": "Esta é uma notificação de teste!",
  "data": {
    "type": "test",
    "timestamp": "2025-12-07T10:00:00Z"
  }
}
```

**Opção 2: Via Script Node** (criar arquivo `backend/test-notification.js`):
```javascript
const axios = require('axios');

const token = 'SEU_TOKEN_JWT_AQUI';

axios.post('http://localhost:3000/api/notifications/send-test', {
  title: 'Teste de Notificação',
  body: 'Notificação enviada via script!',
  data: { type: 'test' }
}, {
  headers: { Authorization: `Bearer ${token}` }
})
.then(res => console.log('✅ Notificação enviada:', res.data))
.catch(err => console.error('❌ Erro:', err.response?.data || err.message));
```

Executar: `node backend/test-notification.js`

**Esperar**:
- [ ] Notificação recebida no dispositivo
- [ ] Som/vibração (se habilitado)
- [ ] Badge no ícone do app
- [ ] Ao clicar, abre o app

#### Notificações Automáticas
1. Criar uma denúncia
2. Admin aprova/rejeita (via AdminDashboard)

**Esperar**:
- [ ] Notificação "Denúncia Aprovada" ✅
- [ ] OU "Denúncia Rejeitada" ❌
- [ ] Ao clicar, navega para ViolationDetailsScreen

---

### ✅ 2.6 - Feature #4: Offline Mode

#### Testar Cache
1. Abrir app com internet
2. Navegar para "Minhas Denúncias"
3. Carregar lista completa
4. **Desabilitar Wi-Fi/Dados móveis**
5. Fechar app
6. Reabrir app

**Esperar**:
- [ ] Denúncias ainda visíveis (cache)
- [ ] Imagens carregadas (CachedImage)
- [ ] Indicador "Offline" exibido
- [ ] Não há erros de rede

#### Criar Denúncia Offline
1. Com internet desligada
2. Tentar criar nova denúncia

**Esperar**:
- [ ] Denúncia salva localmente (pendingSync)
- [ ] Indicador "Aguardando Sincronização"
- [ ] Ao reconectar, sincroniza automaticamente

#### Reconexão
1. Reativar Wi-Fi/Dados
2. Esperar sincronização

**Esperar**:
- [ ] Denúncias pendentes enviadas
- [ ] Status atualizado
- [ ] Indicador "Online"

---

### ✅ 2.7 - Feature #6: Gamificação

#### Ver Estatísticas
1. HomeScreen → "Meu Perfil" (ou ícone de usuário)
2. Ver estatísticas de gamificação

**Esperar**:
- [ ] Pontos totais exibidos
- [ ] Nível calculado corretamente
- [ ] Badges desbloqueados visíveis
- [ ] Achievements listados

#### Ganhar Pontos
**Ações que dão pontos**:
- Criar denúncia: +10 pontos
- Denúncia aprovada: +50 pontos
- Compartilhar denúncia: +5 pontos
- Streak de 7 dias: +20 pontos

**Testar**:
1. Criar 1 denúncia → Verificar +10 pontos
2. Admin aprovar → Verificar +50 pontos (total: 60)
3. Compartilhar → Verificar +5 pontos (total: 65)

**Esperar**:
- [ ] Pontos atualizados instantaneamente
- [ ] Notificação de pontos ganhos
- [ ] Progresso de nível exibido

#### Desbloquear Badges
**Badges disponíveis**:
- 🎯 **Primeira Denúncia** - 1 denúncia
- 🤝 **Ajudante** - 10 denúncias
- 🛡️ **Guardião** - 50 denúncias
- 🦸 **Herói** - 100 denúncias
- 👑 **Lenda** - 500 denúncias
- 📢 **Compartilhador** - 20 compartilhamentos
- 🔥 **Streak 7** - 7 dias consecutivos
- ⚡ **Streak 30** - 30 dias consecutivos

**Testar**:
1. Criar primeira denúncia
2. Verificar badge "Primeira Denúncia" 🎯

**Esperar**:
- [ ] Badge aparece na lista
- [ ] Notificação de desbloqueio
- [ ] Animação (se implementada)

#### Ranking
1. Ver Leaderboard
2. Verificar posição no ranking

**Esperar**:
- [ ] Top 10 usuários listados
- [ ] Ordenados por pontos (maior → menor)
- [ ] Posição atual destacada
- [ ] Nível e pontos de cada usuário

**Testar com múltiplos usuários**:
1. Criar 2-3 contas diferentes
2. Fazer denúncias em cada uma
3. Verificar ranking atualizado

---

### ✅ 2.8 - Feature #7: Heatmap

1. HomeScreen → "Mapa de Denúncias" (ou ícone de mapa)
2. Abrir HeatmapScreen

**Esperar**:
- [ ] Mapa carregado (Google Maps)
- [ ] Região inicial: São Paulo (-23.550520, -46.633308)
- [ ] Marcadores para cada denúncia
- [ ] Cores por status:
  - 🟢 Verde: Aprovada
  - 🔴 Vermelho: Pendente/Rejeitada

#### Interação com Marcadores
1. Clicar em um marcador
2. Ver callout com informações

**Esperar**:
- [ ] Tipo da infração exibido
- [ ] Endereço (se disponível)
- [ ] Ao clicar no callout → ViolationDetailsScreen

#### Zoom e Navegação
1. Zoom in/out
2. Arrastar mapa
3. Ver marcadores agrupados (se muitos)

**Esperar**:
- [ ] Navegação fluida
- [ ] Marcadores agrupados em clusters (se >10)
- [ ] Performance adequada (>30 FPS)

---

### ✅ 2.9 - Feature #8: OCR (Leitura de Placas)

#### Testar Extração de Placa
1. ReportViolationScreen
2. Tirar foto de veículo com placa visível
3. Aguardar processamento OCR

**Esperar**:
- [ ] Placa detectada automaticamente
- [ ] Campo "Placa" preenchido (ABC-1234 ou ABC1D23)
- [ ] Validação de formato brasileiro

**Formatos válidos**:
- ABC-1234 (antigo)
- ABC1D23 (Mercosul)

#### Testar Validação
1. Digitar placa manualmente: "XYZ-5678"
2. Submeter

**Esperar**:
- [ ] Validação de formato
- [ ] Erro se inválido (ex: "12345")

#### Testar OCR com Imagem Ruim
1. Foto desfocada ou sem placa
2. Verificar comportamento

**Esperar**:
- [ ] Campo permanece vazio
- [ ] Mensagem: "Placa não detectada, insira manualmente"
- [ ] Permite digitação manual

---

### ✅ 2.10 - Feature #9: Chatbot

1. HomeScreen → "Ajuda" ou ícone de chat
2. Fazer perguntas ao chatbot

**Perguntas de teste**:
```
1. "Como faço para denunciar?"
2. "Quais tipos de infração posso denunciar?"
3. "Quanto tempo demora para analisar?"
4. "Como ganho pontos?"
5. "O que são badges?"
6. "Como funciona o aplicativo?"
7. "Meus dados estão seguros?"
8. "Preciso de suporte"
9. "Blablabla" (pergunta desconhecida)
```

**Esperar**:
- [ ] Respostas instantâneas
- [ ] Texto formatado corretamente
- [ ] Resposta padrão para perguntas não mapeadas
- [ ] Histórico de conversas (se implementado)

**Testar Keywords**:
- "denunciar" → Resposta sobre como criar denúncia
- "tipos" / "infrações" → Lista de tipos
- "tempo" / "demora" → Prazo de análise
- "pontos" → Sistema de pontuação
- "badges" → Conquistas

---

### ✅ 2.11 - Feature #10: PWA (Progressive Web App)

**Teste apenas na Web**:
```powershell
npx expo start --web
```

#### Verificar Manifest
1. Abrir http://localhost:8081
2. DevTools (F12) → Application → Manifest

**Esperar**:
- [ ] manifest.json carregado
- [ ] Nome: "DetranDenuncia - Denúncias de Trânsito"
- [ ] Ícones: 192x192 e 512x512
- [ ] Display: standalone
- [ ] Theme color: #1E88E5

#### Instalar PWA
1. Chrome → Menu → "Instalar DetranDenuncia"
2. Confirmar instalação

**Esperar**:
- [ ] Prompt de instalação aparece
- [ ] App instalado na área de trabalho/menu iniciar
- [ ] Ícone personalizado
- [ ] Abre em janela standalone (sem barra do navegador)

#### Testar Service Worker
1. DevTools → Application → Service Workers
2. Verificar status

**Esperar**:
- [ ] Service worker registrado
- [ ] Status: "Activated and running"
- [ ] Cache Name: "detrandenuncia-v1"

#### Modo Offline (PWA)
1. DevTools → Network → Offline
2. Recarregar página

**Esperar**:
- [ ] App ainda funciona
- [ ] Assets carregados do cache
- [ ] Funcionalidade básica mantida

---

## 🐛 PASSO 3: DOCUMENTAR BUGS

### Template de Bug Report

Para cada bug encontrado, anotar:

```markdown
### Bug #X: [Título]

**Severidade**: 🔴 Crítico / 🟡 Médio / 🟢 Baixo

**Feature**: [#1 Dark Mode / #2 Sharing / etc]

**Passos para Reproduzir**:
1. 
2. 
3. 

**Comportamento Esperado**:
-

**Comportamento Atual**:
-

**Screenshots**:
[Anexar se possível]

**Ambiente**:
- Device: [iPhone 15 / Android Emulator / Web]
- OS: [iOS 17 / Android 14 / Windows 11]
- Versão App: v2.0.0
```

### Categorias de Bugs

**🔴 Críticos** (Bloqueiam uso):
- App crasha
- Não consegue fazer login
- Não consegue criar denúncia
- Dados perdidos

**🟡 Médios** (Prejudicam UX):
- Loading infinito
- Imagens não carregam
- Notificação não chega
- Offline mode não funciona

**🟢 Baixos** (Cosméticos):
- Alinhamento de UI
- Cores erradas
- Typos
- Performance lenta

---

## 📊 PASSO 4: CHECKLIST FINAL

### Core Functionality
- [ ] Registro funciona
- [ ] Login funciona
- [ ] Logout funciona
- [ ] Criar denúncia funciona
- [ ] Listar denúncias funciona
- [ ] Detalhes da denúncia funciona
- [ ] Upload de foto funciona
- [ ] Localização detectada

### Features Novas (v1.3.0 - v2.0.0)
- [ ] #1 Dark Mode completo
- [ ] #2 Social Sharing (7 opções)
- [ ] #3 Push Notifications
- [ ] #4 Offline Mode (cache + sync)
- [ ] #6 Gamificação (pontos + badges)
- [ ] #7 Heatmap funcional
- [ ] #8 OCR detecta placas
- [ ] #9 Chatbot responde FAQ
- [ ] #10 PWA instalável

### Performance
- [ ] App inicia em <3s
- [ ] Transições suaves (>30 FPS)
- [ ] Imagens otimizadas
- [ ] Sem memory leaks

### UX/UI
- [ ] Navegação intuitiva
- [ ] Feedback visual em ações
- [ ] Loading states
- [ ] Error handling
- [ ] Dark mode consistente

---

## 🎯 PRÓXIMOS PASSOS APÓS TESTES

### Se 0-2 bugs críticos:
✅ **App pronto para produção!**
- Fazer deploy staging
- Testes beta com usuários reais
- Preparar App Store/Google Play

### Se 3-5 bugs médios:
🟡 **Refinamento necessário**
- Priorizar bugs médios
- 1-2 dias de correções
- Re-testar features afetadas

### Se >5 bugs críticos:
🔴 **Refatoração necessária**
- Analisar causa raiz
- Refatorar componentes problemáticos
- Testes unitários adicionais
- Re-testar end-to-end completo

---

## 📝 RELATÓRIO FINAL

Após completar todos os testes, criar relatório:

```markdown
# Relatório de Testes E2E - DetranDenuncia v2.0.0

**Data**: [DATA]
**Testador**: [NOME]
**Device**: [DISPOSITIVO]
**Duração**: [TEMPO]

## Resumo Executivo
- ✅ Features testadas: X/10
- 🐛 Bugs encontrados: X (Y críticos, Z médios, W baixos)
- ⚡ Performance: [Boa/Média/Ruim]
- 🎨 UX: [Excelente/Boa/Precisa melhorias]

## Detalhes por Feature
[Copiar resultados de cada seção]

## Bugs Críticos
[Listar todos os bugs críticos encontrados]

## Recomendações
[Próximos passos sugeridos]
```

---

**BOA SORTE NOS TESTES! 🚀**

Qualquer dúvida, consulte a documentação ou abra uma issue.
