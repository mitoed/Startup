import React from "react";

export function Enter() {
    return (
        <main className="ALL-l-main ALL-container ALL-verticle">
            <section className="ALL-username">
                <h1 id="username">Welcome!</h1>
            </section>
            <section className="ENT-session">
                <section className="ENT-join">
                    <h2>Join an existing session</h2>
                    <form method="get" className="ENT-join-form">
                        <label htmlFor="session_id">Session ID</label>
                        <input type="text" id="join_session_id" name="session_id" placeholder="type a session id" />
                        <br />
                        <p id="session_not_found_error"></p>
                        <button className="submit" id="join_session">Join Session</button>
                    </form>
                </section>
                <br />
                <section className="ENT-create">
                    <h2>or Create a new session</h2>
                    <form method="get" className="ENT-create-form">
                        <div className="ENT-create-form-cat">
                            <input type="radio" id="food" name="category"
                                value="food" />
                            <label htmlFor="food">Food</label>
                        </div>
                        <div className="ENT-create-form-cat">
                            <input type="radio" id="movie" name="category"
                                value="movie" />
                            <label htmlFor="movie">Movie</label>
                        </div>
                        <div className="ENT-create-form-cat">
                            <input type="radio" id="game" name="category"
                                value="game" />
                            <label htmlFor="game">Game</label>
                        </div>
                        <button className="submit" id="create_session">Create Session</button>
                    </form>
                </section>
            </section>
        </main>
    )
}