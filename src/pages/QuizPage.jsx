import { useState, useEffect } from "react";
import book from "../assets/book.png";

const SUBJECTS = {
  math: [
    { q: "What is 12 × 8?", choices: ["80", "96", "108", "112"], answer: 1, hint: "Think 12×(10−2)." },
    { q: "Solve: 2x + 6 = 18", choices: ["x=5", "x=6", "x=7", "x=8"], answer: 0, hint: "Subtract 6, then divide by 2." },
    { q: "Prime number?", choices: ["21", "27", "29", "33"], answer: 2, hint: "Only divisible by 1 and itself." },
    { q: "Area of a 5×7 rectangle", choices: ["12", "24", "30", "35"], answer: 3, hint: "Area = length×width." },
    { q: "Square root of 144", choices: ["10", "11", "12", "13"], answer: 2, hint: "12×12." },
  ],
  biology: [
    { q: "Basic unit of life?", choices: ["Atom", "Molecule", "Cell", "Organ"], answer: 2, hint: "All organisms are made of these." },
    { q: "Process plants use to make food", choices: ["Respiration", "Photosynthesis", "Fermentation", "Transpiration"], answer: 1, hint: "Involves chlorophyll and sunlight." },
    { q: "DNA stands for…", choices: ["Deoxyribonucleic acid", "Dioxyribonitric acid", "Deoxyribose nucleic atom", "Dinucleotide acid"], answer: 0, hint: "Deoxy-ribo-nucleic." },
    { q: "Organ that pumps blood", choices: ["Liver", "Heart", "Lung", "Kidney"], answer: 1, hint: "Cardiac." },
    { q: "Vertebrates have…", choices: ["Backbone", "Scales", "Exoskeleton", "Gills"], answer: 0, hint: "Spine present." },
  ],
  geography: [
    { q: "Largest ocean", choices: ["Atlantic", "Indian", "Pacific", "Arctic"], answer: 2, hint: "Covers ~30% of Earth." },
    { q: "Capital of Japan", choices: ["Seoul", "Kyoto", "Tokyo", "Osaka"], answer: 2, hint: "Most populous metro area." },
    { q: "River through Egypt", choices: ["Nile", "Amazon", "Yangtze", "Danube"], answer: 0, hint: "Flows north to the Med." },
    { q: "Continent with Sahara", choices: ["Asia", "Africa", "Australia", "South America"], answer: 1, hint: "Northern hemisphere desert." },
    { q: "Mount Everest is in…", choices: ["Nepal/China", "India/Pakistan", "Bhutan", "Mongolia"], answer: 0, hint: "On the Himalaya border." },
  ],
  history: [
    { q: "Who painted the Mona Lisa?", choices: ["Da Vinci", "Michelangelo", "Raphael", "Donatello"], answer: 0, hint: "Also an inventor." },
    { q: "WWII ended in", choices: ["1943", "1944", "1945", "1946"], answer: 2, hint: "Same year as Hiroshima." },
    { q: "First US President", choices: ["Lincoln", "Washington", "Jefferson", "Adams"], answer: 1, hint: "On the $1 bill." },
    { q: "Pyramids country", choices: ["Mexico", "Peru", "Egypt", "Iraq"], answer: 2, hint: "Giza plateau." },
    { q: "Ancient Olympic Games origin", choices: ["Rome", "Greece", "Egypt", "China"], answer: 1, hint: "Olympia." },
  ],
  computers: [
    { q: "CPU stands for", choices: ["Central Processing Unit", "Computer Personal Unit", "Core Processing Utility", "Central Peripheral Unit"], answer: 0, hint: "The computer's brain." },
    { q: "Binary base", choices: ["2", "8", "10", "16"], answer: 0, hint: "Bits 0/1." },
    { q: "HTML is a…", choices: ["Programming language", "Markup language", "Database", "OS"], answer: 1, hint: "It structures content." },
    { q: "RAM is…", choices: ["Long-term storage", "Graphics chip", "Random Access Memory", "Read-only media"], answer: 2, hint: "Volatile memory." },
    { q: "URL part identifying server", choices: ["Protocol", "Host", "Path", "Fragment"], answer: 1, hint: "Domain name." },
  ],
};

const randInt = (n) => Math.floor(Math.random() * n);
const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function QuizPage() {
  const [menu, setMenu] = useState(true);
  const [game, setGame] = useState(false);
  const [end, setEnd] = useState(false);
  const [loading, setLoading] = useState(false);

  const [subject, setSubject] = useState("math");
  const [pool, setPool] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [time, setTime] = useState(20);
  const [baseTime, setBaseTime] = useState(20);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [powerUps, setPowerUps] = useState({ fifty: 2, skip: 2, double: 1, freeze: 1, hint: 2 });
  const [doubleActive, setDoubleActive] = useState(false);
  const [hint, setHint] = useState("");
  const [timerId, setTimerId] = useState(null);
  const [powerStatus, setPowerStatus] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    const key = `quiz-hs-${subject}`;
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    setHighScores(data);
  }, [subject]);

  useEffect(() => {
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [timerId]);

  const startGame = async () => {
    setMenu(false);
    setGame(false);
    setEnd(false);
    setLoading(true);

    try {
      const r = await fetch(`http://localhost:3001/api/questions?subject=${subject}`);
      const { questions } = await r.json();

      const questionsWithMask = (questions?.length ? questions : SUBJECTS[subject])
        .map(q => ({ ...q, _masked: new Set() }));

      const shuffled = shuffle(questionsWithMask);
      setPool(shuffled);
      setIndex(0);
      setScore(0);
      setLives(3);
      setBaseTime(20);
      setAnswered(false);
      setDoubleActive(false);
      setHint('');
      setPowerStatus('');
      setLoading(false);
      setGame(true);
      nextQuestion(shuffled, 0, 20);
    } catch {
      const fallback = shuffle(SUBJECTS[subject].map(q => ({ ...q, _masked: new Set() })));
      setPool(fallback);
      setIndex(0);
      setScore(0);
      setLives(3);
      setBaseTime(20);
      setAnswered(false);
      setDoubleActive(false);
      setHint('');
      setPowerStatus('AI generation failed. Using built-in questions.');
      setLoading(false);
      setGame(true);
      nextQuestion(fallback, 0, 20);
    }
  };

  const nextQuestion = (qPool = pool, idx = index, timeForQuestion = baseTime) => {
    if (!qPool || idx >= qPool.length) return endGame();
    setHint("");
    setPowerStatus(doubleActive ? "Double points active on this question!" : "");
    setAnswered(false);
    setFeedback("");
    setTime(timeForQuestion);
    if (timerId) clearInterval(timerId);
    const id = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(id);
          outOfTime();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    setTimerId(id);
  };

  const currentQuestion = pool[index];

  const answer = (i) => {
    if (answered || !currentQuestion) return;
    setAnswered(true);
    if (timerId) clearInterval(timerId);
    const correct = i === currentQuestion.answer;
    if (correct) {
      let gained = 100 + Math.max(0, time) * 2;
      if (doubleActive) {
        gained *= 2;
        setDoubleActive(false);
      }
      setScore((s) => s + gained);
      setFeedback("✅ Correct!");
    } else {
      setLives((l) => l - 1);
      setFeedback(`❌ Wrong! Correct: ${currentQuestion.choices[currentQuestion.answer]}`);
      if (lives - 1 <= 0) endGame();
    }
  };

  const outOfTime = () => {
    if (answered || !currentQuestion) return;
    setAnswered(true);
    setLives((l) => l - 1);
    setFeedback(`⏰ Time's up! Correct: ${currentQuestion.choices[currentQuestion.answer]}`);
    if (lives - 1 <= 0) endGame();
  };

  const endGame = () => {
    if (timerId) clearInterval(timerId);
    setGame(false);
    setEnd(true);
  };

  const saveScore = () => {
    const key = `quiz-hs-${subject}`;
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    const name = playerName || "Player";

    // Check if player already exists
    const existingIndex = data.findIndex(item => item.name === name);

    if (existingIndex !== -1) {
      // Replace existing score if new one is higher
      if (score > data[existingIndex].score) {
        data[existingIndex] = { name, score, date: new Date().toISOString() };
      }
    } else {
      // Add new score
      data.push({ name, score, date: new Date().toISOString() });
    }

    data.sort((a, b) => b.score - a.score);
    const trimmed = data.slice(0, 20);
    localStorage.setItem(key, JSON.stringify(trimmed));
    setHighScores(trimmed);
  };

  const usePower = (type) => {
    if (answered || !currentQuestion) return;
    const c = { ...powerUps };
    if (c[type] <= 0) return;
    const qIdx = index;
    const q = pool[qIdx];
    switch (type) {
      case "fifty": {
        const wrong = [];
        q.choices.forEach((_, i) => { if (i !== q.answer) wrong.push(i); });
        shuffle(wrong);
        const toHide = wrong.slice(0, 2);
        const newPool = pool.slice();
        const newMasked = new Set(q._masked);
        toHide.forEach(i => newMasked.add(i));
        newPool[qIdx] = { ...q, _masked: newMasked };
        setPool(newPool);
        c.fifty -= 1;
        setPowerStatus("Two wrong options removed.");
        break;
      }
      case "skip": {
        c.skip -= 1;
        setScore((s) => s + 50);
        setAnswered(true);
        if (timerId) clearInterval(timerId);
        setFeedback("⏭ Skipped (+50) — treated as correct.");
        setPowerStatus("Question skipped as correct.");
        break;
      }
      case "double": {
        c.double -= 1;
        setDoubleActive(true);
        setPowerStatus("Double points active on this question.");
        break;
      }
      case "freeze": {
        c.freeze -= 1;
        setTime((t) => t + 10);
        setPowerStatus("Time extended by 10 seconds.");
        break;
      }
      case "hint": {
        c.hint -= 1;
        setHint(`Hint: ${q.hint || "No hint available."}`);
        setPowerStatus("Hint shown (no penalty).");
        break;
      }
    }
    setPowerUps(c);
  };

  const isChoiceHidden = (q, i) => q && q._masked && q._masked.has(i);

  return (
    <>
      <div className="background-effects"></div>

      <img src={book} className="corner-book top-right" alt="book" />
      <img src={book} className="corner-book bottom-left" alt="book" />
      <div className="quiz-page container">
        <h1>UniQuiz</h1>

        {menu && (
          <div className="quiz-menu">
            <h2>New Game</h2>
            <label>Subject:</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)}>
              {Object.keys(SUBJECTS).map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <button className="btn" onClick={startGame}>Start</button>

            <h3>High Scores</h3>
            <div className="scores">
              {highScores.length
                ? highScores.map((r, i) => <div key={i}>{`${i + 1}. ${r.name} — ${r.score}`}</div>)
                : "No scores yet."}
            </div>
          </div>
        )}

        {loading && (
          <div className="loading-screen">
            <h2>Generating questions with Gemini...</h2>
            <div className="spinner"></div>
          </div>
        )}

        {game && currentQuestion && (
          <div className="quiz-game">
            <h2>{subject.toUpperCase()}</h2>
            <p>
              Q: {index + 1}/{pool.length} | Score: {score} | ❤️ {lives} | ⏱ {time}s
            </p>

            <div className="question-box">
              <h3>{currentQuestion.q}</h3>
              <div className="choices">
                <div className="choice-buttons">
                  {currentQuestion.choices.map((c, i) => (
                    <div className="choice">
                      <button
                        key={i}
                        onClick={() => answer(i)}
                        disabled={answered || isChoiceHidden(currentQuestion, i)}
                        aria-hidden={isChoiceHidden(currentQuestion, i)}
                        style={ answered ? {"backgroundColor": (c === currentQuestion.choices[currentQuestion.answer] ? "green" : "red" )} : {}}
                      >
                        {isChoiceHidden(currentQuestion, i) ? "—" : c}
                      </button>

                      {i < currentQuestion.choices.length - 1 ? <div className="vr"></div> : <></>}
                    </div>
                  ))}
                </div>
              </div>
              <p className="hint">{hint}</p>
            </div>

            <div className="power-ups">
              <h3>Power-Ups</h3>
              <div className="power-buttons">
                <div className="powers" style={answered ? {backgroundColor: "#dd5858"} : {}}>
                  <button disabled={answered} onClick={() => usePower("fifty")}>50-50 ({powerUps.fifty})</button>
                  <div className="vr"></div>
                  <button disabled={answered} onClick={() => usePower("skip")}>Skip ({powerUps.skip})</button>
                  <div className="vr"></div>
                  <button disabled={answered} onClick={() => usePower("double")}>Double ({powerUps.double})</button>
                  <div className="vr"></div>
                  <button disabled={answered} onClick={() => usePower("freeze")}>Freeze (+10s) ({powerUps.freeze})</button>
                  <div className="vr"></div>
                  <button disabled={answered} onClick={() => usePower("hint")}>Hint ({powerUps.hint})</button>
                </div>
              </div>
              <p>{powerStatus}</p>
            </div>

            <p className="feedback">{feedback}</p>
            <button
              className="next-btn btn"
              disabled={!answered}
              onClick={() => {
                if (index < pool.length - 1) {
                  const nextIdx = index + 1;
                  setIndex(nextIdx);
                  setDoubleActive(false);
                  nextQuestion(pool, nextIdx, baseTime);
                } else endGame();
              }}
            >
              Next
            </button>
          </div>
        )}

        {end && (
          <div className="quiz-end">
            <h2>Game Over</h2>
            <p>Subject: {subject.toUpperCase()} | Score: {score}</p>
            <input
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              className="input-text"
            />
            <button
              onClick={() => {
                window.location.href = "/";
                saveScore();
              }}

              className="btn"
            >
              Save High Score
            </button>
            <button
              onClick={() => {
                window.location.href = "/";
              }}

              className="btn"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </>
  );
}
