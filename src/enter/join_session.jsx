import React from "react";

export function Join(props) {

    const [ sessionID, setSessionID ] = React.useState('')
    const [ joinError, setJoinError ] = React.useState('')

    async function JoinSession() {
        // 2.1.1 -- Gather session ID inputted from Enter Session page
        const username = props.username

        // Make sure input is filled before continuing
        if (sessionID.trim() === '') {
            document.getElementById('join_session_id').value = ''
            return
        }

        try {
        // 2.1.2 -- Check if session is open on LIVE_SESSIONS
            const response = await fetch(`/api/join-session`, {
                method: 'post',
                body: JSON.stringify({
                    username: username,
                    sessionID: sessionID,
                })
            })
            const { status } = response

        // 2.1.3 -- If session is open, enter the session
            if (status === 200) {
                localStorage.setItem('currentSessionID', sessionID)
                
                // NAVIGATE TO SESSION PAGE

                return

        // 2.1.4 -- If session is not available or not open, respond with error message to user
            } else if (status === 204) {
                console.log('Error: Session Not Found')
                setJoinError('Session Not Found')
                return
            }

        // Unexpected errors
        } catch (error) {
            console.log('Problem with server. Please try again.', error)
            return
        }
    }

    return (
        <section className="ENT-join">
            <h2>Join an existing session</h2>
            <form method="get" className="ENT-join-form">
                <label htmlFor="session_id">Session ID</label>
                <input type="text"
                    id="join_session_id"
                    name="session_id"
                    placeholder="type a session id"
                    onChange={(e) => setSessionID(e.target.value)} />
                <br />
                <p id="session_not_found_error">{ joinError }</p>
                <button className="submit"
                    id="join_session"
                    onClick={() => JoinSession(sessionID)}
                    >Join Session</button>
            </form>
        </section>
    )
}