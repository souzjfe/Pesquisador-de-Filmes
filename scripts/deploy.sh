#!/bin/bash

set -e

echo "🚀 Iniciando processo de deployment..."

# Verificar se as variáveis de ambiente necessárias estão definidas
if [ -z "$DEPLOY_URL" ]; then
    echo "❌ Erro: DEPLOY_URL não está definida"
    exit 1
fi

if [ -z "$DEPLOY_TOKEN" ]; then
    echo "❌ Erro: DEPLOY_TOKEN não está definida"
    exit 1
fi

# Definir diretórios
DIST_DIR="./dist"
BACKUP_DIR="./backup-$(date +%Y%m%d-%H%M%S)"

echo "📁 Verificando diretório de build..."
if [ ! -d "$DIST_DIR" ]; then
    echo "❌ Erro: Diretório de build não encontrado em $DIST_DIR"
    exit 1
fi

echo "📦 Compactando arquivos para deployment..."
cd "$DIST_DIR"
tar -czf ../deploy.tar.gz .
cd ..

echo "🔍 Verificando integridade do arquivo compactado..."
if [ ! -f "deploy.tar.gz" ]; then
    echo "❌ Erro: Falha ao criar arquivo de deployment"
    exit 1
fi

echo "📊 Tamanho do arquivo de deployment: $(ls -lh deploy.tar.gz | awk '{print $5}')"

# Simular deployment (substituir por comando real de deployment)
echo "🌐 Realizando deployment para $DEPLOY_URL..."

# Exemplo para diferentes tipos de deployment:

# Para FTP/SFTP:
# sftp -i ~/.ssh/deploy_key user@server << EOF
# put deploy.tar.gz
# bye
# EOF

# Para rsync:
# rsync -avz --delete $DIST_DIR/ user@server:/path/to/deployment/

# Para AWS S3:
# aws s3 sync $DIST_DIR s3://bucket-name/ --delete

# Para Netlify:
# curl -H "Content-Type: application/zip" \
#      -H "Authorization: Bearer $DEPLOY_TOKEN" \
#      --data-binary "@deploy.tar.gz" \
#      https://api.netlify.com/api/v1/sites/site-id/deploys

# Para Vercel:
# vercel --token $DEPLOY_TOKEN --prod

# Exemplo genérico usando curl para API de deployment
curl -X POST \
  -H "Authorization: Bearer $DEPLOY_TOKEN" \
  -H "Content-Type: application/octet-stream" \
  --data-binary "@deploy.tar.gz" \
  "$DEPLOY_URL/deploy" \
  -w "\nHTTP Status: %{http_code}\n" \
  -o deployment-response.json

# Verificar se o deployment foi bem-sucedido
if [ $? -eq 0 ]; then
    echo "✅ Deployment realizado com sucesso!"
    
    # Mostrar resposta do servidor se disponível
    if [ -f "deployment-response.json" ]; then
        echo "📄 Resposta do servidor:"
        cat deployment-response.json
        echo ""
    fi
    
    # Limpeza
    echo "🧹 Limpando arquivos temporários..."
    rm -f deploy.tar.gz deployment-response.json
    
    echo "🎉 Deployment concluído com sucesso!"
else
    echo "❌ Erro durante o deployment"
    
    # Mostrar logs de erro se disponível
    if [ -f "deployment-response.json" ]; then
        echo "📄 Resposta de erro do servidor:"
        cat deployment-response.json
        echo ""
    fi
    
    exit 1
fi

# Verificação pós-deployment (opcional)
echo "🔍 Verificando se a aplicação está online..."
sleep 10

# Fazer uma verificação básica de saúde
HEALTH_CHECK_URL="${DEPLOY_URL}/health"
if command -v curl &> /dev/null; then
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_CHECK_URL" || echo "000")
    
    if [ "$HTTP_STATUS" = "200" ]; then
        echo "✅ Aplicação está online e respondendo"
    else
        echo "⚠️ Aviso: Aplicação pode não estar respondendo corretamente (HTTP $HTTP_STATUS)"
    fi
fi

echo "🏁 Processo de deployment finalizado!"