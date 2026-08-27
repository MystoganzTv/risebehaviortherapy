/**
 * Builds preview/index.html — a standalone copy of the landing page that opens
 * straight from disk in a browser (file://), with no dev server and no build.
 *
 * It is generated FROM src/pages/index.astro, so the preview can never drift
 * from the real page: edit the .astro file, re-run this, refresh the tab.
 *
 *   node scripts/build-landing-preview.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const SITE_URL = 'https://risebehaviortherapy.com';
const SITE_NAME = 'Rise Behavior Therapy';
const TITLE = `${SITE_NAME} — ABA Therapy in Miami Lakes, FL`;
const DESCRIPTION =
  'BCBA-owned ABA therapy in Miami Lakes, FL. Center-based, in-home and school-based Applied Behavior Analysis for children with autism. Most insurance accepted.';

/** Astro expressions -> their literal value in the static preview. */
const EXPRESSIONS = new Map([
  ['title', TITLE],
  ['description', DESCRIPTION],
  ['canonical', `${SITE_URL}/`],
  ['site.name', SITE_NAME],
  ['phoneHref', 'tel:+17865665863'],
  ['phoneDisplay', '786-566-5863'],
  ['contact.email', 'Info@risebehaviortherapy.com'],
  ['forms.accessKey', ''],
  ["forms.accessKey ? 'true' : 'false'", 'false'],
  ['`${site.url}/og.jpg`', `${SITE_URL}/og.jpg`],
]);

let html = readFileSync(join(ROOT, 'src/pages/index.astro'), 'utf8');
const css = readFileSync(join(ROOT, 'src/styles/landing.css'), 'utf8');

// 1. Drop the Astro frontmatter fence.
html = html.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');

// 2. Drop the JSON-LD block (server-rendered; irrelevant to a visual preview).
html = html.replace(/\s*<script is:inline set:html=\{[^}]*\}[^>]*\/>/g, '');

// 3. Resolve `attr={expr}` and bare `{expr}` occurrences.
for (const [expr, value] of EXPRESSIONS) {
  html = html.split(`={${expr}}`).join(`="${value}"`);
  html = html.split(`{${expr}}`).join(value);
}

const leftovers = html.match(/\{[^{}\n]+\}/g)?.filter((m) => !m.startsWith('{ '));
if (leftovers?.length) {
  console.warn('  ! unresolved Astro expressions:', [...new Set(leftovers)].join(', '));
}

// 4. Inline the stylesheet the .astro file imports, and point images at the
//    real public/ folder so the file works straight off disk.
html = html.replace('</head>', `  <style>\n${css}\n    </style>\n  </head>`);
html = html.split('src="/images/').join('src="../public/images/');

// 5. Banner so nobody mistakes the preview for the deployed site.
html = html.replace(
  '</body>',
  `  <div style="position:fixed;left:0;right:0;bottom:0;z-index:99;background:#1C7A45;color:#fff;` +
    `font:500 12px/1 'IBM Plex Mono',monospace;letter-spacing:0.1em;text-align:center;padding:8px">` +
    `LOCAL PREVIEW · NOT YET LIVE AT RISEBEHAVIORTHERAPY.COM</div>\n  </body>`
);

mkdirSync(join(ROOT, 'preview'), { recursive: true });
writeFileSync(join(ROOT, 'preview/index.html'), html);
console.log('  ✓ preview/index.html');
