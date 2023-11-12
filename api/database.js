// =============================================================================
// Mongo DB Functions & Values
// =============================================================================

const fs = require('fs')
const classes = require('./classes.js')
const dummyDirectory = './dummy_values.json'
const { MongoClient } = require('mongodb')
const config = require('./dbConfig.json')

// Access Mongo Database
const url = `mongodb+srv://${config.username}:${config.password}@${config.hostname}`
const client = new MongoClient(url)
const sessionsCollection = client.db('voting').collection('sessions')
const usersCollection = client.db('voting').collection('users')
const foodCollection = client.db('options').collection('food')
const gameCollection = client.db('options').collection('game')
const movieCollection = client.db('options').collection('movie')

// LIVE SERVER Initialization
const LIVE_SERVER = []

// =============================================================================
// Mongo Database Setup Functions -- Development Only
// =============================================================================

// START ME TO RESET MONGO DB TO DEFAULT VALUES
//resetMongo()

async function resetMongo() {
    try {
        await clearMongoDB()
        await addDummyData()
        console.log('\nMongo DB has been reset to dummy values.')
        client.close()
    } catch (ex) {
        console.log('\nSomething went wrong:', ex.message)
    }
}

async function clearMongoDB() {
    try {
        await usersCollection.deleteMany()
        await sessionsCollection.deleteMany()
        await foodCollection.deleteMany()
        await gameCollection.deleteMany()
        await movieCollection.deleteMany()
        console.log('\nCleared all Mongo collections')

    } catch (err) {
        console.error(`\nError clearing the database: ${err}`)
    }
}

async function addDummyData() {
    try {
        const { users, sessions, options } = await loadDummyData()

        let result = await usersCollection.insertMany(users)
        console.log('\nSuccessfully added ', result.insertedCount, 'users')

        result = await sessionsCollection.insertMany(sessions)
        console.log('\nSuccessfully added ', result.insertedCount, 'sessions')

        const { food, game, movie } = options
        result = await foodCollection.insertMany(food)
        console.log('\nSuccessfully added ', result.insertedCount, 'food')
        result = await gameCollection.insertMany(game)
        console.log('\nSuccessfully added ', result.insertedCount, 'games')
        result = await movieCollection.insertMany(movie)
        console.log('\nSuccessfully added ', result.insertedCount, 'movies')

    } catch (err) {
        console.error(`Error adding options to the database: ${err}`)
    }
}

// =============================================================================
// Mongo DB and LIVE SERVER Initialization Functions
// =============================================================================

MASTERCONNECT()

async function MASTERCONNECT() {
    await connectToDatabase()
    await startLiveServer()
}

// Begin connection with Mongo Database
async function connectToDatabase () {
    try {
        await client.connect();
        console.log(`\nConnected to the Mongo database \n\nFull connection string: ${url}`)
    } catch (err) {
        console.error(`\nError connecting to the database: ${err}`)
    }
}

// Request sessions data from Mongo DB and add to LIVE_SERVER array
async function startLiveServer() {
    if (LIVE_SERVER.length === 0) {

        try {
            const result = await sessionsCollection.find({ end_time: "" })
            for await (const session of result) {
                LIVE_SERVER.push(session)
            }
            console.log('\nSuccessfully loaded LIVE SERVER from Mongo DB.')
            return

        } catch (ex) {
            console.log(`\nUnable to connect to database with ${url} because ${ex.message}`);
            process.exit(1);
        }
    }
}

// =============================================================================
// Interacting with Mongo -- Login Page
// =============================================================================

/** Requests an entry by username from the Mongo DB
 * 
 * @param {string} checkUsername - username of requested data
 * @returns - user object from Mongo DB
 */
async function checkUserInfo(checkUsername) {
    try {
        const result = await usersCollection.findOne({ username: checkUsername });
        return result

    } catch (ex) {
        console.log(`\nUnable to check user info in database with ${url} because ${ex.message}`);
    }
}

/** Adds a user entry to Mongo DB
 * 
 * @param {object} userInstance - user object to be added
 */
async function addUserInfo(userInstance) {
    try {
        const result = await usersCollection.insertOne(userInstance);
        return result

    } catch (ex) {
        console.log(`\nUnable to add user to database with ${url} because ${ex.message}`);
    }
}

// =============================================================================
// Interacting with Mongo -- Enter Session Page
// =============================================================================

/** Add a new session object to the Mongo DB
 * 
 * @param {object} sessionInstance - session object to be added
 */
async function addMongoSession(sessionInstance) {
    try {
        const result = await sessionsCollection.insertOne(sessionInstance);
        return result

    } catch (ex) {
        console.log(`\nUnable to add session to database with ${url} because ${ex.message}`);
    }
}

/** Requests the options list stored in Mongo DB
 * 
 * @param {string} category - identifies the collection to return
 * @returns - array of option objects for the category
 */
async function getMongoOptions(category) {
    try {
        const optionsCollection = client.db('options').collection(category)
        const result = await optionsCollection.find()

        const sessionOptions = []
        for await (const option of result) {
            sessionOptions.push(option.name)
        }
        return sessionOptions

    } catch (ex) {
        console.log(`\nUnable to request options from database with ${url} because ${ex.message}`);
    }
}

/** Adds a user to the session entry of Mongo DB
 * 
 * @param {string} sessionID - session to be updated
 * @param {string} username - user to be added
 * @returns - confirmation of success
 */
async function userToMongoSession(sessionID, username) {

    const filter = {session_id: sessionID}
    const newUser = {name: username, vote: null}
    const updates = { $push: { active_users_array: newUser}}

    try {

        const session = await sessionsCollection.findOne(filter)
        const isActiveUser = session.active_users_array.some(u => u.name === username)

        // Only add the user if they are not already in the session
        if (!isActiveUser) {
            const result = await sessionsCollection.updateOne(filter, updates)
            return result
        }

        return
        
    } catch (ex) {
        console.log(`\nUnable to add user to session in database with ${url} because ${ex.message}`);
        process.exit(1);
    }
}

// =============================================================================
// Interacting with Mongo -- Voting Page
// =============================================================================

/** Updates session with an end time, 'closing' the session
 * 
 * @param {string} sessionID - id of session to be closed
 * @returns - confirmation of success
 */
async function endSession(sessionID) {
    
    const filter = { session_id: sessionID }
    const updates = { end_time: Date.now() }

    try {
        const result = await usersCollection.updateOne(filter, updates)
        return result

    } catch (ex) {
        console.log(`\nUnable to update user at end of session in database with ${url} because ${ex.message}`);
        process.exit(1);
    }
}

/** Increments the total and winning counts for the users of a completed session
 * 
 * @param {array} allUsers - array of all users in session
 * @param {array} winUsers - array of users that picked the group selection
 * @returns - confirmation of success
 */
async function updateUsers(allUsers, winUsers) {

    console.log('All:', allUsers)
    console.log('Winners:', winUsers)

    const allFilter = { username: { $in: allUsers } };
    const allUpdates = { $inc: { sessions_total: 1 } };
    const winFilter = { username: { $in: winUsers } };
    const winUpdates = { $inc: { sessions_won: 1 } };

    try {
        let result = await usersCollection.updateMany(allFilter, allUpdates)
        result = await usersCollection.updateMany(winFilter, winUpdates)
        return result

    } catch (ex) {
        console.log(`\nUnable to update user at end of session in database with ${url} because ${ex.message}`);
        process.exit(1);
    }
}

// =============================================================================
// SUPPORTING FUNCTIONS
// =============================================================================

/**
 * Load data from database
 */
function loadDummyData() {
    return new Promise(async (resolve, reject) => {
        try {
            // Access database
            // When this code is written, remove the dummy data

            const jsonData = await fs.promises.readFile(dummyDirectory, 'utf8');
            const data = JSON.parse(jsonData);
            resolve(data); // Resolve the promise with the data.

        } catch (error) {
            console.log('Internal Server Error: cannot connect to database');
            reject(error); // Reject the promise in case of an error.
        }
    });
}

module.exports = {
    connectToDatabase,
    LIVE_SERVER,
    checkUserInfo,
    addUserInfo,
    addMongoSession,
    getMongoOptions,
    userToMongoSession,
    endSession,
    updateUsers,
}