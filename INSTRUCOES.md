# 🚗 DetranDenuncia v2.0 - Instruções de Uso

## ✅ APLICAÇÃO COMPLETA COM 10 MELHORIAS

### 📱 Para Rodar no MOBILE (Android/iOS):

1. **Instale o Expo Go** no seu celular:
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Inicie o servidor**:
```bash
cd "D:\Projeto Multa\DetranDenuncia"
npx expo start
```

3. **Escaneie o QR Code** que aparece no terminal com o Expo Go

4. **Credenciais de teste**:
   - Email: `teste@example.com`
   - Senha: `123456`

### 🌐 Para Rodar na WEB:

1. **Inicie o servidor web**:
```bash
cd "D:\Projeto Multa\DetranDenuncia"
npx expo start --web
```

2. **Acesse**: http://localhost:8081

3. **Ou pressione `w`** no terminal

### 🔧 Backend (API):

```bash
cd "D:\Projeto Multa\DetranDenuncia\backend"
npm start
```

API rodando em: http://localhost:3000

## 🎯 10 FUNCIONALIDADES IMPLEMENTADAS:

### 1️⃣ Dark Mode 🌙
- Acesse via botão "Dark Mode" ou Configurações
- Alterna entre tema claro e escuro

### 2️⃣ Social Sharing 📤
- Compartilhe denúncias em redes sociais
- WhatsApp, Facebook, Twitter, Instagram, Email

### 3️⃣ Push Notifications 🔔
- Notificações sobre status de denúncias
- Alertas de aprovação e conquistas

### 4️⃣ Modo Offline ✈️
- Crie denúncias sem internet
- Sincronização automática ao conectar

### 5️⃣ Gamificação 🏆
- Sistema de pontos e conquistas
- Ranking de usuários
- Badges por participação

### 6️⃣ Mapa de Calor 🗺️
- **Mobile**: Mapa interativo com react-native-maps
- **Web**: Tela explicativa (maps não funciona na web)
- Visualize regiões com mais infrações

### 7️⃣ OCR - Reconhecimento de Placas 📷
- Tire foto de placa e extraia texto automaticamente
- Powered by Tesseract.js

### 8️⃣ Chatbot 🤖
- FAQ interativo
- Responde dúvidas sobre o app

### 9️⃣ PWA - Progressive Web App 📱
- Instale o app no celular via navegador
- Funciona offline
- Ícone na tela inicial

### 🔟 Design Responsivo 💻📱
- **Mobile**: Grid 2 colunas
- **Tablet**: Grid 3 colunas
- **Desktop**: Grid 4 colunas (max 1200px)

## 📦 Tecnologias Usadas:

### Frontend:
- React Native + Expo
- TypeScript
- Redux Toolkit
- React Navigation
- react-native-maps (mobile)
- Tesseract.js (OCR)

### Backend:
- Node.js + Express
- TypeScript
- JWT Authentication
- SQLite Database
- Multer (upload de imagens)

## 🐛 Problemas Conhecidos:

### Mobile - "PlatformConstants not found":
Este erro ocorre no Expo Go com alguns módulos nativos. **Solução**:
```bash
npx expo prebuild
npx expo run:android
# ou
npx expo run:ios
```

### Web - Tela Branca:
Se a web mostrar tela branca:
```bash
# Limpe o cache
rm -rf .expo
rm -rf node_modules/.cache
npx expo start --web --clear
```

## 🚀 Deploy:

### Web (Netlify/Vercel):
```bash
npx expo export:web
# Deploy a pasta web-build/
```

### Mobile (APK):
```bash
eas build --platform android
```

## 📝 Contas de Teste:

- **Admin**: `admin@detran.com` / `admin123`
- **Usuário**: `teste@example.com` / `123456`

## 📞 Suporte:

Qualquer dúvida, consulte a documentação em `/docs`

---

**Desenvolvido com ❤️ para o DETRAN**
**Versão 2.0 - Todas as melhorias implementadas! 🎉**
