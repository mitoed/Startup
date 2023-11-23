import React from "react";

export function About() {
    return (
        <main class="ALL-l-main">
            <section id="media">
                <img
                    src="https://bristoluniversitypress.co.uk/media/ducks-banner-resized.jpg"
                    alt="meaningless placeholder picture" height="120" />
            </section>
            <section class="ABT-container">
                <section class="ABT-why">
                    <h1>Why did I create Activity Anarchy?</h1>
                    <p>Making decisions can be exhausting! Then, include more people.
                        I made Activity Anarchy to help groups of people decide on things
                        that should not require frustration upfront. Using this tool,
                        your group will find the balance between exploring new options
                        and quickly coming to group concencious. Try it out for yourself!</p>
                </section>
                <section class="ABT-how">
                    <h1>How is Activity Anarchy meant to be used?</h1>
                    <p>As each member of the group
                        can vote freely, you will see each preference without hesitence.
                        If you are up for recommendations, follow the Google links to find out
                        what's in style. You will not be disappointed when each group
                        member can express their opinion and the group can quickly move on from
                        the decision-making process.</p>
                </section>
            </section>
            <section class="ABT-container">
                <section class="ABT-quote">
                    
                    <p id="quote">Loading inspirational quote...</p>
                    <p id="citation"></p>
                </section>
            </section>
        </main>
    )
}