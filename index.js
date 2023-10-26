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
apiRouter.get('/scores', (_req, res) => {
  res.send(scores);
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

const sdk = require('api')('@yelp-developers/v1.0#3f3jj1zflo6f1uzh');
const key = process.env.YELP_API_KEY

sdk.auth(`Bearer ${key}`);
sdk.v3_business_search({
  location: 'provo%20utah',
  term: 'restaurant',
  open_now: 'true',
  sort_by: 'best_match',
  limit: '10'
})
  .then(({ data }) => console.log(data))
  .catch(err => console.error(err));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});