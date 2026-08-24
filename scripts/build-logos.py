#!/usr/bin/env python3
"""
Rebuilds the Rise Behavior Therapy logo set as clean vector SVGs by tracing the
high-resolution logo from the company flyer, separating the navy and green inks.

Outputs into public/:
  logo.svg / logo-white.svg              stacked lockup (icon over wordmark)
  logo-h.svg / logo-h-white.svg          horizontal lockup (icon beside wordmark)
  icon.svg / icon-white.svg              icon only
  favicon-512.png, apple-touch-icon.png, og.jpg

Run:  python3 scripts/build-logos.py
"""
import re
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'src/assets/flyer-source.jpg'
OUT = ROOT / 'public'
TMP = Path('/tmp/logobuild')
TMP.mkdir(exist_ok=True)

NAVY, GREEN = '#12275B', '#12813C'
NAVY_ON_DARK, GREEN_ON_DARK = '#FFFFFF', '#7BD3A0'

SPLIT_Y = 0.560   # fraction of the crop height where the icon ends and the wordmark begins


def masks():
    im = Image.open(SRC).convert('RGB')
    w, h = im.size
    crop = im.crop((int(0.032 * w), int(0.022 * h), int(0.4955 * w), int(0.293 * h)))
    crop = crop.resize((crop.width * 5, crop.height * 5), Image.LANCZOS)
    a = np.array(crop).astype(np.int16)
    R, G, B = a[..., 0], a[..., 1], a[..., 2]
    dark = a.max(axis=2) < 205
    green = dark & (G > R + 12) & (G > B + 8)
    navy = dark & (B >= R) & (G - R < 60) & ~green
    return navy, green


def trace(mask, name):
    """Trace a boolean mask; returns the inner path markup of the potrace <g>."""
    pbm = TMP / f'{name}.pbm'
    svg = TMP / f'{name}.svg'
    Image.fromarray(np.where(mask, 0, 255).astype('uint8')).save(pbm)
    subprocess.run(
        ['potrace', '-s', '-o', str(svg), '--turdsize', '10',
         '--alphamax', '1.0', '--opttolerance', '0.2', str(pbm)],
        check=True,
    )
    return re.search(r'<g[^>]*>(.*?)</g>', svg.read_text(), re.S).group(1)


def group(paths, h, fill):
    return f'<g transform="translate(0,{h}) scale(0.1,-0.1)" fill="{fill}" stroke="none">{paths}</g>'


def svg(w, h, body, label='Rise Behavior Therapy'):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
        f'role="img" aria-label="{label}">{body}</svg>'
    )


def bbox(*ms):
    m = np.zeros_like(ms[0])
    for x in ms:
        m |= x
    ys, xs = np.where(m)
    return xs.min(), ys.min(), xs.max() + 1, ys.max() + 1


def main():
    navy, green = masks()
    H = navy.shape[0]
    cut = int(H * SPLIT_Y)

    regions = {
        'full': (navy, green),
        'icon': (navy[:cut], green[:cut]),
        'word': (navy[cut:], green[cut:]),
    }

    built = {}
    for key, (n, g) in regions.items():
        x0, y0, x1, y1 = bbox(n, g)
        pad = 6
        x0, y0 = max(0, x0 - pad), max(0, y0 - pad)
        x1, y1 = min(n.shape[1], x1 + pad), min(n.shape[0], y1 + pad)
        nc, gc = n[y0:y1, x0:x1], g[y0:y1, x0:x1]
        built[key] = {
            'w': x1 - x0,
            'h': y1 - y0,
            'navy': trace(nc, f'{key}-navy'),
            'green': trace(gc, f'{key}-green'),
        }

    def write(name, key, navy_fill, green_fill, label):
        b = built[key]
        body = group(b['navy'], b['h'], navy_fill) + group(b['green'], b['h'], green_fill)
        (OUT / name).write_text(svg(b['w'], b['h'], body, label))

    write('logo.svg', 'full', NAVY, GREEN, 'Rise Behavior Therapy')
    write('logo-white.svg', 'full', NAVY_ON_DARK, GREEN_ON_DARK, 'Rise Behavior Therapy')
    write('icon.svg', 'icon', NAVY, GREEN, 'Rise Behavior Therapy')
    write('icon-white.svg', 'icon', NAVY_ON_DARK, GREEN_ON_DARK, 'Rise Behavior Therapy')

    # ── horizontal lockup: icon on the left, wordmark optically centred on the right
    ic, wd = built['icon'], built['word']
    target_h = 1000.0
    is_ = target_h / ic['h']                      # icon scale
    ws = (target_h * 0.86) / wd['h']              # wordmark scale (slightly shorter)
    gap = target_h * 0.16
    iw, ww = ic['w'] * is_, wd['w'] * ws
    total_w = iw + gap + ww
    wy = (target_h - wd['h'] * ws) / 2 + target_h * 0.02

    def horizontal(navy_fill, green_fill):
        a = (f'<g transform="scale({is_})">'
             + group(ic['navy'], ic['h'], navy_fill)
             + group(ic['green'], ic['h'], green_fill) + '</g>')
        b = (f'<g transform="translate({iw + gap},{wy}) scale({ws})">'
             + group(wd['navy'], wd['h'], navy_fill)
             + group(wd['green'], wd['h'], green_fill) + '</g>')
        return svg(round(total_w), round(target_h), a + b)

    (OUT / 'logo-h.svg').write_text(horizontal(NAVY, GREEN))
    (OUT / 'logo-h-white.svg').write_text(horizontal(NAVY_ON_DARK, GREEN_ON_DARK))

    import cairosvg
    cairosvg.svg2png(url=str(OUT / 'icon.svg'), write_to=str(OUT / 'favicon-512.png'), output_width=512)
    cairosvg.svg2png(url=str(OUT / 'icon.svg'), write_to=str(OUT / 'apple-touch-icon.png'),
                     output_width=180, background_color='white')
    print('logos rebuilt ->', OUT)


if __name__ == '__main__':
    main()
