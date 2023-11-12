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

// Test connection with Mongo Database
const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log(`Connected to the ${dbName} database \nFull connection string: ${url}`)
    } catch (err) {
        console.error(`Error connecting to the database: ${err}`)
    }
}


async function addMongoSession(sessionInstance) {

    try {
        await connectToDatabase()
        const result = await sessionsCollection.insertOne(sessionInstance);
        console.log('Success Inserting:', result)

    } catch (ex) {
        console.log(`Unable to connect to database with ${url} because ${ex.message}`);
        process.exit(1);

    } finally {
        await client.close()
    }
}


async function getMongoSession(getSessionID) {

    try {
        //await connectToDatabase()
        const result = await sessionsCollection.findOne({ session_id: getSessionID });
        console.log(result)
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
        //await connectToDatabase()
        const result = await sessionsCollection.updateMany(filter, updates)
        console.log('Update successful')
        console.log(result)
    } catch (ex) {
        console.log(`Unable to connect to database with ${url} because ${ex.message}`);
        process.exit(1);

    } finally {
        //await client.close()
    }
}

const sessionInstance = {
    session_id: 'DK37DS',
    category: 'food',
    active_users_array: [
        { name: 'MASAULLS', vote: null }
    ],
    start_time: Date.now(),
    unpopular_vote: '',
    end_time: ''
}

//addMongoSession(sessionInstance)
async function addNewUser() {
    try {
        await connectToDatabase()
        await addUserToMongoSession('DK37DS', 'SSAULLS')
        await getMongoSession('DK37DS')
    
    } catch (ex) {
        console.log(`Unable to connect to database with ${url} because ${ex.message}`);
        process.exit(1);
    } finally {
        await client.close()
    }
}

async function mongoSetup() {
    try {
        await connectToDatabase()
    } catch (ex) {
        console.log(`Unable to connect to database with ${url} because ${ex.message}`);
        await client.close()
        console.log('Connection severed to database.')
        process.exit(1);
    } finally {
        //await client.close()
    }
}

mongoSetup()


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

module.exports = { loadDatabase, refreshDatabase, refreshLiveData }