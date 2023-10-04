// =============================================================================
// PAGE CONSTANTS
// =============================================================================

// RegEx that checks for 1 letter, 1 number, and 8 characters long
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/

// =============================================================================
// LOGIN PAGE FUNCTIONS
// =============================================================================

// Verify login credentials
function UserPassCorrect (database, checkUsername, checkPassword) {
  for (let entry in database) {
    if (database[entry]['username'] === checkUsername) {
      if (database[entry]['password'] === checkPassword) {
        document.getElementById('login_error').innerHTML = ''
        window.location.href = `./enter_session.html?user=${checkUsername}`
        return
      } else {
        document.getElementById('login_error').innerHTML = 'incorrect password'
        return
      }
    }
  }
  document.getElementById('login_error').innerHTML = 'username does not exist'
  return
}

// Add user verification to button
export function validateLoginUsernamePassword() {
  const login_exist_button = document.getElementById('login_exist')

  login_exist_button.onclick = function(event) {
    event.preventDefault();

    let username_input = document.getElementById('username_input').value
    let password_input = document.getElementById('password_input').value
    UserPassCorrect(databaseUSERS, username_input, password_input)
  }
}

// Verify new user credentials
function UserPassCreate (database, newUsername, newPassword, confirmPassword) {
  for (let entry in database) {
    if (database[entry]['username'] === newUsername) {
      document.getElementById('create_error').innerHTML = newUsername + ' already exists'
      return
    }
  }
  if (passwordRegex.test(newPassword)) {} else {
    document.getElementById('create_error').innerHTML = 'password must contain 1 letter, 1 number, and be at least 8 characters long'
    return
  }
  if (newPassword === confirmPassword) {} else {
    document.getElementById('create_error').innerHTML = 'passwords must match'
    return
  }
  window.location.href = `./enter_session.html?user=${newUsername}`
  return
}

// Add new user verification to button
export function createLoginUsernamePassword() {
  const login_create_button = document.getElementById('login_create')

  login_create_button.onclick = function(event) {
    event.preventDefault();

    let new_username = document.getElementById('new_username').value
    let new_password = document.getElementById('new_password').value
    let confirm_password = document.getElementById('confirm_password').value
    UserPassCreate(databaseUSERS, new_username, new_password, confirm_password)
  }
}
