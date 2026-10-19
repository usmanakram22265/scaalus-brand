// Checks every text colour in every mood against WCAG 2.1, at the worst point
// of each ground gradient (stops + glow + L1 surface). Exits 1 on any failure
// or forbidden pair.  Usage: node scripts/check-contrast.mjs
import { build } from "./lib/system.mjs";

const data = build();
let failures = 0;

for (const m of Object.values(data.moods)) {
  const { rows, forbidden, pass } = m.contrast;
  console.log(`\n${m.name} (${m.theme})  ${pass ? "PASS" : "FAIL"}`);
  for (const r of rows) {
    const mark = r.pass ? "ok  " : "FAIL";
    console.log(`  ${mark} ${r.label.padEnd(22)} ${r.fg} on ${r.bg}  ${r.ratio.toFixed(1).padStart(5)}:1  (min ${r.min})  worst: ${r.bgLabel}`);
    if (!r.pass) failures++;
  }
  for (const f of forbidden) {
    console.log(`  FORBIDDEN ${f.label}: ${f.fgName} ${f.fg} — ${f.why}`);
    failures++;
  }
}

console.log(failures ? `\n${failures} problem(s).` : "\nAll moods pass.");
process.exit(failures ? 1 : 0);
