import sharp from 'sharp';
import { createHash } from 'crypto';

export interface ImageValidationResult {
  isValid: boolean;
  confidence: number;
  flags: string[];
  metadata: ImageMetadata;
}

export interface ImageMetadata {
  format: string;
  width: number;
  height: number;
  hasExif: boolean;
  hasGPS: boolean;
  fileSize: number;
  hash: string;
  timestamp?: Date;
  device?: string;
  software?: string;
}

export class ImageValidator {
  private static readonly SUSPICIOUS_PATTERNS = [
    'photoshop',
    'gimp',
    'midjourney',
    'stable diffusion',
    'dall-e',
    'ai generated',
    'artificial intelligence',
    'deepfake',
    'gan',
    'neural',
  ];

  private static readonly MIN_FILE_SIZE = 10000; // 10KB
  private static readonly MAX_FILE_SIZE = 10485760; // 10MB
  private static readonly MIN_RESOLUTION = 480;
  private static readonly MAX_RESOLUTION = 4096;

  /**
   * Valida se a imagem é autêntica e não foi gerada/manipulada por IA
   */
  static async validateImage(buffer: Buffer): Promise<ImageValidationResult> {
    const flags: string[] = [];
    let confidence = 100;

    try {
      // 1. Análise de metadados EXIF
      const metadata = await this.extractMetadata(buffer);
      
      // 2. Validação de tamanho de arquivo
      if (buffer.length < this.MIN_FILE_SIZE) {
        flags.push('FILE_TOO_SMALL');
        confidence -= 20;
      }
      
      if (buffer.length > this.MAX_FILE_SIZE) {
        flags.push('FILE_TOO_LARGE');
        confidence -= 10;
      }

      // 3. Validação de resolução
      if (metadata.width < this.MIN_RESOLUTION || metadata.height < this.MIN_RESOLUTION) {
        flags.push('RESOLUTION_TOO_LOW');
        confidence -= 25;
      }

      if (metadata.width > this.MAX_RESOLUTION || metadata.height > this.MAX_RESOLUTION) {
        flags.push('RESOLUTION_SUSPICIOUSLY_HIGH');
        confidence -= 15;
      }

      // 4. Verificação de metadados EXIF (imagens reais geralmente têm)
      if (!metadata.hasExif) {
        flags.push('NO_EXIF_DATA');
        confidence -= 30;
      }

      // 5. Verificação de GPS (importante para localização)
      if (!metadata.hasGPS) {
        flags.push('NO_GPS_DATA');
        confidence -= 20;
      }

      // 6. Detecção de software suspeito nos metadados
      if (metadata.software) {
        const softwareLower = metadata.software.toLowerCase();
        for (const pattern of this.SUSPICIOUS_PATTERNS) {
          if (softwareLower.includes(pattern)) {
            flags.push(`SUSPICIOUS_SOFTWARE: ${pattern}`);
            confidence -= 40;
          }
        }
      }

      // 7. Análise de padrões de IA (ausência de metadados de câmera)
      if (!metadata.device) {
        flags.push('NO_CAMERA_INFO');
        confidence -= 25;
      }

      // 8. Verificação de timestamp (muito importante)
      if (!metadata.timestamp) {
        flags.push('NO_TIMESTAMP');
        confidence -= 20;
      } else {
        // Verifica se o timestamp é muito antigo ou futuro
        const now = new Date();
        const timeDiff = Math.abs(now.getTime() - metadata.timestamp.getTime());
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
        
        if (daysDiff > 30) {
          flags.push('OLD_TIMESTAMP');
          confidence -= 15;
        }
        
        if (metadata.timestamp > now) {
          flags.push('FUTURE_TIMESTAMP');
          confidence -= 30;
        }
      }

      // 9. Análise de padrões de compressão
      const compressionAnalysis = await this.analyzeCompression(buffer);
      if (!compressionAnalysis.natural) {
        flags.push('UNNATURAL_COMPRESSION');
        confidence -= 25;
      }

      // 10. Detecção de artefatos de IA
      const aiArtifacts = await this.detectAIArtifacts(buffer);
      if (aiArtifacts.detected) {
        flags.push(`AI_ARTIFACTS: ${aiArtifacts.description}`);
        confidence -= 50;
      }

      // Confiança mínima para aprovar
      const isValid = confidence >= 50 && !flags.some(f => 
        f.includes('SUSPICIOUS_SOFTWARE') || 
        f.includes('AI_ARTIFACTS')
      );

      return {
        isValid,
        confidence: Math.max(0, confidence),
        flags,
        metadata,
      };

    } catch (error) {
      console.error('Erro ao validar imagem:', error);
      return {
        isValid: false,
        confidence: 0,
        flags: ['VALIDATION_ERROR'],
        metadata: {} as ImageMetadata,
      };
    }
  }

  /**
   * Extrai metadados completos da imagem
   */
  private static async extractMetadata(buffer: Buffer): Promise<ImageMetadata> {
    const image = sharp(buffer);
    const sharpMetadata = await image.metadata();
    
    const hash = createHash('sha256').update(buffer).digest('hex');

    // Extrair EXIF
    const exif = sharpMetadata.exif;
    const hasExif = !!exif && Object.keys(exif).length > 0;
    
    let hasGPS = false;
    let timestamp: Date | undefined;
    let device: string | undefined;
    let software: string | undefined;

    if (exif) {
      // Verificar GPS
      hasGPS = !!(exif as any).GPSLatitude || !!(exif as any).GPSLongitude;
      
      // Extrair timestamp
      const dateTimeOriginal = (exif as any).DateTimeOriginal;
      if (dateTimeOriginal) {
        timestamp = this.parseExifDate(dateTimeOriginal);
      }
      
      // Extrair informações do dispositivo
      device = (exif as any).Model || (exif as any).Make;
      software = (exif as any).Software;
    }

    return {
      format: sharpMetadata.format || 'unknown',
      width: sharpMetadata.width || 0,
      height: sharpMetadata.height || 0,
      hasExif,
      hasGPS,
      fileSize: buffer.length,
      hash,
      timestamp,
      device,
      software,
    };
  }

  /**
   * Analisa padrões de compressão da imagem
   */
  private static async analyzeCompression(buffer: Buffer): Promise<{ natural: boolean; reason?: string }> {
    try {
      const image = sharp(buffer);
      const stats = await image.stats();
      
      // Imagens de IA geralmente têm distribuição muito uniforme de cores
      const channels = stats.channels;
      
      // Calcular variância entre canais
      if (channels.length >= 3) {
        const meanVariance = channels.reduce((sum, ch) => sum + ch.mean, 0) / channels.length;
        const variance = channels.reduce((sum, ch) => sum + Math.pow(ch.mean - meanVariance, 2), 0) / channels.length;
        
        // Variância muito baixa pode indicar geração artificial
        if (variance < 10) {
          return { natural: false, reason: 'Distribuição de cores muito uniforme' };
        }
      }

      return { natural: true };
    } catch (error) {
      return { natural: true }; // Se não conseguir analisar, não penaliza
    }
  }

  /**
   * Detecta artefatos típicos de imagens geradas por IA
   */
  private static async detectAIArtifacts(buffer: Buffer): Promise<{ detected: boolean; description?: string }> {
    try {
      const image = sharp(buffer);
      const metadata = await image.metadata();
      
      // 1. Verificar se a imagem tem aspectos perfeitos (comum em IAs)
      if (metadata.width && metadata.height) {
        const aspectRatio = metadata.width / metadata.height;
        const commonRatios = [1.0, 1.5, 1.77, 2.0]; // 1:1, 3:2, 16:9, 2:1
        
        const isExactRatio = commonRatios.some(ratio => Math.abs(aspectRatio - ratio) < 0.001);
        const isDivisibleBy64 = metadata.width % 64 === 0 && metadata.height % 64 === 0;
        
        if (isExactRatio && isDivisibleBy64) {
          return { 
            detected: true, 
            description: 'Dimensões perfeitas típicas de IA (múltiplos de 64)' 
          };
        }
      }

      // 2. Analisar nitidez excessiva ou blur artificial
      const stats = await image.stats();
      
      // Imagens de IA podem ter nitidez muito alta e artificial
      const sharpnessScore = stats.channels.reduce((sum, ch) => sum + ch.stdev, 0) / stats.channels.length;
      
      if (sharpnessScore > 80) {
        return { 
          detected: true, 
          description: 'Nitidez artificial excessiva' 
        };
      }

      return { detected: false };
    } catch (error) {
      return { detected: false };
    }
  }

  /**
   * Parse de data EXIF
   */
  private static parseExifDate(dateString: string): Date | undefined {
    try {
      // Formato EXIF: "YYYY:MM:DD HH:MM:SS"
      const parts = dateString.split(' ');
      if (parts.length !== 2) return undefined;
      
      const dateParts = parts[0].split(':');
      const timeParts = parts[1].split(':');
      
      return new Date(
        parseInt(dateParts[0]),
        parseInt(dateParts[1]) - 1,
        parseInt(dateParts[2]),
        parseInt(timeParts[0]),
        parseInt(timeParts[1]),
        parseInt(timeParts[2])
      );
    } catch {
      return undefined;
    }
  }

  /**
   * Gera relatório de validação legível
   */
  static generateValidationReport(result: ImageValidationResult): string {
    let report = `Validação de Imagem\n`;
    report += `==================\n\n`;
    report += `Status: ${result.isValid ? '✅ APROVADA' : '❌ REJEITADA'}\n`;
    report += `Confiança: ${result.confidence}%\n\n`;
    
    if (result.flags.length > 0) {
      report += `Alertas:\n`;
      result.flags.forEach(flag => {
        report += `  - ${flag}\n`;
      });
      report += `\n`;
    }
    
    report += `Metadados:\n`;
    report += `  Formato: ${result.metadata.format}\n`;
    report += `  Resolução: ${result.metadata.width}x${result.metadata.height}\n`;
    report += `  Tamanho: ${(result.metadata.fileSize / 1024).toFixed(2)} KB\n`;
    report += `  EXIF: ${result.metadata.hasExif ? 'Presente' : 'Ausente'}\n`;
    report += `  GPS: ${result.metadata.hasGPS ? 'Presente' : 'Ausente'}\n`;
    
    if (result.metadata.timestamp) {
      report += `  Data: ${result.metadata.timestamp.toLocaleString()}\n`;
    }
    
    if (result.metadata.device) {
      report += `  Dispositivo: ${result.metadata.device}\n`;
    }
    
    if (result.metadata.software) {
      report += `  Software: ${result.metadata.software}\n`;
    }
    
    return report;
  }
}
