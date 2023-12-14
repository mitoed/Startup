import React from "react";

export default function GroupSelection({ decision, category }) {

    const [ background, setBackground ] = React.useState('hidden')
    const [ backgroundLock, setBackgroundLock] = React.useState(true)

    React.useEffect(() => {
        if (decision && backgroundLock) {
            setBackground('visible')
        }
    }, [decision])

    function clearBackground() {
        setBackground('hidden')
        setBackgroundLock(false)
    }
    
    function categoryVerb(category) {
        switch (category) {
            case 'food':
                return 'eating at'
            case 'movie':
                return 'watching'
            case 'game':
                return 'playing'
        }
    }

    return (
        <>
            <div id="dark_background" style={{visibility: background}} onClick={() => clearBackground()}></div>
            <div id="final_decision_box">
                <div id="final_decision" style={{visibility: background}}>
                    <p>Based on the selection of the group, you will be{' '}
                        <span id="category_verb">{categoryVerb(category)}</span>{' '}
                        <span id="group_selection">{ decision }</span>!</p>
                </div>
            </div>
        </>
    )
}