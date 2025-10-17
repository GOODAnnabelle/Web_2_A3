// Simplified server - no external dependencies required
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Create HTTP server
const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // Get requested URL path
  let filePath = req.url;
  
  // Default to serve index.html
  if (filePath === '/') {
    filePath = '/index.html';
  }
  
  // Build complete file path
  filePath = path.join(__dirname, 'public', filePath);
  
  // Get file extension
  const extname = String(path.extname(filePath)).toLowerCase();
  
  // Content type mapping
  const contentTypeMap = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
  };
  
  // Set content type
  const contentType = contentTypeMap[extname] || 'text/plain';
  
  // Read file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found - serve index.html
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, indexContent) => {
          if (err) {
            res.writeHead(500);
            res.end('Server error');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(indexContent, 'utf-8');
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server error: ${error.code}`);
      }
    } else {
      // Successful response
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});