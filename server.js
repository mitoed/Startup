// Initialize general modules
const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors')

// Initialize page modules
const login = require('./api/login.js')
const enter_session = require('./api/enter_session.js')
const voting_session = require('./api/voting_session.js')

// Setup cors
app.use(cors({
  origin: 'https://startup.activityanarchy.click',
  methods: 'GET, POST',
  allowedHeaders: 'Content-Type, Authorization'
}));

// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the frontend static content hosting
app.use(express.static('public'));

async function setupServer() {
  try {
    login.pageSetup (app)
    enter_session.pageSetup (app)
    voting_session.pageSetup (app)

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

setupServer()

module.exports = app