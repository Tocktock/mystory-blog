#!/usr/bin/env python3
"""
Utility for generating blog hero artwork compatible with astro:assets.

Example:
  python3 scripts/create_hero_image.py --slug kubernetes-roadmap \
    --title "Kubernetes Journey" --subtitle "Scaling deployments with confidence"
"""

from __future__ import annotations

import argparse
import random
from pathlib import Path
from typing import Sequence, Tuple

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError as exc:  # pragma: no cover - runtime guidance
    raise SystemExit(
        "Pillow is required. Install it via `pip install pillow` and re-run the script."
    ) from exc


CANVAS_SIZE = (1280, 720)
OUTPUT_DIR = Path("src/assets/heroes")

# Curated palette pairs (top, bottom)
COLOR_PALETTES: Sequence[Tuple[Tuple[int, int, int], Tuple[int, int, int]]] = (
    ((30, 64, 175), (56, 189, 248)),  # blue → cyan
    ((14, 116, 144), (20, 184, 166)),  # teal
    ((107, 33, 168), (192, 132, 252)),  # purple
    ((180, 83, 9), (249, 115, 22)),  # orange
    ((22, 163, 74), (163, 230, 53)),  # green
    ((37, 99, 235), (59, 130, 246)),  # indigo
    ((168, 85, 247), (236, 72, 153)),  # violet → pink
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate a PNG hero image.")
    parser.add_argument("--slug", required=True, help="File name (without extension).")
    parser.add_argument("--title", required=True, help="Primary title text.")
    parser.add_argument(
        "--subtitle",
        default="Ji Yong's Tech Notes",
        help="Optional subtitle text.",
    )
    parser.add_argument(
        "--palette",
        choices=tuple(str(idx) for idx in range(len(COLOR_PALETTES))),
        help="Pick a specific palette by index. Defaults to a random palette.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview the chosen palette without writing a file.",
    )
    return parser.parse_args()


def load_font(size: int) -> ImageFont.FreeTypeFont:
    candidates = (
        "DejaVuSans-Bold.ttf",
        "/System/Library/Fonts/SFNSRounded.ttf",
        "/System/Library/Fonts/SFNSDisplay.ttf",
        "/Library/Fonts/Arial Bold.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    )
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def draw_centered(
    draw: ImageDraw.ImageDraw, *, text: str, font: ImageFont.FreeTypeFont, y: int
) -> int:
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (CANVAS_SIZE[0] - text_width) // 2
    shadow_offset = 3
    draw.text(
        (x + shadow_offset, y + shadow_offset),
        text,
        font=font,
        fill=(0, 0, 0, 160),
    )
    draw.text((x, y), text, font=font, fill=(255, 255, 255))
    return text_height


def create_gradient(
    top_color: Tuple[int, int, int], bottom_color: Tuple[int, int, int]
) -> Image.Image:
    width, height = CANVAS_SIZE
    image = Image.new("RGB", CANVAS_SIZE, top_color)
    pixels = image.load()
    for y in range(height):
        ratio = y / max(height - 1, 1)
        r = int(top_color[0] * (1 - ratio) + bottom_color[0] * ratio)
        g = int(top_color[1] * (1 - ratio) + bottom_color[1] * ratio)
        b = int(top_color[2] * (1 - ratio) + bottom_color[2] * ratio)
        for x in range(width):
            pixels[x, y] = (r, g, b)
    return image


def generate_image(slug: str, title: str, subtitle: str, palette_idx: int) -> Path:
    top, bottom = COLOR_PALETTES[palette_idx]
    canvas = create_gradient(top, bottom)
    draw = ImageDraw.Draw(canvas)

    title_font = load_font(78)
    subtitle_font = load_font(38)

    y = int(CANVAS_SIZE[1] * 0.32)
    y += draw_centered(draw, text=title, font=title_font, y=y) + 40
    draw_centered(draw, text=subtitle, font=subtitle_font, y=y)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_path = OUTPUT_DIR / f"{slug}.png"
    canvas.save(output_path, format="PNG", optimize=True)
    return output_path


def main() -> None:
    args = parse_args()
    palette_idx = (
        int(args.palette)
        if args.palette is not None
        else random.randint(0, len(COLOR_PALETTES) - 1)
    )

    if args.dry_run:
        top, bottom = COLOR_PALETTES[palette_idx]
        print(f"[dry-run] palette={palette_idx} top={top} bottom={bottom}")
        return

    output = generate_image(args.slug, args.title, args.subtitle, palette_idx)
    print(f"Hero image saved to {output.relative_to(Path.cwd())}")


if __name__ == "__main__":
    main()
