import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const authHeader = () => {
    const token = localStorage.getItem("mps_token");
    return {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
};

export const getQRCodes = (page = 1, limit = 10, batchId = "") => {
    let url = `${API_BASE}/api/qrcodes?page=${page}&limit=${limit}`;
    if (batchId) url += `&batchId=${batchId}`;
    return axios.get(url, authHeader()).then((r) => r.data);
};

export const getBatchQRCodes = (batchId, page = 1, limit = 10) =>
    axios.get(`${API_BASE}/api/qrcodes/batch/${batchId}?page=${page}&limit=${limit}`, authHeader()).then((r) => r.data);

export const getQRCode = (id) =>
    axios.get(`${API_BASE}/api/qrcodes/${id}`, authHeader()).then((r) => r.data);

export const generateQRCodes = (batchId) =>
    axios.post(`${API_BASE}/api/qrcodes/generate/${batchId}`, {}, authHeader()).then((r) => r.data);

export const deleteQRCode = (id) =>
    axios.delete(`${API_BASE}/api/qrcodes/${id}`, authHeader()).then((r) => r.data);

export const exportQRCodes = (batchId, batchNumber) => {
    return axios.get(`${API_BASE}/api/qrcodes/export/${batchId}`, {
        ...authHeader(),
        responseType: 'blob'
    }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `qrcodes_${batchNumber || batchId}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    });
};
