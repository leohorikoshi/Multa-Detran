import { Request, Response } from 'express';

export type AsyncController = (req: Request, res: Response) => Promise<Response>;

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

export const createResponse = <T>(
  success: boolean,
  data?: T,
  message?: string
): ApiResponse<T> => ({
  status: success ? 'success' : 'error',
  ...(data && { data }),
  ...(message && { message })
});