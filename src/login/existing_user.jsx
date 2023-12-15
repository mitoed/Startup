import React from "react";
import { useNavigate } from 'react-router-dom';

export function ExistingUser(props) {
    const [username, setUsername] = React.useState(props.username)
    const [password, setPassword] = React.useState('')
    const [userLoginError, setUserLoginError] = React.useState('')
    const navigate = useNavigate()

    async function ValidateLogin(event) {
        event.preventDefault()

        const response = await fetch(`/api/auth/validate-login`, {
            method: 'post',
            body: JSON.stringify({
                username: username.toUpperCase(),
                password: password,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
        })
        console.log(response.status)
        const dataValidation = await response.json()

        if (!dataValidation.goodUsername) {
            setUserLoginError('username does not exist')
            return

        } else if (!dataValidation.goodPassword) {
            setUserLoginError('incorrect password')
            return

        } else {
            localStorage.setItem('currentUser', username.toUpperCase())
            
            navigate('/enter')
        }
    }

    return (
        <section className="IND-user IND-exists">
            <h1>Login to Enter a Session</h1>
            <form method="get">
                <label htmlFor="username_input">Username</label>
                <input type="text"
                    id="username_input"
                    placeholder="type your username"
                    onChange={(e) => setUsername(e.target.value)} />
                <br />
                <label htmlFor="password_input">Password</label>
                <input type="password" 
                    id="password_input"
                    placeholder="type your password"
                    onChange={(e) => setPassword(e.target.value)} />
                <br />
                <p id="login_error">{ userLoginError }</p>
                <button className="submit" id="login_exist" onClick={(event) => ValidateLogin(event)}>Login</button>
            </form>
        </section>
    )
}