#!/bin/bash

# factoura Stop Script
# This script stops all services started by the start.sh script

echo "Stopping factoura services..."

# Directory paths
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to forcefully kill a process and all its children
kill_process_tree() {
  local PID=$1
  local PROCESS_NAME=$2
  
  if ps -p $PID > /dev/null 2>&1; then
    echo "Stopping $PROCESS_NAME (PID: $PID)..."
    
    # First try graceful shutdown
    kill -15 $PID 2>/dev/null
    
    # Give it a moment to shut down
    sleep 1
    
    # If still running, force kill
    if ps -p $PID > /dev/null 2>&1; then
      echo "$PROCESS_NAME still running, force killing..."
      kill -9 $PID 2>/dev/null
    fi
    
    # Kill any child processes
    pkill -P $PID 2>/dev/null
    sleep 0.5
    pkill -9 -P $PID 2>/dev/null
  else
    echo "$PROCESS_NAME is not running"
  fi
}

# Stop backend server
if [ -f "$BASE_DIR/.backend.pid" ]; then
  BACKEND_PID=$(cat "$BASE_DIR/.backend.pid")
  kill_process_tree $BACKEND_PID "Backend server"
  rm "$BASE_DIR/.backend.pid"
fi

# Stop frontend server
if [ -f "$BASE_DIR/.frontend.pid" ]; then
  FRONTEND_PID=$(cat "$BASE_DIR/.frontend.pid")
  kill_process_tree $FRONTEND_PID "Frontend server"
  rm "$BASE_DIR/.frontend.pid"
fi
# Also remove the frontend port file
if [ -f "$BASE_DIR/.frontend.port" ]; then
  rm "$BASE_DIR/.frontend.port"
fi

# Stop Python content analysis service
if [ -f "$BASE_DIR/.python.pid" ]; then
  PYTHON_PID=$(cat "$BASE_DIR/.python.pid")
  kill_process_tree $PYTHON_PID "Python content analysis service"
  rm "$BASE_DIR/.python.pid"
fi

# Stop Ollama server
if [ -f "$BASE_DIR/.ollama.pid" ]; then
  OLLAMA_PID=$(cat "$BASE_DIR/.ollama.pid")
  kill_process_tree $OLLAMA_PID "Ollama server"
  rm "$BASE_DIR/.ollama.pid"
fi

echo "Performing additional cleanup for any remaining processes..."

# Kill by process name patterns
echo "Cleaning up any remaining Node.js processes related to factoura..."
pkill -f "node.*backend/node_modules/.bin/nodemon" 2>/dev/null
pkill -f "node.*frontend/node_modules/.bin/react-scripts" 2>/dev/null
pkill -f "npm run dev" 2>/dev/null
pkill -f "npm start" 2>/dev/null

# Force kill after a brief pause if they're still running
sleep 1
pkill -9 -f "node.*backend/node_modules/.bin/nodemon" 2>/dev/null
pkill -9 -f "node.*frontend/node_modules/.bin/react-scripts" 2>/dev/null
pkill -9 -f "npm run dev" 2>/dev/null
pkill -9 -f "npm start" 2>/dev/null

# Kill Node.js processes on the typical ports, being careful not to kill browser processes
echo "Killing any Node.js processes using factoura ports..."
for PORT in 3000 3001 3002 3003 5001 5002; do
  # Get PIDs but filter to only include node processes more strictly
  PORT_PIDS=$(lsof -t -i:$PORT 2>/dev/null)
  if [ ! -z "$PORT_PIDS" ]; then
    for PID in $PORT_PIDS; do
      # Check if it's a Node.js process before attempting to kill
      PROCESS_NAME=$(ps -p $PID -o comm= 2>/dev/null)
      if [[ "$PROCESS_NAME" == *"node"* ]]; then
        echo "Found Node.js process on port $PORT (PID: $PID), stopping it..."
        kill -15 $PID 2>/dev/null
        sleep 1
        # Double-check it's still a Node process before force killing
        if ps -p $PID -o comm= 2>/dev/null | grep -q "node"; then
          kill -9 $PID 2>/dev/null
        fi
      else
        echo "Process on port $PORT (PID: $PID) is $PROCESS_NAME, not Node.js. Will not kill."
      fi
    done
  fi
done

echo "Killing any Python processes related to factoura..."
pkill -f "python.*uvicorn app:app" 2>/dev/null
sleep 1
pkill -9 -f "python.*uvicorn app:app" 2>/dev/null

echo "Killing any Ollama processes..."
pkill -f "ollama serve" 2>/dev/null
sleep 1
pkill -9 -f "ollama serve" 2>/dev/null

echo "All factoura services have been stopped"
echo "If you want to stop PostgreSQL as well, run: brew services stop postgresql@15"
