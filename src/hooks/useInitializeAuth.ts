import { useEffect } from 'react';
import { useAppDispatch } from './useRedux';
import { AuthStorage } from '../utils/auth-storage';

export const useInitializeAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initialize = async () => {
      try {
        // Carregar dados do storage
        const [token, user] = await Promise.all([
          AuthStorage.getToken(),
          AuthStorage.getUser()
        ]);

        // Se tiver dados salvos, restaurar o estado
        if (token && user) {
          dispatch({
            type: 'auth/initializeFromStorage',
            payload: { token, user }
          });
        }
      } catch (error) {
        console.error('Erro ao inicializar auth:', error);
      }
    };

    initialize();
  }, [dispatch]);
};