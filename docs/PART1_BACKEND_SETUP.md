# Part 1: Backend Setup

This document contains the backend setup for the Adaptive Learning Platform.

## Setup steps

1. Install dependencies
   - `cd server`
   - `npm install`
2. Create `.env` from `.env.example`
3. Start the server:
   - `npm run dev`

## API endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`

## Notes

- JWT secret is required in `.env`
- MongoDB connection string is required in `.env`
