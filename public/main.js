// =============================================================================
// LOAD PAGE FUNCTIONALITY -- OCCURS EACH TIME A PAGE LOADS
// =============================================================================

/**
 * When a page loads, checks for an authentication token.
 * If token is present, adds username to the local storage.
 * If token not present, disables navigation to the Enter Session page.
 */

// 5.1.1 -- [Trigger] Upon loading a page
allPageLoad()

async function allPageLoad() {
    
// 5.1.2 -- [Response] Check for user token in cookies
    const response = await fetch('/api/auth/user/me')
    const data = await response.json()
    const { username } = data

// 5.1.3 -- [Action] If authenticated:
    if (username) {
        console.log(`Successfully logged in as ${username}`)

// 5.1.3.1 -- Store username in local storage
        localStorage.setItem('currentUser', username)

// 5.1.3.2 -- Insert username into the correct html elements
        try {document.getElementById('username').innerHTML = `Welcome, ${username}!`}
        catch {} // If no element, ignore
    }

// 5.1.4 -- [Action] If not authenticated:
    if (!username) {

// 5.1.4.1 -- Remove any username in local storage
        localStorage.removeItem('currentUser')

// 5.1.4.2 -- Disable the Enter Session navigation
        const navEnterSession = document.getElementById("nav_enter_session")
        navEnterSession.href = ""
        navEnterSession.onclick = function () {
            alert('You must login or create an account before entering a session.')
        }
// 5.1.4.3 -- If on Enter Session or Voting Session pages, send back to login page with alert
        const currentPage = window.location.href
        if (currentPage.includes('session')) {
            window.location.href = './index.html'
            alert('Something went wrong.\nPlease log in before proceeding.')
        }
    }
}

// =============================================================================
// MISC FUNCTIONS TO BE IMPLIMENTED LATER?
// =============================================================================

/* async function runYelpAPI() {
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
}*/

// Call the yelp api (which won't work until CORS have been configured),
// then add the recommendation into the bubble.
// FOLLOW THE YELP DISPLAY REQUIREMENTS!!!!

/* function displayYelpData() {
    const yelpRestaurant = callYelpAPI()
    const yelpName = yelpRestaurant.name
    const yelpURL = yelpRestaurant.url
    const recommendationBubble = document.getElementById('recommendation_bubble')
    recommendationBubble.innerHTML = `<p>Based on Yelp reviews in Provo, Utah, you should try out <span>${yelpName}</span>!<br>Check out more about it <a href="${yelpURL}">here</a>!</p>`
}*/

// Calls the Yelp API to return a recommendation based on:
// location (provo, utah), currently open, and highly rated.
// Randomized result based on top 10
// 
// @returns yelpRetaurant object containing name and url

/*function callYelpAPI() {
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
}*/

// Determines which users have significant loss rate,
// randomly chooses one of them,
// then displays their option (35% of the time),
// which the user can adopt by clicking "yes" or reject by clicking "no"
// 
// @returns nothing => adds functions to "yes" and "no" buttons which appear when recommendation displays

/*function recommendUnpopularOpinion() {
    let unpopularOpinionArray = []
    for (let entry in DB_USERS) {
        if (DB_USERS[entry].significantLossRate() > 0) {
            unpopularOpinionArray.push(DB_USERS[entry].active_vote)
        }
    }
    if (unpopularOpinionArray.length === 0 || Math.random() < .65) {
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
}*/