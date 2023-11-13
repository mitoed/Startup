const db = require('./database.js')
const classes = require('./classes.js')

function pageSetup (app) {

// 1.1 -- Validate current user login
    app.get('/api/validate-login/:username/:password', async (req, res) => {
        
// 1.1.1 -- Gather information inputted from login page
        const checkUsername = req.params.username
        const checkPassword = req.params.password
        
// 1.1.2 ---- Compare against database of current users
// 1.1.2.1 -- Request persistent database data
        const existingUser = await db.checkUserInfo(checkUsername)

        let goodUsername = false
        let goodPassword = false

// 1.1.2.2 -- Compare given username and recorded username
        if (existingUser) {
            if (existingUser.username === checkUsername) {

                goodUsername = true

// 1.1.2.3 ---- Compare hash of given password and recorded salt with recorded password_hash
                const checkHash = classes.hashPassword(checkPassword, existingUser.salt)
                existingUser.password_hash === checkHash ? goodPassword = true : goodPassword = false
            }
        }

        const validLogin = {
            goodUsername: goodUsername,
            goodPassword: goodPassword
        }

        res.json(validLogin)

    })

// 1.2 -- Create new user
    app.get('/api/create-login/:username/:password/:confirmation', async (req, res) => {

// 1.2.1 -- Gather information inputted from login page
        const checkUsername = req.params.username
        const checkPassword = req.params.password
        const checkConfirmation = req.params.confirmation
        
// 1.2.2 ---- Compare against database of current users
// 1.2.2.1 -- Check new username against Mongo Database
        const existingUser = await db.checkUserInfo(checkUsername)

// 1.2.2.2 -- Check that user does not already exist in database
        let goodUsername = true
        if (existingUser) {
            goodUsername = false
        }

// 1.2.3 -- Ensure given password complies with password requirements
        let goodPassword = false
        let goodConfirmation = false

// 1.2.3.1 -- Password must be 8_ characters with 1+ letter(s) and 1+ number(s)
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/
        goodPassword = passwordRegex.test( checkPassword )

// 1.2.3.2 -- Password confirmation must match the given password
        goodConfirmation = ( checkPassword === checkConfirmation )

// 1.2.5 -- If info is good, create new user with username and password, proceed to 2
        if (goodUsername && goodPassword && goodConfirmation) {

// 1.2.5.1 -- Create new user
            const createUser = new classes.User(checkUsername, checkPassword)

// 1.2.5.2 -- Send new user info to Mongo database
            db.addUserInfo(createUser)
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