import React from "react";

export default function VotingTable({ options , sessionUserVotes }) {

    const [ tableVotes, setTableVotes ] = React.useState(loading())

    function createSortedTable() {
        const voteTotals = []

            for (const option of options) {
                const optionTotal = sessionUserVotes.filter((user) => user.vote === option).length
                voteTotals.push({_id: option, option: option, votes: optionTotal})
            }

            let sortedTotals = voteTotals.sort((a, b) => a.option.localeCompare(b.option));
            sortedTotals = sortedTotals.sort((a, b) => b.votes - a.votes)

            return sortedTotals
    }

    React.useEffect(() => {
        setTableVotes(createSortedTable())
    }, [sessionUserVotes])

    return (
        <section className="VOT-count">
            <table id="count_table">
                <tbody>
                    <tr>
                        <th colSpan="2">Voting Status</th>
                    </tr>
                    {tableVotes.map((vote) => (
                        <tr key={vote._id}>
                            <td>{vote.option}</td>
                            <td>{vote.votes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    )
}

function loading() {
    const loadingValues = []
    for (let i = 0; i < 12; i++) {
        loadingValues.push({_id: i, option: 'Loading...', votes: 0})
    }
    return loadingValues
}