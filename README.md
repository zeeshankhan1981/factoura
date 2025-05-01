# factoura.

**Digital Journalism on the Blockchain**

> **Note on Branding:** The name of this application is always spelled with a lowercase "f" as "factoura." and never capitalized as "Factoura", even at the beginning of sentences.

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
- [Implementation Checklist](#implementation-checklist)

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
- Cryptocurrency Wallet (MetaMask recommended)

### Authentication & Wallet Requirements
factoura. uses a two-tier authentication system:

1. **Basic Authentication (Username/Password)**
   - Required for accessing the platform
   - Allows read-only features and basic interactions
   - Managed through JWT tokens

2. **Blockchain Authentication (MetaMask)**
   - Required for article submission and verification
   - Necessary for all blockchain interactions
   - Connected through the dashboard interface
   - Displays wallet address and MATIC balance

#### Setting Up Your Wallet
1. Install MetaMask browser extension from the Chrome Web Store or Firefox Add-ons
2. Create a new wallet or import an existing one
3. Switch to the Polygon PoS network in MetaMask settings
4. Add some MATIC tokens to your wallet (you can get test MATIC from the Polygon faucet if you're testing)

#### Wallet Connection UI
The wallet connection interface is located in the dashboard sidebar under the BLOCKCHAIN section. It provides:
- A prominent "Connect MetaMask" button when not connected
- Visual indicators of connection status
- Wallet address display (truncated for privacy)
- Current MATIC balance
- Network status indicator
- Disconnect option

#### Versioning System
Factoura uses GitHub tag-based versioning:
- The current version is displayed at the bottom of the dashboard sidebar
- Version numbers follow semantic versioning (e.g., v1.0.4)
- Version is automatically updated via the `backend/scripts/update-version.sh` script when new tags are created

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

## Implementation Checklist

### AI & LLM Integration (Priority 1)
- [ ] **Ollama Setup & Configuration**
  - [ ] Configure existing models:
    - [ ] phi3:3.8b - General purpose and content analysis
    - [ ] gemma3:1b - Fast response and basic tasks
  - [ ] Implement model management
  - [ ] Add model switching capability
  - [ ] Set up model monitoring
  - [ ] Configure model-specific prompts

- [ ] **AI Service Implementation**
  - [ ] Create AI service endpoints:
    - [ ] `/ai/generate` - Content generation (phi3)
    - [ ] `/ai/analyze` - Content analysis (phi3)
    - [ ] `/ai/fact-check` - Fact verification (phi3)
    - [ ] `/ai/summarize` - Content summarization (gemma3)
    - [ ] `/ai/quick-check` - Fast fact verification (gemma3)
  - [ ] Implement prompt engineering for each model
  - [ ] Add response caching
  - [ ] Create error handling
  - [ ] Add rate limiting
  - [ ] Implement model fallback system

- [ ] **AI Features**
  - [ ] Article rewriting and enhancement (phi3)
  - [ ] Fact-checking automation (phi3)
  - [ ] Content summarization (gemma3)
  - [ ] Bias detection (phi3)
  - [ ] Source verification (phi3)
  - [ ] Quick fact verification (gemma3)
  - [ ] Content recommendations (phi3)
  - [ ] Real-time content analysis (gemma3)

### Core Infrastructure (Priority 2)
- [x] **Authentication System**
  - [x] Basic Authentication
    - [x] Username/password login system
    - [x] User registration and profile management
    - [x] Session management
    - [x] Password reset functionality
    - [x] Email verification
  - [ ] Blockchain Authentication
    - [x] Wallet connection check
    - [x] Network verification (Polygon PoS)
    - [x] MATIC balance check
    - [x] Transaction signing
    - [x] Error handling for blockchain operations
    - [x] Connection status UI
    - [x] Network switcher
    - [x] Balance display
    - [x] Transaction history

### Core Infrastructure (Priority 2)
- [x] **Service Integration**
  - [x] Complete Python service integration with backend
    - [x] Set up FastAPI service endpoints
    - [x] Implement proper error handling
    - [x] Add service health monitoring
    - [x] Set up proper logging system
    - [x] Implement service recovery mechanisms
  - [ ] Integrate Ollama AI service
    - [ ] Set up model endpoints
    - [ ] Implement error handling
    - [ ] Add response caching
    - [ ] Create service monitoring
  - [ ] Implement service communication
    - [ ] Add message queues for async operations
    - [ ] Set up service discovery
    - [ ] Implement retry mechanisms
    - [ ] Add circuit breakers

- [x] **Database & Schema**
  - [x] Complete Prisma schema implementation
    - [x] Define article schema
    - [x] Create user management schema
    - [x] Add content analysis schema
    - [x] Implement AI interaction schema
  - [x] Add database migrations
    - [x] Create initial migration
    - [x] Add data seeding
    - [x] Implement rollback procedures
  - [x] Implement data validation
    - [x] Add input validation
    - [x] Create data sanitization
    - [x] Implement type checking
  - [x] Add database backup system
    - [x] Set up automated backups
    - [x] Implement restore procedures
    - [x] Add backup monitoring
  - [x] Set up database monitoring
    - [x] Add performance tracking
    - [x] Implement query optimization
    - [x] Create alert system

### Frontend Development (Priority 3)
- [ ] **UI Components**
  - [ ] Complete Tailwind CSS migration
  - [ ] Implement responsive design
  - [ ] Add dark mode support
  - [ ] Create reusable component library
  - [ ] Add loading states and error handling

- [ ] **User Interface**
  - [ ] Implement user dashboard
  - [ ] Add article management interface
  - [ ] Create content analysis visualization
  - [ ] Add user profile pages
  - [ ] Implement notification system

- [ ] **State Management**
  - [ ] Implement proper state management
  - [ ] Add caching for API responses
  - [ ] Create offline support
  - [ ] Add error boundary handling
  - [ ] Implement proper loading states

### Backend Development (Priority 4)
- [ ] **API Enhancement**
  - [ ] Complete REST API implementation
  - [ ] Add API versioning
  - [ ] Implement rate limiting
  - [ ] Add request validation
  - [ ] Create API documentation

- [ ] **Security**
  - [ ] Implement JWT authentication
  - [ ] Add role-based access control
  - [ ] Set up CSRF protection
  - [ ] Add input sanitization
  - [ ] Implement audit logging

- [ ] **Performance**
  - [ ] Add response caching
  - [ ] Implement request batching
  - [ ] Add database query optimization
  - [ ] Set up performance monitoring
  - [ ] Implement load balancing

### Content Analysis (Priority 5)
- [ ] **Python Service**
  - [ ] Complete sentiment analysis implementation
  - [ ] Add tag generation service
  - [ ] Implement content quality assessment
  - [ ] Add bias detection
  - [ ] Create content summarization

- [ ] **Integration**
  - [ ] Connect analysis service to frontend
  - [ ] Add real-time analysis updates
  - [ ] Implement analysis caching
  - [ ] Add analysis history
  - [ ] Create analysis visualization

### Testing Framework (Priority 6)
- [ ] **Testing Infrastructure**
  - [ ] Set up testing environment
    - [ ] Configure Jest for frontend
    - [ ] Set up Mocha/Chai for backend
    - [ ] Add pytest for Python services
  - [ ] Implement test suites
    - [ ] Create unit tests
    - [ ] Add integration tests
    - [ ] Set up end-to-end tests
  - [ ] Add test automation
    - [ ] Set up CI/CD pipeline
    - [ ] Add test coverage reporting
    - [ ] Implement automated testing
  - [ ] Create test documentation
    - [ ] Document test cases
    - [ ] Add test coverage reports
    - [ ] Create testing guidelines

### Documentation (Priority 7)
- [ ] **Technical Documentation**
  - [ ] Create API documentation
  - [ ] Add architecture diagrams
  - [ ] Document deployment process
  - [ ] Create troubleshooting guide
  - [ ] Add development setup guide

- [ ] **User Documentation**
  - [ ] Create user manual
  - [ ] Add feature guides
  - [ ] Create video tutorials
  - [ ] Add FAQ section
  - [ ] Create troubleshooting guide

### Deployment & Monitoring (Priority 8)
- [ ] **Infrastructure**
  - [ ] Set up production environment
  - [ ] Implement auto-scaling
  - [ ] Add load balancing
  - [ ] Create backup strategy
  - [ ] Set up monitoring

- [ ] **DevOps**
  - [ ] Create deployment pipeline
  - [ ] Add automated testing
  - [ ] Implement blue-green deployment
  - [ ] Add rollback mechanism
  - [ ] Create monitoring dashboard

### Future Enhancements
- [ ] **Advanced AI Features**
  - [ ] Multi-model ensemble for fact-checking
  - [ ] Real-time content analysis
  - [ ] Personalized content recommendations
  - [ ] Automated content moderation
  - [ ] Advanced sentiment analysis
  - [ ] Cross-language support

- [ ] **Community Features**
  - [ ] Add user reputation system
  - [ ] Implement community moderation
  - [ ] Create discussion forums
  - [ ] Add content rating system

- [ ] **Analytics**
  - [ ] Add user behavior tracking
  - [ ] Implement content analytics
  - [ ] Create engagement metrics
  - [ ] Add performance analytics
