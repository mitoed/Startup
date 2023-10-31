/**
 * Assign the function to the Login Button
 */
const login_exist_button = document.getElementById('login_exist')

login_exist_button.onclick = function (event) {
    event.preventDefault();
    validateLogin()
}

/**
 * 1.1 Validate current user login information
 */
async function validateLogin() {

    let username_input = document.getElementById('username_input').value.toUpperCase()
    let password_input = document.getElementById('password_input').value

    const response = await fetch(`/api/validate-login/${username_input}/${password_input}`)
    const parsedData = await response.json()

    if (!parsedData.goodUsername) {
        document.getElementById('login_error').innerHTML = 'username does not exist'
        return
    } else if (!parsedData.goodPassword) {
        document.getElementById('login_error').innerHTML = 'incorrect password'
        return
    } else {
        document.getElementById('login_error').innerHTML = ''
        localStorage.setItem('currentUser', username_input)
        window.location.href = `./enter_session.html?user=${username_input}`
        return
    }
}

/**
 * Assign the function to the Create User Button
 */
const login_create_button = document.getElementById('login_create')

login_create_button.onclick = function (event) {
    event.preventDefault();
    createLogin()
}

/**
 * 1.2 Create new user from login information
 */
async function createLogin() {

    let new_username = document.getElementById('new_username').value.toUpperCase()
    let new_password = document.getElementById('new_password').value || 'error'
    let confirm_password = document.getElementById('confirm_password').value || 'error'

    const response = await fetch (`/api/create-login/${new_username}/${new_password}/${confirm_password}`)
    const parsedData = await response.json()

    if (!parsedData.goodUsername) {
        document.getElementById('create_error').innerHTML = `${new_username} already exists`
        return
    } else if (!parsedData.goodPassword) {
        document.getElementById('create_error').innerHTML = 'password must contain 1 letter, 1 number, and be at least 8 characters long'
        return
    } else if (!parsedData.goodConfirmation) {
        document.getElementById('create_error').innerHTML = 'passwords must match'
        return
    } else {
        document.getElementById('create_error').innerHTML = ''
        localStorage.setItem('currentUser', new_username)
        window.location.href = `./enter_session.html?user=${new_username}`
        return
    }
}