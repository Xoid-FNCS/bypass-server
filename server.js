const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Use CORS middleware
app.use(cors());

// Proxy middleware
app.use('/proxy', createProxyMiddleware({
    target: 'http://example.com', // This will be overridden by the query parameter
    changeOrigin: true,
    pathRewrite: {
        '^/proxy': '', // Remove /proxy from the request path
    },
    onProxyReq: (proxyReq, req) => {
        const targetUrl = req.query.target;
        if (targetUrl) {
            proxyReq.setHeader('Host', new URL(targetUrl).host);
            proxyReq.path = targetUrl;
        }
    },
    onProxyRes: function (proxyRes) {
        // Modify response headers to evade blockers
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        delete proxyRes.headers['X-Frame-Options'];
        delete proxyRes.headers['Content-Security-Policy'];
    },
    onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy error');
    }
}));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(port, () => {
    console.log(`Proxy server listening at http://localhost:${port}`);
});
