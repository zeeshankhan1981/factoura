#!/bin/bash

# factoura Start Script
# This script starts all the necessary services for the factoura application

echo "Starting factoura services..."

# Directory paths
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$BASE_DIR/backend"
FRONTEND_DIR="$BASE_DIR/frontend"
PYTHON_DIR="$BASE_DIR/python_services/content_analysis"

# Define standard ports
FRONTEND_PORT=3000
BACKEND_PORT=5001
PYTHON_PORT=5002

# First, ensure everything is stopped cleanly
echo "Ensuring no previous services are running..."
"$BASE_DIR/stop.sh" > /dev/null 2>&1

# Check if PostgreSQL is running
echo "Checking PostgreSQL status..."
pg_isready 2>/dev/null
if [ $? -ne 0 ]; then
  echo "Starting PostgreSQL..."
  # Try to start PostgreSQL (this may require password)
  brew services start postgresql@15 2>/dev/null || pg_ctl -D /usr/local/var/postgres start
else
  echo "PostgreSQL is already running"
fi

# Start Ollama server for local LLM inference
if command -v ollama >/dev/null 2>&1; then
  echo "Starting Ollama server..."
  # Check if Ollama is already running
  if pgrep -f "ollama serve" >/dev/null; then
    echo "Ollama server is already running"
    OLLAMA_PID=$(pgrep -f "ollama serve")
  else
    ollama serve > "$BASE_DIR/ollama.log" 2>&1 &
    OLLAMA_PID=$!
    echo "Ollama server started with PID: $OLLAMA_PID"
    # Give Ollama a moment to initialize
    sleep 2
  fi
  echo $OLLAMA_PID > "$BASE_DIR/.ollama.pid"
else
  echo "Ollama is not installed. Please install it for AI integration: https://github.com/ollama/ollama"
fi

# Start backend server in background
echo "Starting backend server on port $BACKEND_PORT..."
cd "$BACKEND_DIR" && PORT=$BACKEND_PORT npm run dev > "$BASE_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"
echo $BACKEND_PID > "$BASE_DIR/.backend.pid"
sleep 2

# Check if frontend port is available, kill any process using it if needed
echo "Checking frontend port $FRONTEND_PORT availability..."
PORT_PID=$(lsof -t -i:$FRONTEND_PORT 2>/dev/null)
if [ ! -z "$PORT_PID" ]; then
  # Only kill Node.js processes, not Firefox
  PROCESS_NAME=$(ps -p $PORT_PID -o comm= 2>/dev/null)
  if [[ "$PROCESS_NAME" == *"node"* ]]; then
    echo "Node.js process on port $FRONTEND_PORT with PID $PORT_PID, attempting to kill..."
    kill -15 $PORT_PID 2>/dev/null
    sleep 1
    if lsof -i :$FRONTEND_PORT > /dev/null 2>&1; then
      echo "Process still running, force killing..."
      kill -9 $PORT_PID 2>/dev/null
      sleep 1
    fi
  else
    echo "Warning: Port $FRONTEND_PORT is in use by $PROCESS_NAME (PID: $PORT_PID), which is not a Node.js process. Will not kill."
    echo "Frontend may fail to start or use a different port."
  fi
fi

# Double-check if the port is now available
if lsof -i :$FRONTEND_PORT > /dev/null 2>&1; then
  echo "Warning: Port $FRONTEND_PORT is still in use, frontend may fail to start"
else
  echo "Port $FRONTEND_PORT is now available"
fi

# Start frontend server in background with specified port
echo "Starting frontend server on port $FRONTEND_PORT..."
cd "$FRONTEND_DIR" && PORT=$FRONTEND_PORT npm start > "$BASE_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID on port $FRONTEND_PORT"
echo $FRONTEND_PID > "$BASE_DIR/.frontend.pid"
echo $FRONTEND_PORT > "$BASE_DIR/.frontend.port"

# Start Python content analysis service if available
if [ -d "$PYTHON_DIR" ]; then
  echo "Starting Python content analysis service on port $PYTHON_PORT..."
  cd "$PYTHON_DIR" && python -m uvicorn app:app --host 0.0.0.0 --port $PYTHON_PORT > "$BASE_DIR/python.log" 2>&1 &
  PYTHON_PID=$!
  echo "Python service started with PID: $PYTHON_PID"
  echo $PYTHON_PID > "$BASE_DIR/.python.pid"
else
  echo "Python content analysis directory not found, skipping..."
fi

echo "All factoura services started successfully!"
echo "Logs are available in the following files:"
echo "- Backend: $BASE_DIR/backend.log (http://localhost:$BACKEND_PORT)"
echo "- Frontend: $BASE_DIR/frontend.log (http://localhost:$FRONTEND_PORT)"
echo "- Python service: $BASE_DIR/python.log (http://localhost:$PYTHON_PORT)"
if command -v ollama >/dev/null 2>&1; then
  echo "- Ollama server: $BASE_DIR/ollama.log"
fi
echo ""
echo "To stop all services, run ./stop.sh"
