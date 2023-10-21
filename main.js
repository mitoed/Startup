// =============================================================================
// GLOBAL VARIABLES
// =============================================================================

const DB_USERS = []
const DB_SESSIONS = []
const foodIDLetters = 'BCDFGHJ'
const movieIDLetters = 'KLMNPQ'
const gameIDLetters = 'RSTVWXZ'
let currentUser = localStorage.getItem('currentUser') || ''
let currentSessionID = localStorage.getItem('currentSessionID') || ''
let currentSessionInstance
let categoryDatabase

// =============================================================================
// CLASSES
// =============================================================================

class User {
  constructor(username, password, active_session = '', active_vote = '', sessions_total = 0, sessions_won = 0) {
    this._username = username
    this._salt = generateSalt()
    this._password_hash = hashPassword(password, this._salt)
    this._active_session = active_session
    this._active_vote = active_vote
    this._sessions_total = sessions_total
    this._sessions_won = sessions_won
  }
  get username() {return this._username}
  get salt() {return this._salt}
  get password_hash() {return this._password_hash}
  get active_session() {return this._active_session}
  set active_session(useractive_session) {this._active_session = useractive_session}
  get active_vote() {return this._active_vote}
  set active_vote(useractive_vote) {this._active_vote = useractive_vote}
  get sessions_total() {return this._sessions_total }

  incrementParticipation(groupSelection) {
    if (groupSelection === this.active_vote) {
      this._sessions_won++
    }
    this._sessions_total++
  }
  significantLossRate() {
    const lossRate = (this.sessions_total - this._sessions_won) / this.sessions_total
    if (this.sessions_total >= 5 && lossRate >= .7) {
        return lossRate
    }
  }
}

class Session {
  constructor(session_id, category, category_array, start_time) {
    this._session_id = session_id
    this._category = category
    this._category_array = category_array
    this._start_time = start_time
    this._unpopular_opinion = ''
    this._end_time = ''
    this._winner = ''
  }
  get session_id() { return this._session_id }
  get category() { return this._category }
  get category_array() { return this._category_array }
  get start_time() { return this._start_time }
  get unpopular_opinion() { return this._unpopular_opinion }
  set end_time(timeStamp) {
    this._end_time = timeStamp
  }
  get end_time() { return this._end_time }
  set winner(winningSelection) {
    this._winner = winningSelection
  }
  get winner() { return this._winner }
}

class VotingOption {
  constructor(option_name) {
    this._option_name = option_name
  }
  get option_name() {return this._option_name }
  set option_name(newName) {this._option_name = newName }
  calculateVotes() {
    const totalVotes = DB_USERS.filter(instance => 
      (instance.active_session === currentSessionID && instance.active_vote === this.option_name)
    ).length
    return totalVotes
  }
  newhtmlTableRow() {
    return `<tr><td>${this.option_name}</td><td>${this.calculateVotes()}</td></tr>`
  }
  newhtmlDatalistRow() {
    return `<option value="${this.option_name}"></option>`
  }
  addToCategoryDatabase(DB_CATEGORY) {
    DB_CATEGORY.push({ 'option_name': this.option_name, 'currentVotes': this.calculateVotes() })
  }
}

// =============================================================================
// DUMMY VALUES -- TO BE DELETED WHEN CONNECTED TO PERSISTENT DATABASE
// =============================================================================

  function addFakeUser(fakeUserName, fakePassword, fakeSessionID, fakeSelection, fakeTotal, fakeWon) {
    let fakeUser = new User(fakeUserName, fakePassword, fakeSessionID, fakeSelection, fakeTotal, fakeWon)
    DB_USERS.push(fakeUser)
  }
  addFakeUser("MASAULLS", "1234")
  addFakeUser('CHSAULLS', '389d9*', 'DEFAULT', 'Costa Vida', 7, 1)
  addFakeUser('RCSAULLS', '303udsd', 'DEFAULT', 'Five Sushi Bros', 7, 0)
  addFakeUser('ECSAULLS', '38&jdkf', 'DEFAULT', 'Brick Oven', 3, 0)
  addFakeUser('SSAULLS', '7329fd', 'DEFAULT', 'Burger Supreme', 3, 3)
  addFakeUser('CSAULLS', '39fds', 'DEFAULT', 'Good Move', 7, 4)
  
  function addFakeSession(fakeSessionID, fakeCategory, DB_CATEGORY) {
    let fakeSession = new Session(fakeSessionID, fakeCategory, DB_CATEGORY, Date.now())
    DB_SESSIONS.push(fakeSession)
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
    "Betrayal at Baldur's Gate"]
  
  addFakeSession ('DEFAULT', 'food', listFOOD)
  addFakeSession ("F7N7V4", 'food', listFOOD)
  addFakeSession ("C7T4H9", 'food', listFOOD)
  addFakeSession ("F2W7Q7", 'food', listFOOD)
  addFakeSession ("H6Q2N0", 'food', listFOOD)
  addFakeSession ("D2S4D6", 'food', listFOOD)
  addFakeSession ("K4X6J2", 'movie', listMOVIE)
  addFakeSession ("N7T5Q6", 'movie', listMOVIE)
  addFakeSession ("L3V9B4", 'movie', listMOVIE)
  addFakeSession ("N2K6M6", 'movie', listMOVIE)
  addFakeSession ("P7X5C7", 'movie', listMOVIE)
  addFakeSession ("K5F2K4", 'movie', listMOVIE)
  addFakeSession ("L2K3N3", 'movie', listMOVIE)
  addFakeSession ("R7M0X2", 'game', listGAME)
  addFakeSession ("X7H3J3", 'game', listGAME)
  addFakeSession ("S4C3Q5", 'game', listGAME)
  addFakeSession ("T5H9K5", 'game', listGAME)
  addFakeSession ("S2V2J9", 'game', listGAME)
  addFakeSession ("Z6L3X3", 'game', listGAME)
  addFakeSession ("T7F3P7", 'game', listGAME)

// =============================================================================
// LOAD PAGE FUNCTIONALITY -- OCCURS EACH TIME A PAGE LOADS
// =============================================================================

switch (true) {
  default: // for index.html or blank
    disableEnterSession()
    validateLoginUsernamePassword()
    createLoginUsernamePassword()
    break
  case window.location.href.includes('enter_session.html'):
    infoToPage()
    infoToMenu()
    enterSessionWithID()
    createSessionWithCategory()
    break
  case window.location.href.includes('voting_session.html'):
    infoToPage()
    infoToMenu()
    loadVotingSessionPage()
    castVoteButton()
    break
  case window.location.href.includes('about.html'):
    infoToPage()
    infoToMenu()
    break
}

// =============================================================================
// USER GENERATING/VALIDATING FUNCTIONS
// =============================================================================

// Generate Salt
function generateSalt() {
  const saltArray = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')
  let newSalt = []
  for (let digit = 0; digit < 6; digit++) {
    newSalt.push(randomDigit(saltArray))
  }
  return newSalt.join('')
}

// Hash Password with Salt
function hashPassword(password, salt) {
  let hash = 0
  const saltyPassword = salt + password
  if (saltyPassword.length === 0) return hash;
  for (let i = 0; i < saltyPassword.length; i++) {
    let chr = saltyPassword.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function randomDigit(digitArray) {
  return digitArray[Math.floor(Math.random() * digitArray.length)]
}

// =============================================================================
// INSERTING INFORMATION FUNCTIONS
// =============================================================================

// Retrieve current information from url
function infoToPage() {
  try {if (currentUser !== undefined) {
    document.getElementById('username').innerHTML = `Welcome, ${currentUser}!`;
    console.log(`Successfully logged in as: ${currentUser}`)
  } else {
    document.getElementById('username').innerHTML = `Welcome!`;
    console.warn('Error: Login unsuccessful.')
  }}
  catch {} // no place to insert username
  try {
    document.getElementById('session_id').innerHTML = `Session ID: ${currentSessionID}`;
    console.log(`Successfully entered Session: ${currentSessionID}`)
  }
  catch {} // no place to insert session id
}

// Add current information to navigation menu
function infoToMenu() {
  const navigationChildren = document.getElementById('navigation_menu').children
  if (currentUser !== undefined) {
    for (let child = 1; child < navigationChildren.length; child++) {
      navigationChildren[child].href += `?user=${currentUser}`
    }
  } else if (currentUser === undefined) {
    disableEnterSession()
  }
}

// =============================================================================
// LOGIN PAGE BUTTON INITIALIZING FUNCTIONS
// =============================================================================

// Disable navigation menu
function disableEnterSession() {
  const navEnterSession = document.getElementById("nav_enter_session")
  navEnterSession.href = ""
  navEnterSession.onclick = function () {
    alert('You must login or create an account before entering a session.')
  }
}

// Add user verification to button
function validateLoginUsernamePassword() {
  const login_exist_button = document.getElementById('login_exist')

  login_exist_button.onclick = function (event) {
    event.preventDefault();

    let username_input = document.getElementById('username_input').value
    let password_input = document.getElementById('password_input').value
    UserPassCorrect(DB_USERS, username_input, password_input)
  }
}

// Add new user verification to button
function createLoginUsernamePassword() {
  const login_create_button = document.getElementById('login_create')
  login_create_button.onclick = function (event) {
    event.preventDefault();

    let new_username = document.getElementById('new_username').value
    let new_password = document.getElementById('new_password').value
    let confirm_password = document.getElementById('confirm_password').value
    UserPassCreate(DB_USERS, new_username, new_password, confirm_password)
  }
}

// -----------------------------------------------------------------------------
// LOGIN PAGE SUPPORTING FUNCTIONS
// -----------------------------------------------------------------------------

// Verify login credentials
function UserPassCorrect(database, checkUsername, checkPassword) {
  checkUsername = checkUsername.toUpperCase()
  console.log(checkUsername)
  console.log(checkPassword)
  console.log(database)
  for (let entry in database) {
    console.log(entry)
    console.log(database[entry]['username'])
    if (database[entry]['username'] === checkUsername) {
      const checkSalt = database[entry]['salt']
      const checkHash = hashPassword(checkPassword, checkSalt)
      if (database[entry]['password_hash'] === checkHash) {
        document.getElementById('login_error').innerHTML = ''
        localStorage.setItem('currentUser', checkUsername)
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

// Verify new user credentials
function UserPassCreate(database, newUsername, newPassword, confirmPassword) {
  newUsername = newUsername.toUpperCase();
  // RegEx that checks for 1 letter, 1 number, and 8 characters long
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/
  for (let entry in database) {
    if (database[entry]['username'] === newUsername) {
      document.getElementById('create_error').innerHTML = newUsername + ' already exists'
      return
    }
  }
  if (passwordRegex.test(newPassword) !== true) {
    document.getElementById('create_error').innerHTML = 'password must contain 1 letter, 1 number, and be at least 8 characters long'
    return
  }
  if (newPassword !== confirmPassword) {
    document.getElementById('create_error').innerHTML = 'passwords must match'
    return
  }
  const newUserInstance = new User (newUsername, newPassword)
  DB_USERS.push(newUserInstance)
  localStorage.setItem('currentUser', newUsername)
  window.location.href = `./enter_session.html?user=${newUsername}`
  return
}

// =============================================================================
// ENTER SESSION PAGE BUTTON INITIALIZING FUNCTIONS
// =============================================================================

// Add Session ID validation to button and enter session
function enterSessionWithID() {
  const join_session_button = document.getElementById('join_session')

  join_session_button.onclick = function (event) {
    event.preventDefault();

    currentSessionID = document.getElementById('join_session_id').value
    currentSessionID = currentSessionID.toUpperCase()
    if (validateSessionID(currentSessionID)) {
      localStorage.setItem('currentSessionID', currentSessionID)
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

    let newSessionInstance = new Session(createSessionID(sessionCategory), sessionCategory, listCATEGORY, Date.now())
    DB_SESSIONS.push(newSessionInstance)
    let newSessionID = newSessionInstance['session_id']
    localStorage.setItem('currentSessionID', newSessionID)
    window.location.href = `./voting_session.html?user=${currentUser}&session=${newSessionID}`
    return
  }
}

// -----------------------------------------------------------------------------
// ENTER SESSION PAGE SUPPORTING FUNCTIONS
// -----------------------------------------------------------------------------

function validateSessionID(checkSessionID) {
  for (let session in DB_SESSIONS) {
    if (DB_SESSIONS[session]['session_id'] === checkSessionID) {
      return true
    }
  }
  return false
}

function createSessionID(sessionCategory) {
  let newSessionID
  let problem = false
  do {
    newSessionID = randomSessionID(sessionCategory)
    problem = validateSessionID(newSessionID)
  } while (problem)
  return newSessionID
}

function randomSessionID(sessionCategory) {
  let sessionString = []
  let digitArray1
  switch (true) {
    case sessionCategory === 'food':
      digitArray1 = foodIDLetters.split('')
      break
    case sessionCategory === 'movie':
      digitArray1 = movieIDLetters.split('')
      break
    case sessionCategory === 'game':
      digitArray1 = gameIDLetters.split('')
      break
  }
  let digitArray2 = 'BCDFGHJKLMNPQRSTVWXZ'.split('')
  let digitArray3 = '23456789'.split('')

  sessionString.push(randomDigit(digitArray1))
  sessionString.push(randomDigit(digitArray3))
  sessionString.push(randomDigit(digitArray2))
  sessionString.push(randomDigit(digitArray3))
  sessionString.push(randomDigit(digitArray2))
  sessionString.push(randomDigit(digitArray3))

  sessionString = sessionString.join('')
  return sessionString
}

// =============================================================================
// VOTING SESSION PAGE BUTTON INITIALIZATING FUNCTIONS
// =============================================================================

function loadVotingSessionPage() {
  currentSessionInstance = DB_SESSIONS.find((element) => element['session_id'] === currentSessionID)
  if (currentSessionInstance === undefined) {
    // if session is missing from the database; create new session but log error
    let currentCategory
    let currentDatabase
    switch (true) {
      case foodIDLetters.includes(currentSessionID[0]):
        currentCategory = 'food'
        currentDatabase = listFOOD
        break
      case movieIDLetters.includes(currentSessionID[0]):
        currentCategory = 'movie'
        currentDatabase = listMOVIE
        break
      case gameIDLetters.includes(currentSessionID[0]):
        currentCategory = 'game'
        currentDatabase = listGAME
        break
    }
    currentSessionInstance = new Session(currentSessionID, currentCategory, currentDatabase, Date.now())
    console.warn('Error: Session created and not loaded from database. ' + 
      'Please verify code for database entry creation and retrieval.')
  } else {
    // if session loaded correctly from database
    console.log(`Session ${currentSessionID} loaded correctly from database.`)
  }
  document.title = `Voting Session: ${currentSessionID}`
  const userIndex = DB_USERS.findIndex(user => user.username === currentUser)
  DB_USERS[userIndex].active_session = currentSessionID
  populateRecommendation(currentSessionInstance.category)
  populateTable(currentSessionInstance.category, currentSessionInstance.category_array)
  console.log(`Data populated correctly. Proceed with voting.`)
}

// Add cast vote function to "finalize vote" button
function castVoteButton() {
  const finalize_vote_button = document.getElementById('finalize_vote')
  finalize_vote_button.onclick = function (event) {
    event.preventDefault();
    if (document.getElementById('vote_selection').value.trim().length === 0) {
      document.getElementById('vote_selection').value = ''
      return
    }
    recommendUnpopularOpinion()
    castVote()
    displayWinner(checkAllVotesCast())
  }
  const vote_selection_input = document.getElementById('vote_selection')
  vote_selection_input.addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  })
}

// -----------------------------------------------------------------------------
// VOTING SESSION PAGE SUPPORTING FUNCTIONS
// -----------------------------------------------------------------------------

// Populates recommendation bubble with google search link
function populateRecommendation(category) {

  let extraConditions
  switch (category) {
    case 'food':
      categoryPlural = 'restaurants'
      extraConditions = 'near me'
      break
    case 'game':
      categoryPlural = 'board games'
      break
    case 'movie':
      categoryPlural = 'movies'
      break
  }
  
  const recommendationTypeArray = ['classic', 'new', 'underrated']
  const randomNum = Math.floor(Math.random() * 3)
  let recommendationType = recommendationTypeArray[randomNum]

  const recommendationHREF = `https://www.google.com/search?q=top+${recommendationType}+${categoryPlural}+${extraConditions}`

  const recommendationBubble = document.getElementById('recommendation_bubble')
  recommendationBubble.innerHTML = `<p>Click <a href="${recommendationHREF}" target="_blank">here</a> to see some of the top <span>${recommendationType}</span> ${categoryPlural}<br>from Google.com</p>`
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
    let htmlRowElement = categoryDatabase[entry].newhtmlTableRow()
    tableElement.insertAdjacentHTML('beforeend', htmlRowElement)
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

function recommendUnpopularOpinion() {
  let unpopularOpinionArray = []
  for (let user in DB_USERS) {
    if (DB_USERS[user].significantLossRate() > 0) {
      unpopularOpinionArray.push(DB_USERS[user].active_vote)
    }
  }
  if (unpopularOpinionArray.length === 0 || Math.random() < .65) {
    castVote()
    displayWinner(checkAllVotesCast())
    return
  } else {
    const randomUnpopularOpnion = unpopularOpinionArray[Math.floor(Math.random() * unpopularOpinionArray.length)]
    document.getElementById('recommended_selection').innerHTML = randomUnpopularOpnion
    document.getElementById('dark_background').style.visibility = 'visible'
    document.getElementById('recommended_opinion').style.visibility = 'visible'
  
    const opinion_yes_button = document.getElementById('opinion_yes')
    opinion_yes_button.onclick = () => {
      castVote(randomUnpopularOpnion)
      document.getElementById('vote_selection').value = randomUnpopularOpnion
      document.getElementById('dark_background').style.visibility = 'hidden'
      document.getElementById('recommended_opinion').style.visibility = 'hidden'
      displayWinner(checkAllVotesCast())
    }
  
    const opinion_no_button = document.getElementById('opinion_no')
    opinion_no_button.onclick = () => {
      castVote()
      document.getElementById('dark_background').style.visibility = 'hidden'
      document.getElementById('recommended_opinion').style.visibility = 'hidden'
      displayWinner(checkAllVotesCast())
    }
  }
}

// Needs to be added to 'finalize vote' button on click
function castVote(selectedOption = '') {
  selectedOption = selectedOption || document.getElementById('vote_selection').value
  const userIndex = DB_USERS.findIndex(user => user.username === currentUser)
  DB_USERS[userIndex].active_vote = selectedOption
  const optionDBIndex = categoryDatabase.findIndex((element) => element.option_name === selectedOption)
  if (optionDBIndex !== -1) {
    categoryDatabase[optionDBIndex].calculateVotes()
  } else {
    const newOption = new VotingOption(selectedOption)
    newOption.calculateVotes()
    categoryDatabase.push(newOption)
  }
  clearTable()
  clearDatalist()
  populateTable(currentSessionInstance.category, currentSessionInstance.category_array, categoryDatabase)
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

function checkAllVotesCast() {
  const sessionUsers = DB_USERS.filter(instance => instance.active_session === currentSessionID)
  const totalUsers = sessionUsers.length
  const totalVotes = sessionUsers.filter(instance => instance.active_vote !== '').length
  return (totalUsers === totalVotes)
}

function displayWinner(allVotesCast) {
  if (allVotesCast) {
    console.log('All users have cast their vote. Group decision will be displayed now.')
    categoryDatabase = categoryDatabase.sort((a, b) => b.calculateVotes() - a.calculateVotes())
    let groupSelection = categoryDatabase[0]['option_name']

    const currentCategory = currentSessionInstance.category
    let categoryVerb
    switch (currentCategory) {
      case 'food':
        categoryVerb = 'eating at'
        break
      case 'movie':
        categoryVerb = 'watching'
        break
      case 'game':
        categoryVerb = 'playing'
        break
    }
    document.getElementById('dark_background').style.visibility = 'visible'
    document.getElementById('final_decision').style.visibility = 'visible'
    document.getElementById('category_verb').innerHTML = categoryVerb
    document.getElementById('group_selection').innerHTML = groupSelection

    for (let user in DB_USERS) {
      if (DB_USERS[user]['active_session'] === currentSessionID) {
        DB_USERS[user].incrementParticipation(groupSelection)
      }
    }
    
    exitFromFinalSelection()
    disableCastVoteButton()
  }
}

// Add way out of final selection display
function exitFromFinalSelection() {
  const dark_background_button = document.getElementById('dark_background')

  dark_background_button.onclick = function () {
    document.getElementById('dark_background').style.visibility = 'hidden'
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
    console.log('Session has concluded; Finalize Vote button has been disabled.')
  }
}

/* Voting Page:
- configure/troubleshoot Yelp API for restaurant recommendations in provo, ut
*/