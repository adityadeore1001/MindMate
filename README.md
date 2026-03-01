# MindMate – AI-Powered Mental Health Risk Detection System

<div align="center">

![MindMate Logo](https://img.shields.io/badge/MindMate-AI%20Mental%20Health-blue?style=for-the-badge)

**An intelligent web application that analyzes user-written text and predicts potential mental health risk levels using NLP-based sentiment analysis.**

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)

</div>

---

## ⚠️ Important Disclaimer

**MindMate is an early risk awareness tool and does NOT replace professional medical advice.**

This application is designed for informational purposes only and should not be used as a substitute for professional mental health evaluation, diagnosis, or treatment. If you are experiencing a mental health crisis, please contact a mental health professional or emergency services immediately.

---

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Docker Setup](#docker-setup)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Ethical Considerations](#ethical-considerations)
- [Future Improvements](#future-improvements)

---

## ✨ Features

### Core Functionality
- **Text Analysis**: Analyze user-written text (journal entries, social media posts, etc.)
- **Risk Assessment**: Predict mental health risk levels (Low / Moderate / High)
- **Sentiment Analysis**: Advanced NLP-based sentiment scoring using VADER
- **Keyword Detection**: Identify concerning keywords related to mental health
- **Emoji Analysis**: Count and analyze emoji usage patterns

### User Interface
- **Modern Glassmorphism Design**: Beautiful, modern UI with glassmorphic effects
- **Dark/Light Mode**: Toggle between dark and light themes
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Interactive Dashboard**: Visual analytics with charts and graphs
- **Word Cloud Visualization**: Visual representation of frequently detected keywords
- **Analysis History**: Save and review previous analyses (local storage)

### Additional Features
- **PDF Report Generation**: Download comprehensive analysis reports
- **Risk Gauge Visualization**: Visual representation of risk level distribution
- **Sentiment Trend Chart**: Track sentiment scores over time
- **Privacy-First**: All data stored locally in the browser
- **Ethical Disclaimers**: Clear warnings and recommendations

---

## 🏗️ Architecture

MindMate follows a clean, modular architecture:

```
┌─────────────────┐
│   React Frontend │
│   (Port 5173)   │
└────────┬────────┘
         │ HTTP REST API
         │
┌────────▼────────┐
│  FastAPI Backend │
│   (Port 8000)   │
└────────┬────────┘
         │
┌────────▼────────┐
│   ML Engine     │
│  - VADER        │
│  - TextBlob     │
│  - Rule Engine  │
└─────────────────┘
```

### Component Breakdown

1. **Frontend (React + Vite)**
   - Single Page Application with React Router
   - Chart.js for data visualization
   - React WordCloud for keyword visualization
   - Local storage for analysis history

2. **Backend (FastAPI)**
   - RESTful API endpoints
   - NLP processing engine
   - PDF report generation
   - CORS-enabled for cross-origin requests

3. **ML Engine**
   - VADER Sentiment Analyzer for sentiment scoring
   - Rule-based risk assessment algorithm
   - Keyword detection system
   - Emoji analysis

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **Uvicorn** - ASGI server for FastAPI
- **vaderSentiment** - Sentiment analysis library
- **TextBlob** - NLP library for text processing
- **reportlab** - PDF generation
- **python-dotenv** - Environment variable management

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **React WordCloud** - Word cloud visualization
- **React Icons** - Icon library

### Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web server for frontend (production)

---

## 📦 Installation

### Prerequisites

- **Python 3.10+** - Backend runtime
- **Node.js 18+** - Frontend runtime
- **Docker & Docker Compose** (optional, for containerized deployment)
- **Git** - Version control

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Download NLTK data (required for TextBlob):
```bash
python -m textblob.download_corpora
```

6. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

---

## 🚀 Running Locally

### Development Mode

#### Backend

1. Start the FastAPI server:
```bash
cd backend
python main.py
```

The API will be available at `http://localhost:8000`

2. Access API documentation:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

#### Frontend

1. Start the Vite dev server:
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Production Build

#### Backend

```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

#### Frontend

```bash
cd frontend
npm run build
npm run preview
```

---

## 🐳 Docker Setup

### Using Docker Compose (Recommended)

1. Build and start all services:
```bash
docker-compose up --build
```

2. Access the application:
- Frontend: `http://localhost`
- Backend API: `http://localhost:8000`

3. Stop services:
```bash
docker-compose down
```

### Individual Docker Containers

#### Backend

```bash
cd backend
docker build -t mindmate-backend .
docker run -p 8000:8000 mindmate-backend
```

#### Frontend

```bash
cd frontend
docker build -t mindmate-frontend .
docker run -p 80:80 mindmate-frontend
```

---

## 🌐 Deployment

### Backend Deployment (Render/Railway)

#### Render

1. Create a new Web Service
2. Connect your GitHub repository
3. Set build command: `pip install -r requirements.txt && python -m textblob.download_corpora`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `PORT` (auto-set by Render)
   - `CORS_ORIGINS` (your frontend URL)

#### Railway

1. Create a new project
2. Connect your GitHub repository
3. Select the backend directory
4. Railway will auto-detect Python and install dependencies
5. Add environment variables in the dashboard

### Frontend Deployment (Vercel)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Navigate to frontend directory:
```bash
cd frontend
```

3. Deploy:
```bash
vercel
```

4. Set environment variable:
   - `VITE_API_URL` - Your backend API URL

### Environment Variables

#### Backend (.env)
```env
PORT=8000
CORS_ORIGINS=http://localhost:5173,https://your-frontend-domain.com
```

#### Frontend (.env)
```env
VITE_API_URL=https://your-backend-api.com
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints

#### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "MindMate API",
  "version": "1.0.0"
}
```

#### 2. Analyze Text
```http
POST /analyze
Content-Type: application/json

{
  "text": "Your text here..."
}
```

**Response:**
```json
{
  "risk_level": "Moderate",
  "sentiment_score": -0.3412,
  "detected_keywords": ["sad", "tired"],
  "emoji_count": 2,
  "recommendation": "It may be helpful to talk to someone...",
  "explanation": "The text shows negative sentiment..."
}
```

#### 3. Generate PDF Report
```http
POST /generate-report
Content-Type: application/json

{
  "text": "Your text here..."
}
```

**Response:** PDF file (binary)

---

## 📁 Project Structure

```
MindMate/
│
├── backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── ml_engine.py            # NLP and risk detection logic
│   ├── report_generator.py     # PDF report generation
│   ├── requirements.txt        # Python dependencies
│   ├── Dockerfile              # Backend Docker configuration
│   └── .env.example            # Environment variables template
│
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── AnalysisResult.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── RiskGauge.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── HomePage.jsx
│   │   │   └── DashboardPage.jsx
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # React entry point
│   │   └── index.css           # Global styles
│   ├── package.json            # Node dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── Dockerfile              # Frontend Docker configuration
│   └── nginx.conf              # Nginx configuration
│
├── docker-compose.yml          # Docker Compose configuration
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

---

## 🧠 Risk Scoring Logic

The risk assessment algorithm uses a combination of factors:

### Sentiment Score (VADER)
- Range: -1.0 (very negative) to +1.0 (very positive)
- Uses VADER (Valence Aware Dictionary and sEntiment Reasoner)

### Keyword Detection
Negative keywords that may indicate mental health concerns:
- sad, depressed, alone, hopeless, tired, anxious, worthless, empty, crying, etc.

### Risk Level Rules

1. **High Risk**
   - Sentiment score < -0.5 OR
   - Keyword count > 2

2. **Moderate Risk**
   - Sentiment score < 0 OR
   - Keyword count > 0

3. **Low Risk**
   - All other cases

### Explanation Generation
Each analysis includes a detailed explanation of why a specific risk level was assigned, making the system transparent and explainable.

---

## 🤝 Ethical Considerations

### Privacy
- All analysis data is stored locally in the browser (localStorage)
- No data is sent to external servers except your own backend
- Users can clear their history at any time

### Limitations
- This tool is NOT a diagnostic tool
- Results are based on text analysis only
- Cannot detect all mental health conditions
- Should not replace professional evaluation

### Recommendations
- Always include clear disclaimers
- Provide resources for professional help
- Encourage users to seek professional support when needed
- Regularly update keyword lists and algorithms

---

## 🔮 Future Improvements

### Technical Enhancements
- [ ] Machine learning model training on labeled datasets
- [ ] Multi-language support
- [ ] Real-time analysis with WebSockets
- [ ] User authentication and cloud storage
- [ ] Advanced NLP models (BERT, GPT-based)
- [ ] Integration with mental health APIs
- [ ] Mobile app (React Native)

### Feature Additions
- [ ] Therapist matching system
- [ ] Crisis helpline integration
- [ ] Journaling features with mood tracking
- [ ] Community support features
- [ ] Anonymous sharing options
- [ ] Export to various formats (CSV, JSON)
- [ ] Advanced analytics and insights

### Research & Development
- [ ] Clinical validation studies
- [ ] Bias detection and mitigation
- [ ] Explainable AI improvements
- [ ] Privacy-preserving ML techniques

---

## 📝 License

This project is provided as-is for educational and research purposes. Please ensure compliance with healthcare regulations in your jurisdiction before deploying in production.

---

## 🙏 Acknowledgments

- VADER Sentiment Analysis by C.J. Hutto and Eric Gilbert
- FastAPI by Sebastián Ramírez
- React team and community
- All open-source contributors

---

## 📞 Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

**Remember: MindMate is a tool to raise awareness, not a replacement for professional mental health care.**

<div align="center">

Made with ❤️ for mental health awareness

</div>
