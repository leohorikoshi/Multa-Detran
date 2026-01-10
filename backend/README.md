# DetranDenuncia Backend

Backend da aplicação de denúncias de trânsito para o DETRAN.

## 🚀 Deploy Rápido (Gratuito)

### Opção 1: MongoDB Local (Desenvolvimento)

```bash
# Instalar dependências
cd backend
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Compilar TypeScript
npm run build

# Iniciar servidor
npm start
```

### Opção 2: MongoDB Atlas (Produção)

1. **Criar banco de dados gratuito:**
   - Acesse: https://www.mongodb.com/cloud/atlas/register
   - Crie um cluster M0 (grátis)
   - Copie a connection string

2. **Atualizar .env:**
   ```
   MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/detran-denuncia
   JWT_SECRET=sua-chave-secreta
   NODE_ENV=production
   ```

3. **Testar conexão:**
   ```bash
   npm run test:mongodb
   ```

4. **Criar usuário de teste:**
   ```bash
   npm run create:user
   ```
   - Email: teste@teste.com
   - Senha: 123456

## 📦 Deploy no Render.com

1. Criar conta em: https://render.com
2. Conectar repositório do GitHub
3. Configurar:
   - Build: `npm install && npm run build`
   - Start: `npm start`
   - Variáveis de ambiente: MONGODB_URI, JWT_SECRET

## 🔧 Scripts Disponíveis

- `npm start` - Inicia o servidor (produção)
- `npm run dev` - Desenvolvimento com hot reload
- `npm run build` - Compila TypeScript
- `npm test` - Executa testes
- `npm run test:mongodb` - Testa conexão com MongoDB
- `npm run create:user` - Cria usuário de teste

## 🌐 Endpoints

- `POST /api/auth/register` - Cadastro
- `POST /api/auth/login` - Login
- `GET /api/violations` - Lista denúncias
- `POST /api/violations` - Cria denúncia

## 📝 Estrutura

```
backend/
├── src/
│   ├── controllers/    # Lógica de negócio
│   ├── models/        # Schemas MongoDB
│   ├── routes/        # Rotas da API
│   ├── middleware/    # Middlewares
│   ├── services/      # Serviços
│   └── index.ts       # Entry point
├── dist/              # Código compilado
└── uploads/           # Imagens upload
```
