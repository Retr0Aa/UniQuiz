# UniQuiz

UniQuiz is a small quiz game built with React and Vite. Players choose a subject, answer timed multiple-choice questions, use power-ups strategically, and save high scores locally in the browser.

## Features

- 5 quiz categories: Math, Biology, Geography, History, and Computers
- Timed gameplay with score, lives, and per-question feedback
- Power-ups including 50/50, Skip, Double Points, Freeze Time, and Hint
- Local high score tracking with separate leaderboards for each subject
- Simple menu flow with a dedicated quiz page and end-game screen

## Tech Stack

- React 19
- React Router DOM
- Vite
- SCSS
- ESLint

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm

### Installation

```bash
npm install
```

### Run the App

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal, usually `http://localhost:5173`.

## Available Scripts

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Builds the app for production.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run lint
```

Runs ESLint across the project.

## How It Works

- The main menu lets the player start a game and view saved high scores by subject.
- The quiz page loads a shuffled set of questions for the selected category.
- Each correct answer awards points based on remaining time.
- Wrong answers or timeouts reduce lives.
- High scores are stored in `localStorage`, so they persist in the same browser on the same device.

## Project Structure

```text
src/
  assets/
  pages/
    MainMenuPage.jsx
    QuizPage.jsx
  App.jsx
  App.scss
  main.jsx
```

## Notes

- The active application code lives in `src/`.
- Browser storage is used for score persistence, so clearing site data will remove saved high scores.
