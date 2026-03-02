import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("mps_token")}` },
});

export const getCOAs = () =>
    axios.get(`${API_BASE}/api/coas`, authHeader()).then((r) => r.data);

export const createCOA = (formData) =>
    axios.post(`${API_BASE}/api/coas`, formData, {
        headers: {
            ...authHeader().headers,
            "Content-Type": "multipart/form-data",
        },
    }).then((r) => r.data);

export const updateCOA = (id, formData) =>
    axios.put(`${API_BASE}/api/coas/${id}`, formData, {
        headers: {
            ...authHeader().headers,
            "Content-Type": "multipart/form-data",
        },
    }).then((r) => r.data);

export const deleteCOA = (id) =>
    axios.delete(`${API_BASE}/api/coas/${id}`, authHeader()).then((r) => r.data);
