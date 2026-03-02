import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("mps_token")}` },
});

export const getProducts = () =>
    axios.get(`${API_BASE}/api/products`).then((r) => r.data);

export const getProduct = (id) =>
    axios.get(`${API_BASE}/api/products/${id}`).then((r) => r.data);

export const createProduct = (data) =>
    axios.post(`${API_BASE}/api/products`, data, authHeader()).then((r) => r.data);

export const updateProduct = (id, data) =>
    axios.put(`${API_BASE}/api/products/${id}`, data, authHeader()).then((r) => r.data);

export const deleteProduct = (id) =>
    axios.delete(`${API_BASE}/api/products/${id}`, authHeader()).then((r) => r.data);
