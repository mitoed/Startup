const fs = require('fs')
const classes = require('./classes.js')
const dummyDirectory = './dummy_values.json'

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