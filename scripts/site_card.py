"""Render the two-colour sharing card; see scripts/README.md for provenance."""

import hashlib
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets/images/site-card.png"
BACKGROUND = (0x14, 0x12, 0x10)
AMBER = (0xFF, 0xB0, 0x00)
# Same ordered thresholds as assets/js/dither.js and the footer gallery.
BAYER = (
    (0, 32, 8, 40, 2, 34, 10, 42), (48, 16, 56, 24, 50, 18, 58, 26),
    (12, 44, 4, 36, 14, 46, 6, 38), (60, 28, 52, 20, 62, 30, 54, 22),
    (3, 35, 11, 43, 1, 33, 9, 41), (51, 19, 59, 27, 49, 17, 57, 25),
    (15, 47, 7, 39, 13, 45, 5, 37), (63, 31, 55, 23, 61, 29, 53, 21),
)


def font(size, weight=400, optical_size=72):
    face = ImageFont.truetype(str(ROOT / "scripts/fonts/Newsreader.ttf"), size)
    face.set_variation_by_axes([weight, optical_size])
    return face


def generate():
    mask = Image.new("L", (1200, 630))
    draw = ImageDraw.Draw(mask)
    draw.text((80, 136), "Steak Knives", font=font(112), fill=255, anchor="lt")
    draw.text((80, 252), "and Bagels", font=font(112), fill=255, anchor="lt")
    subtitle = "Roleplaying games, game design, and AI — Jonas Heinke"
    face = font(34, optical_size=18)
    assert draw.textlength(subtitle, font=face) <= 1040, "Subtitle overflows"
    draw.text((84, 408), subtitle, font=face, fill=255, anchor="lt")
    # Palette-indexed pixels make even text edges strictly two-tone. The bottom
    # strip fades in through 2px Bayer cells; no random state or PNG timestamps.
    image = Image.new("P", mask.size)
    image.putpalette(list(BACKGROUND + AMBER) + [0] * (768 - 6))
    pixels, ink = image.load(), mask.load()
    for y in range(image.height):
        for x in range(image.width):
            text = ink[x, y] / 255 > (BAYER[y % 8][x % 8] + 0.5) / 64
            texture = (y >= 500 and (y - 500) / 130 * 0.32
                       > (BAYER[(y // 2) % 8][(x // 2) % 8] + 0.5) / 64)
            pixels[x, y] = int(text or texture)
    image.save(OUTPUT, optimize=True, bits=1)
    assert OUTPUT.stat().st_size < 300_000
    print(f"{OUTPUT.relative_to(ROOT)}: {OUTPUT.stat().st_size:,} bytes; "
          f"SHA256 {hashlib.sha256(OUTPUT.read_bytes()).hexdigest()}")


if __name__ == "__main__":
    generate()
