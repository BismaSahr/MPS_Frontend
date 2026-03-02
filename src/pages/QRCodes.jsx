import { useState, useEffect, useCallback } from "react";
import { getQRCodes, generateQRCodes, deleteQRCode } from "../api/qrcodes";
import { getBatches } from "../api/batches";
import { getCOAs } from "../api/coas";
import AdminLayout from "../components/AdminLayout";
import QRGenerateModal from "../components/QRGenerateModal";
import DeleteConfirm from "../components/DeleteConfirm";
import "./Products.css";

const QRCodes = () => {
    const [qrs, setQrs] = useState([]);
    const [batches, setBatches] = useState([]);
    const [coas, setCoas] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [search, setSearch] = useState("");

    const [showGenModal, setShowGenModal] = useState(false);
    const [generating, setGenerating] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [toast, setToast] = useState(null);
    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const load = useCallback(async () => {
        setFetching(true);
        try {
            const [q, b, c] = await Promise.all([getQRCodes(), getBatches(), getCOAs()]);
            setQrs(Array.isArray(q) ? q : []);
            setBatches(Array.isArray(b) ? b : []);
            setCoas(Array.isArray(c) ? c : []);
        } catch (err) {
            console.error("QR Load Error:", err);
            showToast("Failed to load data.", "error");
        } finally {
            setFetching(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const filtered = qrs.filter(q =>
        q.qrCode?.toLowerCase().includes(search.toLowerCase()) ||
        q.batchId?.batchNumber?.toLowerCase().includes(search.toLowerCase()) ||
        q.productId?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const handleGenerate = async (batchId) => {
        setGenerating(true);
        try {
            const res = await generateQRCodes(batchId);
            showToast(res.message || "Codes generated!");
            setShowGenModal(false);
            load();
        } catch (err) {
            showToast(err?.response?.data?.message || "Generation failed.", "error");
        } finally {
            setGenerating(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteQRCode(deleteTarget._id);
            showToast("QR code removed.", "info");
            setDeleteTarget(null);
            load();
        } catch {
            showToast("Failed to delete.", "error");
        } finally {
            setDeleting(false);
        }
    };

    const topbarActions = (
        <>
            <div className="pm-search-wrap">
                <svg className="pm-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="text"
                    className="pm-search"
                    placeholder="Search Code, Batch, Product..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <button className="pm-add-btn" onClick={() => setShowGenModal(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" /><path d="M14 14h7v7h-7z" />
                </svg>
                Generate Codes
            </button>
        </>
    );

    return (
        <AdminLayout topbarActions={topbarActions}>
            {/* Stats */}
            <div className="pm-stats-bar">
                <div className="pm-stat">
                    <span className="pm-stat-val">{qrs.length}</span>
                    <span className="pm-stat-label">Total QR Units</span>
                </div>
                <div className="pm-stat">
                    <span className="pm-stat-val batch-stat--ok">
                        {new Set(qrs.map(q => q.batchId?._id || q.batchId)).size}
                    </span>
                    <span className="pm-stat-label">Active Batches</span>
                </div>
                <div className="pm-stat">
                    <span className="pm-stat-val">
                        {qrs.reduce((acc, curr) => acc + (curr.scanCount || 0), 0)}
                    </span>
                    <span className="pm-stat-label">Total Scans</span>
                </div>
            </div>

            {fetching ? (
                <div className="pm-center"><div className="pm-spinner" /><p className="pm-loading-text">Loading QR database…</p></div>
            ) : filtered.length === 0 ? (
                <div className="pm-center">
                    <div className="pm-empty-state">
                        <div className="pm-empty-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                                <rect x="3" y="14" width="7" height="7" /><path d="M14 14h7v7h-7z" />
                            </svg>
                        </div>
                        <h3>{search ? "No matches found." : "No QR codes generated."}</h3>
                        {!search && <button className="pm-add-btn" onClick={() => setShowGenModal(true)}>Generate First Batch</button>}
                    </div>
                </div>
            ) : (
                <div className="pm-table-wrap">
                    <table className="pm-table">
                        <thead>
                            <tr>
                                <th className="pm-th">Product & Batch</th>
                                <th className="pm-th">Unique QR String</th>
                                <th className="pm-th pm-th--hide-sm">Status</th>
                                <th className="pm-th pm-th--hide-md">Scans</th>
                                <th className="pm-th pm-th--right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((q) => (
                                <tr key={q._id} className="pm-tr">
                                    <td className="pm-td">
                                        <div className="pm-product-name">{q.productId?.name || "Unknown"}</div>
                                        <div className="pm-product-desc">Batch: {q.batchId?.batchNumber || "—"}</div>
                                    </td>
                                    <td className="pm-td">
                                        <code className="pm-code">{q.qrCode?.substring(0, 13)}...</code>
                                    </td>
                                    <td className="pm-td pm-td--hide-sm">
                                        <span className={`pm-status pm-status--${q.status === 'unused' ? 'active' : 'expired'}`}>
                                            {q.status}
                                        </span>
                                    </td>
                                    <td className="pm-td pm-td--hide-md">
                                        <span className="pm-badge">{q.scanCount || 0}</span>
                                    </td>
                                    <td className="pm-td pm-td--right">
                                        <div className="pm-actions">
                                            <button className="pm-action-btn pm-action-btn--delete" onClick={() => setDeleteTarget(q)} title="Delete Code"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" /></svg></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showGenModal && (
                <QRGenerateModal
                    batches={batches.filter(b => !qrs.some(q => (q.batchId?._id || q.batchId) === b._id))}
                    coas={coas}
                    onClose={() => setShowGenModal(false)}
                    onGenerate={handleGenerate}
                    loading={generating}
                />
            )}

            {deleteTarget && (
                <DeleteConfirm
                    productName={`QR Code ${deleteTarget.qrCode?.substring(0, 8)}`}
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={handleDelete}
                    loading={deleting}
                />
            )}

            {toast && <div className={`pm-toast pm-toast--${toast.type}`}>{toast.msg}</div>}
        </AdminLayout>
    );
};

export default QRCodes;
