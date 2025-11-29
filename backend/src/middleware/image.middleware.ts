import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { IMAGE_CONFIG } from '../config/image.config';

interface ValidationError {
  file: string;
  error: string;
}

declare global {
  namespace Express {
    interface Request {
      processedImages?: string[];
    }
  }
}

export const processImages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      return res.status(400).json({
        status: 'error',
        message: 'Nenhuma imagem enviada'
      });
    }

    if (req.files.length > IMAGE_CONFIG.maxFiles) {
      return res.status(400).json({
        status: 'error',
        message: `Máximo de ${IMAGE_CONFIG.maxFiles} imagens permitido`
      });
    }

    const validationErrors: ValidationError[] = [];
    const processedFiles: string[] = [];

    for (const file of req.files as Express.Multer.File[]) {
      // Validar tipo de arquivo
      if (!IMAGE_CONFIG.allowedTypes.includes(file.mimetype)) {
        validationErrors.push({
          file: file.originalname,
          error: 'Tipo de arquivo não permitido'
        });
        continue;
      }

      // Validar tamanho
      if (file.size > IMAGE_CONFIG.maxSize) {
        validationErrors.push({
          file: file.originalname,
          error: 'Arquivo muito grande'
        });
        continue;
      }

      const filename = file.filename;
      const filepath = file.path;
      const outputFilename = `processed-${filename}`;
      const outputPath = path.join(path.dirname(filepath), outputFilename);

      try {
        // Verificar dimensões da imagem
        const metadata = await sharp(filepath).metadata();
        if (
          metadata.width && metadata.width > IMAGE_CONFIG.maxDimensions.width ||
          metadata.height && metadata.height > IMAGE_CONFIG.maxDimensions.height
        ) {
          validationErrors.push({
            file: file.originalname,
            error: 'Dimensões da imagem muito grandes'
          });
          continue;
        }

        // Processar imagem
        await sharp(filepath)
          .resize(IMAGE_CONFIG.maxDimensions.width, IMAGE_CONFIG.maxDimensions.height, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({
            quality: IMAGE_CONFIG.outputQuality,
            progressive: true
          })
          .withMetadata()
          .toFile(outputPath);

        // Remover arquivo original
        await fs.unlink(filepath);
        processedFiles.push(outputFilename);
      } catch (processError) {
        validationErrors.push({
          file: file.originalname,
          error: 'Erro ao processar imagem'
        });
        continue;
      }
    }

    // Se houver erros, retornar todos eles
    if (validationErrors.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Erros ao processar imagens',
        errors: validationErrors
      });
    }

    // Se nenhuma imagem foi processada com sucesso
    if (processedFiles.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Nenhuma imagem foi processada com sucesso'
      });
    }

    // Atualizar req.files com os novos nomes de arquivo
    req.processedImages = processedFiles;
    next();
  } catch (error) {
    next(error);
  }
};