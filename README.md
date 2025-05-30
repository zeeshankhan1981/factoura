# factoura.

**Digital Journalism on the Blockchain**

> **Note on Branding:** The name of this application is always spelled with a lowercase "f" as "factoura." and never capitalized as "Factoura", even at the beginning of sentences.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fzeeshankhan1981%2Ffactoura)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

factoura. is a modern platform that combines collaborative journalism with blockchain verification to create a transparent and trustworthy news ecosystem. Built with a modern tech stack and designed for both local development and cloud deployment.

## 🚀 Quick Start

### Local Development
```bash
# Clone the repository
git clone https://github.com/zeeshankhan1981/factoura.git
cd factoura

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Start development servers
cd ..
npm run dev
```

### Vercel Deployment
1. Click the "Deploy with Vercel" button above
2. Set up your environment variables (see Configuration section)
3. Deploy!

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

## ✨ Features

### Core Functionality
- **User Authentication**: Secure signup and login with JWT authentication
- **Article Management**: Full CRUD operations for articles with rich text editing
- **Blockchain Verification**: Content hashing and verification on Polygon PoS
- **Real-time Updates**: WebSocket integration for live content updates
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Advanced Features
- **AI Content Analysis**: Sentiment analysis and content scoring
- **Automated Tagging**: AI-powered tag suggestions
- **Version History**: Track changes to articles over time
- **Role-based Access**: Different permission levels for users, editors, and admins
- **API-First Design**: Fully documented RESTful API

### Blockchain Integration
- **Immutable Records**: Article hashes stored on Polygon PoS
- **Smart Contracts**: Custom contracts for content verification
- **Wallet Integration**: MetaMask support for blockchain interactions
- **Gasless Transactions**: Layer 2 solutions for cost-effective operations

## 🛠 Technology Stack

### Frontend (React 18+)
- **Framework**: React 18 with Hooks
- **State Management**: Context API + useReducer
- **Styling**: Tailwind CSS with custom theming
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **Form Handling**: React Hook Form
- **UI Components**: Headless UI + custom components
- **Data Visualization**: Recharts

### Backend (Node.js + Express)
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcrypt
- **API Documentation**: OpenAPI/Swagger
- **Validation**: Joi
- **Logging**: Winston + Morgan
- **Testing**: Jest + Supertest

### Blockchain (Polygon PoS)
- **Network**: Polygon Mainnet & Mumbai Testnet
- **Smart Contracts**: Solidity (0.8.x)
- **Web3 Library**: ethers.js
- **Wallet Integration**: Web3Modal

### AI Services (Python)
- **Framework**: FastAPI
- **NLP**: spaCy + NLTK
- **Sentiment Analysis**: TextBlob + custom models
- **Deployment**: Docker + Kubernetes

### DevOps
- **CI/CD**: GitHub Actions
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack

## 📁 Project Structure

```
factoura/
├── backend/                  # Node.js + Express backend
│   ├── prisma/               # Database schema and migrations
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Express middleware
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   └── utils/            # Helper functions
│   └── package.json
│
├── frontend/                # React frontend
│   ├── public/              # Static assets
│   └── src/
│       ├── assets/         # Images, fonts, etc.
│       ├── components/      # Reusable UI components
│       ├── contexts/        # React contexts
│       ├── hooks/           # Custom React hooks
│       ├── pages/           # Page components
│       ├── services/        # API services
│       └── styles/          # Global styles
│
├── contracts/              # Smart contracts
│   ├── artifacts/           # Compiled contracts
│   ├── migrations/          # Migration scripts
│   └── test/               # Contract tests
│
├── python_services/        # AI/ML services
│   └── content_analysis/    # NLP and content analysis
│
├── .github/                # GitHub workflows
├── .env.example            # Environment variables template
├── docker-compose.yml      # Local development
└── package.json           # Root scripts

```

## 🛠 Installation

### Prerequisites
- Node.js 18+ (LTS recommended)
- PostgreSQL 14+
- Python 3.9+
- Git
- Yarn or npm
- Docker (optional, for containerized development)
- MetaMask (for blockchain features)

### Environment Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/zeeshankhan1981/factoura.git
   cd factoura
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your configuration (database, API keys, etc.)

### Database Setup
1. Start PostgreSQL:
   ```bash
   # Using Homebrew (macOS)
   brew services start postgresql
   
   # Or using Docker
   docker run --name factoura-db -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres:14
   ```

2. Create the database:
   ```bash
   createdb factoura_db
   ```

3. Run migrations:
   ```bash
   cd backend
   npx prisma migrate dev
   ```

### Development
1. Install dependencies:
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend && npm install
   
   # Install frontend dependencies
   cd ../frontend && npm install
   ```

2. Start the development servers:
   ```bash
   # From project root
   npm run dev
   ```
   This will start:
   - Backend: http://localhost:5001
   - Frontend: http://localhost:3000
   - Python services: http://localhost:5002

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Start production server
cd ../backend
npm start
```

## ⚙️ Configuration

### Environment Variables

#### Backend (`.env` in `backend/`)
```env
# App
NODE_ENV=development
PORT=5001

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/factoura_db"

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

# Blockchain
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
PRIVATE_KEY=your_wallet_private_key
CONTRACT_ADDRESS=your_contract_address

# Content Analysis
CONTENT_ANALYSIS_URL=http://localhost:5002
```

#### Frontend (`.env` in `frontend/`)
```env
REACT_APP_API_URL=http://localhost:5001
REACT_APP_ENV=development
REACT_APP_GOOGLE_ANALYTICS_ID=your_ga_id
```

### Blockchain Configuration

1. **Network Setup**
   - Mainnet: Polygon PoS
   - Testnet: Amoy (recommended for development)

2. **Required Tokens**
   - Mainnet: MATIC tokens for gas fees
   - Testnet: Get test MATIC from the [Polygon Faucet](https://faucet.polygon.technology/)

3. **Smart Contracts**
   - Deploy your contracts using Hardhat or Truffle
   - Update contract addresses in the `.env` file

## 🚀 Usage

### Local Development

#### Start Services
```bash
# Start all services with Docker Compose
docker-compose up -d

# Or start services individually
npm run dev:backend
npm run dev:frontend
npm run dev:python
```

#### Available Scripts

**Root**
```bash
# Install all dependencies
npm run install:all

# Start all services in development mode
npm run dev

# Run tests
npm test

# Run linting
npm run lint
```

**Backend**
```bash
# Run database migrations
npm run db:migrate

# Generate Prisma client
npm run prisma:generate

# Start development server with hot-reload
npm run dev
```

**Frontend**
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Vercel Deployment

1. **Frontend**
   - Connect your GitHub repository to Vercel
   - Set up environment variables
   - Deploy!

2. **Backend**
   - Deploy as a serverless function
   - Configure environment variables in Vercel
   - Set up a database connection

### Authentication

1. **User Registration**
   - Sign up with email/password
   - Verify your email address
   - Complete your profile

2. **Wallet Connection**
   - Click "Connect Wallet" in the header
   - Select your preferred wallet (MetaMask recommended)
   - Approve the connection

3. **API Authentication**
   - Include JWT token in `Authorization: Bearer <token>` header
   - For protected routes, ensure valid token is provided

### Common Tasks

#### Create an Article
1. Click "New Article" in the dashboard
2. Enter article details and content
3. Add tags and images
4. Submit for verification

#### Verify Content
1. Navigate to the verification queue
2. Review submitted articles
3. Approve or reject with feedback

#### View Analytics
1. Go to the dashboard
2. Check engagement metrics
3. View content performance

## 🔄 Versioning

Factoura uses [Semantic Versioning](https://semver.org/). The current version can be found in `package.json`.

To update the version:
```bash
# Update version in package.json
npm version [major|minor|patch]

# Push tags
git push --tags
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
 ## 📚 API Documentation

### Interactive API Docs
Access the interactive API documentation at:
- Swagger UI: `http://localhost:5001/api-docs`
- ReDoc: `http://localhost:5001/api-docs/redoc`

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

#### Articles
- `GET /api/articles` - List all articles (paginated)
- `POST /api/articles` - Create new article
- `GET /api/articles/:id` - Get article by ID
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article
- `GET /api/articles/user/:userId` - Get user's articles

#### Blockchain
- `POST /api/blockchain/verify` - Verify content on blockchain
- `GET /api/blockchain/status/:contentId` - Check verification status
- `GET /api/blockchain/history/:wallet` - Get wallet transaction history

#### Analysis
- `POST /api/analyze/text` - Analyze text content
- `GET /api/analyze/article/:id` - Get article analysis
- `POST /api/analyze/batch` - Batch analyze multiple articles

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add some amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Keep PRs focused and small

### Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ❤️ Support

### Community Support
- [GitHub Discussions](https://github.com/zeeshankhan1981/factoura/discussions) - Ask questions and share ideas
- [GitHub Issues](https://github.com/zeeshankhan1981/factoura/issues) - Report bugs and request features

### Professional Support
For enterprise support or custom development, please contact [support@factoura.xyz](mailto:support@factoura.xyz)

## 🙏 Acknowledgments

- Built with ❤️ by the Factoura team
- Special thanks to our contributors and beta testers
- Powered by [Polygon](https://polygon.technology/), [React](https://reactjs.org/), and [Node.js](https://nodejs.org/)

## 🌟 Stargazers

[![Stargazers](https://git-lister.onrender.com/api/stars/zeeshankhan1981/factoura?theme=flat)](https://github.com/zeeshankhan1981/factoura/stargazers)

---

<div align="center">
  <p>Made with ❤️ for decentralized journalism</p>
  <p>© 2025 Factoura. All rights reserved.</p>
</div>

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
