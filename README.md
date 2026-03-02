# MindMate

**AI-powered mental health risk detection from text using NLP.**

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)

---

## Description

MindMate is a full-stack web application that analyzes user-written text (e.g. journal entries, notes) and estimates potential mental health risk levels using sentiment analysis and keyword detection. It is intended for **early awareness only** and does not replace professional evaluation or treatment.

| | |
|---|---|
| **Project type** | Full-stack web app / AI tool |
| **Target users** | Individuals, educators, support organizations (informational use) |
| **Repository** | [github.com/adityadeore1001/MindMate](https://github.com/adityadeore1001/MindMate) |
| **Deployment** | _Add your deployment link here_ |

> **Disclaimer:** This tool is for informational purposes only and is not a substitute for professional mental health care. In a crisis, contact a mental health professional or emergency services.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Folder Structure](#folder-structure)
- [How It Works](#how-it-works)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Features

- **Text analysis** — Submit free-form text for analysis (journal entries, notes, etc.).
- **Risk levels** — Outputs Low / Moderate / High based on sentiment and keywords.
- **Sentiment scoring** — VADER-based compound score from -1 (negative) to +1 (positive).
- **Keyword detection** — Flags a configurable set of concerning terms.
- **Emoji handling** — Counts and considers emoji usage.
- **PDF reports** — Download a summary report of the analysis.
- **Dashboard** — History, charts, and word cloud (data in browser only).
- **Dark / light theme** — UI theme toggle.
- **Responsive UI** — Usable on desktop and mobile.
- **Privacy-first** — No server-side storage of analysis text; history in `localStorage` only.

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, Vite 5, React Router, Axios, Chart.js, React WordCloud, React Icons |
| **Backend** | Python 3.10+, FastAPI, Uvicorn, Pydantic |
| **NLP / ML** | VADER Sentiment, TextBlob, NLTK, emoji |
| **Other** | reportlab (PDF), python-dotenv, Docker & Docker Compose, Nginx (frontend in production) |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Browser (React SPA)                                              │
│  • Home: text input + analyze                                     │
│  • Dashboard: history, charts, word cloud                         │
│  • Theme toggle, localStorage for history                         │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTP (REST)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  Backend (FastAPI, port 8000)                                    │
│  • POST /analyze     → run NLP pipeline, return risk + metadata  │
│  • POST /generate-report → same pipeline + PDF response          │
│  • GET  /health       → liveness check                            │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  ML / NLP pipeline (ml_engine.py)                                 │
│  • VADER sentiment → compound score                              │
│  • Keyword match against negative word list                      │
│  • Emoji count                                                    │
│  • Rule-based risk: High / Moderate / Low + explanation          │
└─────────────────────────────────────────────────────────────────┘
```

**Data flow:** User types text in the frontend → request sent to backend → `ml_engine` computes sentiment, keywords, emoji count → risk level and explanation determined by rules → response returned to frontend → optional PDF generated on `/generate-report`.

---

## Installation

**Prerequisites:** Python 3.10+, Node.js 18+, Git.

### 1. Clone the repository

```bash
git clone https://github.com/adityadeore1001/MindMate.git
cd MindMate
```

### 2. Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m textblob.download_corpora
cp .env.example .env       # then edit .env if needed
cd ..
```

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env       # set VITE_API_URL to your backend URL
cd ..
```

### 4. Run locally

**Terminal 1 — Backend**

```bash
cd backend && source venv/bin/activate && python main.py
```

API: `http://localhost:8000`

**Terminal 2 — Frontend**

```bash
cd frontend && npm run dev
```

App: `http://localhost:5173`

### 5. Run with Docker (optional)

```bash
docker-compose up --build
```

- Frontend: `http://localhost` (port 80)  
- Backend: `http://localhost:8000`

---

## Environment Variables

**Backend** (`backend/.env`):

```env
PORT=8000
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

**Frontend** (`frontend/.env`):

```env
VITE_API_URL=http://localhost:8000
```

Use your deployed backend URL in production for `VITE_API_URL`.

---

## API Endpoints

Base URL: `http://localhost:8000` (or your deployed backend).

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check. Returns `status`, `service`, `version`. |
| `POST` | `/analyze` | Analyze text. Body: `{ "text": "..." }`. Returns risk level, sentiment score, keywords, emoji count, recommendation, explanation. |
| `POST` | `/generate-report` | Same input as `/analyze`. Returns PDF attachment. |

**Example request**

```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "I have been feeling very low and tired lately."}'
```

**Example response (structure)**

```json
{
  "risk_level": "Moderate",
  "sentiment_score": -0.3412,
  "detected_keywords": ["tired"],
  "emoji_count": 0,
  "recommendation": "It may be helpful to talk to someone...",
  "explanation": "The text shows negative sentiment and contains 1 concerning keyword(s)."
}
```

Interactive docs: `http://localhost:8000/docs` (Swagger), `http://localhost:8000/redoc` (ReDoc).

---

## Folder Structure

```
MindMate/
├── backend/                    # FastAPI service
│   ├── main.py                 # App entry, routes, CORS
│   ├── ml_engine.py            # Sentiment, keywords, risk rules
│   ├── report_generator.py     # PDF generation
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── components/         # AnalysisResult, RiskGauge, ThemeToggle, etc.
│   │   ├── pages/              # HomePage, DashboardPage
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile
│   ├── nginx.conf              # Production serving
│   └── .env.example
│
├── docker-compose.yml          # Backend + frontend
├── setup.sh / setup.bat        # One-time setup scripts
├── .gitignore
└── README.md
```

---

## How It Works

1. **Input**  
   User submits text in the UI. Frontend sends a POST to `/analyze` with `{ "text": "..." }`.

2. **Sentiment**  
   Backend runs VADER on the text and uses the **compound** score (range -1 to +1). More negative score contributes to higher risk.

3. **Keywords**  
   Text is checked against a fixed list of negative/clinical terms (e.g. sad, anxious, hopeless). Each match is counted and returned; higher count pushes risk up.

4. **Emoji**  
   Emoji are counted (e.g. for context); the count is included in the response. Risk rules can be extended to use it.

5. **Risk rules (current logic)**  
   - **High:** compound &lt; -0.5 **or** keyword count &gt; 2  
   - **Moderate:** compound &lt; 0 **or** keyword count &gt; 0  
   - **Low:** otherwise  

   An explanation string is built from sentiment and keyword counts.

6. **Recommendation**  
   A fixed message per risk level (Low / Moderate / High) is attached to the response.

7. **PDF report**  
   `/generate-report` runs the same pipeline and uses `report_generator` to produce a PDF with the same analysis summary.

8. **Frontend**  
   Results are shown in the UI; history is stored in the browser only (`localStorage`).

---

## Screenshots

_Add screenshots of the home page, analysis result, and dashboard here._

| Home / Input | Analysis result | Dashboard |
|--------------|-----------------|-----------|
| _Screenshot_ | _Screenshot_    | _Screenshot_ |

---

## Roadmap

- [ ] Optional ML model (e.g. fine-tuned classifier) alongside or instead of rule-based risk.
- [ ] Multi-language support for sentiment and keywords.
- [ ] Optional user accounts and server-side history (with consent and security).
- [ ] Stronger explainability (e.g. which phrases contributed to score).
- [ ] Integration with crisis/hepline resources (links or numbers).
- [ ] Audit of keyword list and rules with domain experts.

---

## Contributing

1. Fork the repo and create a branch from `main`.
2. Make changes; keep commits focused and messages clear.
3. Run backend (e.g. `pytest` if tests exist) and frontend (e.g. `npm run build`) to ensure nothing is broken.
4. Open a Pull Request with a short description of the change and reference any issue.
5. Maintain the existing code style and add comments for non-obvious logic.

---

## License

This project is provided as-is for educational and non-clinical use. Use in production or in any clinical context is at your own risk. Ensure compliance with local regulations before deployment.

---

## Author

**MindMate**  
Repository: [github.com/adityadeore1001/MindMate](https://github.com/adityadeore1001/MindMate)

---

*MindMate is an awareness tool only and does not replace professional mental health care.*
