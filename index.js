const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors')
const fetch = require('node-fetch')
const yelp = require('yelp-fusion')
const apiKey = process.env.YELP_API_KEY

// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use CORS
app.use(cors())

const client = yelp.client(apiKey)

// Route for fetching Yelp data and returning it as JSON
app.get('/get-yelp-data', async (req, res) => {
    // Yelp Search Example Function
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${apiKey}`
        }
      };
      
      fetch('https://api.yelp.com/v3/businesses/search?location=provo%2C%20ut&term=restaurant&open_now=true&sort_by=best_match&limit=10', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));

    // GitHub function
    /*try {
        // Fetch data from Yelp Fusion API
        const response = await client.search({
            term: 'Four Barrel Coffee',
            location: 'san francisco, ca',
        });

        // Extract the name of the first business
        console.log(response)
        const businessName = response.jsonBody.businesses[0].name;

        res.json({ name: businessName });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to fetch Yelp data' });
    }*/
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