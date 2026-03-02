import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("mps_token")}` },
});

export const getBatches = () =>
    axios.get(`${API_BASE}/api/batches`).then((r) => r.data);

export const getBatch = (id) =>
    axios.get(`${API_BASE}/api/batches/${id}`).then((r) => r.data);

export const createBatch = (data) =>
    axios.post(`${API_BASE}/api/batches`, data, authHeader()).then((r) => r.data);

export const updateBatch = (id, data) =>
    axios.put(`${API_BASE}/api/batches/${id}`, data, authHeader()).then((r) => r.data);

export const deleteBatch = (id) =>
    axios.delete(`${API_BASE}/api/batches/${id}`, authHeader()).then((r) => r.data);
