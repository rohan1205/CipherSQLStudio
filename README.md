# CipherSQL Studio

A browser-based SQL learning platform that enables users to practice SQL queries in a secure, pedagogically sound environment with real-time feedback and AI-powered hints.

---

## Project Overview

**CipherSQL Studio** is an interactive SQL practice platform designed for learners to:

- Write and execute SQL queries against a live PostgreSQL sandbox
- Receive immediate feedback on query results
- Request AI-generated hints when stuck
- Progress through structured SQL assignments across multiple difficulty levels
- Learn SQL fundamentals and advanced techniques in a safe, isolated environment

The platform solves the friction in SQL learning by combining:
1. **Immediate query execution** without infrastructure setup
2. **Guided learning** through progressive difficulty assignments
3. **Intelligent assistance** via LLM-powered hints with fallback logic
4. **Clean, intuitive UI** designed as a SaaS dashboard for accessibility

**Target Users:** Developers, data analysts, and students learning SQL from beginner to intermediate levels.

---

## Features

### Core Features

- **Real-time SQL Execution**: Execute queries against a PostgreSQL sandbox and view results instantly
- **Assignment System**: Structured learning through assignments with progressive difficulty (Easy, Medium, Hard)
- **Table Schema Display**: View database table structure inline to guide query construction
- **Syntax Highlighting**: Monaco Editor integration for professional SQL editing experience
- **Result Visualization**: Clean, organized table display with column headers and row data
- **Assignment Persistence**: All assignments stored centrally; seamless user experience across sessions

### Security Features

- **Query Validation**: All user queries validated server-side before execution
- **Destructive Statement Blocking**: `DROP`, `DELETE`, `TRUNCATE`, and other operations prevented
- **Multi-Statement Prevention**: Semicolon-delimited multi-statement queries rejected to prevent sandbox escape
- **Database Sandboxing**: Dedicated PostgreSQL instance isolated from production data
- **Input Sanitization**: Parameter validation and escape handling across all endpoints

### LLM Hint System

- **AI-Powered Assistance**: Integrated OpenRouter API provides intelligent hints based on:
  - Assignment question context
  - User's current query
  - Table schema
- **Graceful Fallback**: If LLM API fails, system serves pre-cached, generic SQL hints
- **Non-Intrusive**: Hints only provided on explicit user request—no spoilers by default
- **Learning-Focused**: Hints guide toward solution without revealing the answer

### UI/UX Features

- **Modern SaaS Dashboard Design**: Dark theme with premium styling and micro-interactions
- **Mobile-First Responsive Layout**: Optimized for desktop, tablet, and mobile viewports
- **Accessibility**: Clear typography hierarchy, color-coded difficulty badges, semantic HTML
- **Smooth Animations**: Card hover effects, button transitions, result fade-ins
- **Topbar Navigation**: Quick back button and assignment context at the top of every page

---

## Tech Stack Explanation

### Frontend: React.js + Monaco Editor + SCSS

**React.js** enables:
- Component-based architecture for maintainability
- Client-side routing with React Router (Home → Assignment pages)
- Real-time state management for query, results, and hint display

**Monaco Editor** (VS Code's editor):
- Professional SQL syntax highlighting
- Keyboard shortcuts familiar to developers
- Auto-completion and error detection

**Vanilla SCSS** with BEM Convention:
- Modular partials (`_variables.scss`, `_mixins.scss`, `_base.scss`, `_layout.scss`, `_components.scss`)
- Mobile-first responsive design via SCSS mixins
- Centralized design tokens (colors, spacing, radii) for consistent theming
- No CSS-in-JS overhead; compiles to optimized CSS

### Backend: Node.js + Express.js

**Rationale:**
- Non-blocking I/O perfect for handling multiple concurrent queries
- Single language across frontend and backend reduces context switching
- Large ecosystem of middleware for security and utilities
- Simple, unopinionated routing for REST API design

### PostgreSQL (Query Sandbox)

**Why PostgreSQL for SQL learning:**
- ACID-compliant, production-like SQL semantics
- Robust query validation and error messages aid learning
- Supports complex queries (JOINs, subqueries, CTEs) for progressive learning
- Open-source and widely used in industry
- Performance sufficient for learning sandbox workloads

**Sandboxing approach:**
- Dedicated PostgreSQL instance separate from any production database
- Read-only access where possible (assignments test SELECT queries primarily)
- Connection limits and query timeouts prevent resource exhaustion
- Pre-loaded with teaching datasets for assignments

### MongoDB Atlas (Assignment Persistence)

**Why MongoDB for assignments:**
- Document-based storage aligns naturally with assignment metadata (title, description, difficulty, test cases)
- Flexible schema accommodates varying assignment types and complexity levels
- MongoDB Atlas provides managed hosting, eliminating infrastructure concerns
- Scalable for future features (user profiles, tracking, collections)

**Data Model:**
```javascript
{
  title: String,
  difficulty: "Easy" | "Medium" | "Hard",
  description: String,
  question: String,
  tableName: String,
  schema: Object,
  expectedOutput: Array,
  hints: [String]
}
```

### OpenRouter LLM API (Hint Generation)

**Architecture:**
- Primary: Call OpenRouter API with prompt including user query + table schema
- Fallback: If API fails (timeout, rate limit, network), serve pre-cached hints
- Non-blocking: Hint requests do not block query execution
- Timeout: 5-second window to prevent user lag

**Why OpenRouter:**
- Access to multiple LLM providers (GPT-4, Claude, Llama) via single API
- Built-in fallback routing if primary model unavailable
- Cost-efficient pricing compared to direct model APIs

---

## Architecture Overview

### Data Flow

```
User Input (SQL Query)
    ↓
React Component (AssignmentPage)
    ↓
HTTP POST → /api/execute
    ↓
Express Middleware (Validation)
    ├─ Check for destructive keywords
    ├─ Verify single statement
    └─ Escape parameters
    ↓
PostgreSQL Connection Pool
    ↓
Query Execution (SELECT only)
    ↓
Result Set (columns, rows)
    ↓
Express Response JSON
    ↓
React State Update
    ↓
UI Render (ResultsTable Component)
```

### Hint Flow

```
User Clicks "Get Hint"
    ↓
React Component State
    ↓
HTTP POST → /api/hint
    ↓
Express Hint Controller
    ├─ Construct LLM prompt
    └─ Call OpenRouter API
    ↓
LLM Response or Fallback
    ├─ Success: Return AI hint
    └─ Failure: Serve cached hint
    ↓
React State Update
    ↓
UI Display (HintPanel Component)
```

### Assignment Flow

```
Home Page (React Router)
    ↓
Fetch /api/assignments
    ↓
MongoDB Query (find all)
    ↓
Display AssignmentCard grid
    ↓
User Clicks Card
    ↓
Navigate → /assignment/:id
    ↓
Fetch /api/assignments/:id
    ↓
MongoDB Query (findById)
    ↓
Render AssignmentPage with data
```

---

## Folder Structure

```
CipherSQLStudio/
├── README.md                    # Project documentation
├── .env.example                 # Environment variables template
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js           # Build configuration
│   ├── eslint.config.js         # Code linting
│   ├── index.html
│   ├── public/                  # Static assets
│   └── src/
│       ├── main.jsx             # React entry point
│       ├── App.jsx              # Main router component
│       ├── api/
│       │   └── api.js           # Axios client for backend
│       ├── components/
│       │   ├── AssignmentCard.jsx     # Assignment card (home page)
│       │   ├── HintPanel.jsx          # Hint display logic
│       │   └── ResultsTable.jsx       # Query results display
│       ├── pages/
│       │   ├── HomePage.jsx           # Assignment list page
│       │   └── AssignmentPage.jsx     # Query practice page
│       ├── styles/
│       │   ├── main.scss              # Master SCSS file
│       │   ├── _variables.scss        # Colors, spacing, fonts
│       │   ├── _mixins.scss           # Responsive, transitions
│       │   ├── _base.scss             # Reset, body styles
│       │   ├── _layout.scss           # Container, flex layouts
│       │   └── _components.scss       # Component-specific styles
│       └── assets/                    # Images, icons
│
├── backend/
│   ├── package.json
│   ├── .env                     # Environment variables (local)
│   └── src/
│       ├── app.js               # Express app setup
│       ├── seed.js              # Database seeding script
│       ├── config/
│       │   ├── mongo.js         # MongoDB connection
│       │   └── postgres.js      # PostgreSQL connection pool
│       ├── models/
│       │   └── Assignment.js    # MongoDB schema
│       └── routes/
│           ├── assignments.js   # GET /api/assignments
│           ├── execute.js       # POST /api/execute
│           └── hint.js          # POST /api/hint
```

---

## Environment Variables

### Backend Configuration

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server
PORT=5000

# MongoDB Atlas
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ciphersql?retryWrites=true&w=majority

# PostgreSQL Sandbox
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=yourpassword
PG_DATABASE=sql_learning

# LLM API
OPENROUTER_API_KEY=sk_live_your_key_here

# Optional: Environment identifier
NODE_ENV=development
```

### `.env.example` Template

Commit this template (without secrets) for documentation:

```env
# Server Port
PORT=5000

# MongoDB Atlas Connection String
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ciphersql?retryWrites=true&w=majority

# PostgreSQL Connection Details
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=your_secure_password
PG_DATABASE=sql_learning

# OpenRouter LLM API Key
OPENROUTER_API_KEY=your_api_key

# Node Environment
NODE_ENV=development
```

**Never commit `.env` with real secrets.** Use `.env.example` for reference.

---

## Installation Instructions

### Prerequisites

- Node.js (v16+)
- PostgreSQL (v12+)
- MongoDB Atlas account (free tier eligible)
- OpenRouter API key (free tier available)
- Git

### Step-by-Step Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/CipherSQLStudio.git
cd CipherSQLStudio
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file with your configuration
cp .env.example .env
# Edit .env with your database credentials and API keys
nano .env

# Setup PostgreSQL (one-time)
createdb sql_learning
psql sql_learning < seeds/schema.sql  # Load teaching datasets

# Setup MongoDB Atlas (one-time)
# - Create cluster at https://www.mongodb.com/cloud/atlas
# - Add your connection string to .env MONGO_URI

# Run backend server
npm start
# Server runs on http://localhost:5000
```

#### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Vite server runs on http://localhost:5173
```

#### 4. Verify Installation

- Open browser to `http://localhost:5173`
- Home page should load with assignments
- Click an assignment and execute a test query (e.g., `SELECT * FROM users LIMIT 5`)
- Verify results display and "Get Hint" button works

---

## Security Considerations

### Query Sanitization

**Server-side validation** prevents malicious or accidental query execution:

```javascript
// backend/routes/execute.js
const BLOCKED_KEYWORDS = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'CREATE'];
const hasDestructiveKeyword = (query) =>
  BLOCKED_KEYWORDS.some(kw => query.toUpperCase().includes(kw));

if (hasDestructiveKeyword(userQuery)) {
  return res.status(400).json({ error: 'Query contains restricted keywords' });
}
```

### Preventing Multi-Statement Execution

```javascript
// Allow only single statements (no semicolon-separated queries)
const stmtCount = (query.match(/;/g) || []).length;
if (stmtCount > 1) {
  return res.status(400).json({ error: 'Multiple statements not allowed' });
}
```

### Database Sandbox Isolation

- **Dedicated PostgreSQL instance:** Separate from production
- **Read-only role (optional):** Users connect with SELECT-only permissions
- **Connection pooling:** Limits concurrent connections
- **Query timeout:** 10-second max execution time prevents infinite loops

### LLM Fallback Security

- **API key isolation:** Stored in `.env`, never exposed to frontend
- **Timeout handling:** If LLM API slow/down, return cached hint (no user-visible errors)
- **Rate limiting:** Hint requests throttled per user session

### Frontend Security

- **Input validation:** Monaco Editor sanitizes before sending
- **CSRF protection:** Express middleware validates origin headers
- **XSS prevention:** React auto-escapes rendered query results

---

## Future Improvements

### Authentication & User Tracking

- User registration/login system
- Track query history per user
- Store solved vs. attempted assignments
- Leaderboard/progress dashboard

### Query Execution Enhancements

- **Query explanation feature:** Explain execution plan to users
- **Query performance tips:** Suggest indexing opportunities
- **Test case validation:** Auto-check if result matches expected output
- **Query diff tool:** Compare user output vs. expected output

### Infrastructure & Deployment

- **Dockerized sandbox:** Containerized PostgreSQL for deployment scalability
- **Kubernetes orchestration:** Multi-region deployment reliability
- **Query caching:** Cache frequent queries for performance
- **Database snapshots:** Reset sandbox to clean state periodically

### Content Expansion

- **Assignment categories:** Filter by topic (JOINs, aggregations, CTEs, window functions)
- **Custom assignments:** Educators create private assignment sets
- **Query templates:** Starter code for complex queries
- **Difficulty progression:** Adaptive difficulty based on user performance

### Monitoring & Analytics

- **Query execution analytics:** Track which queries users struggle with
- **Hint effectiveness:** Measure if hints lead to correct solutions
- **Performance monitoring:** Identify slow assignments or database bottlenecks
- **Error tracking:** Sentry/LogRocket for production debugging

---

## Data Flow Diagram

For detailed request/response flows, refer to `/docs/data-flow-diagram.jpg`.

---

## License

This project is provided as-is for educational purposes.

## Contributing

Contributions welcome. Please submit issues and pull requests to improve the platform.

## Support

For issues or questions, open a GitHub issue or contact the development team.

---

**Last Updated:** February 2025