# Apex Ledger

A full-stack banking web app where users manage accounts and transactions — and instead of digging through raw transaction lists, they can ask an AI assistant natural-language questions like *"how much did I spend on food last month?"* Built with the MERN stack, with Redis caching for fast, production-realistic reads.

> 🚧 **Status:** Actively in development. See the roadmap below for what's built vs. in progress.

## Features

- [x] User authentication (JWT-based signup/login)
- [x] Account management (create checking/savings accounts, view balance)
- [x] Transactions (deposit, withdraw, categorized transaction history)
- [ ] AI-powered spending assistant (ask natural-language questions about your finances)
- [ ] Redis caching (fast balance & transaction-history reads)

## Tech Stack

**Frontend:** React
**Backend:** Node.js, Express
**Database:** MongoDB
**Cache:** Redis
**AI:** External LLM API

## Architecture

```
React (Frontend)
   │  HTTP Requests (JSON)
   ▼
Node/Express (Backend/API)
   │  API Routes · Controllers · Middleware · AI Integration
   │
   ├──▶ MongoDB (Database)       — Query/CRUD, returns JSON docs
   ├──▶ External LLM API         — sends prompt/text, receives generated response
   └──▶ Redis (Cache)            — key/value read & write
```

React talks to the Express backend over HTTP. The backend is the single hub: it queries MongoDB for persistent data, calls the LLM API for AI-generated answers, and reads/writes Redis for cached lookups — then returns a JSON response back to the frontend.

## Data Model

### User
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `name` | String | Required |
| `email` | String | Unique, required, indexed for fast login lookups |
| `password` | String | Hashed, never stored in plain text |
| `createdAt` | Date | Account registration timestamp |

### Account
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `userId` | ObjectId | References `User`, required |
| `accountType` | String | `'checking'` \| `'savings'` |
| `balance` | Number | Tracked in smallest currency unit (cents/paise) |
| `currency` | String | Default `'USD'` or `'INR'` |
| `createdAt` | Date | Account creation timestamp |

### Transaction
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `accountId` | ObjectId | References `Account`, required |
| `amount` | Number | Absolute value of the transaction |
| `type` | String | Enum: `'deposit'` \| `'withdrawal'` |
| `category` | String | e.g. `'groceries'`, `'salary'`, `'entertainment'`, `'utilities'` |
| `description` | String | Optional memo or merchant name |
| `date` | Date | Defaults to `Date.now` |

**Relationships:** One `User` → many `Account`s · One `Account` → many `Transaction`s

## Getting Started

```bash
# Clone the repo
git clone <your-repo-url>
cd global-bank-v2

# Install backend dependencies
cd server
npm install

# Set up environment variables
cp .env.example .env
# Fill in: MONGODB_URI, JWT_SECRET, LLM_API_KEY, REDIS_URL

# Run the server
npm run dev
```

## Roadmap

- [x] Product brief & MVP scoping
- [x] Architecture design
- [x] Data model design
- [x] Backend: Express server + MongoDB connection
- [x] Backend: Auth (signup/login)
- [x] Backend: Account & transaction CRUD
- [ ] Frontend: React UI for auth, accounts, transactions
- [ ] AI chat assistant integration
- [ ] Redis caching layer
- [ ] Deployment (live demo link)

## Live Demo

_Coming soon._
