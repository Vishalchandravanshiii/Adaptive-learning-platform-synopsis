# Part 2: Frontend Setup

This document contains the React frontend setup for the Adaptive Learning Platform.

## Setup steps

1. Open terminal in project root.
2. `cd client`
3. `npm install`
4. Copy `.env.example` to `.env`
5. `npm run dev`

## Notes

- The frontend uses React, React Router, Axios, Tailwind CSS, and JWT-based auth.
- API calls are routed to `VITE_API_URL`.
- Login and registration are implemented with role-based redirect.
