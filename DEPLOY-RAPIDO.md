# 🚀 DEPLOY RÁPIDO - 15 MINUTOS

## ✅ PASSO 1: MongoDB Atlas (3 min)
1. https://cloud.mongodb.com → Try Free
2. Create "M0 Sandbox" (FREE)
3. Username: `detran_admin`, Password: `[CRIAR SENHA]`
4. Network Access → Add IP → Allow 0.0.0.0/0
5. Connect → Get connection string:
```
mongodb+srv://detran_admin:SUASENHA@cluster.xxxxx.mongodb.net/detran-denuncia?retryWrites=true&w=majority
```

## ✅ PASSO 2: GitHub (2 min)
```powershell
cd "d:\Projeto Multa\DetranDenuncia"
git init
git add .
git commit -m "Deploy DetranDenuncia"
# Criar repo no GitHub e push
```

## ✅ PASSO 3: Render - Backend (5 min)
1. https://render.com → Sign up (GitHub)
2. New + → Web Service
3. Connect Repository
4. Configurações:
   - Root Directory: `backend`
   - Build: `npm install && npx tsc`
   - Start: `node dist/index.js`
   - Plan: FREE
5. Environment Variables:
```
MONGODB_URI = [sua URI do passo 1]
JWT_SECRET = detran2026secretkey
NODE_ENV = production
PORT = 3000
FRONTEND_URL = https://SEU-APP.vercel.app
```
6. Create → Copie URL: `https://detran-api.onrender.com`

## ✅ PASSO 4: Atualizar constants (1 min)
Edite `src/constants/index.ts`:
```typescript
export const API_BASE_URL = 'https://detran-api.onrender.com/api';
```

## ✅ PASSO 5: Vercel - Frontend (4 min)
```powershell
npm install -g vercel
cd "d:\Projeto Multa\DetranDenuncia"
npm run build:web
vercel
# Responder: Yes, DetranDenuncia, default tudo
```

Ou via Dashboard:
1. https://vercel.com → Import Project
2. Build: `npm run build:web`
3. Output: `web-build`
4. Deploy

## ✅ PASSO 6: Finalizar (1 min)
1. Volte no Render
2. Atualize `FRONTEND_URL` com URL do Vercel
3. Teste: Acesse seu app → Cadastro → Login → Denúncia

---

## 🎯 URLs FINAIS
- **Frontend:** https://seu-projeto.vercel.app
- **Backend:** https://detran-api.onrender.com
- **MongoDB:** Atlas Dashboard

## 💰 Custo: R$ 0,00/mês (100% gratuito!)

---

## 🆘 Problemas?
- API demora: Normal, plano free hiberna (30s primeira req)
- Build falha: `npm run build:web` local primeiro
- Erro MongoDB: Verifique IP whitelist
