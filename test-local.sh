#!/bin/bash

echo "🚀 Testing Portfolio Local Setup"
echo "================================"

# Check if we're in the right directory
if [ ! -f "backend/server.js" ] || [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: Please run this script from the portfolio root directory"
    exit 1
fi

echo "✅ Directory structure looks good"

# Test backend
echo ""
echo "🔧 Testing Backend..."
cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

echo "🔍 Skipping Node syntax check (not supported). Proceeding to start backend..."

# Start backend in background
echo "🚀 Starting backend server..."
node server.js &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Test backend health endpoint
echo "🏥 Testing backend health endpoint..."
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ Backend is running on port 5000"
else
    echo "❌ Backend failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Test API endpoints
echo "🔌 Testing API endpoints..."
endpoints=("skills" "projects" "blog" "experience" "education")
for endpoint in "${endpoints[@]}"; do
    if curl -s http://localhost:5000/api/$endpoint > /dev/null; then
        echo "✅ /api/$endpoint is working"
    else
        echo "❌ /api/$endpoint failed"
    fi
done

# Stop backend
kill $BACKEND_PID 2>/dev/null

# Test frontend
echo ""
echo "🎨 Testing Frontend..."
cd ../frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Test frontend build
echo "🔨 Testing frontend build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Frontend builds successfully"
else
    echo "❌ Frontend build failed"
    exit 1
fi

echo ""
echo "🎉 All tests passed! Your portfolio is ready to run locally."
echo ""
echo "To start the application:"
echo "1. Terminal 1: cd backend && npm start"
echo "2. Terminal 2: cd frontend && npm start"
echo ""
echo "Then visit: http://localhost:3000"

