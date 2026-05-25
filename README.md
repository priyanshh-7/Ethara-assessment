# Ethara Learn

Full stack role-based Learning Management System using React, Framer Motion, Tailwind CSS, Node.js, Express, MongoDB, JWT, Nodemailer, Razorpay, and Vidstack.

## Folder Structure

```txt
ethara-learn/
  client/           React frontend
  server/           Express API
  README.md
  package.json
```

## Setup

```bash
npm run install:all
cp server/.env.example server/.env
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

Optional local MongoDB:

```bash
docker compose up -d mongo
```

## Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ethara-learn
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

Create `client/.env`:

```env
VITE_API_URL=/api
VITE_RAZORPAY_KEY_ID=rzp_test_key
```

## Deployment

### Vercel

This project is configured for Vercel with:

- React/Vite static frontend from `client`
- Express API as a serverless function at `/api`
- MongoDB Atlas for production database

Set these Vercel environment variables:

```env
MONGO_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/ethara-learn
JWT_SECRET=replace-with-a-long-random-production-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-vercel-domain.vercel.app
PRODUCTION_CLIENT_URL=https://your-custom-domain.com
RAZORPAY_KEY_ID=rzp_live_or_test_key
RAZORPAY_KEY_SECRET=rzp_live_or_test_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-app-password
EMAIL_FROM="Ethara Learn <your-email@example.com>"
VITE_API_URL=/api
VITE_RAZORPAY_KEY_ID=rzp_live_or_test_key
```

Deploy steps:

1. Push this repository to GitHub.
2. Import the repository in Vercel.
3. Add the environment variables above.
4. Deploy.
5. In MongoDB Atlas, allow Vercel access by adding `0.0.0.0/0` to Network Access or using a tighter production network policy.
