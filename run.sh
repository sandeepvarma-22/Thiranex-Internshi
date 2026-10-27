#!/bin/bash

# Student Record Management System - Startup Script
echo "======================================================"
echo " Starting Student Record Management System "
echo "======================================================"

# Check Java
if ! command -v java &> /dev/null; then
    echo "Error: Java is not installed or not in PATH."
    exit 1
fi

# Check Node / npm
if ! command -v npm &> /dev/null; then
    echo "Error: Node/npm is not installed or not in PATH."
    exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "1. Starting Spring Boot Backend (Port 8080)..."
cd "$ROOT_DIR/backend" || exit
./mvnw spring-boot:run &
BACKEND_PID=$!
echo "Backend running (PID: $BACKEND_PID)"

echo "2. Waiting for backend to be ready..."
until curl -s http://localhost:8080/api/students/stats > /dev/null; do
    sleep 1
done
echo "Backend is ready on http://localhost:8080/api/students"

echo "3. Starting React Frontend (Port 5173)..."
cd "$ROOT_DIR/frontend" || exit
npm run dev -- --host 127.0.0.1 --port 5173 &
FRONTEND_PID=$!
echo "Frontend running (PID: $FRONTEND_PID)"

sleep 2
echo "======================================================"
echo " Project is Live!"
echo " 👉 Frontend: http://localhost:5173"
echo " 👉 Backend API: http://localhost:8080/api/students"
echo " 👉 H2 Console: http://localhost:8080/h2-console"
echo "======================================================"

# Automatically open browser on Mac
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:5173
fi

# Trap to kill both when user presses Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
