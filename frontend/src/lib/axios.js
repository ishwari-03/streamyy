import axios from "axios";

// Use the environment variable for the backend URL (e.g., https://streamyy.onrender.com)
// Fallback to localhost for development if the variable is not set
const BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : "http://localhost:5001/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Crucial for sending cookies/JWT cross-domain
});