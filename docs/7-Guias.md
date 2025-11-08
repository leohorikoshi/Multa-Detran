# Guia de Componentes

## Componentes de Formulário

### Input
Componente de entrada de texto com suporte a validação e feedback de erro.

```typescript
interface InputProps extends TextInputProps {
  error?: string;
}

// Uso
<Input
  placeholder="Email"
  value={email}
  onChangeText={setEmail}
  error={validation.email}
/>
```

### Button
Botão customizável com suporte a diferentes variantes.

```typescript
interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  titleStyle?: TextStyle;
}

// Uso
<Button
  title="Entrar"
  onPress={handleLogin}
  disabled={isLoading}
  variant="primary"
/>
```

## Telas

### LoginScreen
Tela de login com validação e feedback visual.

**Features:**
- Validação de email e senha
- Feedback visual de erros
- Persistência de autenticação
- Navegação para registro e recuperação de senha

**Fluxo de Autenticação:**
1. Usuário insere credenciais
2. Validação local dos campos
3. Chamada à API de login
4. Armazenamento do token
5. Redirecionamento para Home

**Exemplo de Uso:**
\`\`\`typescript
navigation.navigate('Login');
\`\`\`

## Hooks Personalizados

### useInitializeAuth
Hook para inicialização do estado de autenticação.

```typescript
// Uso
const App = () => {
  useInitializeAuth();
  return <Navigation />;
};
```

### useRedux
Hooks tipados para uso do Redux.

```typescript
// Uso
const dispatch = useAppDispatch();
const { user } = useAppSelector(state => state.auth);
```

## Serviços

### AuthStorage
Serviço para persistência de dados de autenticação.

```typescript
// Métodos disponíveis
AuthStorage.setToken(token: string): Promise<void>
AuthStorage.getToken(): Promise<string | null>
AuthStorage.setUser(user: User): Promise<void>
AuthStorage.getUser(): Promise<User | null>
AuthStorage.clear(): Promise<void>
```

### API
Serviço Axios configurado com interceptors.

```typescript
// Uso
const response = await api.post('/auth/login', credentials);
```

## Estilos

### Cores
```typescript
const colors = {
  primary: '#1a73e8',
  secondary: '#34a853',
  error: '#ff4444',
  text: {
    primary: '#000000',
    secondary: '#666666',
  },
  background: '#ffffff',
};
```

### Tipografia
```typescript
const typography = {
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
  },
  body: {
    fontSize: 14,
  },
};
```

## Validação

### Regras de Validação
- Email: Formato válido de email
- Senha: Mínimo de 6 caracteres
- CPF: 11 dígitos numéricos
- Nome: Mínimo de 3 caracteres

### Exemplo de Implementação
```typescript
const validateForm = () => {
  let isValid = true;
  const newValidation = { email: '', password: '' };

  if (!email) {
    newValidation.email = 'Email é obrigatório';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    newValidation.email = 'Email inválido';
    isValid = false;
  }

  if (!password) {
    newValidation.password = 'Senha é obrigatória';
    isValid = false;
  } else if (password.length < 6) {
    newValidation.password = 'Senha deve ter no mínimo 6 caracteres';
    isValid = false;
  }

  setValidation(newValidation);
  return isValid;
};
```