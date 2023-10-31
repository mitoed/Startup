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

/**
 * Load data from database
 */
async function loadDatabase() {
    try {
        // Access database and save users array to DB_USERS
        // When this code is written, remove the dummy data
        
        const jsonData = await fs.promises.readFile(dummyDirectory, 'utf8')
        const data = JSON.parse(jsonData)
        return data

    } catch {
        console.log('Database not available. Using dummy data')
    }
}

/**
 * Send new data to the database
 */
async function refreshDatabase(jsonObject, newData) {
    try {
        // Access database and update users array from DB_USERS
        // When this code is written, remove the dummy data

        const dummyData = await loadDatabase()
        dummyData[jsonObject] = newData

        // Save the JSON to Dummy Data file
        const jsonContent = JSON.stringify(dummyData, null, 2);
        fs.promises.writeFile(dummyDirectory, jsonContent);
    } catch {
        console.log('Database not available. Updating dummy data')
    }
}

module.exports = { loginSetup }