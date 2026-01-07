#!/bin/bash

echo "Starting Library Management System..."
echo

echo "Checking if port 5000 is in use..."
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo "WARNING: Port 5000 is already in use by another application"
    echo "Library Management System will use port 3001 instead"
    echo
fi

echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install backend dependencies"
    exit 1
fi

echo
echo "Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install frontend dependencies"
    exit 1
fi

echo
echo "Starting backend server on port 3001..."
cd ../backend
npm run dev &
BACKEND_PID=$!

echo
echo "Waiting for backend to start..."
sleep 3

echo "Starting frontend server on port 3000..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo
echo "Library Management System is running..."
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:3000"
echo
echo "Press Ctrl+C to stop all servers"

# Wait for user to stop
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait