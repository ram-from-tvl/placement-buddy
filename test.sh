#!/bin/bash

# Kai Placement Copilot - Test Script
# This script runs comprehensive API tests

echo "🧪 Running API Tests..."
echo ""

# Activate virtual environment
source venv/bin/activate

# Check if backend is running
if ! curl -s http://localhost:5000/health > /dev/null 2>&1; then
    echo "❌ Backend is not running. Please start it first with ./start.sh"
    exit 1
fi

echo "✅ Backend is running"
echo ""

# Run API tests
cd server
node test-api.js

echo ""
echo "✅ Tests completed!"
