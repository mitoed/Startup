import React from "react";

export function CreateUser(props) {
    const [username, setUsername] = React.useState(props.username)
    const [password, setPassword] = React.useState('')
    const [confirmation, setConfirmation] = React.useState('')
    const [userCreateError, setUserCreateError] = React.useState(null)

    
    async function CreateLogin(event) {
        event.preventDefault()

        const response = await fetch (`/api/auth/create-login`, {
            method: 'post',
            body: JSON.stringify({
                username: username,
                password: password,
                confirmation: confirmation,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
        })
        const dataValidation = await response.json()

        if (!dataValidation.goodUsername) {
            setUserCreateError(`${username} already exists`)
            return
    
        } else if (!dataValidation.goodPassword) {
            setUserCreateError('password must contain 1 letter, 1 number, and be at least 8 characters long')
            return
    
        } else if (!dataValidation.goodConfirmation) {
            setUserCreateError('passwords must match')
            return
    
        } else {
            localStorage.setItem('currentUser', username)
    
            // NAVIGATE TO THE NEXT PAGE
        }
    }

    return (
        <section className="IND-user IND-new">
            <h1>Create an Account to Begin</h1>
            <form method="get">
                <label htmlFor="new_username">New Username</label>
                <input type="text"
                    id="new_username"
                    placeholder="create username"
                    onChange={(e) => setUsername(e.target.value)} />
                <br />
                <label htmlFor="new_password">Create Password</label>
                <input type="password"
                    id="new_password"
                    placeholder="create password"
                    onChange={(e) => setPassword(e.target.value)} />
                <br />
                <label htmlFor="confirm_password">Confirm Password</label>
                <input type="password"
                    id="confirm_password"
                    placeholder="confirm password"
                    onChange={(e) => setConfirmation(e.target.value)} />
                <br />
                <p id="create_error">{ userCreateError }</p>
                <button className="submit" id="login_create" onClick={(event) => CreateLogin(event)}>Create New Account</button>
            </form>
        </section>
    )
}