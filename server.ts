import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Proxy server is running" });
  });

  // Proxy endpoint to bypass CORS
  app.post("/api/proxy", async (req, res) => {
    const { url, method, headers, body } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      console.log(`[Proxy] ${method || 'GET'} -> ${url}`);
      
      const parsedUrl = new URL(url);
      const cleanUrl = parsedUrl.origin + parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
      
      const requestHeaders = { 
        ...(headers || {}),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'ngrok-skip-browser-warning': 'true',
      };
      
      if (parsedUrl.username && parsedUrl.password && !requestHeaders['Authorization']) {
        const auth = Buffer.from(`${parsedUrl.username}:${parsedUrl.password}`).toString('base64');
        requestHeaders['Authorization'] = `Basic ${auth}`;
      }
      
      const response = await fetch(cleanUrl, {
        method: method || "GET",
        headers: requestHeaders,
        body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
      });

      console.log(`[Proxy] Response: ${response.status} ${response.statusText}`);

      const contentType = response.headers.get("content-type");
      const text = await response.text();
      
      let data;
      let isJson = false;
      try {
        data = JSON.parse(text);
        isJson = true;
      } catch (e) {
        data = text;
      }

      // ALWAYS return 200 with a structured object so the frontend never fails to parse JSON
      res.status(200).json({
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        contentType,
        isJson,
        data
      });
    } catch (error: any) {
      console.error("Proxy error:", error);
      res.status(200).json({ 
        ok: false,
        error: error.message,
        status: 500,
        isJson: false,
        data: `Proxy failed to reach target: ${error.message}`
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
