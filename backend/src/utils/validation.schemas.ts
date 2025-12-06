import { z } from 'zod';

// Esquema de validação para registro
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    cpf: z.string().regex(/^\d{11}$/, 'CPF deve conter 11 dígitos'),
  })
});

// Esquema de validação para login
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  })
});

// Esquema de validação para denúncias
export const violationSchema = z.object({
  body: z.object({
    violationType: z.string().min(1, 'Tipo de infração é obrigatório'),
    description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
    location: z.object({
      latitude: z.number(),
      longitude: z.number(),
      address: z.string().optional(),
    }),
    plateNumber: z.string().optional(),
  })
});

// Esquema de validação para atualização de status
export const statusUpdateSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'reviewing', 'approved', 'rejected']),
    reviewNotes: z.string().optional(),
  })
});