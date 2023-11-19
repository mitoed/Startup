// Trigger upon loading Login page...
logout()

// =============================================================================
// 1.1 -- Validate current user login
// =============================================================================

// Assign the function to the Login Button
const login_exist_button = document.getElementById('login_exist')

login_exist_button.onclick = function (event) {
    event.preventDefault();

    validateLogin() 
}

async function validateLogin() {

// 1.1.1 -- Gather information inputted from login page
    let username_input = document.getElementById('username_input').value.toUpperCase() || 'error'
    let password_input = document.getElementById('password_input').value || 'error'

// 1.1.2 -- Compare against database of current users
    const response = await fetch(`/api/auth/validate-login/${username_input}/${password_input}`)
    const dataValidation = await response.json()

// 1.1.3 ---- If info is not all correct, respond with appropriate error message to user; exit
// 1.1.3.1 -- "username does not exist" OR
    if (!dataValidation.goodUsername) {
        document.getElementById('login_error').innerHTML = 'username does not exist'
        return

// 1.1.3.2 -- "incorrect password"
    } else if (!dataValidation.goodPassword) {
        document.getElementById('login_error').innerHTML = 'incorrect password'
        return

// 1.1.4 ---- If all information is correct, proceed to 2
// 1.1.4.1 -- Store username in local storage
    } else {
        document.getElementById('login_error').innerHTML = ''
        localStorage.setItem('currentUser', username_input)

// 1.1.4.2 -- Go to next page
        window.location.href = `./enter_session.html`
    }

}

// =============================================================================
// 1.2 -- Create new user
// =============================================================================

// Assign the function to the Create User Button
const login_create_button = document.getElementById('login_create')

login_create_button.onclick = function (event) {
    event.preventDefault();

    createLogin()
}

async function createLogin() {

// 1.2.1 -- Gather information inputted from login page
    let new_username = document.getElementById('new_username').value.toUpperCase()
    let new_password = document.getElementById('new_password').value || 'error'
    let confirm_password = document.getElementById('confirm_password').value || 'error'

// 1.2.2 -- Compare against databse of current users
// 1.2.3 -- Ensure given password complies with password requirements
// 1.2.4 -- If unique and complete, create a new user with username and password_hash
    const response = await fetch (`/api/auth/create-login/${new_username}/${new_password}/${confirm_password}`)
    const dataValidation = await response.json()

// 1.2.5 ---- If not all info is good, respond with appropriate error message; exit
// 1.2.5.1 -- "<given username> already exists" OR
    if (!dataValidation.goodUsername) {
        document.getElementById('create_error').innerHTML = `${new_username} already exists`
        return

// 1.2.5.2 -- "password must contain 1 letter, 1 number, and be at least 8 characters long" OR
    } else if (!dataValidation.goodPassword) {
        document.getElementById('create_error').innerHTML = 'password must contain 1 letter, 1 number, and be at least 8 characters long'
        return

// 1.2.5.3 -- "passwords must match"
    } else if (!dataValidation.goodConfirmation) {
        document.getElementById('create_error').innerHTML = 'passwords must match'
        return

// 1.2.6 ---- If all info is good, proceed to 2
// 1.2.6.1 -- Store username in local storage
    } else {
        document.getElementById('create_error').innerHTML = ''
        localStorage.setItem('currentUser', new_username)

// 1.2.6.2 -- Go to next page
        window.location.href = `./enter_session.html`
        return
    }
}

// =============================================================================
// 1.3 -- Logout user
// =============================================================================

async function logout() {

// 1.3.1 -- Clear current data from local storage
    localStorage.removeItem('currentUser')
    localStorage.removeItem('currentSessionID')
    localStorage.removeItem('voteSelection')

// 1.3.2 -- Clear user token cookie
    const response = await fetch('/api/auth/logout')

    if (response.status === 204) {
        console.log('User successfully logged out.')
    }
}