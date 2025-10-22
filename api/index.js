// Vercel Serverless Function Handler
// This file exports the Express app for Vercel deployment

import '../backend/server.js';

// The backend/server.js already exports the app
// Vercel will automatically handle it
export { default } from '../backend/server.js';

