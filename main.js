// =============================================================================
// IMPORT MODULES
// =============================================================================




// =============================================================================
// OR PASTE FUNCTIONS TO TEXT
// =============================================================================


// =============================================================================
// CLASSES
// =============================================================================

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
    this._unpopularOpinion = ''
    this._endTime = ''
    this._winner = ''
  }
  get sessionID() {return this._sessionID}
  get userArray() {return this._userArray}
  get category() {return this._category}
  get categoryArray() {return this._categoryArray}
  get startTime() {return this._startTime}
  get unpopularOpinion() {return this._unpopularOpinion}
  set endTime(timeStamp) {
    this._endTime = timeStamp
  }
  get endTime() {return this._endTime}
  set winner(winningSelection) {
    this._winner = winningSelection
  }
  get winner() {return this._winner}
}

class VotingOption {
  constructor (optionName, currentVotes = 0) {
    this._optionName = optionName
    this._currentVotes = currentVotes
  }
  get optionName() {return this._optionName}
  set optionName(newName) {this._optionName = newName}
  get currentVotes() {return this._currentVotes}

  incrementVotes(newVotes) {
    this._currentVotes += newVotes
  }
  htmlTableRow() {
    return `<tr><td>${this.optionName}</td><td>${this.currentVotes}</td></tr>`
  }
  addToCategoryDatabase(databaseCATEGORY) {
    databaseCATEGORY.push({'optionName': this.optionName, 'currentVotes': this.currentVotes})
  }
}

// =============================================================================
// DUMMY VALUES
// =============================================================================

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

const databaseSESSION = []
function addFakeSession (fakeCategory, databaseCATEGORY) {
  let fakeSession = new Session (createSessionID(), databaseUSERS, fakeCategory, databaseCATEGORY, Date.now())
  databaseSESSION.push(fakeSession)
}

let listFOOD = [
  "Wendy's",
  "McDonald's",
  "Chick-fil-A",
  "Bumblebees",
  "Se Llama Peru",
  "India Palace",
  "Burger Supreme",
  "Cubby's",
  "Good Move",
  "Brick Oven",
  "Costa Vida",
  "Five Sushi Bros",
  "Black Sheep Cafe",
];

/*let listMOVIE = [
  "The Shawshank Redemption",
  "The Godfather",
  "The Dark Knight",
  "Pulp Fiction",
  "Schindler's List",
  "The Lord of the Rings: The Return of the King",
  "Fight Club",
  "Forrest Gump",
  "Inception",
  "The Matrix",
  "Gladiator",
  "The Silence of the Lambs"
];

let listGAME = [
  "Settlers of Catan",
  "Ticket to Ride",
  "Carcassonne",
  "Pandemic",
  "Dominion",
  "Codenames",
  "7 Wonders",
  "Twilight Struggle",
  "Agricola",
  "Scythe",
  "Splendor",
  "Betrayal at Baldur's Gate"
];*/

addFakeSession ('food', listFOOD)
console.log(databaseSESSION)

// =============================================================================
// GENERAL FUNCTIONS
// =============================================================================

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

let currentUser

// Retrieve username from url
function usernameFromURL() {
  const pageURL = window.location.href;
  currentUser = pageURL.split('user=')[1];
  if (currentUser !== undefined) {
    document.getElementById('username').innerHTML = `Welcome, ${currentUser}`;
  } else {
    document.getElementById('username').innerHTML = `Welcome!`;
  }
  return// currentUser
}

// Retrieve SessionID from url
function usernameSessionFromURL() {
  const pageURL = window.location.href;

  currentUser = pageURL.split('user=')[1].split('&')[0];
  document.getElementById('username').innerHTML = `Welcome, ${currentUser}`;

  const currentsessionID = pageURL.split('session=')[1];
  document.getElementById('session_id').innerHTML = `Session ID: ${currentsessionID}`;
  return
}

// Insert username into URL
function usernameToURL (nextURL, currentUser) {
  `${nextURL}?user=${currentUser}`
}

// Insert username and session id into URL
function usernameSessionToURL (nextURL, currentUser, currentsessionID) {
  `${nextURL}?user=${currentUser}&session=${currentsessionID}`
}

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
function validateLoginUsernamePassword() {
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

  // RegEx that checks for 1 letter, 1 number, and 8 characters long
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/

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
  console.log('button functionality added')
  window.location.href = `./enter_session.html?user=${newUsername}`
  return
}

// Add new user verification to button
function createLoginUsernamePassword() {
  const login_create_button = document.getElementById('login_create')
  console.log('button recognized')
  login_create_button.onclick = function(event) {
    event.preventDefault();

    let new_username = document.getElementById('new_username').value
    let new_password = document.getElementById('new_password').value
    let confirm_password = document.getElementById('confirm_password').value
    console.log('button functionality tried')
    UserPassCreate(databaseUSERS, new_username, new_password, confirm_password)
  }
}

// =============================================================================
// ENTER SESSION PAGE FUNCTIONS
// =============================================================================

function createSessionID () {
  let newSessionID
  let problem = false
  do {
    newSessionID = randomSessionID()
    problem = validateSessionID(newSessionID)
  } while (problem)
  return newSessionID
}

function randomSessionID() {
  let sessionString = []
  let digit
  let digitArray1 = 'BCDFGHJKLMNPQRSTVWXZ'.split('')
  let digitArray2 = '0123456789'.split('')
  do {
    digit = digitArray1[Math.floor(Math.random() * digitArray1.length)]
    sessionString.push(digit)
    digit = digitArray2[Math.floor(Math.random() * digitArray2.length)]
    sessionString.push(digit)
  } while (sessionString.length < 6)
  sessionString = sessionString.join('')
  return sessionString
}


function validateSessionID (checkSessionID) {
  for (let session in databaseSESSION) {
    if (databaseSESSION[session]['sessionID'] === checkSessionID) {
      return true
    }
  }
  return false
}

// Add Session ID validation to button
function createSessionWithCategory() {
  const create_session_button = document.getElementById('create_session')

  create_session_button.onclick = function(event) {
    event.preventDefault();

    const sessionCategory = document.querySelector('input[name="category"]:checked').value;
    switch (true) {
      case sessionCategory === 'movie':
        listCATEGORY = listMOVIE
        break
      case sessionCategory === 'game':
        listCATEGORY = listGAME
        break
      case sessionCategory === 'food':
        listCATEGORY = listFOOD
        break
    }

    let newSessionInstance = new Session (createSessionID(), databaseUSERS, sessionCategory, listCATEGORY, Date.now())
    databaseSESSION.push(newSessionInstance)
    let newSessionID = newSessionInstance['sessionID']
    window.location.href = `./voting_session.html?user=${currentUser}&session=${newSessionID}`
    return
  }
}

// =============================================================================
// VOTING SESSION PAGE FUNCTIONALITY
// =============================================================================

// From this database will the information be pulled to populate the table
function createCategoryDB(category, categoryList) {
  let categoryDatabase = []
  for (let entry in categoryList) {
    let newOption = new VotingOption(categoryList[entry])
    categoryDatabase.push(newOption)
  }
  return categoryDatabase
}

function populateTable(category, categoryList) {
  const parentElement = document.getElementById('count_table')
  let categoryDatabase = createCategoryDB(category, categoryList)
  console.log(categoryDatabase)
  for (let entry in categoryDatabase) {
    let htmlString = categoryDatabase[entry].htmlTableRow()
    console.log(htmlString)
    parentElement.insertAdjacentHTML('beforeend', htmlString)
  }
}

//populateTable('food', listFOOD)

/* Voting Page:
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

// =============================================================================
// LOAD PAGE FUNCTIONALITY
// =============================================================================

switch (true) {
  default:
    validateLoginUsernamePassword()
    createLoginUsernamePassword()
    break
  case window.location.href.includes('enter_session.html'):
    console.log('initialize page functionality')
    usernameFromURL()
    console.log('username should be retrieved')
    createSessionWithCategory()
    console.log('button should carry value')
    console.log(window.location.href.split('user=')[1])
    break
  case window.location.href.includes('voting_session.html'):
    usernameSessionFromURL()
    populateTable('food', listFOOD)
    break
  case window.location.href.includes('about.html'):
    break
}