// Tiny static server for previewing the guidelines (no dependencies).
// Usage: node scripts/serve.mjs [port]  → http://127.0.0.1:4173/guidelines/
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { root } from "./lib/system.mjs";

const port = Number(process.argv[2] || 4173);
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".pdf": "application/pdf" };

http
  .createServer((req, res) => {
    let rel = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (rel === "/") return res.writeHead(302, { Location: "/guidelines/" }).end();
    if (rel.endsWith("/")) rel += "index.html";
    const file = path.join(root, rel);
    if (!file.startsWith(root)) return res.writeHead(403).end();
    fs.readFile(file, (err, buf) => {
      if (err) return res.writeHead(404).end("Not found");
      res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
      res.end(buf);
    });
  })
  .listen(port, "127.0.0.1", () => console.log(`Serving ${root} at http://127.0.0.1:${port}/guidelines/`));
