# 🚦 DetranDenuncia - Sistema de Denúncia de Infrações de Trânsito

Aplicativo mobile para denúncia de infrações de trânsito com sistema de gestão administrativo.

## 📱 Sobre o Projeto

O **DetranDenuncia** é uma aplicação completa que permite aos cidadãos denunciar infrações de trânsito através de fotos e localização, enquanto administradores podem revisar e aprovar as denúncias.

### ✨ Funcionalidades

- 📸 **Captura de Infrações**: Tire fotos e registre infrações em tempo real
- 📍 **Geolocalização**: Localização automática das infrações
- 👤 **Autenticação**: Sistema seguro de login e registro
- 📊 **Dashboard Admin**: Painel para aprovação/reprovação de denúncias
- 📱 **Minhas Denúncias**: Acompanhe o status das suas denúncias
- 🔔 **Notificações**: Receba atualizações sobre suas denúncias

## 🛠️ Tecnologias

### Backend
- **Node.js** com **TypeScript**
- **Express.js** para API REST
- **MongoDB** + **Mongoose** para banco de dados
- **JWT** para autenticação
- **Multer** para upload de imagens
- **Jest** para testes

### Frontend
- **React Native** com **Expo**
- **TypeScript**
- **Redux Toolkit** para gerenciamento de estado
- **React Navigation** para navegação
- **Expo Camera** e **Location** para recursos nativos

## 📋 Pré-requisitos

- Node.js (v18 ou superior)
- MongoDB (local ou remoto) - **Opcional**: Sistema funciona com mock database
- Expo CLI
- npm ou yarn
- Git

## 🚀 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/leohorikoshi/DetranDenuncia.git
cd DetranDenuncia
```

### 2. Configuração do Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend/`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/detran-denuncia
JWT_SECRET=sua_chave_secreta_muito_segura
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 3. Configuração do Frontend

```bash
cd ..
npm install --legacy-peer-deps
```

> **Nota**: Usamos `--legacy-peer-deps` devido a compatibilidades entre pacotes do Expo SDK 54 e React 18.

Atualize a URL da API em `src/constants/index.ts`:

```typescript
export const API_BASE_URL = 'http://localhost:3000/api';
// Para dispositivo físico, use o IP da sua máquina:
// export const API_BASE_URL = 'http://192.168.X.X:3000/api';
```

## ▶️ Executando o Projeto

### Opção 1: Com MongoDB (Produção)

#### Backend
```bash
cd backend
npm run dev
```

#### Frontend
```bash
cd ..
npm start
```

### Opção 2: Sem MongoDB (Desenvolvimento/Testes)

Ideal para desenvolvimento rápido sem precisar instalar MongoDB:

#### Backend (com Mock Database)
```bash
cd backend
npm run dev:test
```

Este comando inicia o backend com dados em memória. Perfeito para testes!

#### Frontend (Web)
```bash
cd ..
npx expo start --web
```

Abre automaticamente no navegador em `http://localhost:8081`

#### Frontend (Mobile)
```bash
npm start
```

Escaneie o QR Code com o Expo Go:
- **Android**: Expo Go app
- **iOS**: Camera app

> **Dica**: Certifique-se de que seu celular e computador estão na mesma rede Wi-Fi!

## 🧪 Testes

### Backend

```bash
cd backend
npm test              # Executar todos os testes
npm run test:watch    # Modo watch
npm run test:coverage # Com cobertura
```

**Status**: ✅ **11/11 testes passando (100%)**

Suites testadas:
- ✅ Auth Controller (registro, login, validações)
- ✅ Violation Controller (CRUD, status, filtros)
- ✅ Middlewares (autenticação, autorização)

### Frontend

```bash
npm test              # Executar testes
npm run test:watch    # Modo watch
npm run test:coverage # Com cobertura
```

## 📁 Estrutura do Projeto

```
DetranDenuncia/
├── backend/                      # API Node.js + TypeScript
│   ├── src/
│   │   ├── config/              # Configurações (imagens, etc)
│   │   ├── controllers/         # Lógica de negócio
│   │   │   ├── auth.controller.ts
│   │   │   └── violation.controller.ts
│   │   ├── middleware/          # Middlewares Express
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   ├── image.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   ├── models/              # Schemas MongoDB
│   │   │   ├── user.model.ts
│   │   │   └── violation.model.ts
│   │   ├── routes/              # Rotas da API
│   │   │   ├── auth.routes.ts
│   │   │   └── violation.routes.ts
│   │   ├── types/               # TypeScript definitions
│   │   ├── utils/               # Utilitários
│   │   ├── index.ts             # Entry point (com MongoDB)
│   │   ├── index-test.ts        # Entry point (mock DB)
│   │   └── mock-db.ts           # Mock database para testes
│   ├── uploads/                 # Arquivos enviados
│   ├── __tests__/               # Testes Jest
│   │   ├── auth.controller.test.ts
│   │   └── violation.controller.test.ts
│   ├── coverage/                # Relatórios de cobertura
│   ├── package.json
│   └── tsconfig.json
│
├── src/                         # App React Native + Expo
│   ├── components/              # Componentes reutilizáveis
│   │   ├── ui/                 # Componentes de UI
│   │   │   ├── FormComponents.tsx
│   │   │   ├── LoadingOverlay.tsx
│   │   │   ├── CachedImage.tsx
│   │   │   └── index.ts
│   │   └── violation/          # Componentes de denúncias
│   ├── constants/               # Constantes (API_URL, etc)
│   ├── hooks/                   # Custom React Hooks
│   │   ├── useRedux.ts
│   │   ├── useFormValidation.ts
│   │   └── useInitializeAuth.ts
│   ├── navigation/              # React Navigation
│   │   └── index.tsx
│   ├── screens/                 # Telas do aplicativo
│   │   ├── WelcomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ReportViolationScreen.tsx
│   │   ├── MyReportsScreen.tsx
│   │   ├── ViolationDetailsScreen.tsx
│   │   └── AdminDashboard.tsx
│   ├── store/                   # Redux Toolkit
│   │   ├── slices/
│   │   │   └── authSlice.ts
│   │   └── index.ts
│   ├── types/                   # TypeScript types
│   │   ├── api.ts
│   │   ├── models.ts
│   │   └── navigation.ts
│   └── utils/                   # Funções utilitárias
│       ├── api.ts              # Axios instance
│       ├── auth-storage.ts     # AsyncStorage
│       ├── format.ts
│       └── validation.ts
│
├── docs/                        # Documentação técnica
│   ├── 1-DET.md                # Especificação técnica
│   ├── 2-PSIT.md               # Plano de SI
│   ├── 4-Testes.md             # Documentação de testes
│   ├── 8-Changelog.md          # Log de mudanças
│   └── STATUS.md               # Status detalhado
│
├── .vscode/                     # Configurações VS Code
│   └── launch.json             # Debug configs
├── App.tsx                      # Componente raiz
├── index.ts                     # Entry point Expo
├── app.json                     # Configuração Expo
├── babel.config.json
├── tsconfig.json
├── jest.config.json
├── package.json
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login

### Denúncias
- `POST /api/violations` - Criar denúncia
- `GET /api/violations` - Listar todas (admin)
- `GET /api/violations/my` - Minhas denúncias
- `GET /api/violations/:id` - Detalhes da denúncia
- `PATCH /api/violations/:id/status` - Atualizar status (admin)

## 👥 Papéis de Usuário

### Usuário Comum
- Criar denúncias
- Ver próprias denúncias
- Acompanhar status

### Administrador
- Todas as permissões de usuário
- Ver todas as denúncias
- Aprovar/reprovar denúncias
- Adicionar notas de revisão

## 🔐 Segurança

- 🔒 Senhas criptografadas com **bcrypt**
- 🎫 Autenticação **JWT** com refresh token
- ✔️ Validação de dados com **Zod**
- 🛡️ Proteção de rotas (middleware de autenticação)
- 👮 Autorização baseada em roles (user/admin)
- 📁 Upload seguro de arquivos com **Multer**
- 🖼️ Processamento e otimização de imagens com **Sharp**
- 🚫 Proteção contra SQL Injection (MongoDB)
- 📝 Sanitização de inputs
- 🔑 Variáveis de ambiente protegidas (.env)

## 📝 Status do Projeto

### ✅ Concluído

**Backend**
- ✅ API REST completa com TypeScript
- ✅ Sistema de autenticação JWT
- ✅ CRUD de denúncias
- ✅ Upload e processamento de imagens
- ✅ Middleware de autorização (user/admin)
- ✅ Validação de dados com Zod
- ✅ Sistema de mock database para testes
- ✅ 11/11 testes unitários passando
- ✅ Documentação da API

**Frontend**
- ✅ Estrutura base com React Native + Expo
- ✅ Navegação configurada
- ✅ Telas principais criadas (Login, Registro, Home, etc)
- ✅ Redux Toolkit configurado
- ✅ Componentes UI reutilizáveis
- ✅ Sistema de formulários com validação
- ✅ Suporte para Web e Mobile
- ✅ Integração com câmera e localização

### 🔄 Em Desenvolvimento

- 🔄 Integração completa frontend-backend
- 🔄 Sistema de notificações
- 🔄 Cache de imagens otimizado
- 🔄 Testes E2E
- 🔄 Dashboard administrativo completo

### 📅 Próximos Passos

1. **Sprint Atual**
   - Finalizar integração API
   - Implementar upload de fotos
   - Adicionar feedback visual (loading, erros)

2. **Próxima Sprint**
   - Sistema de notificações push
   - Modo offline
   - Melhorias de UX/UI
   - Deploy em ambientes de staging

## 🐛 Problemas Conhecidos e Soluções

### React Native Reanimated
**Problema**: Erro `Cannot find module 'react-native-worklets/plugin'`  
**Solução**: Removida dependência conflitante. Usando animações CSS nativas.

### MongoDB Connection
**Problema**: ECONNREFUSED ao conectar MongoDB  
**Solução**: Use `npm run dev:test` no backend para rodar sem MongoDB

### Expo Web Support
**Problema**: Módulos nativos não funcionam na web  
**Solução**: Implementadas alternativas web-safe para todos os recursos

### Versões de Pacotes
**Problema**: Warnings sobre versões do Expo  
**Solução**: Usando React 18.2.0 para máxima compatibilidade (warnings são seguros para ignorar)

## 🛠️ Scripts Úteis

### Backend
```bash
npm run dev           # Desenvolvimento com MongoDB
npm run dev:test      # Desenvolvimento sem MongoDB (mock)
npm run build         # Build para produção
npm start             # Executa versão buildada
npm test              # Roda todos os testes
npm run test:watch    # Testes em watch mode
npm run test:coverage # Testes com relatório de cobertura
```

### Frontend
```bash
npm start             # Inicia Expo DevTools
npm run android       # Abre no emulador Android
npm run ios           # Abre no simulador iOS
npm run web           # Abre no navegador
npm test              # Executa testes
npm run test:watch    # Testes em watch mode
```

## 🔧 Configuração de Desenvolvimento

### Variáveis de Ambiente

**Backend** (`.env`):
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/detran-denuncia
JWT_SECRET=sua_chave_super_secreta_aqui
JWT_EXPIRES_IN=7d
NODE_ENV=development
USE_MOCK_DB=false
```

**Frontend** (`src/constants/index.ts`):
```typescript
export const API_BASE_URL = __DEV__
  ? 'http://192.168.15.87:3000/api'  // Seu IP local
  : 'https://api.detrandenuncia.com/api';
```

### Debug no VS Code

Configuração já incluída em `.vscode/launch.json`:

- **Expo: Run on Web** - Inicia frontend no navegador
- **Expo: Debug** - Debug do Expo local
- **Expo: Run on Android** - Inicia no Android

Pressione `F5` para iniciar o debug!

## 📚 Documentação Adicional

- [Documentação da API](./docs/1-DET.md)
- [Guia de Testes](./docs/4-Testes.md)
- [Status do Projeto](./docs/STATUS.md)
- [Changelog](./docs/8-Changelog.md)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrões de Código

- TypeScript strict mode
- ESLint + Prettier configurados
- Commits semânticos
- Testes para novas features

## 📄 Licença

Este projeto está sob a licença MIT.

## 👤 Autor

**Leonardo Horikoshi**
- GitHub: [@leohorikoshi](https://github.com/leohorikoshi)

## 🙏 Agradecimentos

- Expo Team pela excelente plataforma
- Comunidade React Native
- Todos os contribuidores do projeto

## 📞 Suporte

Para dúvidas ou sugestões:
- Abra uma [issue](https://github.com/leohorikoshi/DetranDenuncia/issues)
- Consulte a [documentação](./docs/)
- Entre em contato via GitHub

---

**Status**: 🚧 Em Desenvolvimento Ativo  
**Última atualização**: 29 de Novembro de 2025  
Desenvolvido com ❤️ por Leonardo Horikoshi
