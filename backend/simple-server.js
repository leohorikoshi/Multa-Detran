const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`📨 ${req.method} ${req.url}`);
  
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', message: 'Server is running' }));
    return;
  }
  
  if (req.url === '/api/auth/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('✅ Conta criada:', data);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true,
          message: 'Usuário registrado com sucesso',
          user: {
            id: '123',
            name: data.name,
            email: data.email
          },
          token: 'fake-token-123'
        }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }
  
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(3000, '0.0.0.0', () => {
  console.log('🚀 Servidor HTTP simples rodando na porta 3000');
  console.log('📡 Teste: http://localhost:3000/health');
});
