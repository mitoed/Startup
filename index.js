const express = require('express');
const app = express();

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
  console.log(returnedData)
});

// SubmitScore
apiRouter.post('/score', (req, res) => {
  scores = updateScores(req.body, scores);
  res.send(scores);
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

let returnedData
const key = process.env.YELP_API_KEY

const options = {
    method: 'GET',
    headers: {
    accept: 'application/json',
    Authorization: `Bearer ${key}`
    }
};

await fetch('https://api.yelp.com/v3/businesses/search?location=provo%20utah&term=restaurant&open_now=true&sort_by=best_match&limit=10', options)
    .then(response => response.json())
    .then(response => returnedData = response)
    .then(response => console.log(response))