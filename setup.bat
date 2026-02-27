@echo off
echo 🚀 Setting up MindMate...

REM Backend setup
echo 📦 Setting up backend...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
python -m textblob.download_corpora
cd ..

REM Frontend setup
echo 📦 Setting up frontend...
cd frontend
call npm install
cd ..

echo ✅ Setup complete!
echo.
echo To start the backend:
echo   cd backend ^&^& python main.py
echo.
echo To start the frontend:
echo   cd frontend ^&^& npm run dev
echo.
echo Or use Docker:
echo   docker-compose up --build

pause
