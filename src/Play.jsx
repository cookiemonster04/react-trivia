import React, {useState, useEffect} from "react"
import Question from "./Question.jsx"
import Confetti from "./CorrectConfetti.jsx"
import he from "he"

export default function Play({step, settings, setStep, categoriesMap}) {
    const [entries, setEntries] = useState()
    const [submitted, setSubmitted] = useState(false)
    const [numCorrect, setNumCorrect] = useState(0)
    const [answers, setAnswers] = useState()
    const [invalid, setInvalid] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const [renderConfetti, setRenderConfetti] = useState(false)
    const [autoOffTime, setAutoOffTime] = useState()

    useEffect(function setup() {
        if (step !== 1) return;
        // console.log(categoriesMap)
        const categoryID = categoriesMap.get(settings.category)
        const fetchUrl = `https://opentdb.com/api.php?amount=${settings.numQuestions}`+
        (settings.category === "Any" ? `` : `&category=${categoryID}`)+
        (settings.difficulty === "Any" ? `` : `&difficulty=${settings.difficulty.toLowerCase()}`)+
        (settings.type === "Any" ? `` : `&type=${settings.type === "Multiple Choice" ? "multiple" : "boolean"}`)
        // console.log(fetchUrl)
        fetch(fetchUrl)
        .then(response => response.json())
        .then(data => {
            if (data.response_code === 0) {
                // console.log("Setting entries")
                // console.log(data)
                const decode = str => he.decode(String(str))
                for (let i = 0; i < data.results.length; i++) {
                    data.results[i].idx = i;
                }
                setEntries(data.results.map(item => ({...item, 
                    question: decode(item.question),
                    correct_answer: decode(item.correct_answer),
                    incorrect_answers: item.incorrect_answers.map(ans => decode(ans))
                })))
                setAnswers(() => {
                    let ret = []
                    for (let i = 0; i < data.results.length; i++) {
                        ret.push("")
                    }
                    return ret
                })
            } else if (data.response_code === 1) {
                fetch(`https://opentdb.com/api_count.php?category=${categoryID}`)
                .then(response => response.json())
                .then(data => {
                    setInvalid(true)
                    const categoryName = `total_${settings.difficulty !== "Any" ? `${settings.difficulty.toLowerCase()}_` : ''}question_count`
                    const numAvailable = data.category_question_count[categoryName]
                    setErrorMsg(`Sorry, you asked for ${settings.numQuestions} questions, but there are only ${numAvailable} questions that match your settings.
                    Please change your settings and try again.`)
                })
            } else {
                setInvalid(true)
                setErrorMsg("There's something wrong on our end. Sorry for this inconvenience!")
            }
        })
        .catch(error => console.log(error))
    }, [step])

    if (invalid) {
        return <div className="container">
            <h1>{errorMsg}</h1>
            <button className="return" onClick={() => {
                setInvalid(false)
                setErrorMsg("")
                setStep(0)} }>
            Return to Menu
            </button>
        </div>
    }
    if (!entries || !categoriesMap) {
        return <h1>Loading...</h1>
    }

    function setAnswer(idx) {
        return value => setAnswers(answers => {
            const ret = []
            for (let i = 0; i < answers.length; i++) {
                if (i === idx) ret.push(value)
                else ret.push(answers[i])
            }
            return ret
        })
    }

    const questionElements = entries.map(entry => <Question 
        key={entry.idx}
        shuffle={true}
        showAnswer={submitted}
        question={entry.question}
        correct={entry.correct_answer}
        incorrect={entry.incorrect_answers}
        answer={answers[entry.idx]}
        setAnswer={setAnswer(entry.idx)}
        />)
    function submit() {
        let count = 0
        for (let x of questionElements) {
            if (x.props.correct === x.props.answer) count++
        }
        setNumCorrect(count)
        setSubmitted(true)
        if (count === entries.length) runConfetti()
        setStep(2)
    }
    function reset() {
        setNumCorrect(0)
        setSubmitted(false)
        setEntries()
        hideConfetti()
        setStep(1)
    }
    function runConfetti() {
        setRenderConfetti(true)
        setAutoOffTime(Date.now()+3900) // 100ms leeway for delays/reduced precision issues
        // using auto off time to check whether this auto hide confetti timer is stale
        setTimeout(() => (Date.now() > autoOffTime ) && hideConfetti(), 4000)
    }
    function hideConfetti() {
        setRenderConfetti(false)
    }
    return <div className="container">
        <div className="form">
            {questionElements}
        </div>
        {submitted ? <div className="results">
            { numCorrect === entries.length && renderConfetti && <Confetti /> }
            <h1>You scored {numCorrect}/{entries.length}</h1>
            <button className="start" onClick={() => reset()}>
            Play Again
            </button>
            { numCorrect === entries.length && 
                (renderConfetti ? <button onClick={hideConfetti}>
                    Hide Confetti
                </button> : <button onClick={runConfetti}>
                    Show Confetti
                </button>
                )}
        </div> : <div className="center"><button className="submit" onClick={submit}>
            Submit
        </button></div>}
    </div>
}