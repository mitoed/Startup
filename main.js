// =============================================================================
// IMPORT MODULES
// =============================================================================

import * as indexModule from './index.js'
import * as enterSessionModule from './enter_session.js'
import * as votingSessionModule from './voting_session.js'

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

const databaseSESSIONS = []
function addFakeSession (fakeCategory) {
  let fakeSession = new Session (newSessionID(), databaseUSERS, fakeCategory, databaseCATEGORY, Date.now())
  databaseSESSIONS.push(fakeSession)
}
addFakeSession ('movie')
addFakeSession ('movie')
addFakeSession ('food')
addFakeSession ('food')
addFakeSession ('game')
addFakeSession ('food')
console.log(databaseSESSIONS)

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

// Retrieve username from url
function usernameFromURL() {
  const pageURL = window.location.search;
  const currentUser = pageURL.split('user=')[1].split('&')[0];
  if (currentUser !== undefined) {
    document.getElementById('username').innerHTML = `Welcome, ${currentUser}`;
  } else {
    document.getElementById('username').innerHTML = `Welcome!`;
  }
}

// Retrieve SessionID from url
function usernameSessionFromURL() {
  const pageURL = window.location.search;
  const currentUser = pageURL.split('user=')[1].split('&')[0];
  const currentsessionID = pageURL.split('session=')[1].split('&')[0];
  if (currentUser !== undefined) {
    document.getElementById('username').innerHTML = `Welcome, ${currentUser}`;
  } else {
    document.getElementById('username').innerHTML = `Welcome!`;
  }
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
// LOAD PAGE FUNCTIONALITY
// =============================================================================

switch (true) {
  case window.location.href.includes('index.html'):
    indexModule.validateLoginUsernamePassword()
    indexModule.createLoginUsernamePassword()
  case window.location.href.includes('enter_session.html'):
    usernameFromURL()
  case window.location.href.includes('votin_session.html'):
    usernameSessionFromURL()
    votingSessionModule.populateTable()
  case window.location.href.includes('about.html'):

  default:
    console.log('Error: no recognizable page loaded')
}