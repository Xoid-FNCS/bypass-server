const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const port = process.env.PORT || 3000;

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Proxy requests
app.use('/proxy', (req, res, next) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('No URL provided');
    }

    createProxyMiddleware({
        target: url,
        changeOrigin: true,
        onError: (err, req, res) => {
            console.error('Proxy error:', err);
            res.status(500).send('Proxy error');
        }
    })(req, res, next);
});

// Start the server
app.listen(port, () => {
    console.log(`Proxy server listening at http://localhost:${port}`);
});
