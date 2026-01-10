# 🚀 GUIA DE DEPLOY GRATUITO
## DetranDenuncia - MongoDB Atlas + Render + Vercel

---

## 📦 PARTE 1: MONGODB ATLAS (Banco de Dados)

### 1. Criar conta gratuita
- Acesse: https://cloud.mongodb.com
- Clique em "Try Free"
- Crie conta (Google/GitHub ou email)

### 2. Criar cluster gratuito
- Escolha "M0 Sandbox" (FREE FOREVER - 512MB)
- Provider: AWS
- Region: us-east-1 (mais próximo)
- Cluster Name: `DetranCluster`
- Clique "Create Deployment"

### 3. Configurar acesso
**Usuário do banco:**
- Username: `detran_admin`
- Password: `[GERE UMA SENHA FORTE]`
- Salve a senha!

**IP Whitelist:**
- Clique "Network Access"
- "Add IP Address"
- Escolha "Allow Access from Anywhere" (0.0.0.0/0)
- Confirme

### 4. Pegar a URI de conexão
- Clique "Connect" no cluster
- "Connect your application"
- Driver: Node.js
- Copie a string (exemplo):
```
mongodb+srv://detran_admin:<password>@detrancluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
- Substitua `<password>` pela sua senha
- Adicione nome do banco: `/detran-denuncia` antes do `?`
- Resultado final:
```
mongodb+srv://detran_admin:SUASENHA@detrancluster.xxxxx.mongodb.net/detran-denuncia?retryWrites=true&w=majority
```

✅ **Salve essa URI - você vai precisar!**

---

## 🖥️ PARTE 2: RENDER (Backend API)

### 1. Criar conta
- Acesse: https://render.com
- Clique "Get Started for Free"
- Login com GitHub (recomendado)

### 2. Fazer push do código para GitHub
```bash
cd "d:\Projeto Multa\DetranDenuncia"
git init
git add .
git commit -m "Initial commit - DetranDenuncia"
# Criar repositório no GitHub e seguir instruções
```

### 3. Criar Web Service no Render
- No painel Render: "New +" → "Web Service"
- Conecte seu repositório GitHub
- Selecione o repositório `DetranDenuncia`

**Configurações:**
- **Name:** `detran-api`
- **Region:** Oregon (US West)
- **Root Directory:** `backend`
- **Environment:** Node
- **Build Command:** `npm install && npx tsc`
- **Start Command:** `node dist/index.js`
- **Plan:** FREE

### 4. Configurar variáveis de ambiente
Na seção "Environment Variables", adicione:

```
MONGODB_URI = [sua URI do MongoDB Atlas]
JWT_SECRET = [gere aleatório: openssl rand -base64 32]
NODE_ENV = production
PORT = 3000
FRONTEND_URL = https://seu-app.vercel.app
```

**Para gerar JWT_SECRET no PowerShell:**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### 5. Deploy
- Clique "Create Web Service"
- Aguarde build (3-5 minutos)
- Sua API estará em: `https://detran-api.onrender.com`

✅ **Salve essa URL da API!**

⚠️ **IMPORTANTE:** Plano gratuito hiberna após 15min inativo. Primeira requisição demora ~30s.

---

## 🌐 PARTE 3: VERCEL (Frontend Web)

### 1. Criar conta
- Acesse: https://vercel.com
- "Sign Up" com GitHub

### 2. Instalar Vercel CLI (opcional)
```powershell
npm install -g vercel
```

### 3. Atualizar URL da API no código
Edite `src/constants/index.ts`:
```typescript
export const API_BASE_URL = 
  process.env.NODE_ENV === 'production'
    ? 'https://detran-api.onrender.com/api'
    : 'http://localhost:3000/api';
```

### 4. Build para web
```powershell
cd "d:\Projeto Multa\DetranDenuncia"
npm run build:web
```

### 5. Deploy no Vercel
**Opção A - Via CLI:**
```powershell
vercel
# Siga as instruções
# Build Command: npm run build:web
# Output Directory: web-build
```

**Opção B - Via Dashboard:**
- No painel Vercel: "Add New Project"
- Import do GitHub
- Selecione repositório
- Framework: Other
- Build Command: `npm run build:web`
- Output Directory: `web-build`
- Clique "Deploy"

### 6. Configurar domínio
- Seu app estará em: `https://seu-projeto.vercel.app`
- Pode customizar em Settings → Domains

✅ **App no ar!**

---

## 🔧 PARTE 4: CONFIGURAÇÃO FINAL

### 1. Atualizar CORS no backend
Edite `backend/src/index.ts`:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8081',
  credentials: true
}));
```

### 2. Voltar no Render e atualizar FRONTEND_URL
- Vá em Environment Variables
- Atualize `FRONTEND_URL` com URL do Vercel
- Exemplo: `https://detran-denuncia.vercel.app`
- Clique "Save Changes"
- Render fará redeploy automático

### 3. Testar
- Acesse: `https://seu-projeto.vercel.app`
- Crie uma conta
- Faça login
- Crie uma denúncia

---

## 📊 CUSTOS (GRÁTIS!)

| Serviço | Plano Gratuito | Limites |
|---------|---------------|---------|
| **MongoDB Atlas** | M0 Sandbox | 512MB, 3 clusters |
| **Render** | Free | 750h/mês, hiberna após 15min |
| **Vercel** | Hobby | 100GB bandwidth, ilimitado |

**Total: R$ 0,00/mês** 🎉

---

## ⚡ MELHORIAS FUTURAS (Pagas)

### Evitar hibernação Render ($7/mês)
- Upgrade para "Starter" plan
- Mantém API sempre ativa

### MongoDB Atlas ($9/mês)
- Upgrade para M10 (2GB RAM)
- Backups automáticos

### Domínio próprio (~R$ 40/ano)
- Registro.br: detrandenuncia.com.br
- Configurar em Vercel

---

## 🆘 TROUBLESHOOTING

**Erro: "Cannot connect to MongoDB"**
- Verifique IP whitelist (0.0.0.0/0)
- Confira senha na URI
- Teste conexão: https://cloud.mongodb.com

**API não responde no Render**
- Primeira req após hibernação demora ~30s
- Veja logs: Dashboard → Logs
- Verifique variáveis de ambiente

**Build falha no Vercel**
- Verifique `npm run build:web` local
- Veja logs de build no dashboard
- Confirme `web-build` existe

---

## 📱 MOBILE (Expo Go - Gratuito)

O app já funciona mobile via Expo Go:

1. Instale Expo Go (iOS/Android)
2. Escaneie QR code de `npx expo start`
3. App roda no celular

**Para publicar na loja (pago):**
- Google Play: $25 (único)
- Apple Store: $99/ano

---

## ✅ CHECKLIST DE DEPLOY

- [ ] MongoDB Atlas criado
- [ ] URI do MongoDB salva
- [ ] Repositório no GitHub
- [ ] Render configurado
- [ ] Variáveis de ambiente no Render
- [ ] Backend deployado
- [ ] URL da API salva
- [ ] constants/index.ts atualizado
- [ ] Vercel configurado
- [ ] Frontend deployado
- [ ] CORS atualizado
- [ ] Teste completo (cadastro → login → denúncia)

---

🎯 **Pronto! Seu app está 100% gratuito na nuvem!**
