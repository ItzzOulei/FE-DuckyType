import { useEffect, useState, useRef } from "react";
import styles from "../TypingTest/TypingTest.module.css";
import TypingResultAPI from "../../lib/api/TypingResult.js";
import { useGlobalContext } from "../../store/index.js";

const TypingTest = () => {
    const { session } = useGlobalContext();
    const [wordCount, setWordCount] = useState(10);
    const [width, setWidth] = useState(0);
    const [wrongChars, setWrongChars] = useState([]);
    const [displayLetters, setDisplayLetters] = useState("");
    const [userLetters, setUserLetters] = useState("");
    const [testToken, setTestToken] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [nextSentence, setNextSentence] = useState("");
    const [lastTypedPositions, setLastTypedPositions] = useState([]);
    const [results, setResults] = useState({
        accuracy: "",
        raw: "",
        wpm: "",
        cpm: "",
        time: "",
        words: "",
        characters: "",
        sentence: "",
        userInput: "",
        timestamp: ""
    });
    const [showResults, setShowResults] = useState(false);
    const textRef = useRef(null);
    const cursorRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedSentence = localStorage.getItem(`nextSentence_${wordCount}`) || "";
            setNextSentence(savedSentence);
        }
    }, [wordCount]);

    const prefetchSentence = async (wordCount) => {
        try {
            const response = await TypingResultAPI.startTest(wordCount, session?.accessToken || null);
            const sentence = response.sentence;
            setNextSentence(sentence);
            if (typeof window !== 'undefined') {
                localStorage.setItem(`nextSentence_${wordCount}`, sentence);
            }
        } catch (error) {
            console.error("Error prefetching sentence:", error);
            setNextSentence("");
            if (typeof window !== 'undefined') {
                localStorage.removeItem(`nextSentence_${wordCount}`);
            }
        }
    };

    const startTest = async (wordCount) => {
        if (nextSentence) {
            setDisplayLetters(nextSentence);
            setNextSentence("");
            if (typeof window !== 'undefined') {
                localStorage.removeItem(`nextSentence_${wordCount}`);
            }
            prefetchSentence(wordCount);
        } else {
            try {
                const response = await TypingResultAPI.startTest(wordCount, session?.accessToken || null);
                setDisplayLetters(response.sentence);
                prefetchSentence(wordCount);
            } catch (error) {
                console.error("Error starting test:", error);
                setDisplayLetters("Error while loading test words, please check your internet connection");
            }
        }
    };

    const handleReturn = () => {
        setShowResults(false);
        resetTest();
    };

    const handleWordAmount = (e) => {
        e.preventDefault();
        setNextSentence("");
        if (typeof window !== 'undefined') {
            localStorage.removeItem(`nextSentence_${wordCount}`);
        }
        const newWordCount = Number(e.target.textContent);
        setWordCount(newWordCount);
        setShowResults(false);
        resetTest();
    };

    const handleTap = () => {
        if (inputRef.current && !showResults) {
            inputRef.current.focus();
        }
    };

    const resetTest = () => {
        setResults({
            accuracy: "",
            raw: "",
            wpm: "",
            cpm: "",
            time: "",
            words: "",
            characters: "",
            sentence: "",
            userInput: ""
        });
        setUserLetters("");
        setWrongChars([]);
        setLastTypedPositions([]);
        setTestToken(null);
        setStartTime(null);
        startTest(wordCount);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const generateTestTokenAsync = async () => {
        const localStartTime = Date.now();
        setStartTime(localStartTime);
        if (!session?.accessToken) {
            console.log("No access token, skipping token generation");
            return;
        }
        try {
            const response = await TypingResultAPI.generateTestToken(
                { sentence: displayLetters },
                session.accessToken
            );
            setTestToken(response.token);
            console.log("Test token set:", response.token);
            return response.token;
        } catch (error) {
            console.error("Error generating test token:", error);
            return null;
        }
    };

    const addLetter = (letter) => {
        if (userLetters.length === 0 && !startTime) {
            generateTestTokenAsync();
        }
        const updated = userLetters + letter;
        setUserLetters(updated);
    };

    //Contributed by loic steiner
    const skipToNextWord = () => {
        const words = displayLetters.split(" ");
        let currentPos = userLetters.length;
        let currentWordStart = 0;
        let currentWordIndex = 0;

        // Finde das aktuelle Wort
        for (let i = 0; i < words.length; i++) {
            const wordLength = words[i].length;
            if (currentPos >= currentWordStart && currentPos <= currentWordStart + wordLength) {
                currentWordIndex = i;
                break;
            }
            currentWordStart += wordLength + 1; // +1 für das Leerzeichen
        }

        const currentWord = words[currentWordIndex];
        const wordEndPos = currentWordStart + currentWord.length;
        const hasStartedWord = currentPos > currentWordStart;
        const isWordComplete = currentPos === wordEndPos;

        // Prüfe, ob das Wort vollständig ist oder mindestens ein Buchstabe eingegeben wurde
        if (!hasStartedWord && !isWordComplete) {
            return; // Verhindert Leertasten-Spamming
        }

        let updatedUserLetters = userLetters;
        let updatedLastTypedPositions = [...lastTypedPositions];

        // Speichere die Position des letzten eingegebenen Buchstabens
        updatedLastTypedPositions.push(currentPos);
        setLastTypedPositions(updatedLastTypedPositions);

        // Wenn das Wort nicht vollständig ist, fülle mit Platzhaltern auf
        if (!isWordComplete) {
            const remainingLetters = currentWord.slice(currentPos - currentWordStart);
            for (let i = 0; i < remainingLetters.length; i++) {
                updatedUserLetters += "_"; // Platzhalter für übersprungene Buchstaben
            }
        }

        // Prüfe, ob dies das letzte Wort ist
        if (currentWordIndex === words.length - 1) {
            // Fülle den restlichen Text mit Platzhaltern auf, um den Test abzuschließen
            while (updatedUserLetters.length < displayLetters.length) {
                updatedUserLetters += "_";
            }
        } else {
            // Füge ein Leerzeichen hinzu, um zum nächsten Wort zu springen
            updatedUserLetters += " ";
        }

        setUserLetters(updatedUserLetters);
    };

    const handleFinish = async () => {
        if (!startTime) {
            console.log("No start time, cannot finish test");
            return;
        }

        let correct = 0;
        let incorrect = 0;
        const wrongPositions = [];

        displayLetters.split("").forEach((char, i) => {
            const userChar = userLetters[i] || "";
            if (userChar === "_") {
                incorrect += 1;
                wrongPositions.push({
                    position: i,
                    expected: char,
                    typed: null
                });
            } else if (userChar === char) {
                correct += 1;
            } else {
                incorrect += 1;
                wrongPositions.push({
                    position: i,
                    expected: char,
                    typed: userChar || null
                });
            }
        });

        const elapsedTime = (Date.now() - startTime) / 1000;
        const timeInMinutes = elapsedTime / 60;
        const cpm = Math.round(correct / timeInMinutes);
        const accInDec = correct / (incorrect + correct);
        const acc = Math.round(accInDec * 100);
        const wpm = Math.round((wordCount / timeInMinutes) * accInDec);

        const newResults = {
            accuracy: acc,
            raw: Math.round(wordCount / timeInMinutes),
            wpm: wpm,
            cpm: cpm,
            time: Math.round(elapsedTime * 100) / 100,
            words: wordCount,
            characters: (incorrect + correct),
            sentence: displayLetters,
            userInput: userLetters,
            timestamp: Date.now()
        };

        setWrongChars(wrongPositions);
        setResults(newResults);
        setShowResults(true);

        prefetchSentence(wordCount);

        if (session?.accessToken && acc >= 70 && testToken) {
            console.log("Saving result:", newResults, "Token:", testToken);
            try {
                await TypingResultAPI.saveResult(newResults, session.accessToken, testToken);
                console.log("Result saved successfully");
            } catch (error) {
                console.error("Error saving result:", error);
            }
        } else {
            console.log("Save skipped:", { accessToken: !!session?.accessToken, acc, testToken });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            resetTest();
            if (showResults) {
                setShowResults(false);
            } else if (results.wpm !== "") {
                setShowResults(true);
            }
            return;
        }

        if (!showResults) {
            if (e.key === " ") {
                e.preventDefault();
                skipToNextWord();
            } else if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
                addLetter(e.key);
                e.preventDefault();
            } else if (e.key === "Backspace") {
                e.preventDefault();
                let updatedUserLetters = userLetters;
                let updatedLastTypedPositions = [...lastTypedPositions];

                if (updatedUserLetters.length > 0) {
                    if (updatedLastTypedPositions.length > 0 && updatedUserLetters.endsWith(" ")) {
                        // Kehre zur letzten eingegebenen Position zurück
                        const lastPos = updatedLastTypedPositions.pop();
                        updatedUserLetters = updatedUserLetters.slice(0, lastPos);
                        setLastTypedPositions(updatedLastTypedPositions);
                    } else {
                        // Normales Löschen des letzten Buchstabens
                        updatedUserLetters = updatedUserLetters.slice(0, -1);
                    }
                    setUserLetters(updatedUserLetters);
                }
            }
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setWidth(window.innerWidth);
        }

        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        startTest(wordCount);
    }, [wordCount]);

    useEffect(() => {
        if (userLetters.length === displayLetters.length && userLetters.length > 0) {
            handleFinish();
        }
    }, [userLetters, displayLetters]);

    useEffect(() => {
        if (!textRef.current || !cursorRef.current || showResults) return;
        const spans = textRef.current.getElementsByTagName("span");
        const currentPos = userLetters.length;
        if (spans.length > 0) {
            const targetSpan = currentPos === 0 ? spans[0] : spans[Math.min(currentPos, spans.length - 1)];
            const rect = targetSpan.getBoundingClientRect();
            const containerRect = textRef.current.getBoundingClientRect();
            cursorRef.current.style.left = `${rect.left - containerRect.left}px`;
            cursorRef.current.style.top = `${rect.top - containerRect.top}px`;
            cursorRef.current.style.height = `${rect.height}px`;
        }
    }, [userLetters, displayLetters, showResults, width]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [userLetters, displayLetters, showResults, results, lastTypedPositions]);

    return (
        <div className={styles.container}>
            <div className={`${showResults ? styles.showResults : styles.showTyping} ${styles.settingsContainer}`}>
                <div className={styles.settingsIcons}>
                    <p>Words: </p>
                    <p className={styles.settingsClickable} onClick={handleWordAmount}>10</p>
                    <p className={styles.settingsClickable} onClick={handleWordAmount}>15</p>
                    <p className={styles.settingsClickable} onClick={handleWordAmount}>20</p>
                    <p>|</p>
                    <p className={styles.settingsClickable} onClick={handleReturn}>Clear</p>
                </div>
            </div>
            <div className={`${styles.viewContainer} ${showResults ? styles.showResults : styles.showTyping}`}>
                <div className={styles.typingView} onClick={handleTap}>
                    <div className={styles.generatedText} ref={textRef} key={displayLetters}>
                        {displayLetters.split("").map((char, i) => {
                            let className = styles.default;
                            if (userLetters[i]) {
                                if (userLetters[i] === "_") {
                                    className = styles.wrong; // Übersprungene Buchstaben rot markieren
                                } else {
                                    className = userLetters[i] === char ? styles.correct : styles.wrong;
                                }
                            }
                            return (
                                <span key={i} className={className}>
                                    {char}
                                </span>
                            );
                        })}
                        {!showResults && <div ref={cursorRef} className={styles.cursor}></div>}
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        style={{ opacity: 0, position: "absolute", width: 0, height: 0 }}
                    />
                    {!session?.accessToken && (
                        <div className={styles.infoContainer}>
                            <i className="material-icons">info_outline</i>
                            <p>Log in to save your results!</p>
                        </div>
                    )}
                </div>
                <div className={styles.resultsView}>
                    <div className={styles.displayResult}>
                        <div className={styles.topResults}>
                            <div>
                                <h3>WPM: {results.wpm}</h3>
                                <h3>Acc: {results.accuracy}%</h3>
                            </div>
                            <div>
                                <div>
                                    {results.sentence.split("").map((char, i) => {
                                        const userChar = results.userInput[i];
                                        const isCorrect = userChar === char;
                                        if (char === " " && userChar && !isCorrect) {
                                            return (
                                                <span key={i} className={styles.wrongSpace}> _ </span>
                                            );
                                        }
                                        return (
                                            <span key={i} className={userChar ? (isCorrect ? styles.correct : styles.wrong) : styles.default}>
                                                {char}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className={styles.bottomResults}>
                            <h3>Raw: {results.raw}</h3>
                            <h3>CPM: {results.cpm}</h3>
                            <h3>{results.time} sec</h3>
                            <h3>Words: {results.words}</h3>
                        </div>
                        <div className={styles.returnIcons}>
                            <p>Press Tab to try again</p>
                            <div className={styles.returnMobile} onClick={handleReturn}>
                                <p>Return</p>
                                <i className="material-icons">subdirectory_arrow_left</i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TypingTest;