// Mock data in memory for testing without MongoDB
export const users: any[] = [];
export const violations: any[] = [];

// Mock User model
export const MockUser = {
  async findOne(query: any) {
    return users.find(u => {
      if (query.email) return u.email === query.email;
      if (query.cpf) return u.cpf === query.cpf;
      return false;
    });
  },
  
  async findById(id: string) {
    return users.find(u => u._id === id || u.id === id);
  },
  
  async create(data: any) {
    const user = {
      _id: Date.now().toString(),
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(user);
    return user;
  }
};

// Mock Violation model
export const MockViolation = {
  async create(data: any) {
    const violation = {
      _id: Date.now().toString(),
      ...data,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    violations.push(violation);
    return violation;
  },
  
  async find(query: any = {}) {
    let results = violations;
    if (query.user) {
      results = results.filter(v => v.user === query.user);
    }
    return {
      sort: (_sortObj: any) => ({
        skip: (n: number) => ({
          limit: (l: number) => ({
            populate: () => results.slice(n, n + l)
          })
        }),
        exec: async () => results
      }),
      exec: async () => results
    };
  },
  
  async findById(id: string) {
    return violations.find(v => v._id === id);
  },
  
  async updateOne(query: any, update: any) {
    const violation = violations.find(v => v._id === query._id);
    if (violation && update.$set) {
      Object.assign(violation, update.$set);
      violation.updatedAt = new Date();
    }
    return { modifiedCount: violation ? 1 : 0 };
  },
  
  async countDocuments() {
    return violations.length;
  }
};

console.log('🧪 Usando dados em memória (sem MongoDB)');
