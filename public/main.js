// =============================================================================
// GLOBAL VARIABLES
// =============================================================================

const DB_USERS = localStorage.getItem('DB_USERS') || undefined
const DB_SESSIONS = localStorage.getItem('DB_SESSIONS') || undefined
let currentUser = localStorage.getItem('currentUser') || undefined
let currentSessionID = localStorage.getItem('currentSessionID')
// If unavailable, get the session ID from the url
if (!currentSessionID) {
    currentSessionID = window.location.href.split('&session=')[1]
    localStorage.setItem('currentSessionID', currentSessionID)
}
let currentSessionInstance
let categoryDatabase

// =============================================================================
// LOAD PAGE FUNCTIONALITY -- OCCURS EACH TIME A PAGE LOADS
// =============================================================================

/**
 * When page is loaded, get and display user/session information if available
 */
infoToPage()
infoToMenu()

if( window.location.href.includes('voting_session.html') ){
    //runYelpAPI()
    //loadVotingSessionPage()
    //castVoteButton()
}

// =============================================================================
// INSERTING INFORMATION FUNCTIONS
// =============================================================================

/**
 * Inserts local storage information into the correct html elements:
 *    currentUser
 *    currentSessionID (if user entered a session)
 */
function infoToPage() {
    try {
        const currentUser = localStorage.getItem('currentUser')

        if (currentUser === null) {
            currentUser = window.location.href.split('&session=')[0].split('&user=')[1]
            localStorage.setItem('currentUser', currentUser)
        }

        document.getElementById('username').innerHTML = `Welcome, ${currentUser}!`;
        console.log(`Successfully logged in as: ${currentUser}`)

    }
    catch { } // no place to insert username, ignore

    try {
        const currentSessionID = localStorage.getItem('currentSessionID')

        if (currentSessionID === null) {
            currentSessionID = window.location.href.split('&session=')[1]
            localStorage.setItem('currentSessionID', currentSessionID)
        }

        document.getElementById('session_id').innerHTML = `Session ID: ${currentSessionID}`;
        console.log(`Successfully entered Session: ${currentSessionID}`)
    }
    catch { } // no place to insert session id, ignore
}

/**
 * Insert local storage information into the navigation menu links
 */
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

/**
 * Disable the "enter session" button on the navigation menu
 */
function disableEnterSession() {
    const navEnterSession = document.getElementById("nav_enter_session")
    navEnterSession.href = ""
    navEnterSession.onclick = function () {
        alert('You must login or create an account before entering a session.')
    }
}

// =============================================================================
// VOTING SESSION PAGE BUTTON INITIALIZATING FUNCTIONS
// =============================================================================

async function runYelpAPI() {
    console.log('trying runYelpAPI')
    try {
        
        // Make the fetch request
        const response = await fetch('/get-yelp-data')
        console.log('RESPONSE:',response)

        // Check if the ersponse status is OK (status code 200)
        if (!response.ok) {
            console.error('Request failed with status:',response.status)
            return
        }

        // Extract the JSON data from the response
        const { data, error } = await response.json()

        if (error) {
            console.error('Server error:', error)
            return
        }

        console.log('DATA:',data)

        // Store the JSON data in Local Storage
        localStorage.setItem('yelpName', data.name)
        localStorage.setItem('yelpURL', data.url)
        console.log('runYelpAPI successful')

    } catch (error) {
        console.error('Error has occurred:', error)
    }
}

/**
 * Using the session id:
 *  1. load the session instance (if not there, create and log an error)
 *  2. update the webpage title with session id
 *  3. add the session id as the current user's "active session"
 *  4. populate the recommendation bubble
 *  5. populate the datatable and datalist
 */
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

/**
 * Add cast vote function to "finalize vote" button that:
 *  1. triggers the unpopular vote recommendation
 *  2. casts the vote of the user
 *  3. checks to see if all users have voted
 *  4. displays the winner (if all have voted)
 */
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
        if (checkAllVotesCast()) {
            displayWinner()
        }
    }
    const vote_selection_input = document.getElementById('vote_selection')
    vote_selection_input.addEventListener('keydown', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    })
}

// -----------------------------------------------------------------------------
// VOTING SESSION PAGE SUPPORTING FUNCTIONS
// -----------------------------------------------------------------------------

/** Populates recommendation bubble with google search link
 * Uses the current category plus either "underrated", "new", or "classic" (randomly selected) in the search link
 * 
 * @param {string} category - what is the current session's category, which will appear in the recommendation
 */
function populateRecommendation(category) {

    let extraConditions = ''
    switch (category) {
        case 'food':
            /**
             * This will try to call the yelp api.
             * Upon error, uses same method as the other categories.
             */
            try {
                displayYelpData()
                callYelpAPI()
                return
            } catch {
                categoryPlural = 'restaurants'
                extraConditions = 'near me'
                break
            }
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

/**
 * Call the yelp api (which won't work until CORS have been configured),
 * then add the recommendation into the bubble.
 * FOLLOW THE YELP DISPLAY REQUIREMENTS!!!!
 */
function displayYelpData() {
    const yelpRestaurant = callYelpAPI()
    const yelpName = yelpRestaurant.name
    const yelpURL = yelpRestaurant.url
    const recommendationBubble = document.getElementById('recommendation_bubble')
    recommendationBubble.innerHTML = `<p>Based on Yelp reviews in Provo, Utah, you should try out <span>${yelpName}</span>!<br>Check out more about it <a href="${yelpURL}">here</a>!</p>`
}

/**
 * Calls the Yelp API to return a recommendation based on:
 * location (provo, utah), currently open, and highly rated.
 * Randomized result based on top 10
 * 
 * @returns yelpRetaurant object containing name and url
 */
function callYelpAPI() {
    const key = process.env.YELP_API_KEY
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${key}`
        }
    }
    const location = 'provo%2C%20ut'
    const term = 'restaurant'
    const open_now = 'true'
    const sort_by = 'best_match'
    const limit = '10'
    fetch(`https://api.yelp.com/v3/businesses/search?location=${location}&term=${term}&open_now=${open_now}&sort_by=${sort_by}&limit=${limit}`, options)
        .then(response => response.json())
        .then(response => console.log(response))
    // Parse the information from a random result from top 10
    // const yelpName = 
    // const yelpURL = 
    const yelpRestaurant = {
        name: yelpName,
        url: yelpURL
    }
    return yelpRestaurant
}

/** Determines which users have significant loss rate,
 * randomly chooses one of them,
 * then displays their option (35% of the time),
 * which the user can adopt by clicking "yes" or reject by clicking "no"
 * 
 * @returns nothing => adds functions to "yes" and "no" buttons which appear when recommendation displays
 */
function recommendUnpopularOpinion() {
    let unpopularOpinionArray = []
    for (let entry in DB_USERS) {
        if (DB_USERS[entry].significantLossRate() > 0) {
            unpopularOpinionArray.push(DB_USERS[entry].active_vote)
        }
    }
    if (unpopularOpinionArray.length === 0 || Math.random() < .65) {
        castVote()
        if (checkAllVotesCast()) {
            displayWinner()
        }
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
            if (checkAllVotesCast()) {
                displayWinner()
            }
        }

        const opinion_no_button = document.getElementById('opinion_no')
        opinion_no_button.onclick = () => {
            castVote()
            document.getElementById('dark_background').style.visibility = 'hidden'
            document.getElementById('recommended_opinion').style.visibility = 'hidden'
            if (checkAllVotesCast()) {
                displayWinner()
            }
        }
    }
}

/** Using the value in the selection box or a value adopted from the recommended opinion,
 * adds to the user's active_vote value.
 * If the value was not in the database, adds value to the database.
 * Updates the current votes of that value in the database.
 * Then, refreshes the table and datalist.
 * 
 * @param {string} selectedOption - (optional) to allow for a vote change from the recommendated opinion
 */
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

/**
 * Removes all elements from table (to be repopulated in order)
 */
function clearTable() {
    const parentElement = document.getElementById('count_table')
    const parentElementSize = parentElement.childElementCount
    for (let child = 1; child < parentElementSize; child++) {
        parentElement.removeChild(parentElement.children[1])
    }
}

/**
 * Removes all elements from datalist (to be repopulated in order)
 */
function clearDatalist() {
    const parentElement = document.getElementById('voting_options')
    const parentElementSize = parentElement.childElementCount
    for (let child = 0; child < parentElementSize; child++) {
        parentElement.removeChild(parentElement.children[0])
    }
}

/** Have all the users cast a vote (does total users = total votes)
 * 
 * @returns true (if all users have voted) or false (if not)
 */
function checkAllVotesCast() {
    const sessionUsers = DB_USERS.filter(instance => instance.active_session === currentSessionID)
    const totalUsers = sessionUsers.length
    const totalVotes = sessionUsers.filter(instance => instance.active_vote !== '').length
    return (totalUsers === totalVotes)
}

/**
 * Checks database for top-voted option.
 * Displays the group's selection (top-voted) in text box overlay.
 * Enables user to exit from overlay.
 * Disables further voting options.
 */
function displayWinner() {
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

    for (let entry in DB_USERS) {
        if (DB_USERS[entry].active_session === currentSessionID) {
            DB_USERS[entry].incrementParticipation(groupSelection)
        }
    }

    exitFromFinalSelection()
    disableCastVoteButton()
    endSession()
}

/**
 * Add way out of final selection display
 */
function exitFromFinalSelection() {
    const dark_background_button = document.getElementById('dark_background')

    dark_background_button.onclick = function () {
        document.getElementById('dark_background').style.visibility = 'hidden'
        document.getElementById('final_decision').style.visibility = 'hidden'
        document.getElementById('category_verb').innerHTML = ""
        document.getElementById('group_selection').innerHTML = ""
    }
}

/**
 * Disable further voting code and display message if user tries to continue
 */
function disableCastVoteButton() {
    const finalize_vote_button = document.getElementById('finalize_vote')
    finalize_vote_button.onclick = function (event) {
        event.preventDefault();
        document.getElementById('disabled_finalize').innerHTML = 'Session has concluded'
        console.log('Session has concluded; Finalize Vote button has been disabled.')
    }
}

/** Tasks when the session closes:
 *      1. log end_time to session
 *      2. clear each user's active_session
 *      3. clear each user's active_vote
 * 
 * @returns nothing
 */
function endSession() {
    currentSessionInstance.end_time = Date.now()
    for (let entry in DB_USERS) {
        if (DB_USERS[entry][active_session] === currentSessionID) {
            DB_USERS[entry][active_vote] = ''
            DB_USERS[entry][active_session] = ''
            return
        }
    }
}