@echo off
echo Starting Library Management System...
echo.

echo Checking if port 5000 is in use...
netstat -ano | findstr :5000
if %errorlevel% == 0 (
    echo WARNING: Port 5000 is already in use by another application
    echo Library Management System will use port 3001 instead
    echo.
)

echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd ../frontend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Starting backend server on port 3001...
cd ../backend
start "Library Backend" cmd /k "npm run dev"

echo.
echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting frontend server on port 3000...
cd ../frontend
start "Library Frontend" cmd /k "npm run dev"

echo.
echo Library Management System is starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul