import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../store/slices/authSlice';
import { LoginScreen } from '../screens/LoginScreen';

describe('LoginScreen', () => {
  const mockNavigate = jest.fn();
  const mockStore = configureStore({
    reducer: {
      auth: authReducer,
    },
  });

  const renderLoginScreen = () =>
    render(
      <Provider store={mockStore}>
        <LoginScreen navigation={{ navigate: mockNavigate } as any} />
      </Provider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show validation errors for empty fields', () => {
    const { getByText, getByPlaceholderText } = renderLoginScreen();
    const loginButton = getByText('Entrar');

    fireEvent.press(loginButton);

    expect(getByText('Email é obrigatório')).toBeTruthy();
    expect(getByText('Senha é obrigatória')).toBeTruthy();
  });

  it('should validate email format', () => {
    const { getByText, getByPlaceholderText } = renderLoginScreen();
    const emailInput = getByPlaceholderText('Email');
    const loginButton = getByText('Entrar');

    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.press(loginButton);

    expect(getByText('Email inválido')).toBeTruthy();
  });

  it('should validate password length', () => {
    const { getByText, getByPlaceholderText } = renderLoginScreen();
    const passwordInput = getByPlaceholderText('Senha');
    const loginButton = getByText('Entrar');

    fireEvent.changeText(passwordInput, '123');
    fireEvent.press(loginButton);

    expect(getByText('Senha deve ter no mínimo 6 caracteres')).toBeTruthy();
  });

  it('should attempt login with valid credentials', async () => {
    const { getByText, getByPlaceholderText } = renderLoginScreen();
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Senha');
    const loginButton = getByText('Entrar');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      // A navegação será automática pelo NavigationContainer
      // quando o token for definido no estado
      expect(mockStore.getState().auth.isLoading).toBe(true);
    });
  });

  it('should navigate to register screen', () => {
    const { getByText } = renderLoginScreen();
    const registerLink = getByText('Criar conta');

    fireEvent.press(registerLink);

    expect(mockNavigate).toHaveBeenCalledWith('Register');
  });

  it('should navigate to forgot password screen', () => {
    const { getByText } = renderLoginScreen();
    const forgotPasswordLink = getByText('Esqueceu sua senha?');

    fireEvent.press(forgotPasswordLink);

    expect(mockNavigate).toHaveBeenCalledWith('ForgotPassword');
  });
});