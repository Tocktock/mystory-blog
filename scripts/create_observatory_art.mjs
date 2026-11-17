/*
  Midnight Observatory artwork generator.

  Renders the deep-field backdrop with the site's type (Noto Serif KR + DM Mono) using
  canvaskit-wasm, which astro-og-canvas already depends on, so no native image tooling
  is needed.

  Usage:
    node scripts/create_observatory_art.mjs hero --slug <name> --title <text> [--subtitle <text>] [--overwrite]
    node scripts/create_observatory_art.mjs heroes            # re-render every entry in observatory-heroes.json
    node scripts/create_observatory_art.mjs og-background     # backdrop used by src/pages/og/[...slug].ts

  Fonts are read from the installed Fontsource packages (@fontsource/noto-serif-kr, @fontsource/dm-mono).
*/
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEEP_FIELD = path.join(ROOT, 'src/assets/observatory/deep-field.png');
const HERO_DIR = path.join(ROOT, 'src/assets/heroes');
const HERO_MANIFEST = path.join(ROOT, 'scripts/observatory-heroes.json');
const OG_BACKGROUND = path.join(ROOT, 'src/assets/observatory/og-background.jpg');

// Fontsource subset files keep their source instance names: the Korean subset (which also
// carries Latin glyphs) registers as "Noto Serif KR ExtraLight", DM Mono 500 as "DM Mono Medium".
const FONT_FILES = {
  serif: '@fontsource/noto-serif-kr/files/noto-serif-kr-korean-600-normal.woff',
  mono: '@fontsource/dm-mono/files/dm-mono-latin-500-normal.woff',
};
const SERIF = 'Noto Serif KR ExtraLight';
const MONO = 'DM Mono Medium';

const COLORS = {
  bg: [2, 3, 4],
  fg: [232, 232, 230],
  muted: [154, 163, 168],
  line: [61, 69, 73],
};

function usage(message) {
  if (message) process.stderr.write(`${message}\n\n`);
  process.stderr.write(
    [
      'Usage:',
      '  node scripts/create_observatory_art.mjs hero --slug <name> --title <text> [--subtitle <text>] [--overwrite]',
      '  node scripts/create_observatory_art.mjs heroes',
      '  node scripts/create_observatory_art.mjs og-background',
      '',
    ].join('\n'),
  );
  process.exit(message ? 1 : 0);
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = {};
  for (let i = 0; i < rest.length; i += 1) {
    const token = rest[i];
    if (!token.startsWith('--')) usage(`Unexpected argument: ${token}`);
    const key = token.slice(2);
    if (key === 'overwrite') options.overwrite = true;
    else options[key] = rest[(i += 1)];
  }
  return { command, options };
}

function loadFont(file) {
  return fs.readFile(path.join(ROOT, 'node_modules', file));
}

async function createRenderer() {
  const { default: init } = await import('canvaskit-wasm/full');
  const CanvasKit = await init({
    locateFile: (file) => require.resolve(`canvaskit-wasm/bin/full/${file}`),
  });
  const [serif, mono, deepField] = await Promise.all([
    loadFont(FONT_FILES.serif),
    loadFont(FONT_FILES.mono),
    fs.readFile(DEEP_FIELD),
  ]);
  const fontMgr = CanvasKit.FontMgr.FromData(serif, mono);
  const backdrop = CanvasKit.MakeImageFromEncoded(deepField);
  if (!backdrop) throw new Error('Could not decode deep-field.png');
  return { CanvasKit, fontMgr, backdrop };
}

function color(CanvasKit, [r, g, b], alpha = 1) {
  return CanvasKit.Color(r, g, b, alpha);
}

/** Draw the deep field cover-fitted (beam and galaxies to the right), then darken it. */
function drawBackdrop({ CanvasKit, backdrop }, canvas, width, height) {
  const scale = Math.max(width / backdrop.width(), height / backdrop.height());
  const srcWidth = width / scale;
  const srcHeight = height / scale;
  const srcX = (backdrop.width() - srcWidth) / 2;
  const srcY = (backdrop.height() - srcHeight) * 0.35;
  canvas.drawImageRectOptions(
    backdrop,
    CanvasKit.XYWHRect(srcX, srcY, srcWidth, srcHeight),
    CanvasKit.XYWHRect(0, 0, width, height),
    CanvasKit.FilterMode.Linear,
    CanvasKit.MipmapMode.None,
    null,
  );

  // Darken toward the text side and the bottom edge so type stays legible.
  const wash = new CanvasKit.Paint();
  wash.setShader(
    CanvasKit.Shader.MakeLinearGradient(
      [0, 0],
      [width, 0],
      [
        color(CanvasKit, COLORS.bg, 0.94),
        color(CanvasKit, COLORS.bg, 0.55),
        color(CanvasKit, COLORS.bg, 0.2),
      ],
      [0, 0.55, 1],
      CanvasKit.TileMode.Clamp,
    ),
  );
  canvas.drawRect(CanvasKit.XYWHRect(0, 0, width, height), wash);
  const fade = new CanvasKit.Paint();
  fade.setShader(
    CanvasKit.Shader.MakeLinearGradient(
      [0, height * 0.45],
      [0, height],
      [color(CanvasKit, COLORS.bg, 0), color(CanvasKit, COLORS.bg, 0.85)],
      null,
      CanvasKit.TileMode.Clamp,
    ),
  );
  canvas.drawRect(CanvasKit.XYWHRect(0, 0, width, height), fade);
}

function paragraph(
  { CanvasKit, fontMgr },
  text,
  { family, size, rgb, lineHeight = 1.3, letterSpacing = 0, width },
) {
  const style = new CanvasKit.ParagraphStyle({
    textStyle: {
      color: color(CanvasKit, rgb),
      fontFamilies: [family],
      fontSize: size,
      heightMultiplier: lineHeight,
      letterSpacing,
    },
    textAlign: CanvasKit.TextAlign.Left,
  });
  const builder = CanvasKit.ParagraphBuilder.Make(style, fontMgr);
  builder.addText(text);
  const built = builder.build();
  built.layout(width);
  builder.delete();
  return built;
}

function drawRule({ CanvasKit }, canvas, x, y, width) {
  const paint = new CanvasKit.Paint();
  paint.setColor(color(CanvasKit, COLORS.line));
  paint.setStrokeWidth(1);
  canvas.drawLine(x, y, x + width, y, paint);
}

function encode(renderer, surface, format) {
  const { CanvasKit } = renderer;
  const image = surface.makeImageSnapshot();
  const bytes =
    format === 'jpeg'
      ? image.encodeToBytes(CanvasKit.ImageFormat.JPEG, 86)
      : image.encodeToBytes(CanvasKit.ImageFormat.PNG, 100);
  image.delete();
  surface.delete();
  if (!bytes) throw new Error('Image encoding failed');
  return Buffer.from(bytes);
}

/** Article hero: 1280×720, kicker top-left, title and subtitle bottom-left. */
export function renderHero(renderer, { title, subtitle }) {
  const width = 1280;
  const height = 720;
  const margin = 84;
  const surface = renderer.CanvasKit.MakeSurface(width, height);
  const canvas = surface.getCanvas();
  canvas.clear(color(renderer.CanvasKit, COLORS.bg));
  drawBackdrop(renderer, canvas, width, height);

  const kicker = paragraph(renderer, 'THE MIDNIGHT OBSERVATORY', {
    family: MONO,
    size: 17,
    rgb: COLORS.muted,
    letterSpacing: 3.7,
    width: width - margin * 2,
  });
  canvas.drawParagraph(kicker, margin, margin - 6);

  const textWidth = Math.round(width * 0.62);
  const sub = subtitle
    ? paragraph(renderer, subtitle, {
        family: SERIF,
        size: 30,
        rgb: COLORS.muted,
        width: textWidth,
      })
    : undefined;
  const head = paragraph(renderer, title, {
    family: SERIF,
    size: 76,
    rgb: COLORS.fg,
    lineHeight: 1.25,
    width: textWidth,
  });
  const subHeight = sub ? sub.getHeight() + 18 : 0;
  const titleY = height - margin - subHeight - head.getHeight();
  drawRule(renderer, canvas, margin, titleY - 34, 64);
  canvas.drawParagraph(head, margin, titleY);
  if (sub) canvas.drawParagraph(sub, margin, titleY + head.getHeight() + 18);
  return encode(renderer, surface, 'png');
}

/** OG backdrop: 1200×630; astro-og-canvas draws the title and description top-left. */
export function renderOgBackground(renderer) {
  const width = 1200;
  const height = 630;
  const margin = 72;
  const surface = renderer.CanvasKit.MakeSurface(width, height);
  const canvas = surface.getCanvas();
  canvas.clear(color(renderer.CanvasKit, COLORS.bg));
  drawBackdrop(renderer, canvas, width, height);

  const kicker = paragraph(renderer, 'JI YONG / THE MIDNIGHT OBSERVATORY', {
    family: MONO,
    size: 17,
    rgb: COLORS.muted,
    letterSpacing: 3.7,
    width: 700,
  });
  const site = paragraph(renderer, 'JI-YONG.COM', {
    family: MONO,
    size: 17,
    rgb: COLORS.muted,
    letterSpacing: 3.7,
    width: 300,
  });
  const baseline = height - margin - kicker.getHeight();
  drawRule(renderer, canvas, margin, baseline - 26, width - margin * 2);
  canvas.drawParagraph(kicker, margin, baseline);
  canvas.drawParagraph(site, width - margin - site.getMaxIntrinsicWidth(), baseline);
  return encode(renderer, surface, 'jpeg');
}

async function writeFile(file, buffer, overwrite) {
  if (!overwrite) {
    try {
      await fs.access(file);
      throw new Error(`${path.relative(ROOT, file)} exists; pass --overwrite to replace it.`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  await fs.writeFile(file, buffer);
  process.stdout.write(
    `wrote ${path.relative(ROOT, file)} (${Math.round(buffer.length / 1024)} KB)\n`,
  );
}

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));
  if (!command || command === '--help' || command === '-h') usage();
  const renderer = await createRenderer();

  if (command === 'hero') {
    if (!options.slug || !options.title) usage('hero needs --slug and --title.');
    const file = path.join(HERO_DIR, `${options.slug}.png`);
    await writeFile(file, renderHero(renderer, options), options.overwrite);
  } else if (command === 'heroes') {
    const manifest = JSON.parse(await fs.readFile(HERO_MANIFEST, 'utf8'));
    for (const entry of manifest) {
      const file = path.join(HERO_DIR, `${entry.slug}.png`);
      await writeFile(file, renderHero(renderer, entry), true);
    }
  } else if (command === 'og-background') {
    await writeFile(OG_BACKGROUND, renderOgBackground(renderer), true);
  } else {
    usage(`Unknown command: ${command}`);
  }
}

main().catch((error) => {
  process.stderr.write(`${error.stack ?? error}\n`);
  process.exit(1);
});
