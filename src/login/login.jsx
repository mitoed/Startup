import React from "react";
import './login.mjs'

export function Login() {
    return (
        <main className="ALL-l-main ALL-container ALL-verticle">
            <section className="IND-login">
                <section className="IND-user IND-exists">
                    <h1>Login to Enter a Session</h1>
                    <form method="get">
                        <label htmlFor="username_input">Username</label>
                        <input type="text" id="username_input"
                            placeholder="type your username" />
                        <br />
                        <label htmlFor="password_input">Password</label>
                        <input type="password" id="password_input"
                            placeholder="type your password" />
                        <br />
                        <p id="login_error"></p>
                        <button className="submit" id="login_exist" onClick={<validateLogin />}>Login</button>
                    </form>
                </section>
                <section className="IND-user IND-new">
                    <h1>Create an Account to Begin</h1>
                    <form method="get">
                        <label htmlFor="new_username">New Username</label>
                        <input type="text" id="new_username"
                            placeholder="create username" />
                        <br />
                        <label htmlFor="new_password">Create Password</label>
                        <input type="password" id="new_password"
                            placeholder="create password" />
                        <br />
                        <label htmlFor="confirm_password">Confirm Password</label>
                        <input type="password" id="confirm_password"
                            placeholder="confirm password" />
                        <br />
                        <p id="create_error"></p>
                        <button className="submit" id="login_create" onClick={<createLogin />}>Create New Account</button>
                    </form>
                </section>
            </section>
        </main>
    )
}