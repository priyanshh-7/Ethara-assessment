# Ethara Learn

Full stack role-based Learning Management System using React, Framer Motion, Tailwind CSS, Node.js, Express, MongoDB, JWT, Nodemailer, Razorpay, and Vidstack.

```txt
ethara-learn/
├── client/                   # React Frontend (Vite + Tailwind CSS + Framer Motion)
│   ├── public/               # Static assets
│   ├── src/                  # Application source
│   │   ├── api/              # API request utilities (Axios instance)
│   │   ├── components/       # Reusable components (Navbar, CourseCard, ProtectedRoute, etc.)
│   │   ├── context/          # React Contexts (AuthContext, CartContext)
│   │   ├── data/             # Static page data / domains
│   │   ├── pages/            # Page components (Home, Register, Login, Cart, Dashboards, Support)
│   │   ├── styles/           # Global styles and tailwind directives
│   │   ├── utils/            # Helper functions
│   │   ├── App.jsx           # Main App component with routing
│   │   └── main.jsx          # React DOM mounting
│   ├── package.json          # Frontend dependencies
│   ├── tailwind.config.js    # Tailwind configuration
│   └── vite.config.js        # Vite configuration
│
├── server/                   # Express Backend API
│   ├── src/                  # Backend application source
│   │   ├── config/           # DB configuration (Mongoose connection) and Nodemailer setup
│   │   ├── controllers/      # API Controllers (Auth, Cart, Course, Payment, Profile, Support)
│   │   ├── middleware/       # Express middlewares (auth authentication & role checks)
│   │   ├── models/           # Mongoose Database Schemas (User, Course, Order, Progress, SupportTicket)
│   │   ├── routes/           # Express router endpoints (Auth, Cart, Course, Payment, Profile, Support)
│   │   ├── utils/            # Backend helper utilities (token generation, emails)
│   │   ├── app.js            # Express app setup and middleware configuration
│   │   └── server.js         # Local HTTP server startup script
│   ├── .env.example          # Template for backend environment variables
│   └── package.json          # Backend dependencies
│
├── scripts/                  # Development scripts
│   └── generate-codebase-doc.mjs # Script to package the codebase into a clean .docx document
│
└── package.json              # Monorepo root package.json for concurrently running workspaces
```

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React (Vite), Framer Motion, Tailwind CSS, Vidstack Video Player |
| **Backend** | Node.js, Express.js, Nodemailer |
| **Database** | MongoDB (Mongoose ODM) |
| **Payments** | Razorpay Gateway Integration |
| **Auth** | JWT (JSON Web Tokens) + bcrypt Password Hashing |
| **Tooling** | npm workspaces + Concurrently |

## Features

- **Role-based Authentication** — Signup, login, logout, and token validation for Students and Educators, including forgot/reset password via Nodemailer emails.
- **Course Creation & Management** — Educators can create, edit, and publish courses with detailed descriptions, thumbnail images, and customizable pricing models.
- **Lecture Uploading** — Educators can add multiple video lecture contents to courses.
- **Interactive Video Player** — Seamless stream and beautiful responsive controls using the premium Vidstack player.
- **Cart & Secured Checkout** — Comprehensive shopping cart system supporting multi-course additions, removal, and complete checkout.
- **Razorpay Payment Integration** — Immersive checkout overlay using secure API orders, signature verifications, and purchase record updating.
- **Course Progress Tracking** — Tracks lectures watched, percentage completed, and marks courses as fully completed in real time.
- **Unified Dashboards** — Personalized dashboards for students (enrolled courses, progress indicators) and educators (revenue tracking, enrollments, owned courses).
- **Customer Support Ticketing** — Animated support forms generating unique support tokens and auto-triggering email confirmations.
- **Scroll-based Storytelling Animations** — Framer Motion scroll triggers, stunning glassmorphism layouts, parallax visual grids, and custom stagger fades.

## Prerequisites

- Node.js v20+
- MongoDB (local community service or a free MongoDB Atlas cloud cluster)
- Razorpay developer account (for test key IDs and secrets)
- SMTP Mail Account (Gmail App Password or similar credentials for Nodemailer password recovery)

## Quick Start

This project is configured as an npm workspaces monorepo. You can launch all services concurrently from the root or run each service individually.

### 1. Unified Monorepo Launch (Recommended)

From the project root directory, run:

```bash
# Install root, backend, and frontend dependencies in one command
npm run install:all

# Set up local configuration environment files
cp server/.env.example server/.env
cp client/.env.example client/.env

# Start both servers (Express at 5000, React at 5173) concurrently in development mode
npm run dev
```

### 2. Manual Backend Setup

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ethara-learn
JWT_SECRET=replace-with-a-long-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=rzp_test_key
RAZORPAY_KEY_SECRET=rzp_test_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-app-password
EMAIL_FROM="Ethara Learn <your-email@example.com>"
```

Start backend:

```bash
npm run dev      # Start with nodemon (auto-reload)
# or
npm start        # Start production HTTP server
```

### 3. Manual Frontend Setup

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_key
```

Start frontend:

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173` (proxied to API on `http://localhost:5000`).

## API Reference

### Auth

Method | Endpoint | Description
:--- | :--- | :---
**POST** | `/api/auth/register` | Register a new User account (Educator or Student role)
**POST** | `/api/auth/login` | Login, authenticate user, and receive JWT cookie/token
**POST** | `/api/auth/forgot-password` | Request password reset token sent via Nodemailer email
**PATCH** | `/api/auth/reset-password/:token` | Reset password using the valid reset token
**GET** | `/api/auth/me` | Fetch active user credentials (Protected)

### Courses

Method | Endpoint | Description
:--- | :--- | :---
**GET** | `/api/courses` | List all active public courses and domains
**GET** | `/api/courses/:id` | Fetch specific course details and lecture indexes
**GET** | `/api/courses/educator/mine` | List all courses created by active educator (Protected, Educator only)
**POST** | `/api/courses` | Create a new course (Protected, Educator only)
**PATCH** | `/api/courses/:id` | Update a course's properties and pricing (Protected, Educator only)
**POST** | `/api/courses/:id/lectures` | Upload and append a new lecture resource (Protected, Educator only)

### Cart

All cart routes require active Student JWT authentication in the `Authorization: Bearer <token>` header.

Method | Endpoint | Description
:--- | :--- | :---
**GET** | `/api/cart` | Get current student cart items and totals
**POST** | `/api/cart/:courseId` | Add a course into the student cart
**DELETE** | `/api/cart/:courseId` | Remove a course from the student cart
**DELETE** | `/api/cart` | Empty all courses in the active student cart

### Payments

All payment routes require active Student JWT authentication.

Method | Endpoint | Description
:--- | :--- | :---
**POST** | `/api/payments/order` | Create an active checkout order with Razorpay
**POST** | `/api/payments/verify` | Validate cryptographic signatures and grant course ownership

### Progress

Method | Endpoint | Description
:--- | :--- | :---
**PATCH** | `/api/progress/:courseId/lectures/:lectureId` | Toggle lecture viewed state and update tracking progress (Protected, Student only)

### Profile

Method | Endpoint | Description
:--- | :--- | :---
**GET** | `/api/profile/me` | Retrieve structured profile details, enrollment metrics, or educator earnings (Protected)

### Support

Method | Endpoint | Description
:--- | :--- | :---
**POST** | `/api/support` | Post support request, write DB ticket, generate token, send auto-email (Protected)

## Environment Variables

| Variable | Description | Example |
| :--- | :--- | :--- |
| **PORT** | Backend API HTTP listener port | `5000` |
| **MONGO_URI** | Connection string for MongoDB instance | `mongodb://localhost:27017/ethara-learn` |
| **JWT_SECRET** | Cryptographic key to sign Web Tokens | `your-long-random-secret-key-phrase` |
| **JWT_EXPIRES_IN** | Expiry window for JWT session tokens | `7d` |
| **CLIENT_URL** | Frontend domain allowed by backend CORS | `http://localhost:5173` |
| **RAZORPAY_KEY_ID** | Public identifier key for Razorpay checkout | `rzp_test_1234abcd` |
| **RAZORPAY_KEY_SECRET** | Private API signature secret key for Razorpay | `secret_abcdefghijk` |
| **EMAIL_HOST** | SMTP email client hostname service | `smtp.gmail.com` |
| **EMAIL_PORT** | Port for SMTP mail transfers | `587` |
| **EMAIL_SECURE** | Toggle SSL/TLS standard protocols | `false` |
| **EMAIL_USER** | System sender email account username | `example@gmail.com` |
| **EMAIL_PASS** | App-specific login password for SMTP | `xxxx-xxxx-xxxx-xxxx` |
| **EMAIL_FROM** | Display label signature for outgoing mail | `Ethara Learn <example@gmail.com>` |
| **VITE_API_URL** | Base URL for client API requests | `http://localhost:5000` |
| **VITE_RAZORPAY_KEY_ID** | Frontend public Razorpay key | `rzp_test_1234abcd` |

## MongoDB Setup

### Local Setup

Ensure MongoDB Server is installed and running locally:

```bash
# macOS
brew install mongodb-community && brew services start mongodb-community

# Ubuntu
sudo apt update && sudo apt install -y mongodb && sudo systemctl start mongodb

# Windows
# Run MongoDB Windows Service via Services.msc
```

### Atlas (Free Cloud Cluster)

1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas).
2. Create an M0 free tier database cluster.
3. Whitelist access from all IPs (`0.0.0.0/0` for cloud deployment) and create a database user with password credentials.
4. Copy the connection string and assign it to the `MONGO_URI` variable.

## Deployment

### Backend (Render / Railway)

1. Push the `server/` directory or the monorepo to a remote GitHub repository.
2. Import the repository to Render or Railway.
3. Configure the environment variables (e.g., `MONGO_URI`, `JWT_SECRET`, etc.) in the platform's service settings.
4. Set the build command to `npm install` and start command to `npm start` (ensuring the base directory is set to `server/`).
5. Deploy to get your public backend server URL.

### Frontend (Netlify / Vercel / Hostinger)

1. Push the `client/` directory or the monorepo to a remote GitHub repository.
2. Import the repository into your static hosting dashboard (e.g. Netlify).
3. Set the base directory to `client/`.
4. Configure the environment variables (`VITE_API_URL` pointing to your deployed backend URL, and `VITE_RAZORPAY_KEY_ID`).
5. Configure the build command as `npm run build` and publish/output directory as `dist`.
6. Deploy to obtain your public frontend website URL.

## Scripts

### Monorepo Workspaces

```bash
npm run install:all   # Installs dependencies for root, server, and client directories
npm run dev           # Concurrently launches Express API and React Vite dev servers
npm run build         # Triggers the client Vite build process
```

### Server (server/)

```bash
npm start             # Starts Express server in production node environment
npm run dev           # Starts Express server with hot-reload via nodemon
```

### Client (client/)

```bash
npm run dev           # Launches local React development preview server
npm run build         # Compiles static HTML/JS/CSS assets to /dist directory
```

### Document Scripts (scripts/)

```bash
node scripts/generate-codebase-doc.mjs # Packages current codebase files into Ethara-Learn-Codebase.docx
```

## Security Notes

- **Password Cryptography** — All credentials are secure-hashed prior to persistence using high-entropy bcrypt with 10 salt rounds.
- **State-free Sessions** — Secured JWT keys expire within 7 days, maintaining clean cookies/headers stateless logins.
- **Role Guard Middleware** — Endpoints are strongly validated with strict role verification logic (`requireRole`).
- **Signature Integrity** — Payments are fully validated via secure SHA256 HMAC comparisons from Razorpay responses.
- **No .env Exposure** — Local `.env` parameters are ignored automatically inside `.gitignore` files. Never commit private environment files to git.
