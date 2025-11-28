#!/bin/bash

# Full path to python if it's not in PATH
PYTHON="/usr/bin/python3"

echo "Starting Python HTTP server on port 8080..."

# Start the server
$PYTHON -m http.server 8080 &

# Capture the process ID if you want to manage/stop it later
SERVER_PID=$!

# Open browser (works on most Linux distros)
xdg-open "http://localhost:8080" >/dev/null 2>&1 &

# Optional: wait so the script doesn't exit immediately
wait $SERVER_PID