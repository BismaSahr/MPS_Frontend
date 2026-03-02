import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getHeaders = (isMultipart = false) => {
    const token = localStorage.getItem("mps_token");
    const headers = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    if (isMultipart) {
        headers["Content-Type"] = "multipart/form-data";
    }
    return { headers };
};

export const getCOAs = () =>
    axios.get(`${API_BASE}/api/coas`, getHeaders()).then((r) => r.data);

export const createCOA = (formData) =>
    axios.post(`${API_BASE}/api/coas`, formData, getHeaders(true)).then((r) => r.data);

export const updateCOA = (id, formData) =>
    axios.put(`${API_BASE}/api/coas/${id}`, formData, getHeaders(true)).then((r) => r.data);

export const deleteCOA = (id) =>
    axios.delete(`${API_BASE}/api/coas/${id}`, getHeaders()).then((r) => r.data);
