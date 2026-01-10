## 🚀 GUIA DE DEPLOY GRATUITO

### 1️⃣ MongoDB Atlas (Banco de Dados Gratuito)

**Criar conta e cluster:**
1. Acesse: https://www.mongodb.com/cloud/atlas/register
2. Crie uma conta gratuita
3. Crie um cluster M0 (FREE tier - 512MB)
4. Escolha uma região próxima (ex: São Paulo - Brazil)

**Configurar acesso:**
1. Em "Database Access", clique em "Add New Database User"
   - Username: `detran-user`
   - Password: Gere uma senha forte (copie e guarde!)
   - Selecione "Read and write to any database"

2. Em "Network Access", clique em "Add IP Address"
   - Clique em "Allow Access from Anywhere"
   - IP: `0.0.0.0/0` (permite qualquer IP - necessário para deploy)

**Obter Connection String:**
1. Clique em "Connect" no seu cluster
2. Escolha "Connect your application"
3. Copie a connection string (parecida com):
   ```
   mongodb+srv://detran-user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Substitua `<password>` pela senha que você criou
5. Adicione o nome do banco no final: `/detran-denuncia`
   Exemplo final:
   ```
   mongodb+srv://detran-user:SuaSenhaAqui@cluster0.abc123.mongodb.net/detran-denuncia?retryWrites=true&w=majority
   ```

---

### 2️⃣ Render.com (Backend Gratuito)

**Criar conta:**
1. Acesse: https://render.com/
2. Faça login com GitHub

**Fazer deploy do backend:**
1. No GitHub, crie um repositório novo (ex: `detran-denuncia-backend`)
2. Faça push da pasta `backend/` para o repositório
3. No Render, clique em "New +" → "Web Service"
4. Conecte seu repositório do GitHub
5. Configure:
   - **Name**: `detran-backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

**Adicionar variáveis de ambiente:**
1. Na aba "Environment", adicione:
   ```
   MONGODB_URI=<sua-connection-string-do-atlas>
   JWT_SECRET=detran-secret-key-2026-super-seguro
   NODE_ENV=production
   PORT=3000
   ```

2. Clique em "Create Web Service"
3. Aguarde o deploy (5-10 min)
4. Anote a URL do backend (ex: `https://detran-backend.onrender.com`)

---

### 3️⃣ Vercel (Frontend Gratuito)

**Preparar o frontend:**
1. Crie um arquivo `.env.production` na raiz do projeto com:
   ```
   EXPO_PUBLIC_API_URL=https://detran-backend.onrender.com
   ```

**Fazer deploy:**
1. Acesse: https://vercel.com/
2. Faça login com GitHub
3. Clique em "Add New" → "Project"
4. Importe o repositório do projeto
5. Configure:
   - **Framework Preset**: Other
   - **Build Command**: `npx expo export --platform web`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. Adicione as variáveis de ambiente em "Environment Variables"
7. Clique em "Deploy"
8. Aguarde (3-5 min)
9. Anote a URL (ex: `https://detran-denuncia.vercel.app`)

---

### 4️⃣ Expo EAS (App Mobile - Opcional)

Para publicar o app mobile:
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android
```

---

## ✅ Checklist Final

- [ ] MongoDB Atlas criado e connection string copiada
- [ ] Backend no Render com variáveis de ambiente configuradas
- [ ] Frontend no Vercel conectado ao backend
- [ ] Testar login e cadastro
- [ ] Testar criação de denúncias
- [ ] Testar upload de imagens

---

## 🆘 Troubleshooting

**Erro de conexão MongoDB:**
- Verifique se o IP 0.0.0.0/0 está liberado em "Network Access"
- Confirme que a senha na connection string está correta

**Backend não inicia no Render:**
- Verifique os logs em "Logs" no painel do Render
- Confirme que todas as variáveis de ambiente estão configuradas

**Frontend não conecta ao backend:**
- Verifique se a URL do backend está correta no .env
- Teste a URL do backend diretamente no navegador

---

## 💰 Limites Gratuitos

- **MongoDB Atlas**: 512MB de storage
- **Render**: 750 horas/mês (suficiente para 1 app 24/7)
- **Vercel**: Ilimitado para projetos pessoais
