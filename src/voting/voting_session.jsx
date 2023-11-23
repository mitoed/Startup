import React from "react";

export function Voting() {
    return (
        <>
            <main class="ALL-l-main ALL-container ALL-verticle">
                <section class="VOT-session VOT-info">
                    <h1 id="session_id">Session ID: D4K452</h1>
                </section>
                <section class="VOT-session VOT-user-count">
                    <h1 id="user_count">Active Users: 1</h1>
                </section>
                <section class="VOT-count_selection VOT-container">
                    <section class="VOT-count">
                        <table id="count_table">
                            <tr>
                                <th colspan="2">Voting Status</th>
                            </tr>
                            <tbody>
                                <tr>
                                    <td>Loading...</td>
                                    <td></td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <td>Loading...</td>
                                    <td></td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <td>Loading...</td>
                                    <td></td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <td>Loading...</td>
                                    <td></td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <td>Loading...</td>
                                    <td></td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <td>Loading...</td>
                                    <td></td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <td>Loading...</td>
                                    <td></td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <td>Loading...</td>
                                    <td></td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <td>Loading...</td>
                                    <td></td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <td>Loading...</td>
                                    <td></td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <td>Loading...</td>
                                    <td></td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <td>Loading...</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                    <section class="VOT-select">
                        <form action>
                            <label for="vote_selection">Voting Selection</label>
                            <br/>
                            <input type="text" list="voting_options"
                                id="vote_selection"
                                name="vote_selection"
                                placeholder="type to search or create" />
                            <datalist id="voting_options">
                            </datalist>
                        </form>
                        <p id="finalize_msg"></p>
                        <div>
                            <button id="clear_vote" class="submit">Clear</button>
                            <button id="finalize_vote" class="submit">Finalize</button>
                        </div>
                    </section>
                    <section class="VOT-internet" id="recommendation_bubble">
                        <p></p>
                    </section>
                </section>
            </main>
            <section>
                <div id="dark_background"></div>
                <div id="final_decision_box">
                    <div id="final_decision">
                        <p>Based on the selection of the group, you will be
                            <span id="category_verb">eating at</span>
                            <span id="group_selection">McDonald's</span>!</p>
                    </div>
                </div>
                <div id="recommended_opinion_box">
                    <div id="recommended_opinion">
                        <h1>Care to try something new?</h1>
                        <p>A group member seems to be more creative than the rest.
                            <br/>
                            This time, they voted for:
                            <span id="recommended_selection">Good Move</span>
                            <br/>
                            Would you like to support this opinion instead?</p>
                        <button id="opinion_yes" type="submit" class="submit">Yes</button>
                        <button id="opinion_no" type="button" class="submit">No</button>
                    </div>
                </div>
            </section>
        </>
    )
}