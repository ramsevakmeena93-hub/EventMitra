#!/bin/bash

echo "========================================"
echo "College CMS - Quick Start"
echo "========================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "ERROR: .env file not found!"
    echo "Please copy .env.example to .env and configure it."
    echo ""
    exit 1
fi

echo ".env file found!"
echo ""

# Check if MongoDB is running
if command -v mongod &> /dev/null; then
    echo "MongoDB found. Checking if running..."
    if pgrep -x "mongod" > /dev/null; then
        echo "MongoDB is already running"
    else
        echo "Starting MongoDB..."
        # Try to start MongoDB based on OS
        if [[ "$OSTYPE" == "darwin"* ]]; then
            brew services start mongodb-community
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            sudo systemctl start mongod
        fi
    fi
else
    echo "MongoDB not found. Please install MongoDB or use MongoDB Atlas."
fi
echo ""

# Install backend dependencies
echo "Installing backend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies"
    exit 1
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    exit 1
fi
cd ..

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "To seed the database, run: node server/seed.js"
echo "To start the application, run: npm run dev"
echo ""
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:5173"
echo ""
