const express = require('express');
const request = require('request');
const app = express();
const port = 3000;

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Proxy route
app.post('/proxy', (req, res) => {
    const url = req.body.url;
    
    if (!url) {
        return res.status(400).send('URL is required');
    }

    // Make a request to the provided URL
    request(url, (error, response, body) => {
        if (error) {
            return res.status(500).send('Error fetching the URL');
        }
        res.send(body);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Proxy server listening at http://localhost:${port}`);
});
