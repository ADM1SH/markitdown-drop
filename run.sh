#!/bin/bash

# MarkItDown Drop Launcher Script for macOS

echo "--------------------------------------------------------"
echo "🚀 Launching MarkItDown Drop for macOS"
echo "--------------------------------------------------------"

# Directory of script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: python3 could not be found. Please install Python 3.10+."
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "📦 Creating virtual environment (.venv)..."
    python3 -m venv .venv
fi

# Activate virtual environment
source .venv/bin/activate

# Upgrade pip and install dependencies
echo "📥 Checking & installing dependencies..."
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt

# Launch browser after 1.5 seconds in background
(sleep 1.5 && open "http://127.0.0.1:5050") &

# Start Flask Application
echo "✅ Server started at http://127.0.0.1:5050"
echo "Press Ctrl+C to stop."
python app.py
