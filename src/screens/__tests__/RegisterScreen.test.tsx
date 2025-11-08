import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { RegisterScreen } from '../RegisterScreen';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);
const mockNavigation = {
  navigate: jest.fn(),
  replace: jest.fn(),
  replace: jest.fn(),
};

describe('Tela de Registro', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      auth: {
        isLoading: false,
        error: null,
      },
    });
    jest.clearAllMocks();
  });

  const renderizarComponente = () =>
    render(
      <Provider store={store}>
        <NavigationContainer>
          <RegisterScreen navigation={mockNavigation as any} />
        </NavigationContainer>
      </Provider>
    );

  it('deve validar campos obrigatórios', async () => {
    const { getByText, getByPlaceholderText } = renderizarComponente();
    
    // Tentar enviar formulário vazio
    fireEvent.press(getByText('Criar conta'));

    await waitFor(() => {
      expect(getByText('O campo nome é obrigatório')).toBeTruthy();
      expect(getByText('O campo email é obrigatório')).toBeTruthy();
      expect(getByText('O campo senha é obrigatório')).toBeTruthy();
    });
  });

  it('deve validar formato do email', async () => {
    const { getByText, getByPlaceholderText } = renderizarComponente();
    
    fireEvent.changeText(getByPlaceholderText('Digite seu email'), 'emailinvalido');
    fireEvent.press(getByText('Criar conta'));

    await waitFor(() => {
      expect(getByText('Por favor, insira um email válido')).toBeTruthy();
    });
  });

  it('deve validar se as senhas conferem', async () => {
    const { getByText, getByPlaceholderText } = renderizarComponente();
    
    fireEvent.changeText(getByPlaceholderText('Digite sua senha'), 'senha123');
    fireEvent.changeText(getByPlaceholderText('Digite sua senha novamente'), 'senha456');
    fireEvent.press(getByText('Criar conta'));

    await waitFor(() => {
      expect(getByText('As senhas não conferem')).toBeTruthy();
    });
  });

  it('deve validar o formato do CPF', async () => {
    const { getByText, getByPlaceholderText } = renderizarComponente();
    
    fireEvent.changeText(getByPlaceholderText('Digite seu CPF'), '123456789');
    fireEvent.press(getByText('Criar conta'));

    await waitFor(() => {
      expect(getByText('CPF inválido')).toBeTruthy();
    });
  });

  it('deve tratar registro bem-sucedido', async () => {
    const { getByText, getByPlaceholderText } = renderizarComponente();
    
    // Preencher formulário com dados válidos
    fireEvent.changeText(getByPlaceholderText('Digite seu nome completo'), 'João Silva');
    fireEvent.changeText(getByPlaceholderText('Digite seu email'), 'joao@exemplo.com');
    fireEvent.changeText(getByPlaceholderText('Digite seu CPF'), '123.456.789-00');
    fireEvent.changeText(getByPlaceholderText('Digite sua senha'), 'senha123');
    fireEvent.changeText(getByPlaceholderText('Digite sua senha novamente'), 'senha123');

    // Simular registro bem-sucedido
    store.dispatch = jest.fn().mockResolvedValue({});

    fireEvent.press(getByText('Criar conta'));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'auth/register',
        })
      );
      expect(mockNavigation.replace).toHaveBeenCalledWith('Home');
    });
  });

  it('deve tratar erro de registro', async () => {
    const { getByText, getByPlaceholderText } = renderizarComponente();
    
    // Preencher formulário com dados válidos
    fireEvent.changeText(getByPlaceholderText('Digite seu nome completo'), 'João Silva');
    fireEvent.changeText(getByPlaceholderText('Digite seu email'), 'joao@exemplo.com');
    fireEvent.changeText(getByPlaceholderText('Digite seu CPF'), '123.456.789-00');
    fireEvent.changeText(getByPlaceholderText('Digite sua senha'), 'senha123');
    fireEvent.changeText(getByPlaceholderText('Digite sua senha novamente'), 'senha123');

    // Simular erro de registro
    store.dispatch = jest.fn().mockRejectedValue(new Error('Email já cadastrado'));

    fireEvent.press(getByText('Criar conta'));

    await waitFor(() => {
      expect(getByText('Este email já está cadastrado')).toBeTruthy();
    });
  });

  it('deve desabilitar inputs e botões durante carregamento', async () => {
    store = mockStore({
      auth: {
        isLoading: true,
        error: null,
      },
    });

    const { getByPlaceholderText, getByText } = renderizarComponente();

    expect(getByPlaceholderText('Digite seu nome completo').props.editable).toBeFalsy();
    expect(getByPlaceholderText('Digite seu email').props.editable).toBeFalsy();
    expect(getByPlaceholderText('Digite sua senha').props.editable).toBeFalsy();
    expect(getByText('Criar conta').props.disabled).toBeTruthy();
  });

  it('deve limpar erro ao mudar campos do formulário', async () => {
    store = mockStore({
      auth: {
        isLoading: false,
        error: 'Email já cadastrado',
      },
    });

    const { getByText, getByPlaceholderText, queryByText } = renderizarComponente();
    
    // Verificar se erro está visível
    expect(getByText('Email já cadastrado')).toBeTruthy();

    // Mudar valor do campo
    fireEvent.changeText(getByPlaceholderText('Digite seu email'), 'novoEmail@exemplo.com');

    // Verificar se erro foi limpo
    await waitFor(() => {
      expect(queryByText('Email já cadastrado')).toBeNull();
    });
  });
});
  replace: jest.fn(),
};

describe('RegisterScreen', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      auth: {
        isLoading: false,
        error: null,
      },
    });
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <NavigationContainer>
          <RegisterScreen navigation={mockNavigation as any} />
        </NavigationContainer>
      </Provider>
    );

  it('should validate required fields', async () => {
    const { getByText, getByPlaceholderText } = renderComponent();
    
    // Try to submit empty form
    fireEvent.press(getByText('Criar conta'));

    await waitFor(() => {
      expect(getByText('O campo nome é obrigatório')).toBeTruthy();
      expect(getByText('O campo email é obrigatório')).toBeTruthy();
      expect(getByText('O campo senha é obrigatório')).toBeTruthy();
    });
  });

  it('should validate email format', async () => {
    const { getByText, getByPlaceholderText } = renderComponent();
    
    fireEvent.changeText(getByPlaceholderText('Digite seu email'), 'invalidemail');
    fireEvent.press(getByText('Criar conta'));

    await waitFor(() => {
      expect(getByText('Por favor, insira um email válido')).toBeTruthy();
    });
  });

  it('should validate password match', async () => {
    const { getByText, getByPlaceholderText } = renderComponent();
    
    fireEvent.changeText(getByPlaceholderText('Digite sua senha'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Digite sua senha novamente'), 'password456');
    fireEvent.press(getByText('Criar conta'));

    await waitFor(() => {
      expect(getByText('As senhas não conferem')).toBeTruthy();
    });
  });

  it('should handle successful registration', async () => {
    const { getByText, getByPlaceholderText } = renderComponent();
    
    // Fill form with valid data
    fireEvent.changeText(getByPlaceholderText('Digite seu nome completo'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Digite seu email'), 'john@example.com');
    fireEvent.changeText(getByPlaceholderText('Digite seu CPF'), '123.456.789-00');
    fireEvent.changeText(getByPlaceholderText('Digite sua senha'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Digite sua senha novamente'), 'password123');

    // Mock successful registration
    store.dispatch = jest.fn().mockResolvedValue({});

    fireEvent.press(getByText('Criar conta'));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'auth/register',
        })
      );
      expect(mockNavigation.replace).toHaveBeenCalledWith('Home');
    });
  });

  it('should handle registration error', async () => {
    const { getByText, getByPlaceholderText } = renderComponent();
    
    // Fill form with valid data
    fireEvent.changeText(getByPlaceholderText('Digite seu nome completo'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Digite seu email'), 'john@example.com');
    fireEvent.changeText(getByPlaceholderText('Digite seu CPF'), '123.456.789-00');
    fireEvent.changeText(getByPlaceholderText('Digite sua senha'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Digite sua senha novamente'), 'password123');

    // Mock registration error
    store.dispatch = jest.fn().mockRejectedValue(new Error('Email already exists'));

    fireEvent.press(getByText('Criar conta'));

    await waitFor(() => {
      expect(getByText('Este email já está cadastrado')).toBeTruthy();
    });
  });

  it('should disable inputs and buttons while loading', async () => {
    store = mockStore({
      auth: {
        isLoading: true,
        error: null,
      },
    });

    const { getByPlaceholderText, getByText } = renderComponent();

    expect(getByPlaceholderText('Digite seu nome completo').props.editable).toBeFalsy();
    expect(getByPlaceholderText('Digite seu email').props.editable).toBeFalsy();
    expect(getByPlaceholderText('Digite sua senha').props.editable).toBeFalsy();
    expect(getByText('Criar conta').props.disabled).toBeTruthy();
  });
});