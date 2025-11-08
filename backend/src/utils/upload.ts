import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Criar diretório de uploads se não existir
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: function (_req: Request, _file: Express.Multer.File, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req: Request, file: Express.Multer.File, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro de arquivos
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas'));
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5 // máximo de 5 arquivos
  }
});