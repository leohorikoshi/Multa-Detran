# Script de teste da API DetranDenuncia

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TESTE 1: Login Admin" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

$loginBody = @{
    email = "admin@detran.sp.gov.br"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/login' -Method Post -Body $loginBody -ContentType 'application/json'
    Write-Host "✅ Login bem-sucedido!" -ForegroundColor Green
    Write-Host "Token: $($loginResponse.data.token.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host "Nome: $($loginResponse.data.user.name)" -ForegroundColor Gray
    Write-Host "Email: $($loginResponse.data.user.email)" -ForegroundColor Gray
    Write-Host "Role: $($loginResponse.data.user.role)" -ForegroundColor Gray
    
    $token = $loginResponse.data.token
    
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "TESTE 2: Listar Denúncias (Admin)" -ForegroundColor Yellow
    Write-Host "========================================`n" -ForegroundColor Cyan
    
    $headers = @{
        'Authorization' = "Bearer $token"
        'Content-Type' = 'application/json'
    }
    
    $violations = Invoke-RestMethod -Uri 'http://localhost:3000/api/violations' -Method Get -Headers $headers
    Write-Host "✅ Denúncias carregadas!" -ForegroundColor Green
    Write-Host "Total: $($violations.data.total)" -ForegroundColor Gray
    Write-Host "Denúncias: $($violations.data.violations.Count)" -ForegroundColor Gray
    
    if ($violations.data.violations.Count -gt 0) {
        Write-Host "`nPrimeira denúncia:" -ForegroundColor Gray
        $first = $violations.data.violations[0]
        Write-Host "  ID: $($first._id)" -ForegroundColor Gray
        Write-Host "  Tipo: $($first.violationType)" -ForegroundColor Gray
        Write-Host "  Placa: $($first.plateNumber)" -ForegroundColor Gray
        Write-Host "  Status: $($first.status)" -ForegroundColor Gray
    }
    
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "TESTE 3: Login Usuário" -ForegroundColor Yellow
    Write-Host "========================================`n" -ForegroundColor Cyan
    
    $userLoginBody = @{
        email = "joao.silva@email.com"
        password = "user123"
    } | ConvertTo-Json
    
    $userResponse = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/login' -Method Post -Body $userLoginBody -ContentType 'application/json'
    Write-Host "✅ Login usuário bem-sucedido!" -ForegroundColor Green
    Write-Host "Nome: $($userResponse.data.user.name)" -ForegroundColor Gray
    Write-Host "Role: $($userResponse.data.user.role)" -ForegroundColor Gray
    
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "TODOS OS TESTES PASSARAM! ✅" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Green
    
} catch {
    Write-Host "❌ ERRO: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Detalhes: $($_.ErrorDetails.Message)" -ForegroundColor Red
}
