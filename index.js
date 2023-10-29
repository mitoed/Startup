const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors')
const axios = require('axios'); // Import Axios
const yelp = require('yelp-fusion')
const apiKey = process.env.YELP_API_KEY

// The service port. In production, the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use CORS
app.use(cors())

// test
app.get('/test1', (req, res) => {
    console.log('node.js - success')
})

// Node.js search example function
const sdk = require('api')('@yelp-developers/v1.0#420s3alobgub91');

// Route for fetching Yelp data and returning it as JSON
app.get('/get-yelp-data', async (req, res) => {
    sdk.auth(`Bearer ${apiKey}`);
    sdk.v3_business_search({
        location: 'provo%2C%20ut',
        term: 'restaurant',
        open_now: 'true',
        sort_by: 'best_match',
        limit: '10'
    })
    .then(({ data }) => console.log(data))
    .catch(err => console.error(err));
});

// Serve up the frontend static content hosting
app.use(express.static('public'));

// Return the application's default page if the path is unknown
app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
