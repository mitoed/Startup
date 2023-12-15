import React from "react";
import { Join } from './join_session.jsx'
import { Create } from './create_session.jsx'

export function Enter() {

    const [ username, setUsername ] = React.useState('')

    React.useEffect(() => {
        setUsername(localStorage.getItem('currentUser'))

        localStorage.removeItem('currentSessionID')
        localStorage.removeItem('voteSelection')
    }, [])

    return (
        <main className="ALL-l-main ALL-container ALL-verticle">
            <section className="ALL-username">
                <h1 id="username">Welcome, { username }</h1>
            </section>
            <section className="ENT-session">
                < Join username={username}/>
                <br />
                < Create username={username}/>
            </section>
        </main>
    )
}