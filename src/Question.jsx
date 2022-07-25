import React, {useState, useEffect} from "react"

export default function Question(props) {
    // console.log("Question rendered")
    const [curAnswer, setCurAnswer] = useState(props.defAnswer ? props.defAnswer : "")
    const [options, setOptions] = useState()
    useEffect(function setup() {
        // console.log("Question created")
        if (props.options) {
            setOptions(props.options)
        } else {
            let newOptions = [props.correct]
            for (let x of props.incorrect) {
                newOptions.push(x)
            }
            newOptions = newOptions.map(value => ({ value, key: value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
            setOptions(newOptions)
        }
    }, [])
    if (!options) {
        return <h1>Loading...</h1>
    }
    const optionElements = options.map(opt => {
        let curName = curAnswer === opt ? "selected" : "option"
        if (props.showAnswer) {
            curName = (props.correct === opt ? "correct " : "incorrect ") + curName
        }
        return <button key={opt} name={opt} className={curName} onClick={event => { 
            setCurAnswer(event.target.name)
            props.setAnswer(event.target.name)
            } }>
            {opt}
        </button>
    })
    return <div className="question">
        <h1>{props.question}</h1>
        <div className="options">
        {optionElements}
        </div>
    </div>
}