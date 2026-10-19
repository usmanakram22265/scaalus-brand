// Headless Chrome over the DevTools protocol + a tiny static server for the repo.
// Used by export_pdf.mjs. No dependencies (Node 22+).
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { root } from "./system.mjs";

export const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".png": "image/png", ".json": "application/json" };
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function serve() {
  const server = http.createServer((req, res) => {
    let rel = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (rel.endsWith("/")) rel += "index.html";
    const file = path.join(root, rel);
    if (!file.startsWith(root)) return res.writeHead(403).end();
    fs.readFile(file, (err, buf) => {
      if (err) return res.writeHead(404).end();
      res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
      res.end(buf);
    });
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

function cdp(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    } else if (msg.method) listeners.forEach((l) => l(msg));
  };
  const ready = new Promise((r) => (ws.onopen = r));
  return {
    ready,
    send: (method, params = {}) =>
      new Promise((resolve, reject) => {
        const n = ++id;
        pending.set(n, { resolve, reject });
        ws.send(JSON.stringify({ id: n, method, params }));
      }),
    once: (method) => new Promise((r) => listeners.push((m) => m.method === method && r(m.params))),
    close: () => ws.close(),
  };
}

// Opens one headless page. Call page.open(relPath, { width, height, scale }) then page.shot(...).
export async function browser() {
  const server = await serve();
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "scaalus-chrome-"));
  const proc = spawn(CHROME, ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--hide-scrollbars", `--user-data-dir=${profile}`, "--remote-debugging-port=0", "about:blank"], { stdio: "ignore" });
  const file = path.join(profile, "DevToolsActivePort");
  let port;
  for (let i = 0; i < 100 && !port; i++) {
    if (fs.existsSync(file)) port = Number(fs.readFileSync(file, "utf8").split("\n")[0]) || undefined;
    if (!port) await sleep(100);
  }
  if (!port) throw new Error("Chrome did not start (no DevToolsActivePort)");
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const page = cdp(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
  await page.ready;
  await page.send("Page.enable");
  const base = `http://127.0.0.1:${server.address().port}/`;
  return {
    async open(rel, { width, height, scale = 1 }) {
      await page.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: scale, mobile: false });
      const loaded = page.once("Page.loadEventFired");
      await page.send("Page.navigate", { url: base + rel });
      await loaded;
      await page.send("Runtime.evaluate", { awaitPromise: true, expression: "document.fonts.ready.then(() => new Promise((r) => setTimeout(r, 500)))" });
    },
    async evaluate(expression) {
      const { result } = await page.send("Runtime.evaluate", { awaitPromise: true, returnByValue: true, expression });
      return result.value;
    },
    async shot({ x = 0, y = 0, width, height, format = "png", quality }) {
      const params = { format, captureBeyondViewport: true, clip: { x, y, width, height, scale: 1 } };
      if (quality) params.quality = quality;
      const res = await page.send("Page.captureScreenshot", params);
      return Buffer.from(res.data, "base64");
    },
    async close() {
      page.close();
      proc.kill();
      server.close();
      await sleep(300);
      fs.rmSync(profile, { recursive: true, force: true });
    },
  };
}
