/**
 * Share Service - Compartilhamento Social
 * Suporta WhatsApp, Facebook, Instagram, Twitter, Email
 */

import Share from 'react-native-share';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

export interface ShareViolationData {
  id: string;
  type: string;
  location: string;
  date: string;
  imageUrl?: string;
}

/**
 * Templates de mensagens para compartilhamento
 */
export const shareTemplates = {
  whatsapp: (data: ShareViolationData) => `
🚨 *DetranDenuncia* - Infração Reportada

📍 *Local:* ${data.location}
📋 *Tipo:* ${data.type}
📅 *Data:* ${data.date}

Ajude a tornar o trânsito mais seguro! 
Baixe o app: https://detrandenuncia.com.br

#DetranDenuncia #TrânsitoSeguro
  `.trim(),

  twitter: (data: ShareViolationData) => `
🚨 Infração reportada via @DetranDenuncia

📍 ${data.location}
📋 ${data.type}

Faça parte da mudança! 
https://detrandenuncia.com.br

#DetranDenuncia #TrânsitoSeguro
  `.trim(),

  facebook: (data: ShareViolationData) => `
🚨 Infração de Trânsito Reportada - DetranDenuncia

Acabei de reportar uma infração através do DetranDenuncia! 
Juntos podemos tornar nossas ruas mais seguras.

📍 Local: ${data.location}
📋 Tipo: ${data.type}
📅 Data: ${data.date}

O DetranDenuncia é um app que permite a cidadãos reportarem infrações de trânsito com fotos georreferenciadas. Todas as denúncias são analisadas por agentes do DETRAN.

Baixe agora e faça parte dessa mudança: https://detrandenuncia.com.br

#DetranDenuncia #TrânsitoSeguro #CidadaniAtiva
  `.trim(),

  instagram: (data: ShareViolationData) => `
🚨 Infração Reportada

📍 ${data.location}
📋 ${data.type}

#DetranDenuncia #TrânsitoSeguro
#CidadaniAtiva #TrânsitoConsciente
  `.trim(),

  email: (data: ShareViolationData) => ({
    subject: '🚨 Infração de Trânsito Reportada - DetranDenuncia',
    body: `
Olá!

Gostaria de compartilhar uma denúncia que fiz através do DetranDenuncia:

📍 Local: ${data.location}
📋 Tipo de Infração: ${data.type}
📅 Data: ${data.date}

O DetranDenuncia é um aplicativo mobile que permite aos cidadãos reportarem infrações de trânsito de forma rápida e segura, com validação anti-IA de imagens.

Todas as denúncias são analisadas por agentes do DETRAN e podem resultar em autuações oficiais.

Baixe o app e ajude a tornar o trânsito mais seguro:
https://detrandenuncia.com.br

Atenciosamente,
DetranDenuncia
    `.trim(),
  }),

  generic: (data: ShareViolationData) => `
🚨 Infração Reportada via DetranDenuncia

📍 Local: ${data.location}
📋 Tipo: ${data.type}
📅 Data: ${data.date}

Baixe: https://detrandenuncia.com.br
  `.trim(),
};

/**
 * Compartilha uma denúncia via WhatsApp
 */
export const shareViaWhatsApp = async (data: ShareViolationData): Promise<boolean> => {
  try {
    const message = shareTemplates.whatsapp(data);
    
    const options: any = {
      title: 'Compartilhar Denúncia',
      message: message,
      social: Share.Social.WHATSAPP,
    };

    await Share.shareSingle(options);
    return true;
  } catch (error) {
    console.error('Erro ao compartilhar via WhatsApp:', error);
    return false;
  }
};

/**
 * Compartilha uma denúncia via Facebook
 */
export const shareViaFacebook = async (data: ShareViolationData): Promise<boolean> => {
  try {
    const message = shareTemplates.facebook(data);
    const url = `https://detrandenuncia.com.br/violation/${data.id}`;
    
    const options: any = {
      title: 'Infração Reportada - DetranDenuncia',
      message: message,
      url: url,
      social: Share.Social.FACEBOOK,
    };

    await Share.shareSingle(options);
    return true;
  } catch (error) {
    console.error('Erro ao compartilhar via Facebook:', error);
    return false;
  }
};

/**
 * Compartilha uma denúncia via Twitter
 */
export const shareViaTwitter = async (data: ShareViolationData): Promise<boolean> => {
  try {
    const message = shareTemplates.twitter(data);
    const url = `https://detrandenuncia.com.br/violation/${data.id}`;
    
    const options: any = {
      title: 'Infração Reportada',
      message: message,
      url: url,
      social: Share.Social.TWITTER,
    };

    await Share.shareSingle(options);
    return true;
  } catch (error) {
    console.error('Erro ao compartilhar via Twitter:', error);
    return false;
  }
};

/**
 * Compartilha uma denúncia via Instagram (Stories)
 */
export const shareViaInstagram = async (data: ShareViolationData): Promise<boolean> => {
  try {
    if (!data.imageUrl) {
      throw new Error('Imagem necessária para compartilhar no Instagram');
    }

    const message = shareTemplates.instagram(data);
    
    const options: any = {
      title: 'Infração Reportada',
      message: message,
      url: data.imageUrl,
      social: Share.Social.INSTAGRAM_STORIES,
      appId: 'your-facebook-app-id', // TODO: Configurar App ID
    };

    await Share.shareSingle(options);
    return true;
  } catch (error) {
    console.error('Erro ao compartilhar via Instagram:', error);
    return false;
  }
};

/**
 * Compartilha uma denúncia via Email
 */
export const shareViaEmail = async (data: ShareViolationData): Promise<boolean> => {
  try {
    const { subject, body } = shareTemplates.email(data);
    
    const options: any = {
      title: subject,
      subject: subject,
      message: body,
      email: '', // Email destinatário vazio (usuário escolhe)
      social: Share.Social.EMAIL,
    };

    await Share.shareSingle(options);
    return true;
  } catch (error) {
    console.error('Erro ao compartilhar via Email:', error);
    return false;
  }
};

/**
 * Abre o sheet nativo de compartilhamento (iOS/Android)
 */
export const shareViaSystem = async (data: ShareViolationData): Promise<boolean> => {
  try {
    const message = shareTemplates.generic(data);
    const url = `https://detrandenuncia.com.br/violation/${data.id}`;

    const options = {
      title: 'Compartilhar Denúncia - DetranDenuncia',
      message: message,
      url: url,
    };

    const result = await Share.open(options);
    return result.success || false;
  } catch (error: any) {
    // Usuário cancelou o compartilhamento
    if (error?.message === 'User did not share') {
      return false;
    }
    console.error('Erro ao compartilhar:', error);
    return false;
  }
};

/**
 * Copia link da denúncia para a área de transferência
 */
export const copyLink = async (violationId: string): Promise<boolean> => {
  try {
    const url = `https://detrandenuncia.com.br/violation/${violationId}`;
    
    // Usar Clipboard API do React Native
    if (Platform.OS === 'web') {
      await navigator.clipboard.writeText(url);
    } else {
      // Para mobile, usar o Share com intent de copiar
      const { Clipboard } = require('react-native');
      await Clipboard.setString(url);
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao copiar link:', error);
    return false;
  }
};

/**
 * Verifica se o compartilhamento está disponível
 */
export const isShareAvailable = async (): Promise<boolean> => {
  try {
    return await Sharing.isAvailableAsync();
  } catch (error) {
    return true; // Assume disponível por padrão
  }
};

/**
 * Formata data para exibição
 */
export const formatShareDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} às ${hours}:${minutes}`;
};

/**
 * Formata tipo de infração para exibição
 */
export const formatViolationType = (type: string): string => {
  const types: Record<string, string> = {
    'ESTACIONAMENTO_PROIBIDO': 'Estacionamento Proibido',
    'FAIXA_EXCLUSIVA': 'Invasão de Faixa Exclusiva',
    'VAGA_ESPECIAL': 'Estacionamento em Vaga Especial',
    'VELOCIDADE': 'Excesso de Velocidade',
    'SINAL_VERMELHO': 'Avanço de Sinal Vermelho',
    'TELEFONE_AO_VOLANTE': 'Uso de Celular ao Dirigir',
    'CINTO_SEGURANCA': 'Não Uso de Cinto de Segurança',
    'ULTRAPASSAGEM_PROIBIDA': 'Ultrapassagem Proibida',
    'DIRECAO_PERIGOSA': 'Direção Perigosa',
    'POLUICAO': 'Poluição Ambiental',
    'BARULHO_EXCESSIVO': 'Poluição Sonora',
    'DOCUMENTO_IRREGULAR': 'Documento Irregular',
    'TRANSPORTE_IRREGULAR': 'Transporte Irregular',
    'CARGA_IRREGULAR': 'Carga Irregular',
    'CONSERVACAO': 'Má Conservação do Veículo',
    'OUTROS': 'Outras Infrações',
  };
  
  return types[type] || type;
};
