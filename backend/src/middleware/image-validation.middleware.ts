import { Request, Response, NextFunction } from 'express';
import { ImageValidator } from '../utils/image-validator';

export interface ImageValidationRequest extends Request {
  imageValidation?: {
    isValid: boolean;
    confidence: number;
    flags: string[];
    hash: string;
  };
}

/**
 * Middleware para validar imagens contra falsificações de IA
 */
export const validateImageAuthenticity = async (
  req: ImageValidationRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Verificar se há arquivo enviado
    if (!req.file) {
      return next();
    }

    console.log('🔍 Validando autenticidade da imagem...');

    // Validar imagem
    const validation = await ImageValidator.validateImage(req.file.buffer);

    // Log do relatório
    const report = ImageValidator.generateValidationReport(validation);
    console.log(report);

    // Anexar resultado à requisição
    req.imageValidation = {
      isValid: validation.isValid,
      confidence: validation.confidence,
      flags: validation.flags,
      hash: validation.metadata.hash,
    };

    // Rejeitar imagens com baixa confiança
    if (!validation.isValid) {
      console.warn('⚠️ Imagem rejeitada por suspeita de manipulação/IA');
      
      // Criar mensagem de erro detalhada
      let errorMessage = 'Imagem suspeita de manipulação ou geração artificial. ';
      
      if (validation.flags.includes('NO_EXIF_DATA')) {
        errorMessage += 'A imagem não possui metadados de câmera. ';
      }
      
      if (validation.flags.some(f => f.includes('SUSPICIOUS_SOFTWARE'))) {
        errorMessage += 'Software de edição/IA detectado nos metadados. ';
      }
      
      if (validation.flags.some(f => f.includes('AI_ARTIFACTS'))) {
        errorMessage += 'Padrões artificiais detectados na imagem. ';
      }
      
      if (validation.flags.includes('NO_GPS_DATA')) {
        errorMessage += 'Sem dados de localização GPS. ';
      }
      
      errorMessage += `\n\nPor favor, tire uma foto real com a câmera do seu celular no local da infração. Não envie screenshots, imagens editadas ou geradas por IA.`;
      
      return res.status(400).json({
        status: 'error',
        message: errorMessage,
        details: {
          confidence: validation.confidence,
          flags: validation.flags,
        },
      });
    }

    // Se passou na validação mas tem alguns alertas, registrar
    if (validation.flags.length > 0) {
      console.log(`⚠️ Imagem aprovada com ${validation.flags.length} alerta(s):`, validation.flags);
    } else {
      console.log('✅ Imagem validada com sucesso - sem alertas');
    }

    next();
  } catch (error) {
    console.error('❌ Erro ao validar imagem:', error);
    // Em caso de erro na validação, permitir mas registrar
    next();
  }
};

/**
 * Middleware mais permissivo para ambientes de desenvolvimento/teste
 */
export const validateImageAuthenticityDev = async (
  req: ImageValidationRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return next();
    }

    console.log('🔍 [DEV] Validando autenticidade da imagem (modo permissivo)...');

    const validation = await ImageValidator.validateImage(req.file.buffer);
    const report = ImageValidator.generateValidationReport(validation);
    console.log(report);

    req.imageValidation = {
      isValid: validation.isValid,
      confidence: validation.confidence,
      flags: validation.flags,
      hash: validation.metadata.hash,
    };

    // Em dev, apenas avisar mas não bloquear
    if (!validation.isValid) {
      console.warn('⚠️ [DEV] Imagem seria rejeitada em produção');
      console.warn('Confiança:', validation.confidence + '%');
      console.warn('Flags:', validation.flags);
    }

    next();
  } catch (error) {
    console.error('❌ Erro ao validar imagem:', error);
    next();
  }
};
