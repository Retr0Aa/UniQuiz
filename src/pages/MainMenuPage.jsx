import { useState, useEffect } from "react";
import book from '../assets/book.png';

export default function MainMenuPage() {
  const [subject, setSubject] = useState("math");
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    const key = `quiz-hs-${subject}`;
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    setHighScores(data);
  }, [subject]);

  return (
    <>
      <div className="background-effects"></div>

      <img src={book} className="corner-book top-right" alt="book" />
      <img src={book} className="corner-book bottom-left" alt="book" />

      <div className="container">
        <h1>UniQuiz</h1>
        <p>Subjects, timed questions, and power‑ups.</p>

        <div className="main-menu">
          <a href="/quiz" className="menu-btn" role="button">Start</a>
        </div>

        <div className="high-scores">
          <h2>High Scores</h2>
          <label>Subject:</label>
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            {["math", "biology", "geography", "history", "computers"].map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>

          <div className="scores">
            {highScores.length
              ? highScores.map((r, i) => (
                  <div key={i}>{`${i + 1}. ${r.name} — ${r.score}`}</div>
                ))
              : "No scores yet."}
          </div>
        </div>
      </div>
    </>
  );
}
