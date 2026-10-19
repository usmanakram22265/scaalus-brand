// Small colour helpers shared by build.mjs and check-contrast.mjs (no dependencies).

export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

export function rgbToHex(rgb) {
  return "#" + rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
}

function channel(v) {
  const s = v / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(channel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a, b) {
  const x = luminance(a);
  const y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

// Paint `hex` at `alpha` over an opaque `under` colour.
export function composite(hex, alpha, under) {
  const f = hexToRgb(hex);
  const u = hexToRgb(under);
  return rgbToHex(f.map((v, i) => v * alpha + u[i] * (1 - alpha)));
}

export function rgba(hex, alpha = 1) {
  const [r, g, b] = hexToRgb(hex);
  return alpha >= 1 ? hex : `rgb(${r} ${g} ${b} / ${Math.round(alpha * 100)}%)`;
}
