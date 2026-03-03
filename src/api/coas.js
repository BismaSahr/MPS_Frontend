import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Returns Axios config with Authorization header
const authHeader = () => {
    const token = localStorage.getItem("mps_token");
    return {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
};

// -------------------
// Fetch all COAs
// -------------------
export const getCOAs = () =>
    axios.get(`${API_BASE}/api/coa`, authHeader()).then((r) => r.data);

// -------------------
// Fetch single COA by ID
// -------------------
export const getCOA = (id) =>
    axios.get(`${API_BASE}/api/coa/${id}`, authHeader()).then((r) => r.data);

// -------------------
// Create COA (with file upload)
// -------------------
export const createCOA = (formData) =>
    axios
        .post(`${API_BASE}/api/coa`, formData, authHeader())
        .then((r) => r.data);

// -------------------
// Update COA (with optional file upload)
// -------------------
export const updateCOA = (id, formData) =>
    axios
        .put(`${API_BASE}/api/coa/${id}`, formData, authHeader())
        .then((r) => r.data);

// -------------------
// Delete COA
// -------------------
export const deleteCOA = (id) =>
    axios.delete(`${API_BASE}/api/coa/${id}`, authHeader()).then((r) => r.data);