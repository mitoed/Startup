import React from "react";
import castVote from "./cast_vote";

export default function UserSelection({ options, socket, username, sessionID, category, buttonEnable }) {

    const [ userVote, setUserVote ] = React.useState('')

    function handleSubmit(newVote) {
        if (buttonEnable) {
            setUserVote(newVote.trim() || '')
            castVote(socket, username, newVote.trim() || '', sessionID, category)
        }
    }

    function CreateDatalist() {
        const sortedOptions = options.sort((a, b) => a.localeCompare(b))
        
        const datalist = []
        for (let option of sortedOptions) {
            datalist.push(<option key={option} value={option}></option>)
        }
        return datalist
    }

    return (
        <section className="VOT-select">
            <form>
                <label htmlFor="vote_selection">Voting Selection</label>
                <br/>
                <input type="text"
                    list="voting_options"
                    id="vote_selection"
                    name="vote_selection"
                    value={userVote}
                    onChange={(e) => setUserVote(e.target.value)}
                    placeholder="type to search or create" />
                <datalist id="voting_options">
                    <CreateDatalist />
                </datalist>
            </form>
            <p id="finalize_msg"></p>
            <div>
                <button id="clear_vote" className="submit" onClick={() => handleSubmit('')}>Clear</button>
                <button id="finalize_vote" className="submit" onClick={() => handleSubmit(userVote)}>Finalize</button>
            </div>
        </section>
    )
}