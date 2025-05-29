#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Setting up factoura. local development environment...${NC}"

# Create necessary directories if they don't exist
mkdir -p frontend/build
mkdir -p backend/dist

# Setup Python virtual environment
echo -e "${GREEN}Setting up Python environment...${NC}"
cd python_services/content_analysis
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"
python -m spacy download en_core_web_sm
deactivate
cd ../..

# Install frontend dependencies
echo -e "${GREEN}Installing frontend dependencies...${NC}"
cd frontend
npm install
cd ..

# Install backend dependencies
echo -e "${GREEN}Installing backend dependencies...${NC}"
cd backend
npm install
cd ..

# Create environment files
echo -e "${GREEN}Creating environment files...${NC}"

# Frontend .env.development
cat > frontend/.env.development << EOL
REACT_APP_API_URL=http://localhost:5001
REACT_APP_CONTENT_ANALYSIS_URL=http://localhost:5002
REACT_APP_POLYGON_RPC_URL=https://polygon-rpc.com
REACT_APP_CHAIN_ID=137
EOL

# Backend .env.development
cat > backend/.env.development << EOL
PORT=5001
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/factoura"
JWT_SECRET="dev-secret-key-change-in-production"
CONTENT_ANALYSIS_SERVICE_URL="http://localhost:5002"
EOL

# Start PostgreSQL using Docker
echo -e "${GREEN}Starting PostgreSQL database...${NC}"
docker run --name factoura-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=factoura \
  -p 5432:5432 \
  -d postgres:latest

# Wait for PostgreSQL to be ready
echo -e "${GREEN}Waiting for PostgreSQL to be ready...${NC}"
sleep 5

# Initialize database
echo -e "${GREEN}Initializing database...${NC}"
cd backend
npm run prisma:generate
npm run prisma:migrate
cd ..

echo -e "${BLUE}Local development environment setup complete!${NC}"
echo -e "${GREEN}To start the services:${NC}"
echo "1. Start Python service: cd python_services/content_analysis && source venv/bin/activate && uvicorn app:app --reload --port 5002"
echo "2. Start Backend: cd backend && npm run dev"
echo "3. Start Frontend: cd frontend && npm start" 