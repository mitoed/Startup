import React from "react";
import { Link } from "react-router-dom"

export default function Recommendation({ sessionID }) {

    const [ recommendationHREF, setHREF ] = React.useState('')
    const [ recommendationType, setType ] = React.useState('')
    const [ categoryPlural, setPlural ] = React.useState('')

    React.useEffect(() => {
        generateHTML()
    }, [])

    async function generateHTML() {
        const response = await fetch(`/api/internet-recommendation`, {
            method: 'post',
            body: JSON.stringify({
                sessionID: sessionID
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
        })

        const data = await response.json()
        setHREF(data.href)
        setType(data.type)
        setPlural(data.plural)
    }

    return (
        <section className="VOT-internet" id="recommendation_bubble">
            <p>
                Click <Link to={recommendationHREF} target="_blank">here</Link> to see some of the top{' '}
                <span>{recommendationType}</span> {categoryPlural}
                <br />on Google.com
            </p>
        </section>
    )
}