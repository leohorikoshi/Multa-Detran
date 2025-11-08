export const API_BASE_URL = 'https://api.detrandenuncia.gov.br'; // TODO: Atualizar com URL correta

export const VIOLATION_TYPES = [
  'Estacionamento irregular',
  'Excesso de velocidade',
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