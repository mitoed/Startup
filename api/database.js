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
const dbName = 'voting'
const sessionsCollection = client.db(dbName).collection('sessions')
const usersCollection = client.db(dbName).collection('users')
const foodCollection = client.db(dbName).collection('food')
const gameCollection = client.db(dbName).collection('game')
const movieCollection = client.db(dbName).collection('movie')

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
        console.log('Mongo DB has been reset to dummy values.')
    } catch (ex) {
        console.log('Something went wrong:', ex.message)
    }
}

async function clearMongoDB() {
    try {
        usersCollection.deleteMany()
        sessionsCollection.deleteMany()
        foodCollection.deleteMany()
        gameCollection.deleteMany()
        movieCollection.deleteMany()
        console.log('Cleared all Mongo collections')

    } catch (err) {
        console.error(`Error clearing the database: ${err}`)
    }
}

async function addDummyData() {
    try {
        const { users, sessions, options } = await loadDatabase()

        let result = await usersCollection.insertMany(users)
        console.log('Successfully added ', result.insertedCount, 'users')

        result = await sessionsCollection.insertMany(sessions)
        console.log('Successfully added ', result.insertedCount, 'sessions')

        const { food, game, movie } = options
        result = await foodCollection.insertMany(food)
        console.log('Successfully added ', result.insertedCount, 'food')
        result = await gameCollection.insertMany(game)
        console.log('Successfully added ', result.insertedCount, 'games')
        result = await movieCollection.insertMany(movie)
        console.log('Successfully added ', result.insertedCount, 'movies')

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
        console.log(`\nConnected to the ${dbName} database \n\nFull connection string: ${url}`)
    } catch (err) {
        console.error(`\nError connecting to the database: ${err}`)
    }
}

// Request sessions data from Mongo DB and add to LIVE_SERVER array
async function startLiveServer() {
    if (LIVE_SERVER.length === 0) {

        try {
            const result = await sessionsCollection.find()
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
        console.log('Success adding session ' + sessionInstance.session_id)
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
        const optionsCollection = client.db(dbName).collection(category)
        const result = await optionsCollection.find()

        const sessionOptions = []
        for await (const option of result) {
            sessionOptions.push(option)
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
        const result = await sessionsCollection.updateOne(filter, updates)
        return result
        
    } catch (ex) {
        console.log(`\nUnable to add user to session in database with ${url} because ${ex.message}`);
        process.exit(1);
    }
}

// =============================================================================
// Interacting with Mongo -- Voting Page
// =============================================================================








async function getMongoSession(getSessionID) {

    try {
        //await connectToDatabase()
        const result = await sessionsCollection.findOne({ session_id: getSessionID });
        return result

    } catch (ex) {
        console.log(`Unable to connect to database with ${url} because ${ex.message}`);
        process.exit(1);

    } finally {
        //await client.close()
    }

}


async function addUserToMongoSession(sessionID, username) {

    const filter = {session_id: sessionID}
    const newUser = {name: username, vote: null}
    const updates = { $push: { active_users_array: newUser}}

    try {
        const result = await sessionsCollection.updateMany(filter, updates)
        console.log('Update successful')
        console.log(result)
    } catch (ex) {
        console.log(`Unable to add user to session in database with ${url} because ${ex.message}`);
        process.exit(1);
    }
}

// =============================================================================
// SUPPORTING FUNCTIONS
// =============================================================================

/**
 * Load data from database
 */
function loadDatabase() {
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


/** Refresh array of given objects in the database
 * 
 * @param {*} jsonObject - name of array to be refreshed
 * @param {*} newData - new data to be sent
 */
async function refreshDatabase(newSessionData = null, newUserData = null, newOptionsData = null) {
    return new Promise(async (resolve, reject) => {
        try {
            // Access database and update
            // When this code is written, remove the dummy data

            const dummyData = await loadDatabase();
            dummyData['sessions'] = newSessionData || dummyData['sessions'];
            dummyData['users'] = newUserData || dummyData['users'];
            dummyData['options'] = newOptionsData || dummyData['options'];

            // Save the JSON to Dummy Data file
            const jsonContent = JSON.stringify(dummyData, null, 2);
            await fs.promises.writeFile(dummyDirectory, jsonContent);

            resolve(); // Resolve the promise when everything is done.

        } catch (error) {
            console.log('Internal Server Error: cannot connect to database');
            reject(error); // Reject the promise in case of an error.
        }
    });
}


/** Refresh array of votes in the live server
 * 
 * @param {string} sessionServer - name of liver server to be refreshed
 * @param {array} newServerData - new data to be sent
 */
async function refreshLiveData(sessionID, sessionUsersArray, category, tableListHTML) {
    try {
        // Access server data and update
        // When this code is written, remove the dummy data

        const dummyData = await loadDatabase()

        // Update the sessions Database
        const sessionInstance = dummyData['sessions'].find(session => session.session_id === sessionID)
        sessionInstance.active_users_array = sessionUsersArray

        // Update the server lists
        dummyData['options'][category] = tableListHTML

        // Save the JSON to Dummy Data file
        const jsonContent = JSON.stringify(dummyData, null, 2);
        fs.promises.writeFile(dummyDirectory, jsonContent)

    } catch {
        console.log('Internal Server Error: cannot connect to database')
    }
}

module.exports = {
    connectToDatabase,
    LIVE_SERVER,
    checkUserInfo,
    addUserInfo,
    addMongoSession,
    getMongoOptions,
    userToMongoSession,
}