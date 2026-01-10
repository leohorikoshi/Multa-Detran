# 🎯 COMANDOS PRONTOS - COPIAR E COLAR
## Deploy em 5 minutos

---

## 📋 PASSO 1: MongoDB Atlas

1. Acesse: https://cloud.mongodb.com/v2/register
2. Create Database → M0 FREE (AWS, us-east-1)
3. Credenciais:
   - Username: `detran_admin`
   - Password: `[CRIAR E SALVAR]`
4. Network: Add IP → `0.0.0.0/0`
5. Copie a connection string

---

## 🔧 PASSO 2: Git + GitHub

```powershell
# Configurar Git
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"

# Ir para pasta do projeto
cd "d:\Projeto Multa\DetranDenuncia"

# Inicializar repositório
git init
git add .
git commit -m "Deploy inicial - DetranDenuncia v1.5.0"

# Criar repo no GitHub
Start-Process "https://github.com/new"
# Nome: detran-denuncia
# AGUARDE criar no navegador

# Conectar ao GitHub (SUBSTITUA seu-usuario)
git remote add origin https://github.com/seu-usuario/detran-denuncia.git
git branch -M main
git push -u origin main
```

---

## 🚀 PASSO 3: Render (Backend)

1. Acesse: https://dashboard.render.com/register
2. Login com GitHub
3. New + → Web Service
4. Connect repository: `detran-denuncia`
5. Configurações:
   - Name: `detran-api`
   - Root Directory: `backend`
   - Build Command: `npm install && npx tsc`
   - Start Command: `node dist/index.js`
   - Plan: **FREE**

6. Environment Variables (colar):
```
MONGODB_URI=mongodb+srv://detran_admin:SUA_SENHA@cluster.xxxxx.mongodb.net/detran-denuncia?retryWrites=true&w=majority
JWT_SECRET=detran2026_secret_key_super_segura
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://detran-denuncia.vercel.app
```

7. Create Web Service
8. **Copie a URL:** `https://detran-api-xxxx.onrender.com`

---

## 🌐 PASSO 4: Vercel (Frontend)

### Opção A - Via CLI (Rápido):
```powershell
# Instalar Vercel CLI
npm install -g vercel

# Build e Deploy
cd "d:\Projeto Multa\DetranDenuncia"
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
2. Import `detran-denuncia`
3. Build Command: `npm run build:web`
4. Output Directory: `dist`
5. Deploy

---

## ✅ FINALIZAR

1. Volte no Render
2. Environment Variables
3. Edite `FRONTEND_URL` com URL do Vercel
4. Save Changes

---

## 🧪 TESTAR

Acesse: `https://seu-app.vercel.app`

1. Criar conta
2. Login
3. Nova denúncia
4. Ver usuários (admin)

---

## 📱 MOBILE (Opcional)

```powershell
# No PC
cd "d:\Projeto Multa\DetranDenuncia"
npx expo start

# No celular
# Instale "Expo Go" (App Store/Play Store)
# Escaneie o QR code
```

---

## 🎉 PRONTO!

✅ Backend: https://detran-api.onrender.com  
✅ Frontend: https://detran-denuncia.vercel.app  
✅ MongoDB: Atlas Dashboard  
✅ Custo: **R$ 0,00/mês**

---

## 🔄 ATUALIZAR APP

```powershell
cd "d:\Projeto Multa\DetranDenuncia"
git add .
git commit -m "Atualização"
git push

# Render e Vercel fazem redeploy automático!
```
