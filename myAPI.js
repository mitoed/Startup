const fs = require('fs')
const classes = require('./public/modules/classes.js')
const dummyDirectory = './dummy_values.json'

function loginSetup (app) {

    // Backend function to validate login information of existing user
    app.get('/api/validate-login/:username/:password', async (req, res) => {
        const checkUsername = req.params.username
        const checkPassword = req.params.password
        
        // Get users database
        const data = await loadDatabase()
        const DB_USERS = data.users

        // Initialize the check figures
        let goodUsername = false
        let goodPassword = false

        // Compare given username and recorded usernames
        for ( let { username, salt, password_hash } of DB_USERS) {
            if (username === checkUsername) {
                // When one matches
                goodUsername = true

                // Compare hash of given password and recorded salt with recorded password_hash
                const checkHash = classes.hashPassword(checkPassword, salt)
                password_hash === checkHash ? goodPassword = true : goodPassword = false
            }
        }

        // Return the results
        const validLogin = {
            goodUsername: goodUsername,
            goodPassword: goodPassword
        }
        res.json(validLogin)
    })


    // Backend function to create login information for new user
    app.get('/api/create-login/:username/:password/:confirmation', async (req, res) => {
        const checkUsername = req.params.username
        const checkPassword = req.params.password
        const checkConfirmation = req.params.confirmation

        // Initialize the check figures
        let goodUsername = true
        let goodPassword = false
        let goodConfirmation = false
        
        // Get users database
        const data = await loadDatabase()
        const DB_USERS = data.users

        // Username must be unique
        for (let { username } of DB_USERS) {
            if (checkUsername === username) {
                goodUsername = false
                break
            } 
        }

        // Password must be 8_ characters with 1+ letter(s) and 1+ number(s)
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/
        goodPassword = passwordRegex.test( checkPassword )

        // Password confirmation must match the given password
        goodConfirmation = ( checkPassword === checkConfirmation )

        if (goodUsername && goodPassword && goodConfirmation) {

            // Create new user and add to database
            const createUser = new classes.User(checkUsername, checkPassword)
            DB_USERS.push(createUser)

            // Save the updated JSON data to the database
            refreshDatabase('users', DB_USERS)
        }

        const createLogin = {
            goodUsername: goodUsername,
            goodPassword: goodPassword,
            goodConfirmation: goodConfirmation
        }
        
        res.json(createLogin)
    })

}

function enterSessionSetup(app) {
    
    // Backend function to join a session by ID
    app.get('/api/join-session/:username/:sessionID', async (req, res) => {
        const { username } = req.params
        const { sessionID } = req.params
        
        // Connect to live server
        const data = await loadDatabase()
        const DB_SESSIONS = data.sessions

        // Add user data to server, if session is open
        const updatedData = await joinSession(username, sessionID, DB_SESSIONS)

        if (!updatedData) {
            console.log('Error: Session Not Found')
            res.status(204).send('Session Not Found')
            return
        }
        
        res.status(200).send('Session found')
    })

    // Backend function to create a session by category
    app.get('/api/create-session/:username/:category', async (req, res) => {
        const { username } = req.params
        const { category } = req.params

        // Connect to sessions database and live server
        const data = await loadDatabase()
        const DB_SESSIONS = data.sessions

        // Create new session instance
        const newSessionID = createSessionID(category, DB_SESSIONS)
        const newSession = new classes.Session(newSessionID, category)
        console.log('New Session:', newSession)

        // Add this user to the instance
        newSession.addActiveUser(username)
        console.log('Added User:', newSession)
        
        // Add the instance to the sessions array, then update the database
        DB_SESSIONS.push(newSession)
        refreshDatabase('sessions', DB_SESSIONS)
        
        res.status(200).json({sessionID: newSessionID})
    })
}


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

/**
 * Send new data to the database
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

module.exports = { loginSetup, enterSessionSetup }