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

- Node.js (v14 ou superior)
- MongoDB (local ou remoto)
- Expo CLI
- npm ou yarn

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
npm install
```

Atualize a URL da API em `src/utils/api.ts` se necessário.

## ▶️ Executando o Projeto

### Backend

```bash
cd backend
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

### Frontend

```bash
npm start
```

Escaneie o QR Code com o aplicativo Expo Go ou use um emulador.

## 🧪 Testes

### Backend

```bash
cd backend
npm test
```

Todos os testes estão passando ✅ (11/11)

### Frontend

```bash
npm test
```

## 📁 Estrutura do Projeto

```
DetranDenuncia/
├── backend/                 # API Node.js
│   ├── src/
│   │   ├── controllers/    # Controladores
│   │   ├── models/         # Modelos do MongoDB
│   │   ├── routes/         # Rotas da API
│   │   ├── middleware/     # Middlewares
│   │   ├── types/          # Tipos TypeScript
│   │   └── utils/          # Utilitários
│   └── __tests__/          # Testes Jest
├── src/                    # App React Native
│   ├── screens/           # Telas do app
│   ├── components/        # Componentes reutilizáveis
│   ├── navigation/        # Navegação
│   ├── store/            # Redux store
│   ├── hooks/            # Custom hooks
│   └── utils/            # Utilitários
└── docs/                 # Documentação

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

- Senhas criptografadas com bcrypt
- Autenticação JWT
- Validação de dados com Joi
- Proteção de rotas
- Upload seguro de arquivos

## 📝 Status do Projeto

✅ Backend completo e testado
✅ Autenticação funcionando
✅ Sistema de denúncias implementado
✅ Testes passando (11/11)
🔄 Frontend em desenvolvimento
🔄 Integração frontend-backend em andamento

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👤 Autor

**Leonardo Horikoshi**
- GitHub: [@leohorikoshi](https://github.com/leohorikoshi)
- Email: leohorikoshi@gmail.com

## 📞 Suporte

Para dúvidas ou sugestões, abra uma issue no repositório.

---

Desenvolvido com ❤️ por Leonardo Horikoshi
