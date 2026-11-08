const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = __dirname;
const files = fs.readdirSync(root, { recursive: true }).filter(f => fs.statSync(path.join(root, f)).isFile());
const missing = new Set();
let scripts = 0;
for (const file of files) {
  const ext = path.extname(file);
  if (!['.html', '.css', '.js', '.json'].includes(ext)) continue;
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  if (ext === '.json') { JSON.parse(source); continue; }
  if (/__next_f|webpackChunk|\/_next\/|react-dom/.test(source)) throw new Error(`Obsolete framework reference in ${file}`);
  if (ext === '.js') { new vm.Script(source, { filename: file }); scripts++; continue; }
  const urls = [];
  if (ext === '.html') {
    for (const tag of source.matchAll(/<(?:img|link|script)\b[^>]*>/g)) {
      for (const attr of tag[0].matchAll(/(?:src|href)="([^"]+)"/g)) urls.push(attr[1]);
      for (const set of tag[0].matchAll(/srcSet="([^"]+)"/gi)) urls.push(...set[1].split(',').map(s => s.trim().split(' ')[0]));
    }
  } else {
    for (const match of source.matchAll(/url\(([^)]+)\)/g)) urls.push(match[1].replace(/^["']|["']$/g, ''));
  }
  for (const url of urls) {
    if (/^(?:data:|https?:|\/\/)/.test(url)) continue;
    const relative = decodeURIComponent(url.split(/[?#]/)[0]);
    const resolved = relative.startsWith('/') ? path.join(root, relative) : path.resolve(root, path.dirname(file), relative);
    if (!fs.existsSync(resolved)) missing.add(relative);
  }
}
if (missing.size) { console.error('Missing assets:', [...missing]); process.exitCode = 1; }
else console.log(`Asset audit passed: ${files.filter(f => f.endsWith('.html') && f !== 'reference.html').length} landing pages; ${scripts} vanilla JavaScript files parsed; JSON valid; no framework references; all linked HTML and CSS assets exist.`);
