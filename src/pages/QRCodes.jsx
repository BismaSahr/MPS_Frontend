import { useState, useEffect, useCallback } from "react";
import { getQRCodes, generateQRCodes, exportQRCodes, deleteQRCode } from "../api/qrcodes";
import { getBatches } from "../api/batches";
import { getProducts } from "../api/products";
import { getCOAs } from "../api/coas";
import AdminLayout from "../components/AdminLayout";
import QRGenerateModal from "../components/QRGenerateModal";
import DeleteConfirm from "../components/DeleteConfirm";
import "./Products.css";

const QRCodes = () => {
    const [qrs, setQrs] = useState([]);
    const [batches, setBatches] = useState([]);
    const [products, setProducts] = useState([]);
    const [coas, setCoas] = useState([]);
    const [fetching, setFetching] = useState(true);

    // Pagination and Filtering state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedBatchId, setSelectedBatchId] = useState("");

    const [showGenModal, setShowGenModal] = useState(false);
    const [generating, setGenerating] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [exporting, setExporting] = useState(false);

    const [toast, setToast] = useState(null);
    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const loadData = useCallback(async () => {
        setFetching(true);
        try {
            const res = await getQRCodes(page, limit, selectedBatchId);
            setQrs(res.qrCodes || []);
            setTotalCount(res.totalCount || 0);
            setTotalPages(res.totalPages || 1);
        } catch (err) {
            console.error("QR Load Error:", err);
            showToast("Failed to load QR codes.", "error");
        } finally {
            setFetching(false);
        }
    }, [page, limit, selectedBatchId]);

    const loadInitialDeps = useCallback(async () => {
        try {
            const [b, c, p] = await Promise.all([getBatches(), getCOAs(), getProducts()]);
            setBatches(Array.isArray(b) ? b : []);
            setCoas(Array.isArray(c) ? c : []);
            setProducts(Array.isArray(p) ? p : []);
        } catch (err) {
            console.error("Deps Load Error:", err);
        }
    }, []);

    useEffect(() => {
        loadInitialDeps();
    }, [loadInitialDeps]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const productName = useCallback((idOrObj) => {
        if (!idOrObj) return "Unknown";
        if (typeof idOrObj === 'object' && idOrObj.name) return idOrObj.name;
        const id = typeof idOrObj === 'object' ? idOrObj._id : idOrObj;
        return products.find(p => p._id === id)?.name || "Unknown";
    }, [products]);

    const handleGenerate = async (batchId) => {
        setGenerating(true);
        try {
            const res = await generateQRCodes(batchId);
            showToast(res.message || "Codes generated!");
            setShowGenModal(false);
            setPage(1);
            loadData();
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
            showToast("QR Code deleted.");
            setDeleteTarget(null);
            loadData();
        } catch (err) {
            showToast("Failed to delete QR.", "error");
        } finally {
            setDeleting(false);
        }
    };

    const handleExport = async () => {
        if (!selectedBatchId) return showToast("Please filter by a batch first to export.", "error");
        setExporting(true);
        try {
            const b = batches.find(b => b._id === selectedBatchId);
            await exportQRCodes(selectedBatchId, b?.batchNumber);
            showToast("Export successful!");
        } catch (err) {
            showToast("Export failed.", "error");
        } finally {
            setExporting(false);
        }
    };

    const topbarActions = (
        <>
            <div className="pm-search-wrap" style={{ minWidth: '220px' }}>
                <select
                    className="pm-search"
                    value={selectedBatchId}
                    onChange={(e) => { setSelectedBatchId(e.target.value); setPage(1); }}
                    style={{ paddingLeft: '1rem', width: '100%', appearance: 'auto' }}
                >
                    <option value="">All Batches</option>
                    {batches.map(b => (
                        <option key={b._id} value={b._id}>
                            {b.batchNumber} - {productName(b.productId)}
                        </option>
                    ))}
                </select>
            </div>

            {selectedBatchId && (
                <button className="btn-ghost" onClick={handleExport} disabled={exporting}>
                    {exporting ? <div className="btn-spinner" /> : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="btn-icon">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                    )}
                    Export CSV
                </button>
            )}

            <button className="pm-add-btn" onClick={() => setShowGenModal(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" /><path d="M14 14h7v7h-7z" />
                </svg>
                Generate New
            </button>
        </>
    );

    return (
        <AdminLayout topbarActions={topbarActions}>
            <div className="pm-stats-bar">
                <div className="pm-stat">
                    <span className="pm-stat-val">{totalCount}</span>
                    <span className="pm-stat-label">Total Selected QR Units</span>
                </div>
                <div className="pm-stat">
                    <span className="pm-stat-val">{page} / {totalPages || 1}</span>
                    <span className="pm-stat-label">Current Page</span>
                </div>
                <div className="pm-stat">
                    <span className="pm-stat-val">
                        {selectedBatchId ? "Filtered" : "Showing All"}
                    </span>
                    <span className="pm-stat-label">Batch Filter</span>
                </div>
            </div>

            {fetching ? (
                <div className="pm-center"><div className="pm-spinner" /><p className="pm-loading-text">Loading QR database…</p></div>
            ) : qrs.length === 0 ? (
                <div className="pm-center">
                    <div className="pm-empty-state">
                        <div className="pm-empty-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                                <rect x="3" y="14" width="7" height="7" /><path d="M14 14h7v7h-7z" />
                            </svg>
                        </div>
                        <h3>{selectedBatchId ? "No QR codes for this batch." : "No QR codes generated yet."}</h3>
                        {!selectedBatchId && <button className="pm-add-btn" onClick={() => setShowGenModal(true)}>Generate First Batch</button>}
                    </div>
                </div>
            ) : (
                <div className="pm-table-wrap">
                    <table className="pm-table">
                        <thead>
                            <tr>
                                <th className="pm-th">QR String</th>
                                <th className="pm-th">Product Name</th>
                                <th className="pm-th">Batch Number</th>
                                <th className="pm-th pm-th--hide-sm">Status</th>
                                <th className="pm-th pm-th--hide-md">Scans</th>
                                <th className="pm-th pm-th--right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {qrs.map((q) => {
                                const b = q.batchId || {};
                                return (
                                    <tr key={q._id} className="pm-tr">
                                        <td className="pm-td">
                                            <code className="pm-code" style={{ fontSize: '0.75rem' }}>{q.qrCode}</code>
                                        </td>
                                        <td className="pm-td">
                                            <div className="pm-product-name">{productName(b?.productId || q.productId)}</div>
                                        </td>
                                        <td className="pm-td">
                                            <span className="pm-badge">{b.batchNumber || "—"}</span>
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
                                                <button
                                                    className="pm-action-btn pm-action-btn--delete"
                                                    title="Delete QR Code"
                                                    onClick={() => setDeleteTarget(q)}
                                                >
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="3 6 5 6 21 6" />
                                                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                                        <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--surface)', borderTop: '1px solid var(--surface-border)' }}>
                            <button
                                className="btn-ghost"
                                style={{ padding: '0.4rem 0.8rem' }}
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                Prev
                            </button>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Page {page} of {totalPages}</span>
                            <button
                                className="btn-ghost"
                                style={{ padding: '0.4rem 0.8rem' }}
                                disabled={page >= totalPages}
                                onClick={() => setPage(page + 1)}
                            >
                                Next
                            </button>
                            <select
                                className="form-select"
                                style={{ width: 'auto', padding: '0.3rem 2rem 0.3rem 0.5rem', backgroundPosition: 'right 0.5rem center' }}
                                value={limit}
                                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                            >
                                <option value={10}>10 / page</option>
                                <option value={20}>20 / page</option>
                                <option value={50}>50 / page</option>
                            </select>
                        </div>
                    )}
                </div>
            )}

            {showGenModal && (
                <QRGenerateModal
                    batches={batches}
                    coas={coas}
                    onClose={() => setShowGenModal(false)}
                    onGenerate={handleGenerate}
                    loading={generating}
                />
            )}

            {deleteTarget && (
                <DeleteConfirm
                    productName={`QR Code ${deleteTarget.qrCode}`}
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
