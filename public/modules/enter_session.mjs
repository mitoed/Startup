/**
 * Remove current data from local storage
 */
localStorage.removeItem('currentSessionID')

/**
 * Assign the function to the Join Session Button
 */
const join_session_button = document.getElementById('join_session')

    join_session_button.onclick = function (event) {
        event.preventDefault();

        joinSession()
    }

/**
 * 2.1 Enter a session with a Session ID
 */
async function joinSession() {
    const currentUser = localStorage.getItem('currentUser')
    const sessionID = document.getElementById('join_session_id').value.toUpperCase()

    try {
        const response = await fetch(`/api/join-session/${currentUser}/${sessionID}`)
        const success = response.status

        // If successful, enter session page
        if (success === 200) {
            localStorage.setItem('currentSessionID', sessionID)
            document.getElementById('session_not_found_error').innerHTML = ''
            window.location.href = `./voting_session.html?user=${currentUser}&session=${sessionID}`
            return
        
        // If unsuccessful, notify user
        } else if (success === 204) {
            console.log('Error: Session Not Found')
            document.getElementById('session_not_found_error').innerHTML = 'Session Not Found'
            return
        }

    // Unexpected errors
    } catch (error) {
        console.log('Problem with server. Please try again.', error)
        return
    }
}

/**
 * Assign the function to the Create Session Button
 */
const create_session_button = document.getElementById('create_session')

    create_session_button.onclick = function (event) {
        event.preventDefault();

        createSession()
    }

/**
 * 2.2 Create a session based on a category
 */
async function createSession() {
    const currentUser = localStorage.getItem('currentUser')
    const category = document.querySelector('input[name="category"]:checked').value;

    try {
        const response = await fetch(`/api/create-session/${currentUser}/${category}`)
        const success = response.status
        const data = await response.json()

        if (success === 200) {
            window.location.href = `./voting_session.html?user=${currentUser}&session=${data.sessionID}`
        }

    // Unexpected errors
    } catch (error) {
        console.log('Problem with server. Please try again.', error)
        return
    }

}