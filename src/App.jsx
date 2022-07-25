import React, { useState, useEffect } from "react"
import Start from "./Start.jsx"
import Play from "./Play.jsx"

export default function App() {
    const [step, setStep] = useState(0)
    const [categories, setCategories] = useState()
    const [categoriesMap, setCategoriesMap] = useState()
    const [settings, setSettings] = useState()
    useEffect(function setup() {
        retrieveSettings()
        fetch("https://opentdb.com/api_category.php")
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            setCategories(data.trivia_categories)
            const map = new Map()
            for (let x of data.trivia_categories) {
                // console.log(`For: ${categoriesMap}`)
                map.set(x.name, x.id)
            }
            setCategoriesMap(map)
        }).catch(error => console.log(error))
    }, [])
    function updateLocal(settings) {
        localStorage.setItem("settings", JSON.stringify(settings))
    }
    function updateSettings(name, value) {
        setSettings({...settings, 
            [name]: value})
    }
    function retrieveSettings() {
        const localSettings = localStorage.getItem("settings");
        if (localSettings) {
            setSettings(JSON.parse(localSettings))
        } else {
            setSettings({numQuestions: 10,
                category: "Any",
                difficulty: "Any",
                type: "Any"})
            updateLocal(settings)
        }
    }
    return <>
            <nav><h1 onClick={() => setStep(0)}>Trivia!</h1>{step === 1 && <button className="return" onClick={() => setStep(0)}>
            {step === 1 ? "Quit" : "Return to Menu"}
            </button>}</nav>
            <div className="page">
                {(categories !== undefined) ? (step === 0 ? 
                <Start 
                    settings={settings} 
                    categories={categories}
                    setStep={setStep}
                    updateLocal={updateLocal}
                    updateSettings={updateSettings}
                    /> 
                : <Play 
                step={step}
                setStep={setStep}
                settings={settings}
                categoriesMap={categoriesMap}/>) : <h1>Loading...</h1>}
            </div>
        </>
}