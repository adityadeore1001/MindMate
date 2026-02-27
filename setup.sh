#!/bin/bash

echo "🚀 Setting up MindMate..."

# Backend setup
echo "📦 Setting up backend..."
cd backend
python -m venv venv
source venv/bin/activate 2>/dev/null || venv\Scripts\activate 2>/dev/null
pip install -r requirements.txt
python -m textblob.download_corpora
cd ..

# Frontend setup
echo "📦 Setting up frontend..."
cd frontend
npm install
cd ..

echo "✅ Setup complete!"
echo ""
echo "To start the backend:"
echo "  cd backend && python main.py"
echo ""
echo "To start the frontend:"
echo "  cd frontend && npm run dev"
echo ""
echo "Or use Docker:"
echo "  docker-compose up --build"
