# Changelog

## [1.0.0] - 2025-11-08

### Adicionado
- Componentes UI base (Input, Button) para formulários
- Tela de login com validação e feedback visual
- Sistema de persistência de autenticação
- Interceptor Axios para gerenciamento de tokens
- Documentação inicial do projeto

### Modificado
- Atualização da navegação para incluir ForgotPassword
- Refatoração da tela de login para usar componentes reutilizáveis
- Melhorias no feedback visual de erros

### Arquitetura
- Implementação do padrão de componentes reutilizáveis
- Setup de autenticação persistente com AsyncStorage
- Configuração de interceptors para refresh token

### Segurança
- Validação de formulários no cliente
- Token JWT com refresh
- Persistência segura de dados sensíveis

### Próximos Passos
1. Implementar tela de registro
2. Implementar recuperação de senha
3. Configurar testes unitários
4. Implementar tela de perfil

## [0.1.0] - 2025-11-08

### Adicionado
- Setup inicial do projeto
- Configuração do React Navigation
- Implementação do Redux Toolkit
- Estrutura base de autenticação