// =============================================================================
// Mongo DB Functions & Values
// =============================================================================

const fs = require('fs')
const sampleDirectory = './sample_values.json'
const { MongoClient } = require('mongodb')
const config = require('./dbConfig.json')

// Access Mongo Database
const url = `mongodb+srv://${config.username}:${config.password}@${config.hostname}`
const client = new MongoClient(url)
const sessionsCollection = client.db('voting').collection('sessions')
const usersCollection = client.db('voting').collection('users')

// LIVE SERVER Initialization
const LIVE_SERVER = []

// =============================================================================
// Mongo Database Setup Functions -- Development Only
// =============================================================================

// START ME TO RESET MONGO DB TO DEFAULT VALUES
//resetMongo()

async function resetMongo() {
    try {

        // This will completely clear user and session collections
        await clearMongoDB()

        // This will add sample values to user and session collections
        await addSampleData()
        
    } catch (ex) {
        console.log('\nSomething went wrong:', ex.message)
    }
}

async function clearMongoDB() {
    try {
        await usersCollection.deleteMany()
        await sessionsCollection.deleteMany()
        console.log('\nCleared all Mongo collections')

    } catch (err) {
        console.error(`\nError clearing the database: ${err}`)
    }
}

async function addSampleData() {
    try {
        const { users, sessions } = await loadSampleData()

        let result = await usersCollection.insertMany(users)
        console.log('\nSuccessfully added ', result.insertedCount, 'users')

        result = await sessionsCollection.insertMany(sessions)
        console.log('\nSuccessfully added ', result.insertedCount, 'sessions')

        console.log('\nMongo DB has been reset to sample values.')

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
            const result = await sessionsCollection.find({ end_time: 0 })
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
async function endSession(sessionID, category, optionsArray) {

    const session = client.startSession()
    
    const filter = { "session_id": sessionID }
    const updates = { $inc: { end_time: Date.now() } }

    try {

        // Replace the options DB with the new set of options
        const optionsCollection = client.db('options').collection(category)
        for await (const option of optionsArray) {
            await optionsCollection.updateOne({ "name" : option }, { $set: { "name" : option } }, { upsert: true, session })
        }
        
        //await optionsCollection.deleteMany()
        //await optionsCollection.insertMany(optionUpdates)

        if (sessionID === 'SAMPLE') {
            console.log('\nSAMPLE session will not be ended in database.')

        // End the session in Mongo
        } else if (sessionID !== 'SAMPLE') {
            await sessionsCollection.updateOne(filter, updates, {session})
            console.log('\nSuccess updating SESSION in Mongo')
        }

    } catch (ex) {
        console.log(`\nUnable to end session in database with ${url} because ${ex.message}`);
        process.exit(1);
    } finally {
        session.endSession()
        return
    }
}

/** Increments the total and winning counts for the users of a completed session
 * 
 * @param {array} allUsers - array of all users in session
 * @param {array} winUsers - array of users that picked the group selection
 * @returns - confirmation of success
 */
async function updateUsers(allUsers, winUsers) {

    const session = client.startSession()

    try {
        for await (const user of allUsers) {
            const filter = { "username": user }
            const update = { $inc: { sessions_total: 1 } }
            await usersCollection.updateOne(filter, update, {session})
        }

        for await (const winner of winUsers) {
            const filter = { "username": winner }
            const update = { $inc: { sessions_won: 1 } }
            await usersCollection.updateOne(filter, update, {session})
        }

        console.log('\nSuccess updating USERS in Mongo')

    } catch (ex) {
        console.log(`\nUnable to update user at end of session in database with ${url} because ${ex.message}`);
        process.exit(1);

    } finally {
        await session.endSession()
        return
    }
}

// =============================================================================
// SUPPORTING FUNCTIONS
// =============================================================================

/**
 * Load data from database
 */
function loadSampleData() {
    return new Promise(async (resolve, reject) => {
        try {
            // Access sample data

            const jsonData = await fs.promises.readFile(sampleDirectory, 'utf8');
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