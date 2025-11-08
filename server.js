import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Servir arquivos estáticos (seu HTML, CSS, etc)
app.use(express.static("public"));

// Proxy para Jellyfin
app.use(
  "/Jellyfin",
  createProxyMiddleware({
    target: "http://safety-after.gl.at.ply.gg:29795",
    changeOrigin: true,
    pathRewrite: { "^/Jellyfin": "/web" },
    ws: true, // Suporte para WebSockets
    onProxyReq: (proxyReq, req, res) => {
      // Log para debug
      console.log(`[Jellyfin Proxy] ${req.method} ${req.url} -> ${proxyReq.path}`);
    },
    onError: (err, req, res) => {
      console.error("[Jellyfin Proxy Error]", err);
      res.status(500).send("Erro ao conectar com Jellyfin");
    }
  })
);

// Proxy para FileBrowser
app.use(
  "/FileBrowser",
  createProxyMiddleware({
    target: "http://menu-ot.gl.at.ply.gg:20709/login?redirect=/files/",
    changeOrigin: true,
    pathRewrite: { "^/FileBrowser": "" },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[FileBrowser Proxy] ${req.method} ${req.url} -> ${proxyReq.path}`);
    },
    onError: (err, req, res) => {
      console.error("[FileBrowser Proxy Error]", err);
      res.status(500).send("Erro ao conectar com FileBrowser");
    }
  })
);

// Rota de health check para o Render
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Rota principal - serve o index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Tratamento de erros 404
app.use((req, res) => {
  res.status(404).send(`
    <html>
      <head>
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
        </style>
      </head>
      <body>
        <div>
          <h1>404 - Página não encontrada</h1>
          <p>A página que você procura não existe no XalabiaServer</p>
          <p><a href="/">← Voltar para o Hub</a></p>
        </div>
      </body>
    </html>
  `);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║     🎮 XalabiaServer Proxy rodando com sucesso!   ║
║                                                    ║
║     Porta: ${PORT}                                  ║
║     Hub: http://localhost:${PORT}                   ║
║     Jellyfin: http://localhost:${PORT}/Jellyfin     ║
║     FileBrowser: http://localhost:${PORT}/FileBrowser║
║                                                    ║
╚════════════════════════════════════════════════════╝
  `);
});
