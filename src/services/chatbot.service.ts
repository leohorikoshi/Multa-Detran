// Sistema de FAQ simples
const FAQ_DATABASE = {
  'como denunciar': 'Para fazer uma denúncia, toque em "Reportar Infração", tire fotos da violação, preencha os dados e envie. Sua denúncia será analisada em até 48h.',
  'tipos de infração': 'Você pode denunciar: estacionamento irregular, avanço de sinal, excesso de velocidade, ultrapassagem proibida, uso de celular, falta de cinto, entre outros.',
  'quanto tempo': 'Analisamos denúncias em até 48h. Você receberá uma notificação quando sua denúncia for aprovada ou rejeitada.',
  'pontos ganhar': 'Você ganha 10 pontos ao criar uma denúncia, 50 pontos ao ser aprovada, 5 pontos ao compartilhar, e 20 pontos por streak diário.',
  'badges': 'Temos 8 badges: Primeira Denúncia 🎯, Ajudante 🤝 (10), Guardião 🛡️ (50), Herói 🦸 (100), Lenda 👑 (500), Compartilhador 📢 (20 shares), Semana Ativa 🔥 (7 dias), Mês Ativo ⚡ (30 dias).',
  'como funciona': 'DetranDenuncia é um app colaborativo onde cidadãos reportam infrações de trânsito. As denúncias são validadas e enviadas às autoridades competentes.',
  'privacidade': 'Seus dados são protegidos conforme LGPD. Apenas autoridades veem informações completas das denúncias.',
  'suporte': 'Para suporte, entre em contato: suporte@detrandenuncia.com.br',
};

export const chatbotResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase().trim();
  
  // Buscar resposta no FAQ
  for (const [key, value] of Object.entries(FAQ_DATABASE)) {
    if (lowerMessage.includes(key)) {
      return value;
    }
  }
  
  // Resposta padrão
  return 'Desculpe, não entendi sua pergunta. Perguntas comuns: "como denunciar?", "tipos de infração", "quanto tempo?", "pontos", "badges", "como funciona?"';
};
