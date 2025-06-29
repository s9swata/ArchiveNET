# ArchiveNET API

A semantic memory API service powered by vector embeddings and blockchain storage. ArchiveNET provides enterprise-grade memory management with AI-powered search capabilities, enabling applications to store, search, and retrieve contextual information using advanced vector similarity search.

## Architecture

The API is built with a modern, scalable architecture:

- **Framework**: Express.js with TypeScript
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Vector Database**: EizenDB for semantic search
- **Blockchain**: Arweave for permanent storage
- **Cache**: Redis for performance optimization
- **Email**: Nodemailer for transactional emails
- **Validation**: Zod schemas for request validation
- **Security**: Helmet.js, CORS, JWT authentication

## Project Structure

```
API/
├── src/
│   ├── server.ts              # Main application entry point
│   ├── config/
│   │   ├── arlocal.ts         # ArLocal blockchain setup
│   │   ├── arweave.ts         # Arweave configuration
│   │   └── redis.ts           # Redis configuration
│   ├── database/
│   │   ├── db.ts             # Database connection
│   │   ├── migrations/        # Database migrations
│   │   ├── models/           # Database models
│   │   └── schemas/          # Database schemas
│   ├── middlewares/
│   │   ├── contract.ts
│   │   ├── errorHandler.ts
│   │   └── validate.ts
│   ├── routes/
│   │   ├── admin.ts          # Admin operations
│   │   ├── deployment.ts     # Contract deployment
│   │   ├── health.ts         # Health checks
│   │   ├── instances.ts      # Instance management
│   │   ├── memories.ts       # Memory operations
│   │   ├── subscriptions.ts  # User subscriptions
│   │   └── user.ts           # User management
│   ├── schemas/              # Validation schemas
│   ├── services/
│   │   ├── EizenService.ts   # Vector search service
│   │   ├── EmbeddingService.ts # Embedding generation
│   │   ├── mailService.ts    # Email service
│   │   └── MemoryService.ts  # Memory operations
│   └── utils/
├── data/                     # wallets infos
├── logs/
├── Dockerfile
├── drizzle.config.ts
└── package.json
```

## Db tables

## Quick Start

### Prerequisites

- Node.js 22+
- PostgreSQL database
- Redis server
- Arweave wallet (for blockchain storage)

### Installation

1. **Clone the repository and navigate to the API folder**:

   ```bash
   cd API
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the API root directory:

4. **Run database migrations**:

   ```bash
   npm run build
   npx drizzle-kit push
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

### Docker Deployment

Build and run with Docker:

```bash
# Build the image
docker build -t archivenet-api .

# Run the container
docker run -p 3000:3000 --env-file .env archivenet-api
```

## API Endpoints

### Health & Monitoring

- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system health
- `GET /health/eizen` - Vector database health
- `GET /health/memory` - Memory service health

### Memory Operations

- `POST /memories/insert` - Store a new memory
- `GET /memories/search` - Search memories (query parameters)
- `POST /memories/search` - Advanced memory search
- `GET /memories` - List all memories for an instance
- `GET /memories/:id` - Get specific memory by ID

### User Management

- `POST /users/register` - Register new user
- `POST /users/login` - User authentication
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile

### Instance Management

- `POST /instances/create` - Create new memory instance
- `GET /instances/:userId` - Get user's instances

### Subscriptions

- `POST /subscriptions/create` - Create subscription
- `GET /subscriptions/:userId` - Get user subscriptions
- `PUT /subscriptions/update/:userId` - Update subscription

### Admin Operations

- `POST /admin/deploy` - Deploy new contract
- `GET /admin/contracts` - List deployed contracts
- `POST /admin/migrate` - Database migrations

### Contract Deployment

- `POST /deployment/contract` - Deploy Arweave contract
- `GET /deployment/status/:contractId` - Check deployment status

## Configuration

### Environment Variables

| Variable                | Description                  | Default                 |
| ----------------------- | ---------------------------- | ----------------------- |
| `DATABASE_URL`          | PostgreSQL connection string | Required                |
| `REDIS_URL`             | Redis connection string      | Required                |
| `NODE_ENV`              | Environment mode             | `development`           |
| `PORT`                  | Server port                  | `3000`                  |
| `ORIGIN`                | Allowed CORS origins         | Required                |
| `CONTRACT_JWT_SECRET`   | JWT signing secret           | Required for production |
| `EMAIL_SERVICE_USER`    | Email service username       | Required                |
| `EMAIL_SERVICE_PASS`    | Email service password       | Required                |
| `EIZEN_M`               | HNSW max connections         | `16`                    |
| `EIZEN_EF_CONSTRUCTION` | HNSW construction parameter  | `200`                   |
| `EIZEN_EF_SEARCH`       | HNSW search parameter        | `50`                    |

### EizenDB Configuration

The vector search is powered by EizenDB with configurable HNSW parameters:

- **M**: Maximum number of bi-directional links (higher = better connectivity)
- **efConstruction**: Dynamic candidate list size during construction (higher = better quality)
- **efSearch**: Dynamic candidate list size during search (higher = better accuracy)

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run clean` - Remove build artifacts
- `npm run check` - Run Biome linter and formatter
- `npm run check:ci` - Run linter in CI mode

### Code Quality

The project uses [Biome](https://biomejs.dev/) for linting and formatting:

```bash
# Check and fix code issues
npm run check

# Check only (CI mode)
npm run check:ci
```

### Database Management

Using Drizzle ORM for database operations:

```bash
# Generate migrations
npx drizzle-kit generate

# Push schema changes
npx drizzle-kit push

# View database studio
npx drizzle-kit studio
```

## Security

- **CORS Protection**: Configurable allowed origins
- **Helmet.js**: Security headers and protections
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Zod schemas for request validation
- **Error Handling**: Secure error responses without sensitive data

## Support

For questions and support:

- **Email**: admin@archivenet.tech
- **Team**: TeamVyse
- **Documentation**: Check the `/Docs` folder for additional resources
