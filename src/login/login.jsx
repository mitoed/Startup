import React from "react";
import { ExistingUser} from './existing_user.jsx'
import { CreateUser } from './create_user.jsx'

export function Login(props) {

    // Logout of any past user upon entering the login page
    React.useEffect(() => {
        logout()
    }, [])

    async function logout() {
        // 1.3.1 -- Clear current data from local storage
        localStorage.removeItem('currentUser')
        localStorage.removeItem('currentSessionID')
        localStorage.removeItem('voteSelection')

        // 1.3.2 -- Clear user token cookie
        const response = await fetch('/api/auth/logout')

        if (response.status === 204) {
            console.log('User successfully logged out.')
        }
    }

    return (
        <main className="ALL-l-main ALL-container ALL-verticle">
            <section className="IND-login">
                <ExistingUser />
                <CreateUser />
            </section>
        </main>
    )
}