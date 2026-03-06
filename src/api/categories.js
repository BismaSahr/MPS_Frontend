import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const authHeader = () => {
    const token = localStorage.getItem("mps_token");
    return {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
};

export const getCategories = () =>
    axios.get(`${API_BASE}/api/categories`, authHeader()).then((r) => r.data);

export const getCategory = (id) =>
    axios.get(`${API_BASE}/api/categories/${id}`, authHeader()).then((r) => r.data);

export const createCategory = (data) =>
    axios.post(`${API_BASE}/api/categories`, data, authHeader()).then((r) => r.data);

export const updateCategory = (id, data) =>
    axios.put(`${API_BASE}/api/categories/${id}`, data, authHeader()).then((r) => r.data);

export const deleteCategory = (id) =>
    axios.delete(`${API_BASE}/api/categories/${id}`, authHeader()).then((r) => r.data);
