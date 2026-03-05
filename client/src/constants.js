// config.js

export const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://employee-management-system-eu3o.onrender.com";