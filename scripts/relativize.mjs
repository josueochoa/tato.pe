// Post-build: make the static export portable.
// Rewrites every root-relative URL in dist/**/*.html to a path relative to that page (../poster/x.jpg),
// points page links at their index.html so the site opens from file:// and from any subfolder,
// and stamps <html data-root="../"> so client scripts can build paths at runtime.
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname, posix } from 'node:path';

const DIST = join(process.cwd(), 'dist');
const walk = (dir) => readdirSync(dir).flatMap((n) => { const p = join(dir, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
const htmlFiles = walk(DIST).filter((f) => f.endsWith('.html'));

const ATTR = /\b(href|src|poster|content|action)=("|')(\/(?!\/)[^"']*)\2/g;   // attribute values that start with a single slash
const SRCSET = /\bsrcset=("|')([^"']*)\1/g;

function toRelative(url, prefix) {
  if (url.startsWith('//')) return url;
  const m = url.match(/^([^?#]*)([?#].*)?$/);
  let path = m[1]; const tail = m[2] || '';
  if (path === '/') return `${prefix}index.html${tail}`;
  const clean = path.replace(/\/$/, '');
  const hasExt = /\.[a-z0-9]+$/i.test(clean);
  if (!hasExt && existsSync(join(DIST, clean, 'index.html'))) path = `${clean}/index.html`;
  return prefix + path.replace(/^\//, '') + tail;
}

let count = 0;
for (const file of htmlFiles) {
  const dir = dirname(file);
  let prefix = posix.relative(dir.split('\\').join('/'), DIST.split('\\').join('/'));
  prefix = prefix ? `${prefix}/` : './';
  let html = readFileSync(file, 'utf8');
  html = html.replace(ATTR, (all, attr, q, url) => {
    if (attr === 'content' && !/^\/(_astro|poster|video|found)\//.test(url)) return all; // leave og:url and similar alone
    count++; return `${attr}=${q}${toRelative(url, prefix)}${q}`;
  });
  html = html.replace(SRCSET, (all, q, list) => `srcset=${q}${list.split(',').map((s) => { const [u, d] = s.trim().split(/\s+/); return (u.startsWith('/') && !u.startsWith('//') ? toRelative(u, prefix) : u) + (d ? ` ${d}` : ''); }).join(', ')}${q}`);
  html = html.replace(/<html(\s[^>]*)?>/, (all, attrs = '') => `<html${attrs} data-root="${prefix}">`);
  writeFileSync(file, html);
}
console.log(`relativize: ${htmlFiles.length} pages, ${count} urls rewritten`);
