import axios from "axios";

const API_URL = "/api/coas";

// Get auth header
const getAuthHeader = () => {
    const token = localStorage.getItem("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getCOAs = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};

export const createCOA = async (formData) => {
    const res = await axios.post(API_URL, formData, {
        headers: {
            ...getAuthHeader(),
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

export const updateCOA = async (id, formData) => {
    const res = await axios.put(`${API_URL}/${id}`, formData, {
        headers: {
            ...getAuthHeader(),
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

export const deleteCOA = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeader(),
    });
    return res.data;
};
