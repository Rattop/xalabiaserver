import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Logs de todas as requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, "public")));

// Proxy para Jellyfin com logs detalhados
app.use(
  "/Jellyfin",
  createProxyMiddleware({
    target: "http://safety-after.gl.at.ply.gg:29795",
    changeOrigin: true,
    pathRewrite: (path, req) => {
      const newPath = path.replace(/^\/Jellyfin/, "/web");
      console.log(`[Jellyfin] Rewrite: ${path} -> ${newPath}`);
      return newPath;
    },
    ws: true,
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[Jellyfin Proxy] ${req.method} ${req.url}`);
      console.log(`[Jellyfin Target] ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`[Jellyfin Response] ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
      console.error("[Jellyfin Proxy Error]", err.message);
      res.status(502).json({
        error: "Bad Gateway",
        message: "Não foi possível conectar ao Jellyfin",
        details: err.message
      });
    }
  })
);

// Proxy para FileBrowser com logs detalhados
app.use(
  "/FileBrowser",
  createProxyMiddleware({
    target: "http://menu-ot.gl.at.ply.gg:20709",
    changeOrigin: true,
    pathRewrite: (path, req) => {
      const newPath = path.replace(/^\/FileBrowser/, "");
      console.log(`[FileBrowser] Rewrite: ${path} -> ${newPath || "/"}`);
      return newPath || "/";
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[FileBrowser Proxy] ${req.method} ${req.url}`);
      console.log(`[FileBrowser Target] ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`[FileBrowser Response] ${proxyRes.statusCode}`);
    },
    onError: (err, req, res) => {
      console.error("[FileBrowser Proxy Error]", err.message);
      res.status(502).json({
        error: "Bad Gateway",
        message: "Não foi possível conectar ao FileBrowser",
        details: err.message
      });
    }
  })
);

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      jellyfin: "http://safety-after.gl.at.ply.gg:29795",
      filebrowser: "http://menu-ot.gl.at.ply.gg:20709"
    }
  });
});

// Página de teste dos proxies
app.get("/test", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>XalabiaServer - Teste de Proxies</title>
      <style>
        body {
          background: #000;
          color: #00FF00;
          font-family: 'Courier New', monospace;
          padding: 20px;
        }
        .test-card {
          border: 2px solid #00FF00;
          padding: 20px;
          margin: 20px 0;
          background: rgba(0,255,0,0.1);
        }
        button {
          background: #00FF00;
          color: #000;
          border: none;
          padding: 10px 20px;
          cursor: pointer;
          font-family: 'Courier New', monospace;
          font-weight: bold;
          margin: 5px;
        }
        button:hover {
          background: #00FFFF;
        }
        #result {
          margin-top: 20px;
          padding: 10px;
          background: rgba(255,255,0,0.1);
          border-left: 3px solid #FFFF00;
          white-space: pre-wrap;
        }
      </style>
    </head>
    <body>
      <h1>🔧 XalabiaServer - Teste de Proxies</h1>
      
      <div class="test-card">
        <h2>Testar Conexões</h2>
        <button onclick="testService('/Jellyfin')">Testar Jellyfin</button>
        <button onclick="testService('/FileBrowser')">Testar FileBrowser</button>
        <button onclick="testService('/health')">Testar Health Check</button>
      </div>

      <div class="test-card">
        <h2>Links Diretos</h2>
        <a href="/Jellyfin" style="color: #00FFFF; display: block; margin: 5px 0;">Abrir Jellyfin</a>
        <a href="/FileBrowser" style="color: #00FFFF; display: block; margin: 5px 0;">Abrir FileBrowser</a>
        <a href="/" style="color: #00FFFF; display: block; margin: 5px 0;">Voltar ao Hub</a>
      </div>

      <div id="result"></div>

      <script>
        async function testService(url) {
          const result = document.getElementById('result');
          result.innerHTML = 'Testando ' + url + '...\\n';
          
          try {
            const response = await fetch(url);
            result.innerHTML += 'Status: ' + response.status + ' ' + response.statusText + '\\n';
            result.innerHTML += 'Headers:\\n';
            response.headers.forEach((value, key) => {
              result.innerHTML += '  ' + key + ': ' + value + '\\n';
            });
            
            if (response.ok) {
              result.innerHTML += '\\n✅ Conexão bem-sucedida!';
              result.style.borderColor = '#00FF00';
            } else {
              result.innerHTML += '\\n❌ Erro na conexão';
              result.style.borderColor = '#FF0000';
            }
          } catch (error) {
            result.innerHTML += '\\n❌ Erro: ' + error.message;
            result.style.borderColor = '#FF0000';
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 404 handler - deve estar DEPOIS de todas as outras rotas
app.use((req, res) => {
  console.log(`[404] Rota não encontrada: ${req.method} ${req.url}`);
  res.status(404).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>404 - XalabiaServer</title>
        <style>
          body {
            background: #000;
            color: #00FF00;
            font-family: 'Courier New', monospace;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            text-align: center;
          }
          h1 { font-size: 48px; text-shadow: 0 0 20px #00FF00; }
          a { color: #00FFFF; text-decoration: none; }
          a:hover { color: #FFFF00; }
          .debug { 
            margin-top: 20px; 
            padding: 10px; 
            background: rgba(255,0,0,0.1);
            border: 1px solid #FF0000;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div>
          <h1>404 - Página não encontrada</h1>
          <p>A página <code>${req.url}</code> não existe no XalabiaServer</p>
          <div class="debug">
            <p>Método: ${req.method}</p>
            <p>URL: ${req.url}</p>
            <p>Timestamp: ${new Date().toISOString()}</p>
          </div>
          <p style="margin-top: 20px;">
            <a href="/">← Voltar para o Hub</a> | 
            <a href="/test">Página de Testes</a>
          </p>
        </div>
      </body>
    </html>
  `);
});

// Error handler global
app.use((err, req, res, next) => {
  console.error("[Global Error]", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║     🎮 XalabiaServer Proxy rodando!               ║
║                                                    ║
║     Porta: ${PORT}                                  ║
║     Ambiente: ${process.env.NODE_ENV || 'production'}              ║
║                                                    ║
║     Rotas disponíveis:                            ║
║     • http://localhost:${PORT}/                     ║
║     • http://localhost:${PORT}/Jellyfin             ║
║     • http://localhost:${PORT}/FileBrowser          ║
║     • http://localhost:${PORT}/test                 ║
║     • http://localhost:${PORT}/health               ║
║                                                    ║
╚════════════════════════════════════════════════════╝
  `);
  
  console.log("\n[INFO] Proxies configurados:");
  console.log("  - Jellyfin: http://safety-after.gl.at.ply.gg:29795");
  console.log("  - FileBrowser: http://menu-ot.gl.at.ply.gg:20709");
  console.log("\n[INFO] Aguardando requisições...\n");
});
