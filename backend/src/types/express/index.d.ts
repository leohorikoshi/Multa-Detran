declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      _id: string;  // Mantendo compatibilidade com Mongoose
      role: string;
      name: string;
      email: string;
    };
    processedImages?: string[];
  }
}