#!/bin/bash

set -e

echo "🏠 Iniciando deployment local..."

# Navegar para o diretório do projeto
cd "$(dirname "$0")/../filme-tmdb"

echo "📦 Instalando dependências..."
npm ci

echo "🔍 Executando linting..."
npm run lint

echo "🏗️ Construindo aplicação..."
npm run build

echo "🌐 Iniciando servidor de preview..."
echo "📍 A aplicação estará disponível em: http://localhost:4173"
echo "💡 Pressione Ctrl+C para parar o servidor"

npm run preview