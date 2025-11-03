import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.scss'
import MainMenuPage from './pages/MainMenuPage'
import QuizPage from './pages/QuizPage'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainMenuPage />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
