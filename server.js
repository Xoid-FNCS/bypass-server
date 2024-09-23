const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Use CORS middleware
app.use(cors());

// Proxy middleware
app.use('/proxy', createProxyMiddleware({
    target: '', // Placeholder for the target URL
    changeOrigin: true,
    pathRewrite: {
        '^/proxy': '', // Remove /proxy from the request path
    },
    onProxyReq: (proxyReq, req, res) => {
        // Modify the proxy request if needed
    },
    onProxyRes: (proxyRes) => {
        // Modify response headers
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

// Handle requests to open the specified URL in a new tab
app.get('/open', (req, res) => {
    const targetUrl = req.query.url;
    if (targetUrl) {
        // Update the target URL in the proxy configuration
        createProxyMiddleware({
            target: targetUrl,
            changeOrigin: true,
            pathRewrite: {
                '^/proxy': '',
            },
        })(req, res);
    } else {
        res.status(400).send('URL is required');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Monkey Bypass server listening at http://localhost:${port}`);
});
