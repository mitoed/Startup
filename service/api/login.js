const DB = require('../database.js')
const classes = require('./classes.js')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')

function pageSetup (app, apiRouter) {

    app.use(cookieParser())

    // Check for user token before allowing access to Enter Session page
    apiRouter.get('/auth/user/me', async (req, res) => {

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

// =============================================================================
// 1.1 -- Validate current user login
// =============================================================================

    apiRouter.post('/auth/validate-login', async (req, res) => {
        
// 1.1.1 -- Gather information inputted from login page
        const checkUsername = req.body.username
        const checkPassword = req.body.password
        
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

// =============================================================================
// 1.2 -- Create new user
// =============================================================================

    apiRouter.post('/auth/create-login', async (req, res) => {

// 1.2.1 -- Gather information inputted from login page
        const checkUsername = req.body.username
        const checkPassword = req.body.password
        const checkConfirmation = req.body.confirmation
        
// 1.2.2 ---- Compare against database of current users
// 1.2.2.1 -- Search Mongo DB for given username
        const existingUser = await DB.getUser(checkUsername)

// 1.2.2.2 -- Ensure that username is unique
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

// 1.2.4 -- If unique and complete, create new user with username and password_hash
        if (goodUsername && goodPassword && goodConfirmation) {

// 1.2.4.1 -- Create new user
            const passwordHash = await bcrypt.hash(checkPassword, 10)
            const createUser = new classes.User(checkUsername, passwordHash)

// 1.2.4.2 -- Store authentication cookie
            setauthCookie(res, createUser.token)

// 1.2.5.3 -- Send new user info to Mongo DB
            DB.createUser(createUser)
        }

        const createLogin = {
            goodUsername: goodUsername,
            goodPassword: goodPassword,
            goodConfirmation: goodConfirmation
        }
        
        res.json(createLogin)

    })

// =============================================================================
// 1.3 -- Logout of user
// =============================================================================

// 1.3.2 -- Clear user token cookie
    apiRouter.get('/auth/logout', async (req, res) => {
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