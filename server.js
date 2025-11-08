import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Log TODAS as requisições
app.use((req, res, next) => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║ [${new Date().toISOString()}]
║ Método: ${req.method}
║ URL: ${req.url}
║ Headers: ${JSON.stringify(req.headers, null, 2)}
╚═══════════════════════════════════════════════════╝
  `);
  next();
});

// Proxy Jellyfin (reverse proxy transparente)
app.use("/Jellyfin", createProxyMiddleware({
  target: "http://safety-after.gl.at.ply.gg:29795",
  changeOrigin: true,
  secure: false,
  ws: true,
  pathRewrite: { "^/Jellyfin": "/web" },
  logLevel: "debug",
  onProxyReq: (proxyReq, req) => {
    console.log(`✅ [Jellyfin Proxy] ${req.method} ${req.url} -> ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
  },
  onError: (err, req, res) => {
    console.error(`❌ [Jellyfin Error]`, err.message);
    if (!res.headersSent) {
      res.status(502).send(`Erro ao conectar ao Jellyfin: ${err.message}`);
    }
  }
}));

// Proxy FileBrowser (reverse proxy transparente)
app.use("/FileBrowser", createProxyMiddleware({
  target: "http://menu-ot.gl.at.ply.gg:20709",
  changeOrigin: true,
  secure: false,
  pathRewrite: { "^/FileBrowser": "" },
  logLevel: "debug",
  onProxyReq: (proxyReq, req) => {
    console.log(`✅ [FileBrowser Proxy] ${req.method} ${req.url} -> ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
  },
  onError: (err, req, res) => {
    console.error(`❌ [FileBrowser Error]`, err.message);
    if (!res.headersSent) {
      res.status(502).send(`Erro ao conectar ao FileBrowser: ${err.message}`);
    }
  }
}));

// Health check JSON
app.get("/health", (req, res) => {
  console.log("✅ Health check OK");
  res.json({ 
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: "XalabiaServer está funcionando!"
  });
});

// Página de debug
app.get("/debug", (req, res) => {
  console.log("✅ Debug page requested");
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Debug - XalabiaServer</title>
      <style>
        body { background: #000; color: #0f0; font-family: monospace; padding: 20px; }
        h1 { color: #0ff; }
        pre { background: #111; padding: 10px; border: 1px solid #0f0; }
        a { color: #ff0; }
      </style>
    </head>
    <body>
      <h1>🔧 XalabiaServer Debug</h1>
      <h2>Informações do Servidor</h2>
      <pre>
Node Version: ${process.version}
Platform: ${process.platform}
Uptime: ${process.uptime()}s
Diretório: ${__dirname}
      </pre>
      
      <h2>Arquivos no Diretório</h2>
      <pre id="files">Carregando...</pre>
      
      <h2>Testes</h2>
      <button onclick="fetch('/health').then(r=>r.json()).then(d=>alert(JSON.stringify(d,null,2)))">Testar /health</button>
      <button onclick="window.location.href='/Jellyfin'">Testar /Jellyfin</button>
      <button onclick="window.location.href='/FileBrowser'">Testar /FileBrowser</button>
      
      <h2>Links</h2>
      <a href="/">Voltar ao Hub</a>
      
      <script>
        fetch('/api/files')
          .then(r => r.json())
          .then(d => document.getElementById('files').textContent = JSON.stringify(d, null, 2))
          .catch(e => document.getElementById('files').textContent = 'Erro: ' + e);
      </script>
    </body>
    </html>
  `);
});

// API para listar arquivos (debug)
app.get("/api/files", async (req, res) => {
  try {
    const { readdirSync } = await import("fs");
    const files = readdirSync(__dirname);
    console.log("✅ Arquivos listados:", files);
    res.json({ 
      directory: __dirname,
      files: files
    });
  } catch (error) {
    console.error("❌ Erro ao listar arquivos:", error);
    res.status(500).json({ error: error.message });
  }
});

// Servir index.html na raiz
app.get("/", (req, res) => {
  try {
    const indexPath = join(__dirname, "index.html");
    console.log(`✅ Tentando servir: ${indexPath}`);
    
    const html = readFileSync(indexPath, "utf8");
    console.log(`✅ Arquivo lido com sucesso! Tamanho: ${html.length} bytes`);
    
    res.type("html").send(html);
  } catch (error) {
    console.error(`❌ ERRO ao servir index.html:`, error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>body{background:#000;color:#f00;font-family:monospace;padding:50px;}</style>
      </head>
      <body>
        <h1>❌ ERRO: index.html não encontrado</h1>
        <p>Caminho procurado: ${join(__dirname, "index.html")}</p>
        <p>Erro: ${error.message}</p>
        <p><a href="/debug" style="color:#0ff;">Ver página de debug</a></p>
      </body>
      </html>
    `);
  }
});

// 404 Handler
app.use((req, res) => {
  console.log(`❌ [404] Não encontrado: ${req.method} ${req.url}`);
  res.status(404).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>body{background:#000;color:#0f0;font-family:monospace;text-align:center;padding:50px;}</style>
    </head>
    <body>
      <h1>404 - Não encontrado</h1>
      <p>URL: ${req.url}</p>
      <p><a href="/" style="color:#0ff;">← Voltar</a> | <a href="/debug" style="color:#ff0;">Debug</a></p>
    </body>
    </html>
  `);
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("❌ [ERRO GLOBAL]", err);
  res.status(500).json({ 
    error: "Internal Server Error",
    message: err.message 
  });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║     🎮 XalabiaServer está RODANDO!                ║
║                                                    ║
║     Porta: ${PORT}                                  ║
║     Diretório: ${__dirname}
║                                                    ║
║     📍 URLs Disponíveis:                          ║
║     • http://localhost:${PORT}/                     ║
║     • http://localhost:${PORT}/debug                ║
║     • http://localhost:${PORT}/health               ║
║     • http://localhost:${PORT}/Jellyfin             ║
║     • http://localhost:${PORT}/FileBrowser          ║
║                                                    ║
╚════════════════════════════════════════════════════╝
  `);
  
  console.log("\n✅ Servidor iniciado com sucesso!");
  console.log("✅ Aguardando requisições...\n");
});
