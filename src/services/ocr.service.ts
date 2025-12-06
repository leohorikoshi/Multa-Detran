import Tesseract from 'tesseract.js';

// Função para extrair texto de placa de imagem
export const extractPlateFromImage = async (imageUri: string): Promise<string | null> => {
  try {
    const { data: { text } } = await Tesseract.recognize(imageUri, 'por', {
      logger: (m) => console.log(m),
    });

    // Extrair apenas placas (formato brasileiro: ABC-1234 ou ABC1D234)
    const plateRegex = /[A-Z]{3}[-\s]?\d{1}[A-Z0-9]{1}\d{2}/g;
    const matches = text.match(plateRegex);
    
    if (matches && matches.length > 0) {
      return matches[0].replace(/[-\s]/g, '');
    }

    return null;
  } catch (error) {
    console.error('Erro ao processar OCR:', error);
    return null;
  }
};

// Validar formato de placa
export const validatePlate = (plate: string): boolean => {
  const plateRegex = /^[A-Z]{3}\d{1}[A-Z0-9]{1}\d{2}$/;
  return plateRegex.test(plate);
};
