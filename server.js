const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const port = process.env.PORT || 3000;

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Proxy requests
app.use('/proxy', createProxyMiddleware({
    target: '', // leave this empty
    changeOrigin: true,
    pathRewrite: {
        '^/proxy': '',
    },
    onProxyReq: (proxyReq, req) => {
        const url = req.query.url;
        if (url) {
            proxyReq.setHeader('Host', new URL(url).host);
            proxyReq.setHeader('Referer', url);
        }
    },
    onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy error');
    }
}));

// Start the server
app.listen(port, () => {
    console.log(`Proxy server listening at http://localhost:${port}`);
});
