const express = require('express');
const app = express();

const apiKey = process.env.YELP_API_KEY

const yelp = require('yelp-fusion');
const client = yelp.client(apiKey);

// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the frontend static content hosting
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// GetScores
apiRouter.get('/yelpdata', (_req, res) => {
    client.search({
        term: 'restaurant',
        location: 'provo, ut',
      }).then(response => {
        console.log(response.jsonBody.businesses[0].name);
      }).catch(e => {
        console.log(e);
      });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});