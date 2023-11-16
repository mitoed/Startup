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

// Live Servers Initialization
const LIVE_SESSIONS = []
const LIVE_USERS = []

// =============================================================================
// Mongo DB and Live Servers Initialization Functions
// =============================================================================

MASTERCONNECT()

async function MASTERCONNECT() {
    await connectToDatabase()
    await getLiveData()
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
async function getLiveData() {

    if (LIVE_SESSIONS.length === 0) {
        try {
            const result = await sessionsCollection.find({ end_time: 0 })
            for await (const session of result) {
                LIVE_SESSIONS.push(session)
            }
            console.log('\nSuccessfully loaded LIVE_SESSIONS from Mongo DB.')

        } catch (ex) {
            console.log(`\nUnable to connect to database with ${url} because ${ex.message}`);
            process.exit(1);
        }
    }

    if (LIVE_USERS.length === 0) {
        try {
            const data = await loadSampleData()
            for await (const user of data.LIVE_USERS){
                LIVE_USERS.push(user)
            }
            console.log('\nSuccessfully loaded LIVE_USERS from sample data')

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
async function getUser(checkUsername) {
    try {
        return await usersCollection.findOne({ username: checkUsername });

    } catch (ex) {
        console.log(`\nUnable to check user info in database with ${url} because ${ex.message}`);
    }
}

/** Adds a user entry to Mongo DB
 * 
 * @param {object} userInstance - user object to be added
 */
async function createUser(userInstance) {
    try {
        return await usersCollection.insertOne(userInstance);

    } catch (ex) {
        console.log(`\nUnable to add user to database with ${url} because ${ex.message}`);
    }
}

async function getUserByToken(authToken) {
    return await usersCollection.findOne({ token: authToken })

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
        return await sessionsCollection.insertOne(sessionInstance);

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
            return await sessionsCollection.updateOne(filter, updates)
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

module.exports = {
    connectToDatabase,
    LIVE_SESSIONS,
    LIVE_USERS,
    getUser,
    createUser,
    getUserByToken,
    addMongoSession,
    getMongoOptions,
    userToMongoSession,
    endSession,
    updateUsers,
}