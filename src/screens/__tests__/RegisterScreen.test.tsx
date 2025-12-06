import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { RegisterScreen } from '../RegisterScreen';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import type {} from 'redux-mock-store';

const mockStore = configureStore([]);
const mockNavigation = {
  navigate: jest.fn(),
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

  it('deve validar campos obrigatórios', async () => {
    const { getByText } = renderComponent();
    
    fireEvent.press(getByText('Criar conta'));

    await waitFor(() => {
      expect(getByText('O campo nome é obrigatório')).toBeTruthy();
    });
  });

  it('deve validar formato do email', async () => {
    const { getByText, getByPlaceholderText } = renderComponent();
    
    fireEvent.changeText(getByPlaceholderText('Digite seu email'), 'emailinvalido');
    fireEvent.press(getByText('Criar conta'));

    await waitFor(() => {
      expect(getByText('Por favor, insira um email válido')).toBeTruthy();
    });
  });

  it('deve validar se as senhas conferem', async () => {
    const { getByText, getByPlaceholderText } = renderComponent();
    
    fireEvent.changeText(getByPlaceholderText('Digite sua senha'), 'senha123');
    fireEvent.changeText(getByPlaceholderText('Digite sua senha novamente'), 'senha456');
    fireEvent.press(getByText('Criar conta'));

    await waitFor(() => {
      expect(getByText('As senhas não conferem')).toBeTruthy();
    });
  });

  it('deve tratar registro bem-sucedido', async () => {
    const { getByText, getByPlaceholderText } = renderComponent();
    
    fireEvent.changeText(getByPlaceholderText('Digite seu nome completo'), 'João Silva');
    fireEvent.changeText(getByPlaceholderText('Digite seu email'), 'joao@exemplo.com');
    fireEvent.changeText(getByPlaceholderText('Digite seu CPF'), '123.456.789-00');
    fireEvent.changeText(getByPlaceholderText('Digite sua senha'), 'senha123');
    fireEvent.changeText(getByPlaceholderText('Digite sua senha novamente'), 'senha123');

    store.dispatch = jest.fn().mockResolvedValue({});
    fireEvent.press(getByText('Criar conta'));

    await waitFor(() => {
      expect(mockNavigation.replace).toHaveBeenCalledWith('Home');
    });
  });

  it('deve desabilitar inputs durante carregamento', async () => {
    store = mockStore({
      auth: {
        isLoading: true,
        error: null,
      },
    });

    const { getByPlaceholderText, getByText } = renderComponent();
    expect(getByText('Criar conta').props.disabled).toBeTruthy();
  });
});
