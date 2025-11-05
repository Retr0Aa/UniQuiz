import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import book from "../assets/book.png";

export default function MainMenuPage() {
  const [subject, setSubject] = useState("math");
  const [count, setCount] = useState(10);
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
        <p>Subjects, timed questions, and power-ups.</p>

        <div className="main-menu">
          <label>Subject:</label>
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            {["math", "biology", "geography", "history", "computers"].map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>

          <label style={{ marginLeft: 12 }}>Questions:</label>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Math.min(50, Math.max(1, Number(e.target.value || 10))))}
            style={{ width: 80 }}
          />

          <div style={{ marginTop: 16 }}>
            <Link
              to={`/quiz?subject=${encodeURIComponent(subject)}&count=${count}`}
              className="menu-btn"
              role="button"
            >
              Start
            </Link>
          </div>
        </div>

        <div className="high-scores">
          <h2>High Scores</h2>
          <div className="scores">
            {highScores.length
              ? highScores.map((r, i) => <div key={i}>{`${i + 1}. ${r.name} — ${r.score}`}</div>)
              : "No scores yet."}
          </div>
        </div>
      </div>
    </>
  );
}
