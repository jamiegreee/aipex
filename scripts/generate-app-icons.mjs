// Renders the AIPEX app icons from one SVG source.
//
//   node scripts/generate-app-icons.mjs
//
// The icon is the site's exchange mark (two overlapping speech bubbles) in
// lime on the dark page colour, matching the header. Colours mirror the dark
// palette in src/app/theme.css (--color-bg and --color-accent); image files
// can't read CSS variables, so they're repeated here.
//
// Outputs:
//   src/app/icon.svg              favicon (rounded square)
//   src/app/apple-icon.png        180x180, iOS home screen
//   public/icons/icon-192.png     web manifest
//   public/icons/icon-512.png     web manifest
//   public/icons/maskable-512.png web manifest, Android adaptive shapes
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

const BG = "#10140f";
const LIME = "#e5edb5";

// The mark's own artwork lives in a 40x40 box (see ExchangeMark in
// src/components/Brand.tsx). `scale` is how much of the icon it fills.
function iconSvg({ size, scale, radius = 0 }) {
  const markSize = size * scale;
  const offset = (size - markSize) / 2;
  const k = markSize / 40;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${BG}"/>
  <g transform="translate(${offset} ${offset}) scale(${k})">
    <path d="M4 5h23v21H15L4 35V5Z" fill="${LIME}"/>
    <path d="M17 13h19v21l-8-7H17V13Z" fill="${BG}" stroke="${LIME}" stroke-width="2.5"/>
  </g>
</svg>
`;
}

async function png(svg, out) {
  await sharp(Buffer.from(svg)).png().toFile(out);
  console.log("wrote", out);
}

await mkdir("public/icons", { recursive: true });

// Favicon: rounded square, mark fills most of it so it reads at 16px.
await writeFile("src/app/icon.svg", iconSvg({ size: 40, scale: 0.8, radius: 8 }));
console.log("wrote src/app/icon.svg");

// Full-bleed squares: iOS and Android apply their own corner masks.
await png(iconSvg({ size: 180, scale: 0.62 }), "src/app/apple-icon.png");
await png(iconSvg({ size: 192, scale: 0.62 }), "public/icons/icon-192.png");
await png(iconSvg({ size: 512, scale: 0.62 }), "public/icons/icon-512.png");
// Maskable: keep the mark inside the central safe circle (80% diameter).
await png(iconSvg({ size: 512, scale: 0.52 }), "public/icons/maskable-512.png");
