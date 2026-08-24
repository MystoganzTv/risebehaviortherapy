#!/usr/bin/env python3
"""Generates public/og.jpg — the 1200x630 social preview card."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import cairosvg, io

ROOT = Path(__file__).resolve().parent.parent
W, H = 1200, 630
NAVY = (14, 30, 70)

card = Image.new('RGB', (W, H), NAVY)

# right-hand photo, faded into the navy
photo = Image.open(ROOT / 'src/assets/founders-together.jpg').convert('RGB')
pw = int(W * 0.52)
scale = max(pw / photo.width, H / photo.height)
photo = photo.resize((int(photo.width * scale), int(photo.height * scale)), Image.LANCZOS)
left = (photo.width - pw) // 2
photo = photo.crop((left, 0, left + pw, H))

mask = Image.new('L', (pw, H), 255)
d = ImageDraw.Draw(mask)
fade = int(pw * 0.55)
for x in range(fade):
    d.line([(x, 0), (x, H)], fill=int(255 * (x / fade) ** 1.4))
card.paste(photo, (W - pw, 0), mask)

# subtle green glow bottom-right
glow = Image.new('RGB', (W, H), NAVY)
gd = ImageDraw.Draw(glow)
gd.ellipse([W - 380, H - 260, W + 120, H + 240], fill=(18, 129, 60))
glow = glow.filter(ImageFilter.GaussianBlur(120))
card = Image.blend(card, glow, 0.16)

# logo
logo_png = cairosvg.svg2png(url=str(ROOT / 'public/logo-h-white.svg'), output_width=560)
logo = Image.open(io.BytesIO(logo_png)).convert('RGBA')
card.paste(logo, (78, 150), logo)

# strapline
strip = Image.new('RGB', (W, 10), (18, 129, 60))
card.paste(strip, (0, H - 10))

d = ImageDraw.Draw(card)
try:
    from PIL import ImageFont
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 27)
    small = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 21)
except Exception:
    font = small = None
d.text((80, 330), 'ABA therapy in Miami Lakes, Florida', fill=(226, 233, 245), font=font)
d.text((80, 375), 'BCBA-owned  ·  Ages 2–20  ·  Center, home & school', fill=(151, 173, 219), font=small)
d.text((80, 448), '(786) 566-5863', fill=(123, 211, 160), font=font)

card.save(ROOT / 'public/og.jpg', quality=90, optimize=True)
print('og.jpg written')
