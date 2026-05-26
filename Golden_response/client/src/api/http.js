import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api"
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("ethara_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const apiError = (error) => {
  if (!error?.response) return "API server is unavailable. Start the backend and MongoDB, then try again.";
  return error.response.data?.message || "Something went wrong";
};

export default http;
