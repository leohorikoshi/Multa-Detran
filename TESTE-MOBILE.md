# 📱 Guia de Teste Mobile - DetranDenuncia

## 🎯 Status Atual
✅ Backend rodando em: `http://localhost:3000`
✅ MongoDB conectado e populado
✅ Frontend compilado com sucesso
✅ Túnel Expo ativo

---

## 📲 OPÇÃO 1: Teste via Expo Go (Recomendado - Mais Rápido)

### Passo 1: Instalar Expo Go no seu celular
- **Android**: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)

### Passo 2: Conectar na mesma rede Wi-Fi
- Celular e computador devem estar na **mesma rede Wi-Fi**
- Certifique-se de que o firewall não está bloqueando a porta 8081

### Passo 3: Escanear o QR Code

#### No Android:
1. Abra o app **Expo Go**
2. Toque em **"Scan QR code"**
3. Aponte a câmera para o QR Code exibido no terminal
4. Aguarde o carregamento do app

#### No iOS:
1. Abra o app **Câmera** nativo do iPhone
2. Aponte para o QR Code no terminal
3. Toque na notificação que aparece
4. O app abrirá no Expo Go automaticamente

### URL Direta (se QR code não funcionar):
```
exp://qufkini-anonymous-8081.exp.direct
```
Cole essa URL no Expo Go (campo "Enter URL manually")

---

## 🌐 OPÇÃO 2: Teste via Navegador Mobile

### No seu celular, acesse:
```
http://192.168.15.87:8081
```

**Atenção**: Substitua `192.168.15.87` pelo IP do seu computador se necessário.

### Como descobrir o IP do seu computador:
```powershell
ipconfig | Select-String -Pattern "IPv4"
```

---

## ⚠️ PROBLEMAS CONHECIDOS

### ❌ Erro: TurboModuleRegistry/PlatformConstants
**Causa**: React Native 0.76.1 com New Architecture incompatível com Expo Go

**Solução**: Use teste via navegador mobile ou aguarde build nativo

### ❌ Funcionalidades Desabilitadas no Expo Go:
- 📷 Câmera (expo-image-picker removido)
- 📍 Localização (expo-location removido)
- 📁 Sistema de arquivos (expo-file-system removido)

**Status**: Essas funcionalidades mostram alertas informativos

---

## 🔧 OPÇÃO 3: Build Nativo (Para Produção)

### Android APK com EAS Build:

```powershell
# 1. Instalar EAS CLI globalmente
npm install -g eas-cli

# 2. Fazer login na Expo
eas login

# 3. Configurar o projeto
cd "d:\Projeto Multa\DetranDenuncia"
eas build:configure

# 4. Criar build de preview (APK para teste)
eas build --platform android --profile preview

# 5. Aguardar build (5-15 minutos)
# O link para download do APK será exibido no terminal
```

### iOS Build (Requer conta Apple Developer):
```powershell
eas build --platform ios --profile preview
```

---

## 🧪 Credenciais de Teste

### Usuário Admin:
```
Email: admin@detran.sp.gov.br
Senha: admin123
```

### Usuários Comuns:
```
Email: joao.silva@email.com
Senha: user123

Email: maria.santos@email.com
Senha: user123

Email: pedro.oliveira@email.com
Senha: user123
```

---

## 📊 Base de Dados Atual

### Estatísticas:
- ✅ 4 usuários cadastrados
- ✅ 8 denúncias populadas
- ✅ Tipos de infração: estacionamento irregular, avanço de sinal, velocidade, outros
- ✅ Status: pendente, em análise, aprovado, rejeitado

---

## 🔄 Fluxo de Teste Completo

### 1️⃣ Teste de Registro
- [ ] Abrir app no celular
- [ ] Clicar em "Criar Conta"
- [ ] Preencher dados:
  - Nome: Seu Nome
  - Email: teste@email.com
  - CPF: 12345678901
  - Senha: teste123
- [ ] Confirmar cadastro
- [ ] Verificar redirecionamento

### 2️⃣ Teste de Login
- [ ] Fazer logout (se necessário)
- [ ] Fazer login com credenciais de teste
- [ ] Verificar tela Home

### 3️⃣ Teste de Listagem
- [ ] Ver denúncias existentes
- [ ] Clicar em uma denúncia
- [ ] Ver detalhes completos

### 4️⃣ Teste Admin (se logado como admin)
- [ ] Acessar Dashboard Admin
- [ ] Ver lista de todas as denúncias
- [ ] Aprovar/Rejeitar denúncias
- [ ] Ver estatísticas

### 5️⃣ Teste de Performance
- [ ] Navegar entre telas
- [ ] Verificar fluidez
- [ ] Testar scroll em listas
- [ ] Verificar tempo de carregamento

---

## 🐛 Troubleshooting

### Problema: QR Code não funciona
**Solução**: Use a URL manual: `exp://qufkini-anonymous-8081.exp.direct`

### Problema: "Unable to connect to Metro"
**Solução**: 
```powershell
# Parar servidor
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

# Limpar cache e reiniciar
cd "d:\Projeto Multa\DetranDenuncia"
npx expo start --clear --tunnel
```

### Problema: "Network Error" ao fazer login
**Solução**: Verificar se backend está rodando
```powershell
cd "d:\Projeto Multa\DetranDenuncia\backend"
npm run dev
```

### Problema: Tela branca no app
**Solução**: Recarregar o app
- Shake o celular
- Toque em "Reload"

---

## 📱 Comandos Úteis

### Reiniciar Expo com túnel:
```powershell
cd "d:\Projeto Multa\DetranDenuncia"
npx expo start --tunnel
```

### Reiniciar apenas para rede local:
```powershell
npx expo start
```

### Abrir automaticamente no Android conectado via USB:
```powershell
npx expo start --android
```

### Ver logs do dispositivo:
Os logs aparecem automaticamente no terminal quando você usa o app

---

## 📞 Suporte

### Logs e Debugging:
- Logs aparecem em tempo real no terminal do VS Code
- Use `console.log()` no código para debug
- Erros do React Native aparecem na tela do celular

### Reload rápido:
- **Android/iOS**: Shake o celular → "Reload"
- **Terminal**: Pressione `r`

---

## ✅ Checklist Pré-Teste

Antes de testar no celular, verifique:

- [x] Backend rodando (porta 3000)
- [x] MongoDB conectado
- [x] Frontend compilado sem erros
- [x] Túnel Expo ativo
- [ ] Expo Go instalado no celular
- [ ] Celular na mesma rede Wi-Fi
- [ ] QR Code visível no terminal

---

## 🎉 Sucesso!

Se tudo funcionou, você verá:
1. ✅ Tela de boas-vindas ("Bem-vindo de volta!")
2. ✅ Navegação fluida entre telas
3. ✅ Login funcional
4. ✅ Lista de denúncias carregando
5. ✅ Sem erros no terminal

---

## 📝 Próximos Passos

Após teste bem-sucedido:
1. [ ] Testar todos os fluxos
2. [ ] Reportar bugs encontrados
3. [ ] Fazer build de produção (se necessário)
4. [ ] Preparar para deploy

---

**Data**: 06/12/2025
**Versão**: 1.0.0
**Status**: ✅ Pronto para teste
