// =============================================================================
// CLASSES
// =============================================================================

class User {
  constructor(username, password, activeVote = '') {
    this._username = username
    this._password = password
    this._activeSession = ''
    this._activeVote = activeVote
    this._sessionsTotal = 0
    this._sessionsWon = 0
  }
  get username() { return this._username }
  get password() { return this._password }
  get activeSession() {return this._activeSession}
  set activeSession(userActiveSession) {this._activeSession = userActiveSession}
  get activeVote() {return this._activeVote}
  set activeVote(userActiveVote) {this._activeVote = userActiveVote}
  get sessionsTotal() {return this._sessionsTotal }

  participateSession() {
    this._sessionsTotal++
  }
  get sessionsWon() { return this._sessionsWon }
  winSession() {
    this._sessionsWon++
  }
}

class Session {
  constructor(sessionID, category, categoryArray, startTime) {
    this._sessionID = sessionID
    this._category = category
    this._categoryArray = categoryArray
    this._startTime = startTime
    this._unpopularOpinion = ''
    this._endTime = ''
    this._winner = ''
  }
  get sessionID() { return this._sessionID }
  get category() { return this._category }
  get categoryArray() { return this._categoryArray }
  get startTime() { return this._startTime }
  get unpopularOpinion() { return this._unpopularOpinion }
  set endTime(timeStamp) {
    this._endTime = timeStamp
  }
  get endTime() { return this._endTime }
  set winner(winningSelection) {
    this._winner = winningSelection
  }
  get winner() { return this._winner }
}

class VotingOption {
  constructor(optionName) {
    this._optionName = optionName
  }
  get optionName() {return this._optionName }
  set optionName(newName) {this._optionName = newName }
  calculateVotes() {
    const totalVotes = databaseUSERS.filter(instance => 
      //instance.activeSession === currentSessionID && // Use once session ID can be recovered
      instance.activeVote === this.optionName
    ).length
    return totalVotes
  }
  newhtmlTableRow() {
    return `<tr><td>${this.optionName}</td><td>${this.calculateVotes()}</td></tr>`
  }
  newhtmlDatalistRow() {
    return `<option value="${this.optionName}"></option>`
  }
  addToCategoryDatabase(databaseCATEGORY) {
    databaseCATEGORY.push({ 'optionName': this.optionName, 'currentVotes': this.calculateVotes() })
  }
}

// =============================================================================
// DUMMY VALUES
// =============================================================================

const databaseUSERS = []
function addFakeUser(fakeUserName, fakePassword, fakeSelection) {
  let fakeUser = new User(fakeUserName, fakePassword, fakeSelection)
  databaseUSERS.push(fakeUser)
}
addFakeUser("masaulls", "1234", 'Bumblebees')
addFakeUser('chsaulls', '389d9*', 'Costa Vida')
addFakeUser('rcsaulls', '303udsd', 'Five Sushi Bros')
addFakeUser('ecsaulls', '38&jdkf', 'Brick Oven')
addFakeUser('ssaulls', '7329fd', 'Burger Supreme')
addFakeUser('csaulls', '39fds', 'Good Move')

const databaseSESSION = []
function addFakeSession(fakeSessionID, fakeCategory, databaseCATEGORY) {
  let fakeSession = new Session(fakeSessionID, fakeCategory, databaseCATEGORY, Date.now())
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

let listMOVIE = [
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
];

addFakeSession ('M7G2X7', 'food', listFOOD)
addFakeSession ("M7N7V4", 'food', listFOOD)
addFakeSession ("S7T4H9", 'food', listFOOD)
addFakeSession ("F0W7Q7", 'food', listFOOD)
addFakeSession ("H6Q2N0", 'food', listFOOD)
addFakeSession ("S2S4D6", 'food', listFOOD)
addFakeSession ("C7M0X2", 'game', listGAME)
addFakeSession ("X7H3J3", 'game', listGAME)
addFakeSession ("N4C3Q5", 'game', listGAME)
addFakeSession ("D5H9K5", 'game', listGAME)
addFakeSession ("S0V0J9", 'game', listGAME)
addFakeSession ("Z6L1X1", 'game', listGAME)
addFakeSession ("T7F3P7", 'game', listGAME)
addFakeSession ("H4X6J2", 'movie', listMOVIE)
addFakeSession ("N7T5Q6", 'movie', listMOVIE)
addFakeSession ("F3V9B4", 'movie', listMOVIE)
addFakeSession ("N2K6M6", 'movie', listMOVIE)
addFakeSession ("Z7X5C7", 'movie', listMOVIE)
addFakeSession ("Q5F0K4", 'movie', listMOVIE)
addFakeSession ("V0K3N1", 'movie', listMOVIE)

// =============================================================================
// GENERAL FUNCTIONS
// =============================================================================

// Validate a value from any field
function DBInfoExist(database, checkField, checkValue, errorID = '') {
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
let currentSessionID
let currentSessionInstance

// Retrieve current information from url
function infoFromURL() {
  const pageURL = window.location.href;
  currentSessionID = pageURL.split('session=')[1];
  try {currentUser = pageURL.split('user=')[1].split('&session')[0];} 
  catch {currentUser = pageURL.split('user=')[1];}
  document.getElementById('username').innerHTML = `Welcome, ${currentUser}`;
  document.getElementById('session_id').innerHTML = `Session ID: ${currentSessionID}`;
}

// Add current information to navigation menu
function infoToMenu() {
  const navigationMenu = document.getElementById('navigation_menu')
  const navigationChildren = navigationMenu.children
  for (let child = 1; child < navigationChildren.length; child++) {
    if (currentUser !== undefined) {
      navigationChildren[child].href += `?user=${currentUser}`
    }
  }
}

// =============================================================================
// LOGIN PAGE FUNCTIONS
// =============================================================================

// Disable navigation menu
function disableEnterSession() {
  const navEnterSession = document.getElementById("nav_enter_session")
  navEnterSession.href = ""
  navEnterSession.onclick = function () {
    alert('You must login or create an account before entering a session.')
  }
}

// Verify login credentials
function UserPassCorrect(database, checkUsername, checkPassword) {
  checkUsername = checkUsername.toLowerCase()
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

  login_exist_button.onclick = function (event) {
    event.preventDefault();

    let username_input = document.getElementById('username_input').value
    let password_input = document.getElementById('password_input').value
    UserPassCorrect(databaseUSERS, username_input, password_input)
  }
}

// Verify new user credentials
function UserPassCreate(database, newUsername, newPassword, confirmPassword) {

  // RegEx that checks for 1 letter, 1 number, and 8 characters long
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/

  newUsername = newUsername.toLowerCase();

  for (let entry in database) {
    if (database[entry]['username'] === newUsername) {
      document.getElementById('create_error').innerHTML = newUsername + ' already exists'
      return
    }
  }
  if (passwordRegex.test(newPassword)) { } else {
    document.getElementById('create_error').innerHTML = 'password must contain 1 letter, 1 number, and be at least 8 characters long'
    return
  }
  if (newPassword === confirmPassword) { } else {
    document.getElementById('create_error').innerHTML = 'passwords must match'
    return
  }
  const newUserInstance = new User (newUsername, newPassword)
  databaseUSERS.push(newUserInstance)
  console.log(databaseUSERS)
  window.location.href = `./enter_session.html?user=${newUsername}`
  return
}

// Add new user verification to button
function createLoginUsernamePassword() {
  const login_create_button = document.getElementById('login_create')
  login_create_button.onclick = function (event) {
    event.preventDefault();

    let new_username = document.getElementById('new_username').value
    let new_password = document.getElementById('new_password').value
    let confirm_password = document.getElementById('confirm_password').value
    UserPassCreate(databaseUSERS, new_username, new_password, confirm_password)
  }
}

// =============================================================================
// ENTER SESSION PAGE FUNCTIONS
// =============================================================================

function validateSessionID(checkSessionID) {
  for (let session in databaseSESSION) {
    if (databaseSESSION[session]['sessionID'] === checkSessionID) {
      return true
    }
  }
  return false
}

// Add Session ID validation to button and enter session
function enterSessionWithID() {
  const join_session_button = document.getElementById('join_session')

  join_session_button.onclick = function (event) {
    event.preventDefault();

    currentSessionID = document.getElementById('join_session_id').value
    if (validateSessionID(currentSessionID)) {
      window.location.href = `./voting_session.html?user=${currentUser}&session=${currentSessionID}`
    } else {
      document.getElementById('session_not_found_error').innerHTML = 'Session Not Found'
    }
  }
}

// Add Session ID validation to button and create session
function createSessionWithCategory() {
  const create_session_button = document.getElementById('create_session')

  create_session_button.onclick = function (event) {
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

    let newSessionInstance = new Session(createSessionID(), sessionCategory, listCATEGORY, Date.now())
    databaseSESSION.push(newSessionInstance)
    let newSessionID = newSessionInstance['sessionID']
    window.location.href = `./voting_session.html?user=${currentUser}&session=${newSessionID}`
    return
  }
}

function createSessionID() {
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

// =============================================================================
// VOTING SESSION PAGE FUNCTIONALITY
// =============================================================================

// Declare Global Variables
let categoryDatabase // This is what's populated in the table and the datalist

function loadVotingSessionPage(defaultSessionID, defaultCategory, defaultList) {
  try  { // session was correctly created in the database
    currentSessionInstance = databaseSESSION.find((element) => element['sessionID'] === currentSessionID)
  }
  catch { // session is missing from the database; revert to default
    console.log('Error: session not correctly loaded from database. Default inert session loaded instead.')
    currentSessionInstance = new Session(defaultSessionID, defaultCategory, defaultList, Date.now())
    currentSessionID = currentSessionInstance['sessionID']
    databaseSESSION.push(currentSessionInstance)
  } finally {
    document.title = `Voting Session: ${currentSessionID}`
  }
}

// Populates data table and data list using the information gathered or inputted.
function populateTable(category, categoryList, thisDatabase = null) {
  const tableElement = document.getElementById('count_table')
  const datalistElement = document.getElementById('voting_options')
  if (thisDatabase === null) {
    categoryDatabase = createCategoryDB(category, categoryList)
  }
  sortTableHighToLow()
  for (let entry in categoryDatabase) {
    // Add entry to table
    let htmlRowElement = categoryDatabase[entry].newhtmlTableRow()
    tableElement.insertAdjacentHTML('beforeend', htmlRowElement)
    // Add entry to datalist
    let htmlDatalistString = categoryDatabase[entry].newhtmlDatalistRow()
    datalistElement.insertAdjacentHTML('beforeend', htmlDatalistString)
  }
}

// From this database will the information be pulled to populate the table
function createCategoryDB(category, categoryList) {
  categoryDatabase = []
  for (let entry in categoryList) {
    let newOption = new VotingOption(categoryList[entry])
    categoryDatabase.push(newOption)
  }
  return categoryDatabase
}

function sortTableHighToLow() {
  categoryDatabase = categoryDatabase.sort((a, b) => {
    return b.calculateVotes() - a.calculateVotes()
  })
}

// Add cast vote function to "finalize vote" button
function castVoteButton() {
  const finalize_vote_button = document.getElementById('finalize_vote')
  finalize_vote_button.onclick = function (event) {
    event.preventDefault();
    recommendUnpopularOpinion()
    castVote()
    declareWinner(checkAllVotesCast())
  }
  const vote_selection_input = document.getElementById('vote_selection')
  vote_selection_input.addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  })
}

// Needs to be added to 'finalize vote' button on click
function castVote() {
  // Set the user's active vote
  const selectedOption = document.getElementById('vote_selection').value
  const userIndex = databaseUSERS.findIndex(user => user.username === currentUser)
  databaseUSERS[userIndex].activeVote = selectedOption
  // Search for the vote in the category database
  const optionDBIndex = categoryDatabase.findIndex((element) => element.optionName === selectedOption)
  if (optionDBIndex !== -1) {// If option already exists in databaseCATEGORY
    categoryDatabase[optionDBIndex].calculateVotes()
  } else {// If option does not exist in databaseCATEGORY, add
    const newOption = new VotingOption(selectedOption)
    newOption.calculateVotes()
    categoryDatabase.push(newOption)
  }
  // Clear the table, sort the database, and repopulate the table
  clearTable()
  clearDatalist()
  populateTable('food', listFOOD, categoryDatabase)
}

function clearTable() {
  const parentElement = document.getElementById('count_table')
  const parentElementSize = parentElement.childElementCount
  for (let child = 1; child < parentElementSize; child++) {
    parentElement.removeChild(parentElement.children[1])
  }
}

function clearDatalist() {
  const parentElement = document.getElementById('voting_options')
  const parentElementSize = parentElement.childElementCount
  for (let child = 0; child < parentElementSize; child++) {
    parentElement.removeChild(parentElement.children[0])
  }
}

function recommendUnpopularOpinion() {

}

function checkAllVotesCast() {
  const totalUsers = 6 // databaseUSERS.filter(instance => instance.activeSession === currentSessionID).length // Use once session ID can be recovered
  const totalVotes = databaseUSERS.filter(instance => instance.activeVote !== '').length
  return (totalUsers === totalVotes)
}

function declareWinner(proceed) {
  if (proceed) {
    categoryDatabase = categoryDatabase.sort((a, b) => b.calculateVotes() - a.calculateVotes())
    let groupSelection = categoryDatabase[0]['optionName']

    const currentCategory = currentSessionInstance.category
    let categoryVerb
    switch (true) {
      case currentCategory === 'food':
        categoryVerb = 'eating at'
        break
      case currentCategory === 'movie':
        categoryVerb = 'watching'
        break
      case currentCategory === 'game':
        categoryVerb = 'playing'
        break
    }
    document.getElementById('final_decision_background').style.visibility = 'visible'
    document.getElementById('final_decision').style.visibility = 'visible'
    document.getElementById('category_verb').innerHTML = categoryVerb
    document.getElementById('group_selection').innerHTML = groupSelection
    exitFromFinalSelection()
    disableCastVoteButton()
  }
}

// Add way out of final selection display
function exitFromFinalSelection() {
  const final_decision_background_button = document.getElementById('final_decision_background')

  final_decision_background_button.onclick = function () {
    document.getElementById('final_decision_background').style.visibility = 'hidden'
    document.getElementById('final_decision').style.visibility = 'hidden'
    document.getElementById('category_verb').innerHTML = ""
    document.getElementById('group_selection').innerHTML = ""
  }
}

function disableCastVoteButton() {
  const finalize_vote_button = document.getElementById('finalize_vote')
  finalize_vote_button.onclick = function (event) {
    event.preventDefault();
    document.getElementById('disabled_finalize').innerHTML = 'Session has concluded'
  }
}

/* Voting Page:
- pass session ID to document.head.title.innerHTML
- upon clicking "finalize vote":
    - [based on users and chance] generate and display unpopular user's vote:
        - check all users for most unpopular user
        - pass that user's vote to document.getElementById('recommendation_opinion').innerHTML
        - wait for user response
        - if 'yes', replace their selection with recommended opinion
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
    disableEnterSession()
    validateLoginUsernamePassword()
    createLoginUsernamePassword()
    break
  case window.location.href.includes('enter_session.html'):
    infoFromURL()
    infoToMenu()
    enterSessionWithID()
    createSessionWithCategory()
    break
  case window.location.href.includes('voting_session.html'):
    infoFromURL()
    infoToMenu()
    loadVotingSessionPage('D4K452', 'food', listFOOD)
    //THIS IS CURRENTLY HARDCODED BECAUSE THE SESSION DATABASE DOES NOT PERSIST BETWEEN PAGES
    populateTable(currentSessionInstance.category, currentSessionInstance.categoryArray)
    castVoteButton()
    break
  case window.location.href.includes('about.html'):
    infoFromURL()
    infoToMenu()
    break
}