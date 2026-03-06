import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { getDashboardStats } from "../api/dashboard";
import "./Dashboard.css";

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState("week"); // week or month

    useEffect(() => {
        const fetchStats = async () => {
            const data = await getDashboardStats();
            setStats(data);
            setLoading(false);
        };
        fetchStats();
    }, []);

    if (loading) return (
        <AdminLayout>
            <div className="pm-center"><div className="pm-spinner" /><p className="pm-loading-text">Analyzing MPS Systems...</p></div>
        </AdminLayout>
    );

    const currentData = stats.scanActivity[timeframe] || [];
    const maxVal = Math.max(...currentData, 5); // Ensure at least 5 for scale if all 0
    const hasData = currentData.some(v => v > 0);

    return (
        <AdminLayout>
            <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Analytical Overview</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Miami Pro Science System Status & Logistics</p>
            </div>

            {/* KPI Cards */}
            <div className="dashboard-grid">
                <div className="db-card">
                    <div className="kpi-icon" style={{ background: 'rgba(255, 27, 33, 0.1)', color: 'var(--primary)' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24"><path d="M21 16V8a2 2 0 00-1-1.73L13 2.27a2 2 0 00-2 0L4 6.27A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></svg>
                    </div>
                    <span className="kpi-val">{stats.totalProducts}</span>
                    <span className="kpi-label">Active Products</span>
                </div>

                <div className="db-card">
                    <div className="kpi-icon" style={{ background: 'rgba(37, 75, 154, 0.1)', color: 'var(--secondary)' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                    </div>
                    <span className="kpi-val">{stats.totalBatches}</span>
                    <span className="kpi-label">Production Batches</span>
                </div>

                <div className="db-card">
                    <div className="kpi-icon" style={{ background: 'rgba(0, 200, 150, 0.1)', color: '#00c896' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M12 8v8M8 12h8" /></svg>
                    </div>
                    <span className="kpi-val">{stats.totalScans}</span>
                    <span className="kpi-label">Total Authentications</span>
                </div>

                <div className="db-card" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <div className="kpi-icon" style={{ background: 'rgba(255, 27, 33, 0.1)', color: 'var(--primary)' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    </div>
                    <span className="kpi-val" style={{ color: 'var(--primary)' }}>{stats.expiringSoon}</span>
                    <span className="kpi-label">Stock Expiring Soon</span>
                </div>
            </div>

            {/* Middle Section: Activity & Distribution */}
            <div className="dashboard-grid" style={{ marginTop: '2rem' }}>
                <div className="chart-section">
                    <div className="chart-header">
                        <h3 style={{ margin: 0 }}>Scan Activity</h3>
                        <div className="time-toggle">
                            <button
                                className={`toggle-btn ${timeframe === "week" ? "active" : ""}`}
                                onClick={() => setTimeframe("week")}
                            >Week</button>
                            <button
                                className={`toggle-btn ${timeframe === "month" ? "active" : ""}`}
                                onClick={() => setTimeframe("month")}
                            >Month</button>
                        </div>
                    </div>

                    <div className="bar-chart" style={{ position: 'relative' }}>
                        {!hasData && (
                            <div style={{
                                position: 'absolute',
                                left: 0, right: 0, top: '50%',
                                transform: 'translateY(-50%)',
                                textAlign: 'center',
                                color: 'var(--text-secondary)',
                                fontSize: '0.85rem',
                                zIndex: 1
                            }}>
                                No authentication data for this period
                            </div>
                        )}
                        {currentData.map((val, i) => (
                            <div
                                key={i}
                                className="bar"
                                style={{
                                    height: `${(val / maxVal) * 100}%`,
                                    minHeight: '2px', // UX: Always show a tiny line even for 0
                                    opacity: hasData ? 1 : 0.2
                                }}
                                title={`${val} scans`}
                            />
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                        <span>{timeframe === "week" ? "7d ago" : "30d ago"}</span>
                        <span>Today</span>
                    </div>
                </div>

                <div className="activity-feed">
                    <h3 style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Recent Activity</h3>
                    <div className="feed-list">
                        {stats.recentActivity.map((act, i) => (
                            <div key={i} className="activity-item">
                                <div className="activity-icon" style={{ opacity: 0.6 }}>
                                    {act.type === 'scan' ? '🔍' : act.type === 'batch' ? '🧪' : '📄'}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{act.message}</div>
                                    <div className="activity-time">{new Date(act.time).toLocaleTimeString()}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section: Categories */}
            <div className="db-card" style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Category Insights</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                    {stats.categoryDistribution.map((cat, i) => (
                        <div key={i} style={{ flex: 1, minWidth: '150px' }}>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{cat.name}</div>
                            <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${(cat.count / stats.totalProducts) * 100}%`,
                                    height: '100%',
                                    background: 'var(--secondary)'
                                }} />
                            </div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '0.5rem' }}>{cat.count} Items</div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
