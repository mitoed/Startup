// =============================================================================
// IMPORT FUNCTIONS
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

export class User {}

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