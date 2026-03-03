import { useState, useEffect, useCallback, useMemo } from "react";
import { getQRCodes, generateQRCodes, deleteQRCode, exportQRCodes } from "../api/qrcodes";
import { getBatches } from "../api/batches";
import { getProducts } from "../api/products";
import { getCOAs } from "../api/coas";
import AdminLayout from "../components/AdminLayout";
import QRGenerateModal from "../components/QRGenerateModal";
import QRListModal from "../components/QRListModal";
import DeleteConfirm from "../components/DeleteConfirm";
import "./Products.css";

const QRCodes = () => {
    const [qrs, setQrs] = useState([]);
    const [batches, setBatches] = useState([]);
    const [products, setProducts] = useState([]);
    const [coas, setCoas] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [search, setSearch] = useState("");

    const [showGenModal, setShowGenModal] = useState(false);
    const [generating, setGenerating] = useState(false);

    const [listModalTarget, setListModalTarget] = useState(null);
    const [exporting, setExporting] = useState(false);

    const [toast, setToast] = useState(null);
    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const load = useCallback(async () => {
        setFetching(true);
        try {
            const [q, b, c, p] = await Promise.all([getQRCodes(), getBatches(), getCOAs(), getProducts()]);
            setQrs(Array.isArray(q) ? q : []);
            setBatches(Array.isArray(b) ? b : []);
            setCoas(Array.isArray(c) ? c : []);
            setProducts(Array.isArray(p) ? p : []);
        } catch (err) {
            console.error("QR Load Error:", err);
            showToast("Failed to load data.", "error");
        } finally {
            setFetching(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const productName = useCallback((idOrObj) => {
        if (!idOrObj) return "Unknown";
        if (typeof idOrObj === 'object' && idOrObj.name) return idOrObj.name;
        const id = typeof idOrObj === 'object' ? idOrObj._id : idOrObj;
        return products.find(p => p._id === id)?.name || "Unknown";
    }, [products]);

    // Grouping QR codes by batch for the modal
    const batchDataMap = useMemo(() => {
        return qrs.reduce((acc, q) => {
            const bid = q.batchId?._id || q.batchId;
            if (!bid) return acc;
            if (!acc[bid]) acc[bid] = [];
            acc[bid].push(q);
            return acc;
        }, {});
    }, [qrs]);

    // Display list: Batches that have QR codes generated
    const qrBatches = useMemo(() => {
        const generatedIds = new Set(Object.keys(batchDataMap));
        return batches
            .filter(b => generatedIds.has(b._id))
            .filter(b =>
                b.batchNumber?.toLowerCase().includes(search.toLowerCase()) ||
                productName(b.productId).toLowerCase().includes(search.toLowerCase())
            );
    }, [batches, batchDataMap, search, productName]);

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

    const handleExport = async (batch) => {
        setExporting(true);
        try {
            await exportQRCodes(batch._id, batch.batchNumber);
            showToast("Export successful!");
        } catch (err) {
            showToast("Export failed.", "error");
        } finally {
            setExporting(false);
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
                    placeholder="Search Batch or Product..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
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
                    <span className="pm-stat-val">{Object.keys(batchDataMap).length}</span>
                    <span className="pm-stat-label">Active Batches</span>
                </div>
                <div className="pm-stat">
                    <span className="pm-stat-val">{qrs.length}</span>
                    <span className="pm-stat-label">Total QR Units</span>
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
            ) : qrBatches.length === 0 ? (
                <div className="pm-center">
                    <div className="pm-empty-state">
                        <div className="pm-empty-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                                <rect x="3" y="14" width="7" height="7" /><path d="M14 14h7v7h-7z" />
                            </svg>
                        </div>
                        <h3>{search ? "No batches found." : "No QR codes generated yet."}</h3>
                        {!search && <button className="pm-add-btn" onClick={() => setShowGenModal(true)}>Generate First Batch</button>}
                    </div>
                </div>
            ) : (
                <div className="pm-table-wrap">
                    <table className="pm-table">
                        <thead>
                            <tr>
                                <th className="pm-th">Product Name</th>
                                <th className="pm-th">Batch Number</th>
                                <th className="pm-th pm-th--hide-sm">Unit Count</th>
                                <th className="pm-th pm-th--hide-md">Total Scans</th>
                                <th className="pm-th pm-th--right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {qrBatches.map((b) => {
                                const codes = batchDataMap[b._id] || [];
                                const scanSum = codes.reduce((sum, q) => sum + (q.scanCount || 0), 0);
                                return (
                                    <tr key={b._id} className="pm-tr">
                                        <td className="pm-td">
                                            <div className="pm-product-name">{productName(b.productId)}</div>
                                        </td>
                                        <td className="pm-td">
                                            <code className="pm-badge">{b.batchNumber}</code>
                                        </td>
                                        <td className="pm-td pm-td--hide-sm">
                                            <span className="pm-image-count">{codes.length} Units</span>
                                        </td>
                                        <td className="pm-td pm-td--hide-md">
                                            <span className="pm-badge">{scanSum}</span>
                                        </td>
                                        <td className="pm-td pm-td--right">
                                            <div className="pm-actions">
                                                <button
                                                    className="pm-action-btn pm-action-btn--edit"
                                                    style={{ width: 'auto', padding: '0 1rem', fontSize: '0.8rem', gap: '0.4rem' }}
                                                    onClick={() => setListModalTarget(b)}
                                                >
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                        <circle cx="12" cy="12" r="3" />
                                                    </svg>
                                                    View Codes
                                                </button>
                                                <button
                                                    className="pm-action-btn"
                                                    title="Export CSV"
                                                    onClick={() => handleExport(b)}
                                                    disabled={exporting}
                                                >
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                        <polyline points="7 10 12 15 17 10" />
                                                        <line x1="12" y1="15" x2="12" y2="3" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {showGenModal && (
                <QRGenerateModal
                    batches={batches.filter(b => !batchDataMap[b._id])}
                    coas={coas}
                    onClose={() => setShowGenModal(false)}
                    onGenerate={handleGenerate}
                    loading={generating}
                />
            )}

            {listModalTarget && (
                <QRListModal
                    batch={listModalTarget}
                    qrs={batchDataMap[listModalTarget._id] || []}
                    onClose={() => setListModalTarget(null)}
                    onExport={handleExport}
                    loadingExport={exporting}
                />
            )}

            {toast && <div className={`pm-toast pm-toast--${toast.type}`}>{toast.msg}</div>}
        </AdminLayout>
    );
};

export default QRCodes;
