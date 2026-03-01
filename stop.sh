#!/bin/bash

# Kai Placement Copilot - Stop Script
# This script stops both backend and frontend servers

echo "🛑 Stopping Kai Placement Copilot..."

# Kill processes by PID files
if [ -f .backend.pid ]; then
    BACKEND_PID=$(cat .backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID
        echo "✅ Backend server stopped (PID: $BACKEND_PID)"
    fi
    rm -f .backend.pid
fi

if [ -f .frontend.pid ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID
        echo "✅ Frontend server stopped (PID: $FRONTEND_PID)"
    fi
    rm -f .frontend.pid
fi

# Kill any remaining processes on ports
if lsof -ti:5000 >/dev/null 2>&1; then
    lsof -ti:5000 | xargs kill -9 2>/dev/null
    echo "✅ Cleaned up port 5000"
fi

if lsof -ti:5173 >/dev/null 2>&1; then
    lsof -ti:5173 | xargs kill -9 2>/dev/null
    echo "✅ Cleaned up port 5173"
fi

echo "✅ All servers stopped"
