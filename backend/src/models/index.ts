// Wrapper para usar dados mockados em modo de teste
import { User as MongooseUser } from './user.model';
import { Violation as MongooseViolation } from './violation.model';
import { MockUser, MockViolation } from '../mock-db';

// Usa mock se não estiver conectado ao MongoDB
const USE_MOCK = process.env.USE_MOCK_DB === 'true' || process.env.NODE_ENV === 'test-no-db';

export const User = USE_MOCK ? MockUser : MongooseUser;
export const Violation = USE_MOCK ? MockViolation : MongooseViolation;

if (USE_MOCK) {
  console.log('📦 Usando modelos mockados (sem MongoDB)');
}
