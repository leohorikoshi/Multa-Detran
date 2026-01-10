const http = require('http');

const createTestAccount = async () => {
  const postData = JSON.stringify({
    name: 'Teste Usuario',
    email: 'teste@teste.com',
    cpf: '12345678901',
    password: '123456'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log('🔄 Criando conta teste...');

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log('✅ Conta criada com sucesso!');
        console.log('📧 Email: teste@teste.com');
        console.log('🔑 Senha: 123456');
        console.log('\nDados retornados:', JSON.parse(data));
      } else {
        console.error('❌ Erro:', JSON.parse(data));
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Erro de requisição:', error.message);
    console.error('Código:', error.code);
    console.error('Stack:', error.stack);
  });

  req.write(postData);
  req.end();
};

createTestAccount();
