import React from "react";
import { useNavigate } from 'react-router-dom';
import { locals } from "../../service";

export function Create({ username }) {

    const [ category, setCategory ] = React.useState('')
    const navigate = useNavigate()

    async function newSession(event) {

        event.preventDefault()
        
        try {
            const response = await fetch(`/api/create-session`, {
                method: 'post',
                body: JSON.stringify({
                    username: username,
                    category: category,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
            })
            const { status } = response
    
            if (status === 200) {
                const { sessionID } = await response.json()
                localStorage.setItem('currentSessionID', sessionID.toUpperCase())
                localStorage.setItem('currentCategory', category)
                
                navigate('/voting')
            }
    
        // Unexpected errors
        } catch (error) {
            console.log('Problem with server. Please try again.', error)
            return
        }
    
    }

    return (
        <section className="ENT-create">
            <h2>or Create a new session</h2>
            <form method="get" className="ENT-create-form">
                <div className="ENT-create-form-cat">
                    <input type="radio"
                        id="food"
                        name="category"
                        value="food"
                        onChange={(e) => setCategory(e.target.value)}
                        />
                    <label htmlFor="food">Food</label>
                </div>
                <div className="ENT-create-form-cat">
                    <input type="radio"
                        id="movie"
                        name="category"
                        value="movie"
                        onChange={(e) => setCategory(e.target.value)}
                        />
                    <label htmlFor="movie">Movie</label>
                </div>
                <div className="ENT-create-form-cat">
                    <input type="radio"
                        id="game"
                        name="category"
                        value="game"
                        onChange={(e) => setCategory(e.target.value)}
                        />
                    <label htmlFor="game">Game</label>
                </div>
                <button
                    className="submit"
                    id="create_session"
                    onClick={(event) => newSession(event)}
                    >Create Session</button>
            </form>
        </section>
    )
}