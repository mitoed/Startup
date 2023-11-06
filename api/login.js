const database = require('./database.js')
const classes = require('./classes.js')

function pageSetup (app) {

    // Backend function to validate login information of existing user
    app.get('/api/validate-login/:username/:password', async (req, res) => {
        const checkUsername = req.params.username
        const checkPassword = req.params.password
        
        // Get users database
        const data = await database.loadDatabase()
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
        const data = await database.loadDatabase()
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
            database.refreshDatabase(null, DB_USERS, null)
        }

        const createLogin = {
            goodUsername: goodUsername,
            goodPassword: goodPassword,
            goodConfirmation: goodConfirmation
        }
        
        res.json(createLogin)
    })

}

module.exports = { pageSetup }