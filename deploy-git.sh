#!/bin/bash

echo "================================"
echo "  DEPLOY AUTOMÁTICO - DETRAN"
echo "================================"
echo ""
echo "Este script vai:"
echo "  1. Configurar Git"
echo "  2. Criar repositório"
echo "  3. Fazer push para GitHub"
echo "  4. Preparar para deploy"
echo ""
read -p "Pressione ENTER para continuar..."

# Configura Git
echo ""
echo "[1/4] Configurando Git..."
git config --global user.name "DetranDev"
git config --global user.email "dev@detran.com"

# Inicializa repositório
echo ""
echo "[2/4] Inicializando repositório..."
git init

# Adiciona arquivos
echo ""
echo "[3/4] Adicionando arquivos..."
git add .
git commit -m "Deploy inicial - DetranDenuncia v1.5.0"

# Instruções
echo ""
echo "[4/4] PRÓXIMOS PASSOS:"
echo ""
echo "1. Crie um repositório no GitHub:"
echo "   https://github.com/new"
echo "   Nome: detran-denuncia"
echo ""
echo "2. Execute os comandos:"
echo "   git remote add origin https://github.com/SEU-USUARIO/detran-denuncia.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Depois execute: ./deploy-completo.sh"
echo ""
read -p "Pressione ENTER para sair..."
