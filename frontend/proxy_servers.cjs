/**
 * CampusOn Multi-Port Fallback Proxy Server
 * Madhav Institute of Technology & Science, Gwalior
 * 
 * Proxies incoming requests from fallback ports (3001, 8080, 5173) 
 * directly to the primary Vite application running at http://127.0.0.1:3000
 */

const http = require('http');

const TARGET_HOST = '127.0.0.1';
const TARGET_PORT = 3000;
const PROXY_PORTS = [3001, 8080, 5173];

function createProxyForPort(port) {
  const server = http.createServer((clientReq, clientRes) => {
    const options = {
      hostname: TARGET_HOST,
      port: TARGET_PORT,
      path: clientReq.url,
      method: clientReq.method,
      headers: {
        ...clientReq.headers,
        host: `${TARGET_HOST}:${TARGET_PORT}`,
        'x-forwarded-for': clientReq.socket.remoteAddress,
        'x-forwarded-port': port.toString()
      }
    };

    const proxyReq = http.request(options, (proxyRes) => {
      clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(clientRes, { end: true });
    });

    proxyReq.on('error', (err) => {
      clientRes.writeHead(502, { 'Content-Type': 'text/html' });
      clientRes.end(`
        <div style="font-family: sans-serif; padding: 2rem; text-align: center; color: #8b1e3f;">
          <h2>CampusOn Multi-Port Fallback Proxy (Port ${port})</h2>
          <p>Connecting to primary application at http://${TARGET_HOST}:${TARGET_PORT}...</p>
        </div>
      `);
    });

    if (clientReq.method === 'GET' || clientReq.method === 'HEAD') {
      proxyReq.end();
    } else {
      clientReq.pipe(proxyReq, { end: true });
    }
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[Proxy Notice] Port ${port} is currently in use by another process. Skipping.`);
    } else {
      console.error(`[Proxy Error] Port ${port}:`, err.message);
    }
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`[Multi-Port Proxy] Listening on http://127.0.0.1:${port} -> Forwarding to http://${TARGET_HOST}:${TARGET_PORT}`);
  });

  return server;
}

PROXY_PORTS.forEach(port => createProxyForPort(port));

console.log(`[CampusOn Network Router] Multi-port proxies active for: ${PROXY_PORTS.map(p => `http://127.0.0.1:${p}`).join(', ')}`);
