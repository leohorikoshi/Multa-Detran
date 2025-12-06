import { useEffect } from 'react';
import { useAppDispatch } from './useRedux';

export const useInitializeAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Hook temporário vazio - persistência removida
    // TODO: Re-implementar com localStorage direto depois dos testes
    console.log('🔄 useInitializeAuth: Sem persistência no momento');
  }, [dispatch]);
};