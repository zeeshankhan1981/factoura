# factoura.

**Digital Journalism on the Blockchain**

factoura. is a modern platform that combines collaborative journalism with blockchain verification to create a transparent and trustworthy news ecosystem.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Overview

factoura. enables journalists, fact-checkers, and readers to collaborate on verifying news stories. All verified content is secured on the Polygon PoS blockchain, creating permanent, tamper-proof records of journalistic work.

## Features

- **User Authentication**: Secure signup and login with JWT authentication
- **Article Management**: Create, read, update, and delete articles
- **Dashboard**: User-friendly interface to manage articles and see verification status
- **Blockchain Integration**: Verified stories are secured on Polygon PoS
- **Responsive Design**: Modern UI with powder blue color scheme that works on all devices
- **Content Analysis**: AI-powered sentiment analysis and tag suggestions using Python
- **User Profiles**: View and manage your profile and published stories
- **Sentiment Analysis**: Analyze the emotional tone and objectivity of articles
- **Intelligent Tagging**: Generate relevant tags for articles based on content
- **Article Quality Assessment**: Evaluate content quality and readability

## Technology Stack

### Frontend
- React.js
- React Router for navigation
- Axios for API requests
- CSS with custom variables for theming

### Backend
- Node.js
- Express.js
- PostgreSQL database
- Prisma ORM
- JWT for authentication

### Blockchain
- Polygon PoS for storing verified article hashes

### AI & Analysis
- Python 3.9+
- FastAPI for microservices
- NLTK and SpaCy for natural language processing
- TextBlob for sentiment analysis

## Project Structure

```
factoura_app/
├── backend/                # Backend Node.js application
│   ├── prisma/             # Prisma schema and migrations
│   ├── src/
│   │   ├── routes/         # API route definitions
│   │   │   ├── analysisRoutes.js  # Routes for content analysis
│   │   │   └── ...         # Other route files
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── services/       # Business logic
│   │   │   ├── contentAnalysisService.js  # Service for Python integration
│   │   │   └── ...         # Other service files
│   │   ├── utils/          # Utility functions
│   │   └── app.js          # Express application setup (also serves frontend build)
│   └── package.json        # Backend dependencies
├── frontend/               # React frontend application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ArticleAnalysis.js  # Component for content analysis
│   │   │   └── ...         # Other component files
│   │   ├── pages/          # Page components
│   │   ├── styles/         # Global styles and variables
│   │   ├── utils/          # Utility functions
│   │   ├── App.js          # Main application component
│   │   └── index.js        # Application entry point
│   └── package.json        # Frontend dependencies
│   └── build/              # Production build (served by backend)
├── python_services/        # Python microservices for content analysis
│   ├── content_analysis/   # Content analysis service
│   │   ├── app.py          # FastAPI application setup
│   │   ├── Dockerfile      # Docker configuration
│   │   └── requirements.txt # Python dependencies
├── docker-compose.yml      # Docker Compose configuration
├── start-services.sh       # Script to start all services
└── README.md               # Project documentation
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- Git
- Python 3.9+ (for content analysis)

### Clone the Repository
```bash
git clone https://github.com/zeeshankhan1981/factoura_app.git
cd factoura_app
```

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup
```bash
cd frontend
npm install
```

### Python Services Setup
```bash
cd python_services/content_analysis
pip install -r requirements.txt

# Download required NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"

# Download SpaCy model
python -m spacy download en_core_web_sm
```

Alternatively, if you're using a virtual environment (recommended):
```bash
# Create a Python virtual environment
# Note: On the Thinkpad T16 laptop, this environment is named 'factoura_py_venv'
# You can use any name that makes sense for your environment
python -m venv factoura_py_venv

# Activate the virtual environment
source factoura_py_venv/bin/activate  # On Linux/macOS
# or
factoura_py_venv\Scripts\activate  # On Windows

# Install dependencies
cd python_services/content_analysis
pip install -r requirements.txt

# Download required NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('wordnet')"

# Download SpaCy model
python -m spacy download en_core_web_sm
```

## Configuration

### Backend Configuration
Create a `.env` file in the backend directory with the following variables:

```
DATABASE_URL="postgresql://username:password@192.168.86.45:5432/factoura"
JWT_SECRET="your-jwt-secret"
PORT=5001
CONTENT_ANALYSIS_SERVICE_URL="http://localhost:5002"
```

The backend server is configured to serve the frontend build files from the `frontend/build` directory. Make sure to run `npm run build` in the frontend directory before starting the backend server, or use the `start-services.sh` script which handles this automatically.

### Frontend Configuration
The frontend is configured to connect to the backend at `http://localhost:5001`. 

For development, you can run the frontend separately using `npm start` in the frontend directory, which will start a development server at `http://localhost:3000`.

For production, the frontend should be built using `npm run build` and the resulting build files will be served by the backend server from the `frontend/build` directory.

### Python Services Configuration
Create a `.env` file in the python_services/content_analysis directory with the following variables:

```
API_KEY="your-api-key"
API_SECRET="your-api-secret"
```

## Usage

### Service Management Scripts

factoura. comes with several scripts to manage the services:

- **start-services.sh**: Starts all factoura. services (Python Content Analysis and Backend)
  ```bash
  ./start-services.sh
  ```
  This script:
  - Builds the frontend for production
  - Starts the Python Content Analysis service on port 5002
  - Starts the backend service on port 5001 (which serves the frontend)
  - Saves the process IDs to `.factoura_pids` file for easy stopping

- **stop-services.sh**: Stops all factoura. services
  ```bash
  ./stop-services.sh
  ```
  This script:
  - Kills processes using saved PIDs from `.factoura_pids` file
  - Falls back to pattern matching to find and kill any remaining services

- **restart-services.sh**: Restarts all factoura. services
  ```bash
  ./restart-services.sh
  ```
  This script:
  - Stops all services using stop-services.sh
  - Waits for processes to fully shut down
  - Starts all services using start-services.sh

### Accessing the Application

Once the services are running:
- The main application is accessible at http://localhost:5001
- The Python Content Analysis service API is accessible at http://localhost:5002

## API Documentation

### Authentication Endpoints

- `POST /api/users/register` - Register a new user
  - Request body: `{ name, email, password }`
  - Response: `{ token }`

- `POST /api/users/login` - Login an existing user
  - Request body: `{ email, password }`
  - Response: `{ token }`

### Article Endpoints

- `GET /api/articles` - Get all articles
  - Response: `[{ id, title, content, ... }]`

- `GET /api/articles/:id` - Get a specific article
  - Response: `{ id, title, content, ... }`

- `POST /api/articles` - Create a new article
  - Request body: `{ title, content, ... }`
  - Response: `{ id, title, content, ... }`

- `PUT /api/articles/:id` - Update an article
  - Request body: `{ title, content, ... }`
  - Response: `{ id, title, content, ... }`

- `DELETE /api/articles/:id` - Delete an article
  - Response: `{ message: "Article deleted" }`

### Content Analysis Endpoints

- `POST /api/analysis/sentiment` - Analyze the sentiment of a piece of text
  - Request body: `{ text, title }`
  - Response: 
    ```json
    {
      "overall_sentiment": {
        "compound_score": 0.4588,
        "positive": 0.182,
        "negative": 0.0,
        "neutral": 0.818
      },
      "emotional_tone": "Positive",
      "emotional_intensity": 45.88,
      "objectivity_score": 62.5
    }
    ```

- `POST /api/analysis/tags` - Generate tags for a piece of text
  - Request body: `{ text, title, existing_tags, max_tags }`
  - Response:
    ```json
    {
      "suggested_tags": [
        {"tag": "digital", "type": "keyword", "relevance": 0.6},
        {"tag": "journalism", "type": "keyword", "relevance": 0.6}
      ],
      "categorized_tags": {
        "entities": [...],
        "keywords": [...]
      }
    }
    ```

## Recent Updates

### March 2025 Update
- Added Python-based content analysis service for advanced text processing
- Implemented sentiment analysis for articles to determine emotional tone
- Added intelligent tag generation based on article content
- Created ArticleAnalysis component in the frontend for visualizing analysis results
- Updated article detail page to include sentiment analysis and tag suggestions
- Added start-services.sh script for easier development workflow
- Updated Docker configuration to include Python services
- Added health check endpoints to both Python service and Node.js backend
- Improved service integration with automatic readiness checks
- Enhanced start-services.sh script with process management and database connectivity checks

### Health Check Endpoints

- `GET /api/analysis/health` - Check the health of the content analysis service
  - Response: 
    ```json
    {
      "status": "available",
      "pythonService": {
        "status": "healthy",
        "service": "factoura. Content Analysis Service",
        "version": "1.0.0",
        "dependencies": {
          "nltk": "available",
          "spacy": "available",
          "textblob": "available"
        }
      },
      "serviceUrl": "http://localhost:5002"
    }
    ```

- `GET /health` (Python service) - Check the health of the Python service directly
  - Response:
    ```json
    {
      "status": "healthy",
      "service": "factoura. Content Analysis Service",
      "version": "1.0.0",
      "dependencies": {
        "nltk": "available",
        "spacy": "available",
        "textblob": "available"
      }
    }
    ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Copyright (c) 2025 factoura.

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
