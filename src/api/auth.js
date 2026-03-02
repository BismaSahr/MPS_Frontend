import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const loginAdmin = async ({ email, password }) => {
  const response = await axios.post(`${API_BASE}/api/admin/login`, {
    email,
    password,
  });
  return response.data; // expects { token: "..." }
};
