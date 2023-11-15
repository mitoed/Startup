const DB = require('./database.js')
const classes = require('./classes.js')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')

function pageSetup (app) {

    app.use(cookieParser())

    // Check for user token before allowing access to Enter Session page
    app.get('/api/auth/user/me', async (req, res) => {

        const authToken = req.cookies['token']
        const user = await DB.getUserByToken(authToken)

        if (user) {
            res.json({ "username": user.username })

        } else {
            console.log('User not found (missing token)')
            res.json({ "username": null })
        }

        return
    })

// 1.1 -- Validate current user login
    app.get('/api/auth/validate-login/:username/:password', async (req, res) => {
        
// 1.1.1 -- Gather information inputted from login page
        const checkUsername = req.params.username
        const checkPassword = req.params.password
        
// 1.1.2 ---- Compare against database of current users
// 1.1.2.1 -- Request persistent database data (Mongo DB)
        const existingUser = await DB.getUser(checkUsername)

        let goodUsername = false
        let goodPassword = false

// 1.1.2.2 -- Compare given username and recorded username
        if (existingUser) {
            if (existingUser.username === checkUsername) {

                goodUsername = true

// 1.1.2.3 ---- Compare hash of given password and salt with recorded password_hash
                if (await bcrypt.compare(checkPassword, existingUser.password_hash)) {
                    goodPassword = true
                }
            }
        }

// 1.1.2.4 -- If both are right, store authentication cookie
        if (goodUsername && goodPassword) {
            setauthCookie(res, existingUser.token)
        }

        const validLogin = {
            goodUsername: goodUsername,
            goodPassword: goodPassword
        }

        res.json(validLogin)

    })

// 1.2 -- Create new user
    app.get('/api/auth/create-login/:username/:password/:confirmation', async (req, res) => {

// 1.2.1 -- Gather information inputted from login page
        const checkUsername = req.params.username
        const checkPassword = req.params.password
        const checkConfirmation = req.params.confirmation
        
// 1.2.2 ---- Compare against database of current users
// 1.2.2.1 -- Check new username against Mongo Database
        const existingUser = await DB.getUser(checkUsername)

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
            const passwordHash = await bcrypt.hash(checkPassword, 10)
            const createUser = new classes.User(checkUsername, passwordHash)

// 1.2.4.2 -- Store authentication cookie
            setauthCookie(res, createUser.token)

// 1.2.5.2 -- Send new user info to Mongo database
            DB.createUser(createUser)
        }

        const createLogin = {
            goodUsername: goodUsername,
            goodPassword: goodPassword,
            goodConfirmation: goodConfirmation
        }
        
        res.json(createLogin)

    })

// 5.2 -- Clear user token
    app.get('/api/auth/logout', async (req, res) => {
        res.clearCookie('token');
        res.status(204).end();
    })

}

// =============================================================================
// Supporting Functions
// =============================================================================

function setauthCookie(res, authToken) {
    res.cookie('token', authToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict'
    })
}

module.exports = { pageSetup }