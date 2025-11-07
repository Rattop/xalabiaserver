# 🎮 XalabiaServer - Proxy Reverso HTTPS

Portal principal do XalabiaServer com proxy reverso para acesso HTTPS seguro aos serviços HTTP.

## 📁 Estrutura do Projeto

```
xalabiaserver/
├── server.js           # Servidor Express com proxy
├── package.json        # Dependências do Node.js
├── public/            # Arquivos estáticos
│   └── index.html     # Página principal do hub
└── README.md          # Este arquivo
```

## 🚀 Como Configurar

### 1. Criar a Estrutura Local

```bash
# Criar diretório do projeto
mkdir xalabiaserver
cd xalabiaserver

# Criar pasta public
mkdir public

# Copiar os arquivos:
# - server.js na raiz
# - package.json na raiz
# - index.html dentro de public/
```

### 2. Instalar Dependências Localmente (Opcional)

```bash
npm install
```

### 3. Testar Localmente

```bash
# Iniciar o servidor
npm start

# Acessar no navegador:
# http://localhost:10000
# http://localhost:10000/Jellyfin
# http://localhost:10000/FileBrowser
```

## 🌐 Deploy no Render

### Opção 1: Via GitHub (Recomendado)

1. **Criar repositório no GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - XalabiaServer Proxy"
   git branch -M main
   git remote add origin https://github.com/seu-usuario/xalabiaserver.git
   git push -u origin main
   ```

2. **Configurar no Render**
   - Acesse [render.com](https://render.com)
   - Clique em "New +" → "Web Service"
   - Conecte seu repositório GitHub
   - Configure:
     - **Name:** xalabiaserver (ou qualquer nome)
     - **Environment:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Plan:** Free (ou o que preferir)

3. **Deploy automático** - Render irá fazer deploy automaticamente!

### Opção 2: Via CLI do Render

```bash
# Instalar Render CLI
npm install -g @render/cli

# Login no Render
render login

# Deploy direto
render deploy
```

### Opção 3: Deploy Manual (Git diretamente no Render)

1. No Render, crie um novo Web Service
2. Escolha "Deploy from Git"
3. Cole a URL do seu repositório
4. Configure conforme Opção 1

## ⚙️ Variáveis de Ambiente

O servidor usa a variável `PORT` automaticamente fornecida pelo Render. Não é necessário configurar nada adicional.

## 🔧 Configuração dos Proxies

Os proxies estão configurados em `server.js`:

- **Jellyfin:** `/Jellyfin` → `http://safety-after.gl.at.ply.gg:29795/web`
- **FileBrowser:** `/FileBrowser` → `http://menu-ot.gl.at.ply.gg:20709`

### Para adicionar novos serviços:

```javascript
app.use(
  "/NovoServico",
  createProxyMiddleware({
    target: "http://seu-servidor.com:porta",
    changeOrigin: true,
    pathRewrite: { "^/NovoServico": "/caminho" },
    ws: true // Se precisar de WebSocket
  })
);
```

## 🎯 URLs de Acesso

Após o deploy no Render:

- **Hub Principal:** `https://xalabiaserver.onrender.com/`
- **Jellyfin:** `https://xalabiaserver.onrender.com/Jellyfin`
- **FileBrowser:** `https://xalabiaserver.onrender.com/FileBrowser`

## 🐛 Troubleshooting

### Problema: Serviço não carrega
- Verifique se os URLs HTTP originais estão acessíveis
- Confira os logs do Render: Dashboard → Logs
- Teste localmente primeiro: `npm start`

### Problema: WebSocket não funciona
- Certifique-se que `ws: true` está no proxy
- Jellyfin especialmente precisa disso para streaming

### Problema: CORS errors
- Já configurado `changeOrigin: true` nos proxies
- Se persistir, pode ser necessário configurar headers adicionais

### Problema: Render hiberna (plano gratuito)
- Plano gratuito hiberna após 15 min de inatividade
- Primeira requisição após hibernação leva ~30s
- Considere upgrade ou use serviço de "keep-alive"

## 🔒 Segurança

- ✅ Todo tráfego via HTTPS (Render fornece certificado SSL gratuito)
- ✅ Servidores HTTP originais não precisam ser expostos publicamente
- ⚠️ Mantenha credenciais FTP e senhas em segredo
- ⚠️ Links devem ser compartilhados apenas com pessoas autorizadas

## 📊 Monitoramento

Para ver os logs em tempo real no Render:
1. Dashboard → Seu serviço
2. Aba "Logs"
3. Logs mostram todas requisições proxy

## 🎨 Personalização

### Alterar visual do hub:
Edite `public/index.html` - CSS inline está tudo lá!

### Adicionar/remover serviços:
1. Edite `server.js` para proxies
2. Edite `public/index.html` para cards visuais
3. Commit e push - Render faz deploy automático

## 💡 Dicas

- **Performance:** Proxy adiciona ~50-200ms de latência
- **Custo:** Plano Free do Render é suficiente para uso pessoal
- **Uptime:** Monitoramento gratuito via UptimeRobot
- **Domínio:** Pode conectar domínio próprio no Render

## 🤝 Suporte

Problemas? Me chama no WhatsApp/Discord!

## 📝 Licença

MIT - Use como quiser! 🍺

---

**Powered by Linux, Desemprego e Muito Café ☕**