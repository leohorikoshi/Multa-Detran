# Plano de Testes

## Última Atualização: 08/11/2025
### Status: EM ANDAMENTO
### Cobertura Atual: Em implementação

## 1. Estratégia de Testes

### 1.1 Níveis de Teste
1. **Testes Unitários**
   - Components React Native
   - Funções utilitárias
   - Controllers da API
   - Models do banco

2. **Testes de Integração**
   - Fluxos de navegação
   - Chamadas de API
   - Operações de banco
   - Upload de arquivos

3. **Testes E2E**
   - Fluxos completos de usuário
   - Cenários de negócio
   - Performance
   - Usabilidade

### 1.2 Tipos de Teste
- Funcionais
- Performance
- Segurança
- Usabilidade
- Acessibilidade

## 2. Frameworks e Ferramentas

### 2.1 Frontend (Mobile)
\`\`\`json
{
  "testing-library/react-native": "Testes de componentes",
  "jest": "Test runner e assertions",
  "cypress": "Testes E2E",
  "msw": "Mock de API"
}
\`\`\`

### 2.2 Backend
\`\`\`json
{
  "jest": "Testes unitários",
  "supertest": "Testes de API",
  "mongodb-memory-server": "Banco de testes"
}
\`\`\`

## 3. Casos de Teste

### 3.1 Autenticação
\`\`\`typescript
describe('Autenticação', () => {
  // Registro
  test('deve criar novo usuário com dados válidos')
  test('deve validar email duplicado')
  test('deve validar formato de CPF')
  
  // Login
  test('deve autenticar com credenciais válidas')
  test('deve rejeitar senha incorreta')
  test('deve gerar token JWT válido')
})
\`\`\`

### 3.2 Denúncias
\`\`\`typescript
describe('Denúncias', () => {
  // Criação
  test('deve criar denúncia com fotos')
  test('deve validar dados obrigatórios')
  test('deve processar localização')
  
  // Listagem
  test('deve listar denúncias do usuário')
  test('deve filtrar por status')
  test('deve paginar resultados')
})
\`\`\`

## 4. Ambiente de Testes

### 4.1 Configuração
\`\`\`javascript
// jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation)',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
}
\`\`\`

### 4.2 Mocks
\`\`\`typescript
// API Mock
const apiMock = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

// Geolocation Mock
const geolocationMock = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
};
\`\`\`

## 5. CI/CD Integration

### 5.1 GitHub Actions
\`\`\`yaml
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run test:e2e
\`\`\`

### 5.2 Relatórios
- Coverage reports
- Test results
- Performance metrics
- E2E recordings

## 6. Critérios de Aceitação

### 6.1 Qualidade de Código
- 80% cobertura de testes
- Sem erros de lint
- TypeScript strict mode
- Documentação atualizada

### 6.2 Performance
- Tempo de resposta < 2s
- Score Lighthouse > 90
- FPS > 30 no app
- Cache hit ratio > 80%

## 7. Automação de Testes

### 7.1 Scripts
\`\`\`json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:e2e": "cypress run",
  "test:ci": "jest --ci --coverage"
}
\`\`\`

### 7.2 Pre-commit Hooks
\`\`\`json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm test"
    }
  }
}
\`\`\`

## 8. Matriz de Testes

### 8.1 Mobile
| Recurso | Unit | Integration | E2E |
|---------|------|-------------|-----|
| Auth    |  ✓   |     ✓      |  ✓  |
| Camera  |  ✓   |     ✓      |  -  |
| Geo     |  ✓   |     ✓      |  -  |
| Reports |  ✓   |     ✓      |  ✓  |

### 8.2 API
| Endpoint | Unit | Integration | Security |
|----------|------|-------------|-----------|
| /auth    |  ✓   |     ✓      |    ✓     |
| /upload  |  ✓   |     ✓      |    ✓     |
| /reports |  ✓   |     ✓      |    ✓     |

## 9. Atualizações

### v1.0.0 (08/11/2025)
- Documento inicial
- Setup de testes unitários
- Configuração do Jest