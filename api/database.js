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

// Test connection with Mongo Database
const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log(`Connected to the ${dbName} database \nFull connection string: ${url}`)
    } catch (err) {
        console.error(`Error connecting to the database: ${err}`)
    }
}

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
        console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    }
}

/** Adds a user entry to Mongo DB
 * 
 * @param {object} userInstance - user object to be added
 */
async function addUserInfo(userInstance) {
    try {
        await usersCollection.insertOne(userInstance);
    } catch (ex) {
        console.log(`Unable to connect to database with ${url} because ${ex.message}`);
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

module.exports = { connectToDatabase, checkUserInfo, addUserInfo }
//module.exports = { loadDatabase, refreshDatabase, refreshLiveData, testDB, changeVote }