/**
 * Builds preview/index.html from Astro's production output, including data-driven
 * locations. Opens directly from disk; maps and Google Fonts need internet.
 *
 * Run: node scripts/build-landing-preview.mjs
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

const astroRoot = join(ROOT, 'node_modules/astro');
const astroPackage = JSON.parse(readFileSync(join(astroRoot, 'package.json'), 'utf8'));
execFileSync(process.execPath, [join(astroRoot, astroPackage.bin.astro), 'build'], {
  cwd: ROOT,
  stdio: 'inherit',
});

let html = readFileSync(join(DIST, 'index.html'), 'utf8');

// Inline compiled styles and scripts so the preview also works with file://.
html = html.replace(/<link\b[^>]*href="(\/_astro\/[^"?]+\.css)"[^>]*>/g, (_, path) =>
  `<style>${readFileSync(join(DIST, path), 'utf8')}</style>`
);
html = html.replace(/<script\b[^>]*src="(\/_astro\/[^"?]+\.js)"[^>]*><\/script>/g, (_, path) =>
  `<script type="module">${readFileSync(join(DIST, path), 'utf8')}</script>`
);
html = html.replace(/\b(src|href)="\/(?!\/)([^"\s]+)"/g, '$1="../public/$2"');
html = html.replace(
  '</body>',
  '<div style="position:fixed;left:0;right:0;bottom:0;z-index:99;background:#1C7A45;color:#fff;' +
    'font:500 12px/1.4 monospace;letter-spacing:0.1em;text-align:center;padding:8px">' +
    'LOCAL PREVIEW · UNPUBLISHED CHANGES</div></body>'
);

mkdirSync(join(ROOT, 'preview'), { recursive: true });
writeFileSync(join(ROOT, 'preview/index.html'), html);
console.log('  ✓ preview/index.html');
