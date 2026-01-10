// Configuração da API
const getApiUrl = () => {
  // Detecta ambiente
  const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';
  
  if (!__DEV__) {
    // PRODUÇÃO - Substitua pela URL do Render após deploy
    return 'https://detran-api.onrender.com/api';
  }
  
  // DESENVOLVIMENTO
  if (isWeb) {
    return 'http://localhost:3000/api';
  }
  
  // Mobile usa o IP da rede local
  // IMPORTANTE: Substitua pelo seu IP real
  return 'http://192.168.15.87:3000/api';
};

export const API_BASE_URL = getApiUrl();

export const VIOLATION_TYPES = [
  'Estacionamento irregular',
  'Parada em cima da faixa no farol',
  'Avanço de sinal vermelho',
  'Uso do celular ao volante',
  'Transporte irregular de passageiros',
  'Circulação em local proibido',
  'Manobra perigosa',
  'Outros',
] as const;

export const VIOLATION_STATUS = {
  pending: 'Pendente',
  reviewing: 'Em análise',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
} as const;

export const ERROR_MESSAGES = {
  invalidEmail: 'E-mail inválido',
  invalidCPF: 'CPF inválido',
  passwordTooShort: 'A senha deve ter no mínimo 6 caracteres',
  passwordsDontMatch: 'As senhas não conferem',
  required: 'Campo obrigatório',
  serverError: 'Erro no servidor. Tente novamente mais tarde.',
  networkError: 'Erro de conexão. Verifique sua internet.',
} as const;