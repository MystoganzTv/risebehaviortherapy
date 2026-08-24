/**
 * Bundles the built site (./dist) into ONE self-contained HTML fragment that can be
 * published as a shareable preview page. Everything is inlined — CSS, JS, images,
 * fonts stay on Google Fonts (the only external host allowed) — and the multi-page
 * site is turned into a hash-routed single page so every link still works.
 *
 * Usage: node scripts/build-preview.mjs  ->  ./preview/rise-preview.html
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

const ROUTES = [
  ['/', 'index.html'],
  ['/about/', 'about/index.html'],
  ['/services/', 'services/index.html'],
  ['/getting-started/', 'getting-started/index.html'],
  ['/insurance/', 'insurance/index.html'],
  ['/resources/', 'resources/index.html'],
  ['/careers/', 'careers/index.html'],
  ['/contact/', 'contact/index.html'],
  ['/privacy/', 'privacy/index.html'],
  ['/accessibility/', 'accessibility/index.html'],
];

const MIME = {
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.avif': 'image/avif',
};

const dataUriCache = new Map();
function dataUri(assetPath) {
  if (dataUriCache.has(assetPath)) return dataUriCache.get(assetPath);
  const file = join(DIST, assetPath.replace(/^\//, ''));
  if (!existsSync(file)) return null;
  const mime = MIME[extname(assetPath).toLowerCase()];
  if (!mime) return null;
  const uri = `data:${mime};base64,${readFileSync(file).toString('base64')}`;
  dataUriCache.set(assetPath, uri);
  return uri;
}

const read = (rel) => readFileSync(join(DIST, rel), 'utf8');
const between = (html, open, close) => {
  const a = html.indexOf(open);
  if (a === -1) return '';
  const b = html.indexOf(close, a);
  return html.slice(a + open.length, b);
};

/** Inline every referenced image, drop srcset, and neutralise external iframes. */
function inlineAssets(html) {
  // srcset points at many variants; keep the single largest and inline it
  html = html.replace(/\ssrcset="[^"]*"/g, '').replace(/\ssizes="[^"]*"/g, '');

  html = html.replace(/(src|href)="(\/[^"]+\.(?:svg|webp|jpe?g|png|avif))"/g, (m, attr, path) => {
    const uri = dataUri(path);
    return uri ? `${attr}="${uri}"` : m;
  });

  // Google Maps embeds are blocked by the preview's content policy — swap in a link card
  html = html.replace(
    /<iframe[^>]*maps[^>]*><\/iframe>/g,
    `<a href="https://www.google.com/maps/search/?api=1&amp;query=5901+NW+151st+Street+Suite+206+Miami+Lakes+FL+33014"
        target="_blank" rel="noopener"
        class="flex h-72 w-full flex-col items-center justify-center gap-3 bg-navy-50 text-center ring-1 ring-navy-100 transition hover:bg-navy-100 lg:h-80">
       <span class="font-serif text-2xl text-navy-800">5901 NW 151st Street, Suite 206</span>
       <span class="text-ink-600">Miami Lakes, FL 33014</span>
       <span class="text-sm font-semibold text-leaf-700">Open in Google Maps &rarr;</span>
       <span class="text-xs text-ink-400">(live map appears on the published site)</span>
     </a>`
  );
  return html;
}

const shell = read('index.html');

// ── styles: inline every stylesheet Astro emitted
const cssHrefs = [...shell.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)]
  .map((m) => m[1])
  .filter((h) => h.startsWith('/'));
const css = cssHrefs.map((h) => read(h.replace(/^\//, ''))).join('\n');

const fontsLink = (shell.match(/<link\s+rel="stylesheet"\s+href="https:\/\/fonts\.googleapis[^>]*>/) || [''])[0];

// ── scripts: inline Astro's module bundles (header menu, form handling, reveals)
const jsSrcs = [...shell.matchAll(/<script type="module" src="([^"]+)"/g)]
  .map((m) => m[1])
  .filter((s) => s.startsWith('/'));
const js = jsSrcs.map((s) => read(s.replace(/^\//, ''))).join('\n;\n');

// ── chrome + per-route content
const header = inlineAssets(
  between(shell, '<div class="hidden bg-navy-900', '</header>').replace(/^/, '<div class="hidden bg-navy-900') + '</header>'
);
const footer = inlineAssets('<footer' + between(shell, '<footer', '</footer>') + '</footer>');

const pages = {};
for (const [route, file] of ROUTES) {
  const html = read(file);
  pages[route] = {
    title: between(html, '<title>', '</title>'),
    main: inlineAssets(between(html, '<main id="main">', '</main>')),
  };
}

// internal links become hash routes
const rewrite = (s) =>
  s
    .replace(/href="\/(?!\/)([a-z-]*\/?)(#[a-z-]+)?"/g, (m, path, hash) => `href="#/${path}${hash || ''}"`)
    .replace(/href="#\/#/g, 'href="#/');

const out = `<title>Rise Behavior Therapy</title>
${fontsLink}
<style>
${css}
</style>
<style>
  /* preview-only chrome */
  #preview-flag {
    position: fixed; inset-inline: 0; bottom: 0; z-index: 90;
    display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: .35rem 1rem;
    padding: .55rem 1rem calc(.55rem + env(safe-area-inset-bottom));
    background: #0e1e46; color: #c5d2ea;
    font: 500 12.5px/1.4 Inter, system-ui, sans-serif; letter-spacing: .01em;
  }
  #preview-flag b { color: #7bd3a0; font-weight: 600; }
  body { padding-bottom: 2.6rem; }
</style>

<div id="app-header">${rewrite(header)}</div>
<main id="main"></main>
<div id="app-footer">${rewrite(footer)}</div>

<div id="preview-flag">
  <span><b>Preview</b> &middot; Rise Behavior Therapy</span>
  <span>Not yet live at risebehaviortherapy.com</span>
</div>

<script type="application/json" id="route-data">${JSON.stringify(
  Object.fromEntries(Object.entries(pages).map(([k, v]) => [k, { title: v.title, main: rewrite(v.main) }]))
).replace(/</g, '\\u003c')}</script>

<script type="module">
const routes = JSON.parse(document.getElementById('route-data').textContent);
const main = document.getElementById('main');

function currentRoute() {
  const h = location.hash.replace(/^#/, '');
  const path = h.split('#')[0] || '/';
  return routes[path] ? path : '/';
}

function render(scrollToTop = true) {
  const path = currentRoute();
  main.innerHTML = routes[path].main;
  document.title = routes[path].title;

  // header active state
  document.querySelectorAll('#app-header nav a').forEach((a) => {
    const href = a.getAttribute('href') || '';
    const on = href === '#' + path && path !== '/';
    a.toggleAttribute('aria-current', on);
    a.classList.toggle('text-navy-800', on);
    a.classList.toggle('text-navy-700/80', !on);
  });

  main.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));

  // Forms submit for real only on the deployed site; here they confirm and stop.
  main.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = form.querySelector('[data-form-status]');
      if (!status) return;
      status.textContent =
        'Preview mode — this form is fully wired and will deliver to Info@risebehaviortherapy.com once the site is published.';
      status.className = 'rounded-2xl bg-leaf-50 px-4 py-3 text-[0.9rem] text-leaf-800 ring-1 ring-leaf-200';
    });
  });

  const anchor = location.hash.split('#')[2];
  if (anchor) {
    const target = document.getElementById(anchor);
    if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
  }
  if (scrollToTop) window.scrollTo({ top: 0 });
}

addEventListener('hashchange', () => render());
render(false);
</script>

<script type="module">
${js}
</script>
`;

mkdirSync(join(ROOT, 'preview'), { recursive: true });
const target = join(ROOT, 'preview', 'rise-preview.html');
writeFileSync(target, out);
console.log('preview written:', target, (Buffer.byteLength(out) / 1024 / 1024).toFixed(2) + ' MB');
