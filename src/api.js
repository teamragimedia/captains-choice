import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("adminToken");
    const customerToken =
      localStorage.getItem("customerToken") || localStorage.getItem("token");

    // Don't overwrite an explicitly configured Authorization header.
    if (!config.headers.Authorization) {
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      } else if (customerToken) {
        config.headers.Authorization = `Bearer ${customerToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default API;
