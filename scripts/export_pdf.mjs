// Exports guidelines/index.html to guidelines/scaalus-brand-guidelines.pdf.
// Captures every page at 2x in headless Chrome and packs the JPEGs into a PDF —
// pixel-identical to the browser (Chrome's vector print adds hairlines around
// gradient text). No dependencies. Run node scripts/build.mjs first.
// Usage: node scripts/export_pdf.mjs   (set CHROME=/path/to/chrome to override)
import fs from "node:fs";
import path from "node:path";
import { root } from "./lib/system.mjs";
import { browser } from "./lib/chrome.mjs";

const OUT = path.join(root, "guidelines", "scaalus-brand-guidelines.pdf");
const PAGE = { width: 1334, height: 834 };
const SCALE = 2;

// Minimal PDF: one JPEG per page, page size in points at 96 px per inch.
function writePdf(jpegs, file) {
  const wPt = ((PAGE.width * 72) / 96).toFixed(2);
  const hPt = ((PAGE.height * 72) / 96).toFixed(2);
  const chunks = [];
  const offsets = [];
  let size = 0;
  const push = (b) => {
    const buf = typeof b === "string" ? Buffer.from(b, "latin1") : b;
    chunks.push(buf);
    size += buf.length;
  };
  const obj = (n, body) => {
    offsets[n] = size;
    push(`${n} 0 obj\n`);
    body();
    push("\nendobj\n");
  };
  push("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
  const pageIds = jpegs.map((_, i) => 3 + i * 3);
  obj(1, () => push("<< /Type /Catalog /Pages 2 0 R >>"));
  obj(2, () => push(`<< /Type /Pages /Kids [${pageIds.map((n) => `${n} 0 R`).join(" ")}] /Count ${jpegs.length} >>`));
  jpegs.forEach((jpg, i) => {
    const p = pageIds[i];
    const content = `q ${wPt} 0 0 ${hPt} 0 0 cm /Im0 Do Q`;
    obj(p, () => push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${wPt} ${hPt}] /Resources << /XObject << /Im0 ${p + 2} 0 R >> >> /Contents ${p + 1} 0 R >>`));
    obj(p + 1, () => push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`));
    obj(p + 2, () => {
      push(`<< /Type /XObject /Subtype /Image /Width ${PAGE.width * SCALE} /Height ${PAGE.height * SCALE} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`);
      push(jpg);
      push("\nendstream");
    });
  });
  const total = 3 + jpegs.length * 3;
  const xref = size;
  push(`xref\n0 ${total}\n0000000000 65535 f \n`);
  for (let n = 1; n < total; n++) push(`${String(offsets[n]).padStart(10, "0")} 00000 n \n`);
  push(`trailer\n<< /Size ${total} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  fs.writeFileSync(file, Buffer.concat(chunks));
}

const b = await browser();
try {
  // The page loads every shortlist font from Google Fonts / Fontshare; retry until all are really there.
  let missing = [];
  for (let attempt = 1; attempt <= 3; attempt++) {
    await b.open("guidelines/?export", { width: PAGE.width, height: PAGE.height, scale: SCALE });
    missing = await b.evaluate(`(async () => {
      const names = [...new Set([...SCAALUS.typography.fonts.map((f) => f["css-family"]), "Geist Mono", "Inter Tight"])];
      await Promise.all(names.map((n) => document.fonts.load('700 40px "' + n + '"').catch(() => null)));
      await document.fonts.ready;
      const loaded = new Set([...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/["']/g, "")));
      return names.filter((n) => !loaded.has(n));
    })()`);
    if (!missing.length) break;
    console.log(`Fonts not loaded (attempt ${attempt}): ${missing.join(", ")} — retrying`);
  }
  const fontOk = missing.length === 0;
  if (!fontOk) throw new Error(`Fonts did not load: ${missing.join(", ")} — check the network and run again.`);
  const rects = await b.evaluate(`[...document.querySelectorAll(".page")].map((p) => { const r = p.getBoundingClientRect(); return [r.left + scrollX, r.top + scrollY]; })`);
  const jpegs = [];
  for (const [x, y] of rects) jpegs.push(await b.shot({ x, y, width: PAGE.width, height: PAGE.height, format: "jpeg", quality: 90 }));
  writePdf(jpegs, OUT);
  console.log(`Wrote ${path.relative(root, OUT)} — ${jpegs.length} pages, ${(fs.statSync(OUT).size / 1e6).toFixed(1)} MB`);
} finally {
  await b.close();
}
