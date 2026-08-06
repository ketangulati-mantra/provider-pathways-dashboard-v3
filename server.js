import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 80;
const DIST_DIR = path.join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];

  // Strip known subpath prefixes if present (longest prefix first with boundary check)
  const knownPrefixes = [
    '/provider_pathways_dashboard_v3',
    '/provider_pathways_dashboard_v2',
    '/provider_pathways_dashboard_v1',
    '/provider_dashboard_v1',
    '/provider_pathways_v2_testing',
    '/provider_pathways',
    '/provider_pathway'
  ];

  for (const prefix of knownPrefixes) {
    if (reqPath === prefix || reqPath.startsWith(prefix + '/')) {
      reqPath = reqPath.slice(prefix.length) || '/';
      break;
    }
  }

  let filePath = path.join(DIST_DIR, reqPath === '/' ? 'index.html' : reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA client-side routing
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        res.end('Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    });
  });
});

server.listen(PORT, () => {
  console.log(`Provider Pathways subpath server running on port ${PORT} at /provider_pathways`);
});
