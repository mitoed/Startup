// Initialize general modules
const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors')
const { peerProxy } = require('./peer_proxy.js');

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

setupPages()

async function setupPages() {
    try {
        login.pageSetup(app)
        enter_session.pageSetup(app)
        voting_session.pageSetup(app)

    } catch (error) {
        console.error('An error occured during the server setup:', error)
        process.exit(1)
    }
}

// Return the application's default page if the path is unknown
app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

// Notify user of active port
const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Create and run WebSocket server
peerProxy(httpService);

module.exports = app