import React from "react";
import { useNavigate } from 'react-router-dom';
import { locals } from "../../service";

export function Join({ username }) {

    const [ sessionID, setSessionID ] = React.useState('')
    const [ joinError, setJoinError ] = React.useState('')
    const navigate = useNavigate()

    async function JoinSession(event) {

        event.preventDefault()

        // 2.1.1 -- Gather session ID inputted from Enter Session page
        //const username = props.username

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
                    sessionID: sessionID.toUpperCase(),
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
            })
            const { status } = response
            const { category } = response.json()

        // 2.1.3 -- If session is open, enter the session
            if (status === 200) {
                localStorage.setItem('currentSessionID', sessionID.toUpperCase())
                localStorage.setItem('currentCategory', category)
                setJoinError('')

                navigate('/voting')
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
                <label htmlFor="join_session_id">Session ID</label>
                <input type="text"
                    id="join_session_id"
                    name="join_session_id"
                    placeholder="type a session id"
                    value={sessionID}
                    onChange={(e) => setSessionID(e.target.value)} />
                <br />
                <p id="session_not_found_error">{ joinError }</p>
                <button className="submit"
                    id="join_session"
                    onClick={(event) => JoinSession(event)}
                    >Join Session</button>
            </form>
        </section>
    )
}