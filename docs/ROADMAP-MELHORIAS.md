# 🚀 Roadmap de Melhorias - DetranDenuncia

**Versão**: 1.0  
**Data de Criação**: 6 de Dezembro de 2025  
**Status**: 📋 Planejamento Completo  
**Meta**: Implementar 10 melhorias priorizadas em 5 sprints

---

## 📊 Visão Geral do Roadmap

### Timeline Total: 26-39 dias (~5-8 semanas)

```
Sprint 1 (Quick Wins) ─────────► 4-6 dias
    ├── Dark Mode (1-2 dias)
    ├── Social Sharing (1 dia)
    └── Push Notifications (2-3 dias)

Sprint 2 (Foundation) ─────────► 5-7 dias
    ├── Offline Mode (3-5 dias)
    └── Home Screen Widget (2 dias)

Sprint 3 (Engagement) ─────────► 9-12 dias
    ├── Gamificação (5-7 dias)
    └── Heatmap (4-5 dias)

Sprint 4 (Intelligence) ───────► 9-13 dias
    ├── OCR com IA (4-6 dias)
    └── Chatbot (5-7 dias)

Sprint 5 (Expansion) ──────────► 3 dias
    └── PWA (3 dias)
```

---

## 🎯 Sprint 1: Quick Wins (4-6 dias)

**Objetivo**: Implementar melhorias de alto impacto e baixa complexidade para gerar engajamento imediato.

### 1️⃣ Dark Mode (1-2 dias) - PRIORIDADE ALTA

#### 📋 Checklist de Implementação

**Backend** (Não requer alterações)
- [x] Nenhuma mudança necessária

**Frontend**
- [ ] Instalar dependências
  ```bash
  npm install @react-navigation/native react-native-appearance
  npx expo install expo-system-ui
  ```

- [ ] Criar context de tema
  - [ ] Arquivo: `src/contexts/ThemeContext.tsx`
  - [ ] Estados: `theme` ('light' | 'dark' | 'auto')
  - [ ] Funções: `toggleTheme()`, `setTheme()`
  - [ ] Persistência: AsyncStorage

- [ ] Definir paleta de cores
  - [ ] Arquivo: `src/constants/colors.ts`
  - [ ] Light theme: branco, azul, cinza claro
  - [ ] Dark theme: preto, azul escuro, cinza escuro
  - [ ] Garantir contraste WCAG AA (4.5:1)

- [ ] Atualizar componentes (20+ arquivos)
  - [ ] `src/screens/HomeScreen.tsx`
  - [ ] `src/screens/LoginScreen.tsx`
  - [ ] `src/screens/RegisterScreen.tsx`
  - [ ] `src/screens/ReportViolationScreen.tsx`
  - [ ] `src/screens/MyReportsScreen.tsx`
  - [ ] `src/screens/ViolationDetailsScreen.tsx`
  - [ ] `src/screens/AdminDashboard.tsx`
  - [ ] `src/components/ui/*` (todos os componentes UI)
  - [ ] `src/components/violation/*`

- [ ] Adicionar toggle em Settings
  - [ ] Criar `src/screens/SettingsScreen.tsx` (se não existir)
  - [ ] Switch: Light / Dark / Auto
  - [ ] Preview em tempo real

- [ ] Testar em todos os devices
  - [ ] iOS (light/dark)
  - [ ] Android (light/dark)
  - [ ] Web (light/dark)
  - [ ] Transição suave (animação)

**Documentação**
- [ ] Atualizar `docs/7-Guias.md` com instruções de uso
- [ ] Screenshots light vs dark
- [ ] Atualizar `docs/8-Changelog.md`

**Métricas de Sucesso**
- Tempo de implementação: 1-2 dias
- Satisfação esperada: +25%
- Taxa de adoção do dark mode: >60%
- Sem degradação de performance

---

### 2️⃣ Social Sharing (1 dia) - PRIORIDADE ALTA

#### 📋 Checklist de Implementação

**Backend** (Não requer alterações)
- [x] Endpoint de denúncias já existe
- [x] Imagens acessíveis via URL

**Frontend**
- [ ] Instalar dependências
  ```bash
  npm install react-native-share
  npx expo install expo-sharing
  ```

- [ ] Criar templates de compartilhamento
  - [ ] Arquivo: `src/utils/shareTemplates.ts`
  - [ ] Template para Instagram Stories (1080x1920)
  - [ ] Template para Facebook/Twitter (1200x630)
  - [ ] Template para WhatsApp (texto + imagem)
  - [ ] Incluir logo DetranDenuncia
  - [ ] Incluir call-to-action (baixe o app)

- [ ] Implementar geração de imagem compartilhável
  - [ ] Biblioteca: `react-native-view-shot`
  - [ ] Overlay: Tipo de infração + localização + logo
  - [ ] Qualidade: 90% (balanço tamanho/qualidade)

- [ ] Adicionar botões de share
  - [ ] `ViolationDetailsScreen`: Botão "Compartilhar"
  - [ ] `MyReportsScreen`: Ícone de share em cada card
  - [ ] Modal de opções: WhatsApp, Facebook, Instagram, Twitter, Copiar Link

- [ ] Implementar deep linking
  - [ ] Arquivo: `app.json` → scheme: "detrandenuncia"
  - [ ] URL: `detrandenuncia://violation/:id`
  - [ ] Handling em `App.tsx`
  - [ ] Fallback para web: `https://app.detrandenuncia.com.br/violation/:id`

- [ ] Testar compartilhamento
  - [ ] WhatsApp (preview de link)
  - [ ] Instagram Stories
  - [ ] Facebook
  - [ ] Twitter
  - [ ] Copiar link

**Documentação**
- [ ] Atualizar `docs/7-Guias.md` com exemplos de uso
- [ ] GIF demonstrativo do fluxo
- [ ] Atualizar `docs/8-Changelog.md`

**Métricas de Sucesso**
- Tempo de implementação: 1 dia
- Taxa de compartilhamento: >15%
- Downloads orgânicos: +100% em 3 meses
- Viral coefficient: >1.2

---

### 3️⃣ Push Notifications (2-3 dias) - PRIORIDADE CRÍTICA

#### 📋 Checklist de Implementação

**Backend**
- [ ] Instalar dependências
  ```bash
  cd backend
  npm install firebase-admin expo-server-sdk
  ```

- [ ] Configurar Firebase
  - [ ] Criar projeto no Firebase Console
  - [ ] Baixar `serviceAccountKey.json`
  - [ ] Adicionar ao `.gitignore`
  - [ ] Configurar em `.env`: `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`

- [ ] Criar notification service
  - [ ] Arquivo: `backend/src/services/notification.service.ts`
  - [ ] Função: `sendPushNotification(userId, title, body, data)`
  - [ ] Função: `sendBulkNotifications(userIds[], title, body)`
  - [ ] Função: `scheduleNotification(userId, timestamp, message)`

- [ ] Criar modelo de Push Token
  - [ ] Arquivo: `backend/src/models/pushToken.model.ts`
  - [ ] Campos: `userId`, `token`, `platform`, `createdAt`
  - [ ] Índice: `userId` (único)

- [ ] Criar endpoints
  - [ ] `POST /api/notifications/register-token` (registra token do device)
  - [ ] `POST /api/notifications/unregister-token` (remove token)
  - [ ] `GET /api/notifications/history/:userId` (histórico de notificações)

- [ ] Implementar triggers de notificação
  - [ ] Status mudou para "aprovada" → Notificar usuário
  - [ ] Status mudou para "rejeitada" → Notificar com motivo
  - [ ] Status mudou para "em_analise" → Notificar
  - [ ] Nova denúncia em área seguida → Notificar (futuro)

**Frontend**
- [ ] Instalar dependências
  ```bash
  npx expo install expo-notifications expo-device expo-constants
  ```

- [ ] Solicitar permissões
  - [ ] Arquivo: `src/utils/notifications.ts`
  - [ ] Função: `registerForPushNotifications()`
  - [ ] Pedir permissão ao abrir app pela primeira vez
  - [ ] Enviar token para backend

- [ ] Configurar listeners
  - [ ] Notificação recebida (foreground)
  - [ ] Notificação clicada (background/killed)
  - [ ] Navegação automática para tela relevante

- [ ] Criar componente de notificação in-app
  - [ ] Arquivo: `src/components/ui/NotificationBanner.tsx`
  - [ ] Exibir no topo quando receber em foreground
  - [ ] Auto-dismiss após 5s
  - [ ] Ação: Tocar para ver detalhes

- [ ] Configurar `app.json`
  - [ ] `notification.icon`: logo do app
  - [ ] `notification.color`: cor primária
  - [ ] `notification.androidMode`: "default"

- [ ] Testar notificações
  - [ ] iOS (device físico obrigatório)
  - [ ] Android (emulator + device)
  - [ ] Foreground, background, killed
  - [ ] Deep linking ao clicar

**Documentação**
- [ ] Atualizar `docs/README.md` → Seção "Notificações"
- [ ] Documentar triggers em `docs/7-Guias.md`
- [ ] Atualizar `docs/8-Changelog.md`

**Métricas de Sucesso**
- Tempo de implementação: 2-3 dias
- Taxa de opt-in: >70%
- Engagement rate: +35%
- Retention D7: +20%

---

## 🏗️ Sprint 2: Foundation (5-7 dias)

**Objetivo**: Construir funcionalidades fundamentais que suportam uso em áreas de baixa conectividade.

### 4️⃣ Offline Mode (3-5 dias) - PRIORIDADE ALTA

#### 📋 Checklist de Implementação

**Backend** (Ajustes mínimos)
- [ ] Criar endpoint de sincronização batch
  - [ ] `POST /api/sync/violations` (aceita array de denúncias)
  - [ ] Validação de duplicatas via hash de imagem
  - [ ] Retornar IDs remotos para mapeamento

**Frontend**
- [ ] Instalar dependências
  ```bash
  npm install @react-native-async-storage/async-storage netinfo
  npx expo install expo-file-system
  ```

- [ ] Criar sync service
  - [ ] Arquivo: `src/services/syncService.ts`
  - [ ] Função: `saveDraftOffline(violation)`
  - [ ] Função: `syncPendingViolations()`
  - [ ] Função: `checkConnectivity()`
  - [ ] Fila de sincronização com retry logic

- [ ] Implementar cache de imagens
  - [ ] Salvar imagens localmente em `FileSystem.documentDirectory`
  - [ ] Gerar thumbnail para preview rápido
  - [ ] Upload quando online

- [ ] Atualizar ReportViolationScreen
  - [ ] Detectar se está offline
  - [ ] Banner: "Você está offline. Denúncia será enviada quando conectar."
  - [ ] Salvar em AsyncStorage como rascunho
  - [ ] Badge visual "Pendente de Sincronização"

- [ ] Criar tela de rascunhos
  - [ ] Arquivo: `src/screens/DraftsScreen.tsx`
  - [ ] Listar denúncias offline
  - [ ] Botão: "Tentar Sincronizar Agora"
  - [ ] Status: "Aguardando conexão" / "Sincronizando..." / "Erro"

- [ ] Implementar sincronização automática
  - [ ] Listener de conectividade (NetInfo)
  - [ ] Ao detectar online → tentar sync
  - [ ] Retry exponencial em caso de falha (1s, 2s, 4s, 8s...)

- [ ] Testar modo offline
  - [ ] Modo avião + criar denúncia
  - [ ] Desativar modo avião → verificar sync
  - [ ] Conflitos de dados (mesma denúncia 2x)

**Documentação**
- [ ] Atualizar `docs/7-Guias.md` → Seção "Uso Offline"
- [ ] Fluxograma de sincronização
- [ ] Atualizar `docs/8-Changelog.md`

**Métricas de Sucesso**
- Tempo de implementação: 3-5 dias
- Taxa de sucesso de sync: >98%
- Cobertura rural: +50%
- Satisfação usuários rurais: +60%

---

### 5️⃣ Home Screen Widget (2 dias) - PRIORIDADE MÉDIA

#### 📋 Checklist de Implementação

**Backend** (Não requer alterações)
- [x] Endpoints existentes suficientes

**Frontend**
- [ ] Configurar widget (iOS)
  - [ ] Criar extensão de widget em Xcode
  - [ ] Timeline provider com dados do usuário
  - [ ] Layout: Stats + botão "Reportar Rápido"
  - [ ] Deep link para abrir app

- [ ] Configurar widget (Android)
  - [ ] Criar `android/app/src/main/java/.../WidgetProvider.kt`
  - [ ] Layout XML com RemoteViews
  - [ ] Intent para abrir app em ReportViolationScreen

- [ ] Dados do widget
  - [ ] Total de denúncias do usuário
  - [ ] Última denúncia (status + data)
  - [ ] Botão: "Reportar Infração"
  - [ ] Atualização: A cada 1 hora (background)

- [ ] Implementar deep link
  - [ ] URL: `detrandenuncia://report`
  - [ ] Abrir diretamente em ReportViolationScreen
  - [ ] Pré-preencher GPS se disponível

- [ ] Testar widgets
  - [ ] iOS (3 tamanhos: small, medium, large)
  - [ ] Android (4x2, 4x4)
  - [ ] Atualização de dados
  - [ ] Clique no botão

**Documentação**
- [ ] Screenshots do widget em `docs/assets/`
- [ ] Instruções de instalação em `docs/7-Guias.md`
- [ ] Atualizar `docs/8-Changelog.md`

**Métricas de Sucesso**
- Tempo de implementação: 2 dias
- Taxa de adoção: >30%
- Redução de fricção: -80%
- Aumento em denúncias: +15%

---

## 🎮 Sprint 3: Engagement (9-12 dias)

**Objetivo**: Gamificar a experiência para aumentar retenção e engajamento a longo prazo.

### 6️⃣ Gamificação (5-7 dias) - PRIORIDADE ALTA

#### 📋 Checklist de Implementação

**Backend**
- [ ] Criar modelo de pontuação
  - [ ] Arquivo: `backend/src/models/gamification.model.ts`
  - [ ] Campos: `userId`, `points`, `level`, `badges`, `streak`, `rank`

- [ ] Definir sistema de pontos
  - [ ] Denúncia criada: +10 pontos
  - [ ] Denúncia aprovada: +50 pontos (bônus)
  - [ ] Denúncia rejeitada: -5 pontos (sem penalidade excessiva)
  - [ ] Login diário: +5 pontos (streak)
  - [ ] Compartilhamento: +15 pontos

- [ ] Criar badges
  - [ ] 🥉 Bronze: 1ª denúncia
  - [ ] 🥈 Prata: 10 denúncias aprovadas
  - [ ] 🥇 Ouro: 50 denúncias aprovadas
  - [ ] 🔥 Sequência: 7 dias seguidos
  - [ ] 📸 Fotógrafo: 100 fotos enviadas
  - [ ] 🏆 Top 10 do mês
  - [ ] ⭐ Cidadão Exemplo: 95%+ aprovação

- [ ] Criar rankings
  - [ ] Endpoint: `GET /api/gamification/leaderboard`
  - [ ] Filtros: Global, Semanal, Mensal
  - [ ] Top 100 usuários
  - [ ] Posição do usuário atual

- [ ] Criar endpoints
  - [ ] `GET /api/gamification/profile/:userId` (stats do usuário)
  - [ ] `GET /api/gamification/badges` (lista de badges)
  - [ ] `POST /api/gamification/claim-daily-bonus` (streak diário)

**Frontend**
- [ ] Criar tela de perfil gamificado
  - [ ] Arquivo: `src/screens/GamificationProfileScreen.tsx`
  - [ ] Avatar do usuário + level
  - [ ] Barra de progresso para próximo nível
  - [ ] Grid de badges (desbloqueados + bloqueados)
  - [ ] Estatísticas: pontos, ranking, streak

- [ ] Criar componente de level up
  - [ ] Arquivo: `src/components/ui/LevelUpModal.tsx`
  - [ ] Animação de confetes
  - [ ] "Parabéns! Você alcançou o Nível X"
  - [ ] Próximas recompensas

- [ ] Criar tela de leaderboard
  - [ ] Arquivo: `src/screens/LeaderboardScreen.tsx`
  - [ ] Tabs: Hoje, Semana, Mês, Sempre
  - [ ] Cards com foto + nome + pontos
  - [ ] Destaque para Top 3 (ouro, prata, bronze)
  - [ ] Posição do usuário fixada no topo

- [ ] Adicionar notificações gamificadas
  - [ ] "Você ganhou um novo badge: 🥇 Ouro!"
  - [ ] "Subiu de nível! Agora é Nível 5"
  - [ ] "Você está no Top 10!"

- [ ] Integrar com fluxos existentes
  - [ ] Após denúncia aprovada → mostrar +50 pontos
  - [ ] Login diário → "Streak de X dias! +5 pontos"

**Documentação**
- [ ] Criar `docs/GAMIFICATION.md` com sistema completo
- [ ] Tabela de pontos e badges
- [ ] Atualizar `docs/8-Changelog.md`

**Métricas de Sucesso**
- Tempo de implementação: 5-7 dias
- Engagement: +40%
- Retention D30: +35%
- Denúncias por usuário: +50%

---

### 7️⃣ Heatmap (4-5 dias) - PRIORIDADE ALTA

#### 📋 Checklist de Implementação

**Backend**
- [ ] Criar endpoint de agregação
  - [ ] `GET /api/analytics/heatmap`
  - [ ] Query params: `?type=all&dateFrom=&dateTo=&zoom=`
  - [ ] Retornar array de coordenadas + contagem
  - [ ] Cache de 1 hora (Redis futuro)

- [ ] Otimizar queries geoespaciais
  - [ ] Criar índice 2dsphere no MongoDB
  - [ ] Aggregation pipeline com `$geoNear`
  - [ ] Clustering para zoom baixo (cidade inteira)

**Frontend**
- [ ] Instalar dependências
  ```bash
  npm install react-native-maps react-native-maps-heatmap
  npx expo install expo-location
  ```

- [ ] Criar tela de mapa
  - [ ] Arquivo: `src/screens/HeatmapScreen.tsx`
  - [ ] MapView fullscreen
  - [ ] Layer de heatmap sobreposto
  - [ ] Gradiente: verde (baixo) → amarelo → vermelho (alto)

- [ ] Implementar filtros
  - [ ] Dropdown: Tipo de infração
  - [ ] Date range picker: Últimos 7/30/90 dias
  - [ ] Toggle: Heatmap / Pins individuais

- [ ] Adicionar interatividade
  - [ ] Clique em pin → modal com detalhes
  - [ ] Zoom automático em clusters
  - [ ] Busca por endereço

- [ ] Otimizar performance
  - [ ] Lazy loading de pontos
  - [ ] Clustering de markers (react-native-maps-supercluster)
  - [ ] Debounce de movimentação do mapa

- [ ] Adicionar botão no HomeScreen
  - [ ] Ícone de mapa → navegar para HeatmapScreen
  - [ ] Badge: "Ver pontos críticos"

**Documentação**
- [ ] Screenshots do mapa em `docs/assets/`
- [ ] Explicação de cores em `docs/7-Guias.md`
- [ ] Atualizar `docs/8-Changelog.md`

**Métricas de Sucesso**
- Tempo de implementação: 4-5 dias
- Uso do mapa: >40% usuários
- Valor percebido: +70%
- Compartilhamento de mapas: +25%

---

## 🤖 Sprint 4: Intelligence (9-13 dias)

**Objetivo**: Adicionar inteligência artificial para automatizar tarefas e melhorar UX.

### 8️⃣ OCR com IA (4-6 dias) - PRIORIDADE MÉDIA

#### 📋 Checklist de Implementação

**Backend**
- [ ] Configurar Google Vision API
  - [ ] Criar projeto no Google Cloud
  - [ ] Ativar Cloud Vision API
  - [ ] Gerar service account key
  - [ ] Adicionar credenciais ao `.env`

- [ ] Instalar dependências
  ```bash
  npm install @google-cloud/vision
  ```

- [ ] Criar OCR service
  - [ ] Arquivo: `backend/src/services/ocr.service.ts`
  - [ ] Função: `extractPlateFromImage(imageBuffer)`
  - [ ] Regex de validação: formato BR (ABC-1234 ou ABC1D23)
  - [ ] Confiança mínima: 85%

- [ ] Integrar ao upload de imagens
  - [ ] No middleware de imagem, chamar OCR service
  - [ ] Se placa detectada → preencher campo automaticamente
  - [ ] Retornar no response: `suggestedPlate`, `confidence`

**Frontend**
- [ ] Atualizar ReportViolationScreen
  - [ ] Após upload de imagem → mostrar loading "Detectando placa..."
  - [ ] Se placa detectada → preencher campo automaticamente
  - [ ] Banner: "Placa detectada: ABC-1234 (92% confiança). Confirme ou edite."
  - [ ] Permitir edição manual

- [ ] Feedback visual
  - [ ] Ícone de verificação se confiança >90%
  - [ ] Ícone de alerta se confiança 70-90%
  - [ ] Campo em branco se <70%

**Documentação**
- [ ] Adicionar seção "OCR Automático" em `docs/7-Guias.md`
- [ ] Exemplos de placas detectadas
- [ ] Atualizar `docs/8-Changelog.md`

**Métricas de Sucesso**
- Tempo de implementação: 4-6 dias
- Taxa de detecção: >80%
- Redução de tempo de preenchimento: -60%
- Satisfação: +45%

---

### 9️⃣ Chatbot (5-7 dias) - PRIORIDADE MÉDIA

#### 📋 Checklist de Implementação

**Backend**
- [ ] Escolher provedor de NLP
  - [ ] Opção 1: Dialogflow (Google)
  - [ ] Opção 2: Wit.ai (Meta)
  - [ ] Opção 3: OpenAI GPT-3.5 Turbo (menor custo)

- [ ] Instalar dependências
  ```bash
  npm install openai  # ou dialogflow
  ```

- [ ] Criar intents básicos
  - [ ] "Como criar uma denúncia?"
  - [ ] "Quanto tempo para analisar?"
  - [ ] "Como acompanhar minha denúncia?"
  - [ ] "Quais tipos de infrações posso reportar?"
  - [ ] "Preciso de ajuda com login"
  - [ ] "Esqueci minha senha"
  - [ ] "Como funciona o sistema de pontos?"

- [ ] Criar chatbot service
  - [ ] Arquivo: `backend/src/services/chatbot.service.ts`
  - [ ] Função: `processMessage(message, context)`
  - [ ] Fallback: escalar para humano se confiança <60%

- [ ] Criar endpoints
  - [ ] `POST /api/chatbot/message` (envia mensagem)
  - [ ] `GET /api/chatbot/conversation/:userId` (histórico)
  - [ ] `POST /api/chatbot/escalate` (escalar para suporte)

**Frontend**
- [ ] Instalar dependências
  ```bash
  npm install react-native-gifted-chat
  ```

- [ ] Criar tela de chat
  - [ ] Arquivo: `src/screens/ChatbotScreen.tsx`
  - [ ] Interface de chat com bolhas
  - [ ] Avatar do bot (logo DetranDenuncia)
  - [ ] Typing indicator

- [ ] Implementar funcionalidades
  - [ ] Envio de mensagens
  - [ ] Respostas em tempo real
  - [ ] Botões de resposta rápida (Quick Replies)
  - [ ] Opção "Falar com humano"

- [ ] Adicionar botão flutuante
  - [ ] Ícone de chat no canto inferior direito
  - [ ] Disponível em todas as telas
  - [ ] Badge de notificação se nova mensagem

- [ ] Integração com suporte
  - [ ] Se escalado → criar ticket
  - [ ] Email para equipe de suporte
  - [ ] Notificação para admin

**Documentação**
- [ ] Criar `docs/CHATBOT.md` com lista de intents
- [ ] Exemplos de conversas
- [ ] Atualizar `docs/8-Changelog.md`

**Métricas de Sucesso**
- Tempo de implementação: 5-7 dias
- Taxa de resolução automática: >70%
- Redução de tickets: -50%
- Satisfação: +40%

---

## 🌐 Sprint 5: Expansion (3 dias)

**Objetivo**: Converter em PWA para expandir alcance para desktop e navegadores mobile.

### 🔟 PWA (3 dias) - PRIORIDADE MÉDIA

#### 📋 Checklist de Implementação

**Frontend (Web)**
- [ ] Configurar Expo para PWA
  - [ ] Arquivo: `app.json`
  - [ ] Adicionar seção `web.pwa`
  - [ ] Icons: 192x192, 512x512
  - [ ] Theme color, background color

- [ ] Criar manifest.json
  - [ ] Nome: "DetranDenuncia"
  - [ ] Short name: "Detran"
  - [ ] Display: "standalone"
  - [ ] Start URL: "/"
  - [ ] Icons em múltiplos tamanhos

- [ ] Implementar Service Worker
  - [ ] Cache de assets estáticos
  - [ ] Cache de imagens
  - [ ] Offline fallback page
  - [ ] Estratégia: Network first, fallback to cache

- [ ] Adicionar install prompt
  - [ ] Detectar se PWA não instalado
  - [ ] Banner: "Instalar app para melhor experiência"
  - [ ] Botão: "Instalar" → beforeinstallprompt

- [ ] Otimizações PWA
  - [ ] Lazy loading de rotas
  - [ ] Code splitting
  - [ ] Minificação
  - [ ] Lighthouse score >90

- [ ] Testar PWA
  - [ ] Chrome (desktop + mobile)
  - [ ] Safari (iOS)
  - [ ] Edge
  - [ ] Firefox
  - [ ] Instalar na home screen

**Documentação**
- [ ] Criar `docs/PWA.md` com instruções de instalação
- [ ] GIF de instalação no Chrome
- [ ] Atualizar `docs/8-Changelog.md`

**Métricas de Sucesso**
- Tempo de implementação: 3 dias
- Installs PWA: >10k em 3 meses
- Desktop usage: +50%
- Lighthouse score: >90

---

## 📊 Métricas de Acompanhamento

### KPIs por Sprint

| Sprint | Métrica Principal | Meta |
|--------|-------------------|------|
| Sprint 1 | Satisfação (NPS) | +20 pontos |
| Sprint 2 | Cobertura rural | +50% |
| Sprint 3 | Retention D30 | +35% |
| Sprint 4 | Eficiência | -60% tempo |
| Sprint 5 | Alcance desktop | +50% usuários |

### Dashboard de Progresso

```
Sprint 1 ■■■■■■■■■■ 100% ✅
Sprint 2 ░░░░░░░░░░   0% ⏳
Sprint 3 ░░░░░░░░░░   0% ⏳
Sprint 4 ░░░░░░░░░░   0% ⏳
Sprint 5 ░░░░░░░░░░   0% ⏳
```

---

## 🚨 Dependências e Bloqueios

### Dependências Técnicas

| Melhoria | Depende de | Motivo |
|----------|------------|--------|
| Widget | Push Notifications | Widget usa notificações |
| Gamificação | Backend refatorado | Precisa de novo schema |
| Heatmap | Dados suficientes | Mínimo 1000 denúncias |
| Chatbot | FAQ documentado | Base de conhecimento |

### Recursos Externos

| Sprint | Recurso | Custo Estimado | Status |
|--------|---------|----------------|--------|
| 1 | Firebase (Push) | $0 (Free tier) | ✅ Disponível |
| 4 | Google Vision API | ~$100/mês | ⏳ A contratar |
| 4 | OpenAI API | ~$50/mês | ⏳ A contratar |
| 5 | SSL Certificate | $0 (Let's Encrypt) | ✅ Disponível |

---

## 🔄 Processo de Revisão

### Checklist Pós-Sprint

Após completar cada sprint, execute:

- [ ] **Code Review**: 100% do código revisado por outro dev
- [ ] **Testes**: Cobertura >85%, todos passando
- [ ] **Performance**: Lighthouse >80, sem degradação
- [ ] **Acessibilidade**: WCAG AA compliant
- [ ] **Documentação**: README atualizado
- [ ] **Changelog**: Versão bumpeada (1.2 → 1.3 → 1.4...)
- [ ] **Git Commit**: Mensagem clara + tag de versão
- [ ] **Deploy Staging**: Testar em ambiente de homologação
- [ ] **Beta Testing**: Mínimo 50 usuários testarem
- [ ] **Feedback**: Coletar NPS e bugs reportados
- [ ] **Correções**: Fix de bugs críticos antes de prosseguir
- [ ] **Deploy Produção**: Rollout gradual (10% → 50% → 100%)
- [ ] **Monitoramento**: 48h de observação intensiva
- [ ] **Retrospectiva**: O que funcionou? O que melhorar?

---

## 📅 Cronograma Sugerido

### Cenário Ideal (1 desenvolvedor full-time)

| Sprint | Início | Fim | Duração |
|--------|--------|-----|---------|
| Sprint 1 | 09/12/2025 | 14/12/2025 | 6 dias |
| Sprint 2 | 16/12/2025 | 23/12/2025 | 7 dias |
| Sprint 3 | 06/01/2026 | 17/01/2026 | 12 dias |
| Sprint 4 | 20/01/2026 | 31/01/2026 | 13 dias |
| Sprint 5 | 03/02/2026 | 05/02/2026 | 3 dias |

**Data de Conclusão Estimada**: 5 de Fevereiro de 2026 🎯

### Cenário Conservador (2 desenvolvedores)

| Sprint | Duração Real |
|--------|--------------|
| Sprint 1 | 3 dias |
| Sprint 2 | 4 dias |
| Sprint 3 | 7 dias |
| Sprint 4 | 8 dias |
| Sprint 5 | 2 dias |

**Data de Conclusão Estimada**: 24 de Janeiro de 2026 🚀

---

## ✅ Como Seguir Este Roadmap

### Passo a Passo

1. **Comece pelo Sprint 1** (não pule etapas)
2. **Complete todas as tarefas** do checklist antes de prosseguir
3. **Faça commit após cada melhoria** com mensagem clara
4. **Teste exaustivamente** antes de marcar como concluído
5. **Atualize este documento** marcando ✅ nos checkboxes
6. **Documente aprendizados** na seção de retrospectiva
7. **Peça review** antes de fazer merge
8. **Deploy em staging** → teste → produção

### Comandos Git Sugeridos

```bash
# Ao iniciar um sprint
git checkout -b feature/sprint-1-dark-mode

# Após completar uma melhoria
git add .
git commit -m "feat: Implementa dark mode com theme context e persistência"

# Ao finalizar o sprint
git checkout main
git merge feature/sprint-1-dark-mode
git tag v1.3.0
git push origin main --tags
```

---

## 📝 Retrospectivas

### Sprint 1 (a ser preenchido)
- **O que funcionou bem:**
- **O que pode melhorar:**
- **Bloqueios encontrados:**
- **Aprendizados:**

### Sprint 2 (a ser preenchido)
- **O que funcionou bem:**
- **O que pode melhorar:**
- **Bloqueios encontrados:**
- **Aprendizados:**

---

## 🎯 Meta Final

**Transformar DetranDenuncia no app de referência em fiscalização cidadã no Brasil.**

**ROI Esperado (pós-implementação completa):**
- Usuários ativos: 200k → **500k** (+150%)
- Denúncias/mês: 10k → **50k** (+400%)
- Retention D30: 25% → **60%** (+140%)
- NPS: 68 → **85** (+25%)
- Downloads: 100k → **1M** (+900%)

---

**💡 Lembre-se**: Qualidade > Velocidade. Cada sprint deve ser concluído com excelência antes de avançar.

**🚀 Boa implementação!**
