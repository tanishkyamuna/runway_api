const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.url === '/manifest.json') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    fs.createReadStream(path.join(__dirname, 'public', 'manifest.json')).pipe(res);
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Hello Node.js v${process.versions.node}!`);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});