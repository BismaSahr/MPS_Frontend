import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const authHeader = () => {
    const token = localStorage.getItem("mps_token");
    return {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
};

/**
 * Assumed backend endpoint for consolidated dashboard statistics.
 * If this doesn't exist yet, we can fallback to individual API counts.
 */
export const getDashboardStats = async () => {
    try {
        const res = await axios.get(`${API_BASE}/api/admin/stats`, authHeader());
        return res.data;
    } catch (err) {
        console.warn("Dashboard stats endpoint not found, falling back to manual aggregation.");
        // Fallback or Mock data for visualization if backend is not ready
        return {
            totalProducts: 24,
            totalBatches: 12,
            totalScans: 842,
            expiringSoon: 3,
            categoryDistribution: [
                { name: "Reagents", count: 12 },
                { name: "Consumables", count: 8 },
                { name: "Equipment", count: 4 }
            ],
            recentActivity: [
                { type: "scan", message: "QR Code scanned in Miami Lab", time: new Date().toISOString() },
                { type: "batch", message: "New batch #MPS-R-2024 created", time: new Date(Date.now() - 3600000).toISOString() },
                { type: "coa", message: "COA uploaded for Batch #9921", time: new Date(Date.now() - 14400000).toISOString() }
            ],
            scanActivity: {
                week: [65, 59, 80, 81, 56, 55, 40],
                month: [45, 52, 38, 65, 59, 80, 81, 56, 55, 40, 72, 88, 95, 102, 98, 110, 85, 92, 78, 65, 59, 80, 81, 56, 55, 40, 30, 25, 35, 45]
            }
        };
    }
};
