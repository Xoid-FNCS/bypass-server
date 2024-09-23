const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.use('/proxy', createProxyMiddleware({
    target: '',
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
        res.status(500).send('Proxy error');
    }
}));

app.listen(port, () => {
    console.log(`Proxy server listening at http://localhost:${port}`);
});
