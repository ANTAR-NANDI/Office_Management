// src/api/axios.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api", // Make sure this matches your Node.js backend port
});

// 🟢 THE FIX: Add a request interceptor to automatically inject the token headers
api.interceptors.request.use(
    (config) => {
        // Pull the token from localStorage
        const token = localStorage.getItem("token");
        
        if (token) {
            // Attach Bearer token cleanly matching your authMiddleware format
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;