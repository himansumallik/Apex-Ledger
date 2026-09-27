# Apex Ledger

A full-stack banking web app where users manage accounts and transactions — complete with a secure Role-Based Access Control (RBAC) system, an admin control center, and an upcoming AI-powered spending assistant. Built with the MERN stack and deployed live in production.

## Features

- [x] **User Authentication & Authorization**: Secure JWT-based signup and login with strict server-side role enforcement.
- [x] **Role-Based Access Control (RBAC)**: Distinct permissions for standard users and administrators (`user` vs `admin`).
- [x] **Admin Control Center**: Platform-wide user audits, global account monitoring, and system metrics.
- [x] **Account Management**: Create checking/savings accounts and view real-time balances.
- [x] **Transactions**: Secure deposits, withdrawals, and categorized transaction history.
- [ ] **AI-powered spending assistant**: Ask natural-language questions about your finances.
- [ ] **Redis caching**: Fast balance & transaction-history reads.

## Tech Stack

**Frontend:** React (hosted on Netlify)
**Backend:** Node.js, Express (hosted on Render)
**Database:** MongoDB Atlas
**Cache:** Redis
**Security:** JWT, bcrypt, CORS, RBAC middleware

## Architecture

```
React (Netlify Frontend)
   │  HTTP Requests (JSON via Axios + Auth Token)
   ▼
Node/Express (Render Backend API)
   │  API Routes · Controllers · RBAC Middleware · AI Integration
   │
   ├──▶ MongoDB Atlas (Database)  — Query/CRUD, user roles, accounts, transactions
   ├──▶ External LLM API          — sends prompt/text, receives generated response
   └──▶ Redis (Cache)             — key/value read & write
```

React talks to the Express backend over HTTP, attaching a JWT auth token on every request. The backend is the single hub: it enforces role-based access via middleware, queries MongoDB Atlas for persistent data, calls the LLM API for AI-generated answers, and reads/writes Redis for cached lookups — then returns a JSON response back to the frontend.

## Data Model

### User
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `name` | String | Required |
| `email` | String | Unique, required, indexed for fast login lookups |
| `password` | String | Hashed, never stored in plain text |
| `role` | String | Enum: `'user'` \| `'admin'` (defaults to `'user'`) |
| `createdAt` | Date | Account registration timestamp |

### Account
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `userId` | ObjectId | References `User`, required |
| `accountType` | String | `'checking'` \| `'savings'` |
| `balance` | Number | Tracked in currency units |
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

## Getting Started (Local Development)

```bash
# Clone the repo
git clone https://github.com/himansumallik/Apex-Ledger.git
cd Apex-Ledger

# Install backend dependencies
cd server
npm install

# Set up environment variables
cp .env.example .env
# Fill in: MONGO_URI, JWT_SECRET, LLM_API_KEY, REDIS_URL, PORT

# Run the backend server
npm start
```

```bash
# In a separate terminal, set up and run the frontend
cd client
npm install
# Configure VITE_API_URL=http://localhost:5000/api in a .env file
npm run dev
```

## Roadmap

- [x] Product brief & MVP scoping
- [x] Architecture design
- [x] Data model design
- [x] Backend: Express server + MongoDB connection
- [x] Backend: Auth (signup/login) with RBAC & Admin middleware
- [x] Backend: Account & transaction CRUD
- [x] Frontend: React UI for auth, accounts, transactions, and Admin Dashboard
- [x] Deployment: Frontend live on Netlify, backend live on Render
- [ ] AI chat assistant integration
- [ ] Redis caching layer

## Live Demo

**Frontend Application:** https://apexledgerlive.netlify.app
**Backend API:** https://apex-ledger-backend.onrender.com
