import React, {useState, useEffect} from "react"
import Question from "./Question.jsx"

export default function Start({settings, updateLocal, setStep, categories, updateSettings}) {
    console.log(`Start: ${categories}`)
    const [entries, setEntries] = useState([])
    useEffect(function setup() {
        setEntries([{ 
            idx: 0,
            name: "numQuestions",
            question: "Number of questions:",
            options: Array.from({length: 40}, (_, i) => `${i + 1}`)},
        { 
            idx: 1,
            name: "category",
            question: "Category:",
            options: ["Any", ...categories.map(category => category.name)]},
        { 
            idx: 2,
            name: "difficulty",
            question: "Difficulty:",
            options: ["Any", "Easy", "Medium", "Hard"]},
        { 
            idx: 3,
            name: "type",
            question: "Type:",
            options: ["Any", "True/False", "Multiple Choice"]}])
    }, [])
    const questionElements = entries.map(entry => <Question 
        key={entry.idx}
        options={entry.options}
        question={entry.question}
        defAnswer={settings[entry.name]}
        setAnswer={value => updateSettings(entry.name, value)}
        />)
    function concludeStart() {
        updateLocal(settings)
        setStep(1)
    }
    return <div className="container">
        <div className="form">
            {questionElements}
        </div>
        <div className="center">
        <button className="start" onClick={concludeStart}>
            Start!
        </button>
        </div>
    </div>
}