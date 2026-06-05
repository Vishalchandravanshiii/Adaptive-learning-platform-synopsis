<<<<<<< HEAD
# Adaptive Learning Platform

A MERN stack adaptive learning platform prototype with Student, Instructor, and Admin roles.

## Overview

This repository contains a complete adaptive learning platform with:
- Backend API in `server/`
- React + Vite frontend in `client/`
- Role-based access for Students, Instructors, and Admins
- Course management, enrollment analytics, adaptive quizzes, and learning path recommendations

## Quick start

### Install dependencies

1. Open terminal in the repository root.
2. Install both workspaces:
   - `npm install --workspaces`

### Run locally

1. Start the backend:
   - `npm run dev:server`
2. Start the frontend:
   - `npm run dev:client`
3. Start the backend from the workspace root:
   - `npm run dev`
4. Start both server and client together:
   - `npm run dev:all`

### Environment variables

Create `.env` files in both subfolders:

- `server/.env`
  - `MONGO_URI=`
  - `JWT_SECRET=`
  - `PORT=10000`

- `client/.env`
  - `VITE_API_URL=http://localhost:5000/api`

## Deployment

See `docs/PART8_DEPLOYMENT.md` for Render backend and Vercel frontend deployment instructions.

## Project structure

server/
├── config/
│   └── db.js
├── middleware/
│   ├── auth.js
│   └── role.js
├── models/
│   ├── Course.js
│   ├── Enrollment.js
│   ├── Question.js
│   ├── QuizAttempt.js
│   └── User.js
├── routes/
│   ├── admin.js
│   ├── auth.js
│   ├── courses.js
│   └── quiz.js
├── server.js
├── package.json
└── .env.example

client/
├── public/
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
=======
# Adaptive-learning-platform
>>>>>>> aa717f49c537e3cbbe223248b2558d2462d647ff
