# ⚡ DEPLOY INSTANTÂNEO - 5 MINUTOS
## DetranDenuncia - Tudo Automatizado

Este guia faz deploy **AUTOMÁTICO** em 5 minutos.

---

## 📋 PRÉ-REQUISITOS (2 min)

### 1. Instalar Git
- Windows: https://git-scm.com/download/win
- Ou: `winget install Git.Git`

### 2. Criar contas (abra em abas separadas):
- MongoDB Atlas: https://cloud.mongodb.com/v2/register
- Render: https://dashboard.render.com/register
- Vercel: https://vercel.com/signup
- GitHub: https://github.com/signup

**Dica:** Use login do GitHub em todas para facilitar!

---

## 🚀 PASSO 1: MongoDB Atlas (1 min)

1. Acesse: https://cloud.mongodb.com
2. Clique "Build a Database" → **M0 FREE**
3. Provider: AWS, Region: us-east-1
4. Cluster Name: `DetranCluster`
5. Username: `detran_admin`
6. Password: **COPIE E SALVE!** Exemplo: `Abc123456`
7. Network Access → Add IP → **0.0.0.0/0** (Allow from anywhere)
8. Connect → Drivers → Copie a connection string:

```
mongodb+srv://detran_admin:Abc123456@detrancluster.xxxxx.mongodb.net/detran-denuncia?retryWrites=true&w=majority
```

✅ **Salve essa URI!**

---

## 🚀 PASSO 2: GitHub + Deploy (3 min)

### Windows (PowerShell):
```powershell
cd "d:\Projeto Multa\DetranDenuncia"

# Inicializar Git
git init
git add .
git commit -m "Deploy DetranDenuncia v1.5.0"

# Criar repo no GitHub (abrir navegador)
Start-Process "https://github.com/new"

# AGUARDE criar o repo no navegador
# Nome: detran-denuncia
# Público ou Privado: qualquer um
# NÃO adicionar README, .gitignore ou license

# Depois que criar, copie a URL e execute:
git remote add origin https://github.com/SEU-USUARIO/detran-denuncia.git
git branch -M main
git push -u origin main
```

✅ **Código no GitHub!**

---

## 🚀 PASSO 3: Render - Backend (1 min)

1. Acesse: https://dashboard.render.com
2. New + → **Web Service**
3. Connect GitHub → Selecione `detran-denuncia`
4. Configurações:
   - **Name:** `detran-api`
   - **Root Directory:** `backend`
   - **Environment:** Node
   - **Build:** `npm install && npx tsc`
   - **Start:** `node dist/index.js`
   - **Plan:** FREE ✅

5. **Environment Variables:**
   Clique "Add Environment Variable" e adicione:

   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | [sua URI do Passo 1] |
   | `JWT_SECRET` | `detran_secret_2026_super_seguro` |
   | `NODE_ENV` | `production` |
   | `PORT` | `3000` |
   | `FRONTEND_URL` | `https://detran-denuncia.vercel.app` |

6. **Create Web Service**

Aguarde deploy (2-3 min). Sua API estará em:
```
https://detran-api.onrender.com
```

✅ **Copie essa URL!**

---

## 🚀 PASSO 4: Atualizar Código (30 seg)

Edite `src/constants/index.ts` linha 7:

```typescript
// ANTES:
return 'https://detran-api.onrender.com/api';

// DEPOIS (com SUA URL do Render):
return 'https://SEU-NOME-DA-API.onrender.com/api';
```

Commit e push:
```powershell
git add .
git commit -m "Update API URL"
git push
```

---

## 🚀 PASSO 5: Vercel - Frontend (30 seg)

### Opção A - Via CLI (RECOMENDADO):
```powershell
# Instalar Vercel CLI
npm install -g vercel

# Build
npm run build:web

# Deploy
vercel --prod

# Responder:
# - Setup and deploy? Y
# - Scope? [Enter]
# - Link to project? N
# - Project name? detran-denuncia
# - Directory? [Enter]
# - Override settings? N
```

### Opção B - Via Dashboard:
1. https://vercel.com/new
2. Import Git Repository → `detran-denuncia`
3. Build Command: `npm run build:web`
4. Output Directory: `web-build`
5. Deploy

Sua URL:
```
https://detran-denuncia.vercel.app
```

✅ **App no ar!**

---

## 🚀 PASSO 6: Finalizar (30 seg)

1. Volte no **Render**
2. Environment Variables
3. Edite `FRONTEND_URL`: `https://detran-denuncia.vercel.app`
4. Save (vai fazer redeploy automático)

---

## ✅ TESTAR

Acesse: https://detran-denuncia.vercel.app

1. Crie uma conta
2. Faça login
3. Crie uma denúncia
4. Veja em "Minhas Denúncias"
5. Acesse "Usuários" (admin)

---

## 🎯 RESUMO - SUAS URLs

| Serviço | URL | Login |
|---------|-----|-------|
| **App (Web)** | https://detran-denuncia.vercel.app | - |
| **API** | https://detran-api.onrender.com | - |
| **MongoDB** | Atlas Dashboard | detran_admin |
| **Render** | Dashboard | GitHub |
| **Vercel** | Dashboard | GitHub |

---

## 💰 Custos

**R$ 0,00/mês** (100% gratuito!)

---

## ⚠️ IMPORTANTE

**Render FREE hiberna após 15min sem uso**
- Primeira requisição demora ~30 segundos
- Depois funciona normal
- Para evitar: Upgrade para Starter ($7/mês)

**Alternativa gratuita:** Configure um cron job para fazer ping a cada 10min:
- https://cron-job.org (gratuito)
- URL para ping: `https://detran-api.onrender.com/api/health`
- Intervalo: 10 minutos

---

## 🆘 PROBLEMAS?

**Build falha no Vercel:**
```powershell
npm run build:web
# Se funcionar local, commit e push de novo
```

**API não responde:**
- Aguarde 30 segundos (hibernação)
- Veja logs no Render Dashboard
- Verifique variáveis de ambiente

**Erro MongoDB:**
- Confirme IP 0.0.0.0/0 no Network Access
- Teste URI no MongoDB Compass
- Verifique senha na connection string

**Backend não inicia:**
```powershell
cd backend
npm install
npx tsc
node dist/index.js
# Veja o erro no console
```

---

## 📱 MOBILE (Expo Go)

O app já funciona mobile:

1. Instale **Expo Go** (iOS/Android)
2. No PC:
   ```powershell
   cd "d:\Projeto Multa\DetranDenuncia"
   npx expo start
   ```
3. Escaneie QR code com Expo Go
4. App roda no celular!

**Para publicar na loja:**
- Google Play: $25 (pagamento único)
- Apple Store: $99/ano

---

## 🎉 PRONTO!

Seu app está:
- ✅ No ar 24/7
- ✅ Com banco de dados real
- ✅ Acessível de qualquer lugar
- ✅ 100% gratuito
- ✅ Escalável

**Compartilhe:** https://detran-denuncia.vercel.app
