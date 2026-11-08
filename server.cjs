const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain; charset=utf-8' };
http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400).end('Bad request'); return; }
  if (pathname === '/favicon.ico') { res.writeHead(204).end(); return; }
  if (pathname === '/' || pathname === '/en') { res.writeHead(302, { Location: '/en/' + new URL(req.url, 'http://localhost').search }).end(); return; }
  if (pathname === '/en/') pathname = '/index.html';
  if (pathname === '/verifier' || pathname === '/verifier/') pathname = '/verifier/index.html';
  const localeMatch = pathname.match(/^\/(ar|cn|cnt|de|es|fi|fr|id|it|jp|kr|ms|nl|no|pl|pt|ru|th|tr|vi)\/?$/);
  if (localeMatch) pathname = '/locales/' + localeMatch[1] + '/index.html';
  const file = path.resolve(root, '.' + pathname);
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end('Forbidden'); return; }
  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) { console.error('404', pathname); res.writeHead(404).end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    fs.createReadStream(file).pipe(res);
  });
}).listen(5173, '127.0.0.1', () => console.log('Brawl Stars: http://127.0.0.1:5173'));
