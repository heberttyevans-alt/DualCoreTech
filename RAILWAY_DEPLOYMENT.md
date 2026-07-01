# Guia de Deploy no Railway - DualCoreTech

## Problema Identificado
A aplicação estava crashando porque o módulo `sqlite3` precisa ser compilado para bindings nativos, e o Railway não estava fazendo isso corretamente.

## Solução Implementada

### 1. Arquivo `.nvmrc`
Especifica a versão do Node.js (v20) para garantir consistência

### 2. Arquivo `Dockerfile`
Garante que as dependências de build (python, make, g++) sejam instaladas antes de compilar os módulos nativos

### 3. Arquivo `.railwayignore`
Evita enviar arquivos desnecessários para o Railway

## Passos para Fazer Deploy no Railway

### No repositório local:
```bash
# Commit as mudanças
git add .nvmrc Dockerfile .railwayignore
git commit -m "fix: add railway deployment configuration"
git push origin main
```

### No Railway Dashboard:

1. **Se é o primeiro deploy:**
   - Vá para [railway.app](https://railway.app)
   - Clique em "New Project"
   - Selecione "Deploy from GitHub"
   - Conecte seu repositório `DualCoreTech`

2. **Configure as variáveis de ambiente:**
   - Vá para a aba "Variables"
   - Adicione as seguintes variáveis:
     - `PORT`: 3000
     - `SESSION_SECRET`: (uma string segura)
     - `ADMIN_EMAIL`: seu_email@exemplo.com
     - `ADMIN_SENHA`: uma_senha_forte
     - `ADMIN_NOME`: Seu Nome
     - `DATABASE_PATH`: (pode deixar vazio para usar o padrão)
     - Google OAuth (opcional):
       - `GOOGLE_CLIENT_ID`: seu_client_id
       - `GOOGLE_CLIENT_SECRET`: seu_client_secret
       - `GOOGLE_CALLBACK_URL`: https://seu-domain.railway.app/auth/google/callback

3. **Ativar o deploy automático:**
   - Na aba "Deploy", ative "Automatic Deploys"
   - Isso fará deploy automático sempre que houver push para `main`

4. **Acompanhar o deployment:**
   - Vá para a aba "Build Logs"
   - Procure por mensagens de sucesso

## Checklist de Verificação

- [ ] Arquivo `.nvmrc` está no repositório
- [ ] Arquivo `Dockerfile` está no repositório
- [ ] As variáveis de ambiente estão configuradas no Railway
- [ ] O `package.json` tem script `start: node servidor.js`
- [ ] O `Procfile` está correto: `web: node servidor.js`
- [ ] Todas as mudanças foram commitadas e pushadas para GitHub

## Troubleshooting

Se ainda houver problemas:

1. **Limpar cache do Railway:**
   - No Railway Dashboard, clique no seu projeto
   - Vá em "Settings" → "Redeploy"
   - Clique "Force Redeploy"

2. **Verificar logs em tempo real:**
   - Clique em "View Logs" no Railway Dashboard
   - Procure por erros específicos

3. **Testar localmente com Docker:**
   ```bash
   docker build -t dualcoretech .
   docker run -p 3000:3000 dualcoretech
   ```

## Notas Importantes

- O arquivo `database.sqlite` será criado no Railway na primeira execução
- A aplicação está usando SQLite, que funciona bem com Railway
- Certifique-se de que as variáveis de ambiente críticas estão definidas antes do deploy

Boa sorte com o deploy! 🚀
