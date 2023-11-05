const fs = require('fs')
const classes = require('./classes.js')
const dummyDirectory = './dummy_values.json'

// =============================================================================
// SUPPORTING FUNCTIONS
// =============================================================================

/**
 * Load data from database
 */
async function loadDatabase() {
    try {
        // Access database
        // When this code is written, remove the dummy data
        
        const jsonData = await fs.promises.readFile(dummyDirectory, 'utf8')
        const data = JSON.parse(jsonData)
        return data

    } catch {
        console.log('Internal Server Error: cannot connect to database')
    }
}

/** Refresh array of given objects in the database
 * 
 * @param {*} jsonObject - name of array to be refreshed
 * @param {*} newData - new data to be sent
 */
async function refreshDatabase(jsonObject, newData) {
    try {
        // Access database and update
        // When this code is written, remove the dummy data

        const dummyData = await loadDatabase()
        dummyData[jsonObject] = newData

        // Save the JSON to Dummy Data file
        const jsonContent = JSON.stringify(dummyData, null, 2);
        fs.promises.writeFile(dummyDirectory, jsonContent);

    } catch {
        console.log('Internal Server Error: cannot connect to database')
    }
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
        const sessionInstance = dummyData['sessions'].filter(session => session.session_id === sessionID)[0]
        sessionInstance.active_users_array = sessionUsersArray
        
        // Update the server lists
        dummyData['live_servers']['server' + category.toUpperCase()] = tableListHTML

        // Save the JSON to Dummy Data file
        const jsonContent = JSON.stringify(dummyData, null, 2);
        fs.promises.writeFile(dummyDirectory, jsonContent)

    } catch {
        console.log('Internal Server Error: cannot connect to database')
    }
}

/**
 * 
 * @param {string} username - username of user who will be added to the session
 * @param {string} sessionID  - the session which should they be added to
 * @param {array} DB_SESSIONS - the array of session data
 * @returns 
 */
async function joinSession(username, sessionID, DB_SESSIONS = []) {

    // Access server and push username to that open session
    // Without access to server's live data, access and push new data to JSON
    for (let { session_id, active_users_array, end_time } of DB_SESSIONS) {
        if (sessionID === session_id && end_time === '') {
            
            // Add user to the active users array
            active_users_array.push({user: username, vote: null})

            // Refresh the database with the updated data
            await refreshDatabase('sessions', DB_SESSIONS)

            // Data updated
            return true
        }
    }
    
    // Data not updated
    return false
}

/** Create a session id and verify that it doesn't already exist
 * 
 * @param {string} sessionCategory - the category (movie, game, food) to send to randomSessionID()
 * @param {array} DB_SESSIONS - array of sessions to check for duplicates
 * @returns the new session id
 */
function createSessionID(sessionCategory, DB_SESSIONS) {
    let newSessionID
    for (let loopLimit = 0; loopLimit < 10; loopLimit++) {
        
        // Create a new session ID
        newSessionID = randomSessionID(sessionCategory)

        // If it already exists, make a new one
        const existingID = DB_SESSIONS.some(session => session.session_id === newSessionID)
        if (!existingID) {return newSessionID}
    }
    console.log('Something went wrong while creating a session ID.')
    return null
}

/** Create a random session id using the category
 * 
 * @param {string} sessionCategory - the category (movie, game, food) for which a session will be created
 * @returns the created session id
 */
function randomSessionID(sessionCategory) {
    let sessionString = []
    let digitArray1

    switch (true) {
        case sessionCategory === 'food':
            digitArray1 = ['B', 'C', 'D', 'F', 'G', 'H', 'J']
            break
        case sessionCategory === 'movie':
            digitArray1 = ['K', 'L', 'M', 'N', 'P', 'Q']
            break
        case sessionCategory === 'game':
            digitArray1 = ['R', 'S', 'T', 'V', 'W', 'X', 'Z']
            break
    }
    let digitArray2 = 'BCDFGHJKLMNPQRSTVWXZ'.split('')
    let digitArray3 = '23456789'.split('')

    sessionString.push(classes.randomDigit(digitArray1))
    sessionString.push(classes.randomDigit(digitArray3))
    sessionString.push(classes.randomDigit(digitArray2))
    sessionString.push(classes.randomDigit(digitArray3))
    sessionString.push(classes.randomDigit(digitArray2))
    sessionString.push(classes.randomDigit(digitArray3))

    sessionString = sessionString.join('')
    return sessionString
}

module.exports = { loadDatabase, refreshDatabase, refreshLiveData, joinSession, createSessionID }