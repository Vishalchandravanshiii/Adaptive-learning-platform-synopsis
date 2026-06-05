# Part 8: Deployment

This document describes production deployment for the Adaptive Learning Platform frontend and backend.

## Backend: Render

1. Create a new Web Service on Render.
2. Connect the GitHub repository and choose the correct branch.
3. Set the Root Directory to `server`.
4. Set the Environment:
   - `MONGO_URI` = your MongoDB connection string
   - `JWT_SECRET` = a strong, unique secret
   - `PORT` = `10000` (or leave blank; Render provides one)
5. Configure Build and Start Commands:
   - Build command: `npm install`
   - Start command: `npm start`
6. Deploy the service.

### Notes
- The backend already enables CORS for the frontend.
- Use a secure, production-ready MongoDB cluster (Atlas, MongoDB Atlas, or another hosted database).
- Keep `JWT_SECRET` private and do not commit `.env` to source control.

## Frontend: Vercel

1. Create a new project on Vercel.
2. Connect the same GitHub repository.
3. Set the Root Directory to `client`.
4. Configure the build settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add an environment variable:
   - `VITE_API_URL` = `https://<your-backend-url>.onrender.com/api`
6. Deploy the frontend.

### Notes
- The client uses `VITE_API_URL` to route requests to the backend.
- If running locally, `client/src/api/axios.js` falls back to `http://localhost:10000/api`.
- Ensure the production backend URL is HTTPS.

## Production configuration checklist

- `server/.env` should contain:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `PORT`
- `client/.env` should contain:
  - `VITE_API_URL`
- For local development, the backend runs on `http://localhost:5000/api`.
- Enable HTTPS on both platforms.
- Use strong service passwords and rotate secrets if exposed.
- Monitor logs in Render and Vercel for deployment issues.
