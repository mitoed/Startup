const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors')

// Setup cors
app.use(cors());

// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the frontend static content hosting
app.use(express.static('public'));

async function setupServer() {
  try {
    // Listen for yelp api call from main.js
    app.get('/get-yelp-data', async (req, res) => {
      console.log('trying /get-yelp-data')
      const yelpData = await getYelpData()
      console.log('/get-yelp-data successful')
      res.json(yelpData)
    })

    // Return the application's default page if the path is unknown
    app.use((_req, res) => {
      res.sendFile('index.html', { root: 'public' });
    });
    
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (error) {
    console.error('An error occured during the server setup:', error)
    process.exit(1)
  }
}

const yelpAPI = process.env.YELP_API_KEY
const location = 'provo%2C%20ut'
const term = 'restaurant'
const open_now = 'true'
const sort_by = 'best_match'
const limit = '10'

async function getYelpData() {
  console.log('trying getYelpData')
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${yelpAPI}`
    }
  };
  
  let data
  console.log('trying API fetch')
  await fetch(`https://api.yelp.com/v3/businesses/search?location=${location}&term=${term}&open_now=${open_now}&sort_by=${sort_by}&limit=${limit}`, options)
    .then(response => response.json())
    .then(response => data = response)
    .catch(err => console.error(err));

  console.log('APT fetch successful')
  const yelpData = restaurantData(data.businesses)
  
  console.log('YELPDATA', yelpData)
  console.log('getYelpData successful')
  return yelpData
}

function restaurantData(yelpData) {
  const randDigit = Math.floor(Math.random() * yelpData.length)
  const randRestaurant = yelpData[randDigit]

  return {
    name: randRestaurant.name,
    url: randRestaurant.url
  }
}

module.exports = app