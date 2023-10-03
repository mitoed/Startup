// ---------- INITIALIZING VALUES ---------- //


document.getElementById('login_error').innerHTML = ''
document.getElementById('create_error').innerHTML = ''





// ---------- CLASSES ---------- //


class User {
  constructor (username, password) {
    this._username = username
    this._password = password
    this._sessions_total = 0
    this._sessions_won = 0
  }
  get username() {return this._username}
  get password() {return this._password}
  get sessions_total() {return this._sessions_total}
  participateSession() {
    this._sessions_total++
  }
  get sessions_won() {return this._sessions_won}
  winSession() {
    this._sessions_won++
  }
}
class Session {
  constructor (sessionID, userArray, category, categoryArray, startTime) {
    this._sessionID = sessionID
    this._userArray = userArray
    this._category = category
    this._categoryArray = categoryArray
    this._startTime = startTime
    this._unpopularOpinion = ""
    this._endTime = ""
    this._winner = ""
  }
  get sessionID() {return this._sessionID}
  get userArray() {return this._userArray}
  get category() {return this._category}
  get categoryArray() {return this._categoryArray}
  get startTime() {return this._startTime}
  get _unpopularOpinion() {return this._unpopularOpinion}
  set endTime(timeStamp) {
    this._endTime = timeStamp
  }
  get endTime() {return this._endTime}
  set winner(winningSelection) {
    this._winner = winningSelection
  }
  get winner() {return this._winner}
}





// ---------- DUMMY VALUES ---------- //


const databaseUSERS = []
function addFakeUser (fakeUserName, fakePassword) {
  let fakeUser = new User(fakeUserName, fakePassword)
  databaseUSERS.push(fakeUser)
}
addFakeUser("masaulls", "1234")
addFakeUser('chsaulls', '389d9*')
addFakeUser('rcsaulls', '303udsd')
addFakeUser('ecsaulls', '38&jdkf')
addFakeUser('ssaulls', '7329fd')
addFakeUser('csaulls', '39fds')
console.log(databaseUSERS)





// ---------- GENERAL FUNCTIONS ---------- //


// Validate a value from any field
function DBInfoExist (database, checkField, checkValue, errorID = '') {
  if (database === null || checkField === null || checkValue === null) {
    console.log('Please provide all the inputs.')
    return false
  }
  for (let entry in database) {
    if (database[entry][checkField] === checkValue) {
      document.getElementById(errorID).innerHTML = '' // TO BE TESTED
      return true
    }
  }
  document.getElementById(errorID).innerHTML = `that ${checkField} does not exist` // TO BE TESTED
  return false
}





// ---------- LOGIN PAGE ---------- //


// Verify password of a given username
function UserPassCorrect (database, checkUsername, checkPassword, errorID) {
  if (database === null || checkUsername === null || checkPassword === null || errorID === null) {
    console.log('Please provide all the inputs.')
    return
  }
  for (let entry in database) {
    if (database[entry]['username'] === checkUsername) {
      if (database[entry]['password'] === checkPassword) {
        document.getElementById(errorID).innerHTML = ''
        window.location.href = './enter_session.html'
        return
      } else {
        document.getElementById(errorID).innerHTML = 'incorrect password'
        return
      }
    }
  }
  document.getElementById(errorID).innerHTML = 'username does not exist'
  return
}

// When user clicks "login", validate the username and password then go to the Enter Session page.
const login_exist_button = document.getElementById('login_exist')

login_exist_button.onclick = function(event) {
  event.preventDefault();

  let login_user = document.getElementById('username_input').value
  let password_input = document.getElementById('password_input').value
  UserPassCorrect(databaseUSERS, login_user, password_input, 'login_error')
}

/* Login Page (Create User):
- check to see if username exists in DB
- check to see if password fits requirements
- if passwords does not fit requirements or passwords don't match, show error message.
*/

/* Enter Session Page (Existing Session):
- enter username into document.getElementById('username').innerHTML
- check to see if session (by ID) is active
- pass session ID to document.head.title.innerHTML
*/

/* Enter Session Page (New Session):
- generate session ID and add to DB (marked as active?)
- pass session ID to document.head.title.innerHTML and the category to the table generation
*/

/* Voting Page:
- enter username into document.getElementById('username').innerHTML
- pass session ID to document.head.title.innerHTML
- generate table from DB using handlebars
- upon clicking "finalize vote":
    - [based on users and chance] generate and display unpopular user's vote:
        - check all users for most unpopular user
        - pass that user's vote to document.getElementById('recommendation_opinion').innerHTML
        - wait for user response
        - if 'yes', replace their selection with recommended opinion
    - add value to DB/table if not in DB/table
    - increment vote count
    - sort table by votes (then alphabetically)
- using user physical location:
    - scrape google for top nearby restaurants
    - pass website url to document.getElementById('recommendation_link').href
    - add restaurant name to document.getElementById('recommendation_internet').innerHTML
- when all users have clicked "finalize vote":
    - pass appropriate category verb (e.g., "eating at") to document.getElementById('category_verb')
    - pass winning selection to document.getElementById('group_selection)
    - change the message and background's hidden property to false
*/

/* About Page:
- none

*/

