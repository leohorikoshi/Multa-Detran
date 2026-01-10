import { Router, Request, Response } from 'express';
import { users } from '../mock-db';

const router = Router();

// GET /api/admin/users - Listar todos os usuários
router.get('/users', async (req: Request, res: Response) => {
  try {
    console.log('📥 Admin: Listando todos os usuários');
    console.log('Total de usuários no mock:', users.length);
    
    // Retornar usuários sem a senha
    const usersWithoutPassword = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json({
      status: 'success',
      data: usersWithoutPassword,
      total: usersWithoutPassword.length,
    });
  } catch (error: any) {
    console.error('❌ Erro ao listar usuários:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao listar usuários',
      error: error.message,
    });
  }
});

// GET /api/admin/users/:id - Buscar usuário por ID
router.get('/users/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = users.find(u => u._id === id || u.id === id);
    
    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'Usuário não encontrado',
      });
      return;
    }
    
    const { password, ...userWithoutPassword } = user;
    
    res.json({
      status: 'success',
      data: userWithoutPassword,
    });
  } catch (error: any) {
    console.error('❌ Erro ao buscar usuário:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao buscar usuário',
      error: error.message,
    });
  }
});

// DELETE /api/admin/users/:id - Deletar usuário
router.delete('/users/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userIndex = users.findIndex(u => u._id === id || u.id === id);
    
    if (userIndex === -1) {
      res.status(404).json({
        status: 'error',
        message: 'Usuário não encontrado',
      });
      return;
    }
    
    const deletedUser = users.splice(userIndex, 1)[0];
    const { password, ...userWithoutPassword } = deletedUser;
    
    res.json({
      status: 'success',
      message: 'Usuário deletado com sucesso',
      data: userWithoutPassword,
    });
  } catch (error: any) {
    console.error('❌ Erro ao deletar usuário:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao deletar usuário',
      error: error.message,
    });
  }
});

export default router;
