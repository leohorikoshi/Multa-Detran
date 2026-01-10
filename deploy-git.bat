@echo off
echo ================================
echo   DEPLOY AUTOMATICO - DETRAN
echo ================================
echo.
echo Este script vai:
echo   1. Configurar Git
echo   2. Criar repositorio
echo   3. Fazer push para GitHub
echo   4. Preparar para deploy
echo.
pause

REM Configura Git
echo.
echo [1/4] Configurando Git...
git config --global user.name "DetranDev"
git config --global user.email "dev@detran.com"

REM Inicializa repositorio
echo.
echo [2/4] Inicializando repositorio...
cd /d "%~dp0"
git init

REM Adiciona arquivos
echo.
echo [3/4] Adicionando arquivos...
git add .
git commit -m "Deploy inicial - DetranDenuncia v1.5.0"

REM Instrucoes
echo.
echo [4/4] PROXIMOS PASSOS:
echo.
echo 1. Crie um repositorio no GitHub:
echo    https://github.com/new
echo    Nome: detran-denuncia
echo.
echo 2. Execute os comandos:
echo    git remote add origin https://github.com/SEU-USUARIO/detran-denuncia.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Depois execute: deploy-render.bat
echo.
pause
