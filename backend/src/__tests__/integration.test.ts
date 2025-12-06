import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../index-test';
import { User } from '../models/user.model';
import { Violation } from '../models/violation.model';

describe('Integration Tests - Complete Flow', () => {
  let authToken: string;
  let violationId: string;
  let adminToken: string;

  beforeAll(async () => {
    // Conectar ao MongoDB de teste
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/detran-test');
    }
  });

  afterAll(async () => {
    // Limpar dados de teste
    await User.deleteMany({ email: /test-integration/ });
    await Violation.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Fluxo 1: Registro e Autenticação de Usuário', () => {
    const newUser = {
      name: 'Teste Integração',
      email: 'test-integration@example.com',
      password: 'senha123456',
      cpf: '12345678901'
    };

    it('deve registrar um novo usuário com sucesso', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(201);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toMatchObject({
        name: newUser.name,
        email: newUser.email,
        cpf: newUser.cpf,
        role: 'user'
      });

      authToken = response.body.data.token;
    });

    it('deve rejeitar registro com email duplicado', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(400);

      expect(response.body).toHaveProperty('status', 'error');
      expect(response.body.message).toContain('já cadastrado');
    });

    it('deve fazer login com credenciais válidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: newUser.email,
          password: newUser.password
        })
        .expect(200);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe(newUser.email);
    });

    it('deve rejeitar login com senha incorreta', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: newUser.email,
          password: 'senhaerrada'
        })
        .expect(401);

      expect(response.body).toHaveProperty('status', 'error');
    });

    it('deve acessar perfil com token válido', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.user).toMatchObject({
        email: newUser.email,
        name: newUser.name
      });
    });

    it('deve rejeitar acesso sem token', async () => {
      await request(app)
        .get('/api/auth/profile')
        .expect(401);
    });
  });

  describe('Fluxo 2: Criação e Gerenciamento de Denúncias', () => {
    const newViolation = {
      violationType: 'speeding',
      description: 'Veículo em alta velocidade na zona escolar',
      plateNumber: 'ABC-1234',
      location: {
        latitude: -23.5505,
        longitude: -46.6333,
        address: 'Av. Paulista, 1000'
      }
    };

    it('deve criar uma denúncia sem foto', async () => {
      const response = await request(app)
        .post('/api/violations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newViolation)
        .expect(201);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.data.violation).toMatchObject({
        violationType: newViolation.violationType,
        description: newViolation.description,
        plateNumber: newViolation.plateNumber,
        status: 'pending'
      });

      violationId = response.body.data.violation._id;
    });

    it('deve rejeitar criação sem autenticação', async () => {
      await request(app)
        .post('/api/violations')
        .send(newViolation)
        .expect(401);
    });

    it('deve rejeitar criação com dados inválidos', async () => {
      await request(app)
        .post('/api/violations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          violationType: 'invalid',
          description: 'abc'  // muito curto
        })
        .expect(400);
    });

    it('deve listar denúncias do usuário', async () => {
      const response = await request(app)
        .get('/api/violations/my')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.data.violations).toBeInstanceOf(Array);
      expect(response.body.data.violations.length).toBeGreaterThan(0);
    });

    it('deve buscar denúncia por ID', async () => {
      const response = await request(app)
        .get(`/api/violations/${violationId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.violation).toMatchObject({
        _id: violationId,
        violationType: newViolation.violationType
      });
    });

    it('deve rejeitar busca de denúncia inexistente', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/api/violations/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('Fluxo 3: Gerenciamento Administrativo', () => {
    const adminUser = {
      name: 'Admin Teste',
      email: 'test-integration-admin@example.com',
      password: 'admin123456',
      cpf: '11122233344',
      role: 'admin'
    };

    beforeAll(async () => {
      // Criar usuário admin manualmente
      const hashedPassword = await require('bcryptjs').hash(adminUser.password, 10);
      const admin = await User.create({
        ...adminUser,
        password: hashedPassword
      });

      // Fazer login como admin
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: adminUser.email,
          password: adminUser.password
        });

      adminToken = response.body.data.token;
    });

    it('admin deve listar todas as denúncias', async () => {
      const response = await request(app)
        .get('/api/violations')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.violations).toBeInstanceOf(Array);
    });

    it('admin deve aprovar denúncia', async () => {
      const response = await request(app)
        .patch(`/api/violations/${violationId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'approved',
          reviewNotes: 'Denúncia válida, será processada'
        })
        .expect(200);

      expect(response.body.data.violation.status).toBe('approved');
      expect(response.body.data.violation.reviewNotes).toBe('Denúncia válida, será processada');
    });

    it('admin deve rejeitar denúncia', async () => {
      const response = await request(app)
        .patch(`/api/violations/${violationId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'rejected',
          reviewNotes: 'Falta de evidências'
        })
        .expect(200);

      expect(response.body.data.violation.status).toBe('rejected');
    });

    it('usuário comum não deve poder alterar status', async () => {
      await request(app)
        .patch(`/api/violations/${violationId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'approved'
        })
        .expect(403);
    });
  });

  describe('Fluxo 4: Validações de Segurança', () => {
    it('deve rejeitar token inválido', async () => {
      await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer token_invalido')
        .expect(401);
    });

    it('deve rejeitar token expirado (simulado)', async () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjAwMDAwMDAwLCJleHAiOjE2MDAwMDAwMDF9.invalid';
      
      await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);
    });

    it('deve sanitizar entrada de dados', async () => {
      const maliciousInput = {
        violationType: 'speeding',
        description: '<script>alert("xss")</script>',
        plateNumber: 'ABC-1234',
        location: {
          latitude: -23.5505,
          longitude: -46.6333
        }
      };

      const response = await request(app)
        .post('/api/violations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(maliciousInput)
        .expect(201);

      // Verificar que o script não foi executado
      expect(response.body.data.violation.description).not.toContain('<script>');
    });
  });

  describe('Fluxo 5: Performance e Limites', () => {
    it('deve processar requisições em tempo aceitável', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/api/violations/my')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(responseTime).toBeLessThan(2000); // < 2 segundos
    });

    it('deve lidar com múltiplas requisições simultâneas', async () => {
      const promises = Array(10).fill(null).map(() =>
        request(app)
          .get('/api/violations/my')
          .set('Authorization', `Bearer ${authToken}`)
      );

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });

    it('deve validar tamanho máximo de descrição', async () => {
      const longDescription = 'A'.repeat(1000); // 1000 caracteres

      await request(app)
        .post('/api/violations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          violationType: 'speeding',
          description: longDescription,
          plateNumber: 'ABC-1234',
          location: {
            latitude: -23.5505,
            longitude: -46.6333
          }
        })
        .expect(400);
    });
  });

  describe('Fluxo 6: Casos de Uso Completos', () => {
    it('Cenário: Cidadão registra, reporta e acompanha denúncia', async () => {
      // 1. Novo cidadão se registra
      const citizen = {
        name: 'João Cidadão',
        email: 'joao.test-integration@example.com',
        password: 'senha123456',
        cpf: '55566677788'
      };

      const registerRes = await request(app)
        .post('/api/auth/register')
        .send(citizen)
        .expect(201);

      const citizenToken = registerRes.body.data.token;

      // 2. Reporta uma infração
      const violation = {
        violationType: 'parking',
        description: 'Veículo estacionado em local proibido há 2 horas',
        plateNumber: 'XYZ-5678',
        location: {
          latitude: -23.5505,
          longitude: -46.6333,
          address: 'Rua Augusta, 500'
        }
      };

      const createRes = await request(app)
        .post('/api/violations')
        .set('Authorization', `Bearer ${citizenToken}`)
        .send(violation)
        .expect(201);

      const newViolationId = createRes.body.data.violation._id;

      // 3. Verifica suas denúncias
      const listRes = await request(app)
        .get('/api/violations/my')
        .set('Authorization', `Bearer ${citizenToken}`)
        .expect(200);

      expect(listRes.body.data.violations).toHaveLength(1);

      // 4. Admin analisa e aprova
      await request(app)
        .patch(`/api/violations/${newViolationId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'reviewing',
          reviewNotes: 'Em análise'
        })
        .expect(200);

      // 5. Cidadão consulta status atualizado
      const statusRes = await request(app)
        .get(`/api/violations/${newViolationId}`)
        .set('Authorization', `Bearer ${citizenToken}`)
        .expect(200);

      expect(statusRes.body.data.violation.status).toBe('reviewing');
    });
  });
});
