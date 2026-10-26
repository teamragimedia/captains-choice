import axios from "axios";

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const BASE_URL = isLocalhost
  ? import.meta.env.VITE_SERVER_URL_LOCAL
  : import.meta.env.VITE_SERVER_URL;

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});

API.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("adminToken");

  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }

  return config;
});

export default API;