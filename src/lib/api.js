// frontend/src/lib/api.js
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "/api";

const API = axios.create({
  baseURL: BASE,
  withCredentials: true,
  timeout: 60000,
});

API.interceptors.request.use((cfg) => {
  try {
    const token = localStorage.getItem("token");
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
  } catch {}
  return cfg;
}, (err) => Promise.reject(err));

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(err);
  }
);

export default API;
