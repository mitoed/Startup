const express = require('express');
const app = express();
require('dotenv').config();
const yelp = require('yelp-fusion');
const axios = require('axios')
const apiKey = process.env.YELP_API_KEY
console.log(apiKey)
const portYelp = 4000;

// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the frontend static content hosting
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

const client = yelp.client(apiKey);

/*function callGetYelpData() {
  return axios.get(`http://localhost:${portYelp}/get-yelp-data`)
}

app.get('/', (req, res) => {
  console.log('get "/" successful')
  callGetYelpData()
    .then(response => {
      const yelpData = response.data
      console.log('Yelp Data:', data)
      res.send(`Yelp Data: ${JSON.stringify(data)}`)
    })
    .catch(error => {
      res.status(500).send('Failed to fetch Yelp data')
    })
})*/

// get yelp api data
app.get('/get-yelp-data', (req, res) => {
  client.search({
    term: 'restaurant',
    location: 'provo, ut',
    open_now: 'true',
    sort_by: 'best_match',
  })
  .then(response => {
    const businessName = response.jsonBody.businesses[0].name;
    res.json({name: businessName})
  })
  .catch(error => {
    res.status(500).json({error: 'Failed to fetch Yelp data'})
  })
})

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});