#!/bin/bash

echo "🚀 Starting Portfolio Application Locally"
echo "========================================="

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Stopping all processes..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check if we're in the right directory
if [ ! -f "backend/server.js" ] || [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: Please run this script from the portfolio root directory"
    exit 1
fi

echo "✅ Directory structure verified"

# Start backend
echo ""
echo "🔧 Starting Backend Server..."
cd backend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Start backend in background
echo "🚀 Starting backend on port 5000..."
npm start &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Test backend
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ Backend is running on http://localhost:5000"
else
    echo "❌ Backend failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Start frontend
echo ""
echo "🎨 Starting Frontend Server..."
cd ../frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend in background
echo "🚀 Starting frontend on port 3000..."
npm start &
FRONTEND_PID=$!

# Wait for frontend to start
echo "⏳ Waiting for frontend to start..."
sleep 10

# Test frontend
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is running on http://localhost:3000"
else
    echo "⚠️  Frontend may still be starting up..."
fi

echo ""
echo "🎉 Portfolio Application Started Successfully!"
echo "=============================================="
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:5000"
echo "🏥 Health Check: http://localhost:5000/health"
echo ""
echo "📋 Available API Endpoints:"
echo "   • /api/skills - Skills data"
echo "   • /api/projects - Projects data"
echo "   • /api/blog - Blog posts"
echo "   • /api/experience - Work experience"
echo "   • /api/education - Training & certifications"
echo "   • /api/contact - Contact form"
echo ""
echo "🛑 Press Ctrl+C to stop all servers"
echo ""

# Keep script running
wait

