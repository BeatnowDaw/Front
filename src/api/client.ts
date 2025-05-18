// src/api/client.ts

import axios from 'axios';

// Using Vite environment variables. For CRA use process.env.REACT_APP_API_BASE_URL replaced at build time.
const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  console.error(
    'VITE_API_BASE_URL is not defined. Please add VITE_API_BASE_URL to your .env files'
  );
}

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
});

export default api;