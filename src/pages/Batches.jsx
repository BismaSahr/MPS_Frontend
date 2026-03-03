import { useState, useEffect, useCallback } from "react";
import { getBatches, createBatch, updateBatch, deleteBatch } from "../api/batches";
import { getProducts } from "../api/products";
import AdminLayout from "../components/AdminLayout";
import BatchModal from "../components/BatchModal";
import BatchPreviewModal from "../components/BatchPreviewModal";
import DeleteConfirm from "../components/DeleteConfirm";
import "./Batches.css";

const EMPTY_FORM = { productId: "", batchNumber: "", manufactureDate: "", expiryDate: "", quantity: "" };

const toInputDate = (d) => (d ? new Date(d).toISOString().split("T")[0] : "");

const payloadToForm = (b) => ({
    productId: b.productId?._id || b.productId || "",
    batchNumber: b.batchNumber || "",
    manufactureDate: toInputDate(b.manufactureDate),
    expiryDate: toInputDate(b.expiryDate),
    quantity: b.quantity || "",
});

const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const isExpired = (d) => d && new Date(d) < new Date();
const isExpiringSoon = (d) => {
    if (!d) return false;
    const diff = new Date(d) - new Date();
    return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
};

const Batches = () => {
    const [batches, setBatches] = useState([]);
    const [products, setProducts] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [fetchError, setFetchError] = useState("");
    const [search, setSearch] = useState("");

    const [modal, setModal] = useState(null);
    const [editTarget, setEditTarget] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [previewTarget, setPreviewTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [toast, setToast] = useState(null);
    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const load = useCallback(async () => {
        setFetching(true);
        setFetchError("");
        try {
            const [b, p] = await Promise.all([getBatches(), getProducts()]);
            setBatches(b);
            setProducts(p);
        } catch {
            setFetchError("Failed to load data. Check your backend connection.");
        } finally {
            setFetching(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const productName = (id) =>
        products.find((p) => p._id === (id?._id || id))?.name || "Unknown";

    const filtered = batches.filter(
        (b) =>
            b.batchNumber?.toLowerCase().includes(search.toLowerCase()) ||
            productName(b.productId).toLowerCase().includes(search.toLowerCase())
    );

    const openCreate = () => { setForm(EMPTY_FORM); setModal("create"); };
    const openEdit = (b) => { setEditTarget(b); setForm(payloadToForm(b)); setModal("edit"); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...form,
                manufactureDate: form.manufactureDate || undefined,
                expiryDate: form.expiryDate || undefined,
            };
            if (modal === "create") {
                await createBatch(payload);
                showToast("Batch created successfully!");
            } else {
                await updateBatch(editTarget._id, payload);
                showToast("Batch updated successfully!");
            }
            setModal(null);
            load();
        } catch (err) {
            showToast(err?.response?.data?.message || "Something went wrong.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteBatch(deleteTarget._id);
            showToast("Batch deleted.", "info");
            setDeleteTarget(null);
            load();
        } catch {
            showToast("Failed to delete batch.", "error");
            setDeleteTarget(null);
        } finally {
            setDeleting(false);
        }
    };

    // Stats
    const expiredCount = batches.filter(b => isExpired(b.expiryDate)).length;
    const expiringSoonCount = batches.filter(b => isExpiringSoon(b.expiryDate)).length;

    const topbarActions = (
        <>
            <div className="pm-search-wrap">
                <svg className="pm-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="text"
                    className="pm-search"
                    placeholder="Search batches..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <button className="pm-add-btn" onClick={openCreate} id="add-batch-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Batch
            </button>
        </>
    );

    return (
        <AdminLayout topbarActions={topbarActions}>
            {/* Stats bar */}
            <div className="pm-stats-bar">
                <div className="pm-stat">
                    <span className="pm-stat-val">{batches.length}</span>
                    <span className="pm-stat-label">Total Batches</span>
                </div>
                <div className="pm-stat">
                    <span className="pm-stat-val batch-stat--warn">{expiringSoonCount}</span>
                    <span className="pm-stat-label">Expiring Soon</span>
                </div>
                <div className="pm-stat">
                    <span className="pm-stat-val batch-stat--danger">{expiredCount}</span>
                    <span className="pm-stat-label">Expired</span>
                </div>
            </div>

            {fetching ? (
                <div className="pm-center"><div className="pm-spinner" /><p className="pm-loading-text">Loading batches…</p></div>
            ) : fetchError ? (
                <div className="pm-center">
                    <div className="pm-error-state">
                        <div className="pm-error-icon">⚠</div>
                        <p>{fetchError}</p>
                        <button className="btn-ghost" onClick={load}>Retry</button>
                    </div>
                </div>
            ) : filtered.length === 0 ? (
                <div className="pm-center">
                    <div className="pm-empty-state">
                        <div className="pm-empty-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                            </svg>
                        </div>
                        <h3>{search ? "No batches match your search." : "No batches yet."}</h3>
                        {!search && <button className="pm-add-btn" onClick={openCreate}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>Add First Batch</button>}
                    </div>
                </div>
            ) : (
                <div className="pm-table-wrap">
                    <table className="pm-table">
                        <thead>
                            <tr>
                                <th className="pm-th">#</th>
                                <th className="pm-th">Product</th>
                                <th className="pm-th">Batch No.</th>
                                <th className="pm-th">Quantity</th>
                                <th className="pm-th pm-th--hide-sm">Mfg. Date</th>
                                <th className="pm-th">Expiry Date</th>
                                <th className="pm-th pm-th--hide-sm">Status</th>
                                <th className="pm-th pm-th--right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((b, i) => {
                                const expired = isExpired(b.expiryDate);
                                const expiringSoon = isExpiringSoon(b.expiryDate);
                                return (
                                    <tr key={b._id} className="pm-tr">
                                        <td className="pm-td pm-td--num">{i + 1}</td>
                                        <td className="pm-td">
                                            <span className="pm-product-name">{productName(b.productId)}</span>
                                        </td>
                                        <td className="pm-td">
                                            <code className="pm-slug">{b.batchNumber}</code>
                                        </td>
                                        <td className="pm-td">
                                            <span className="pm-badge">{b.quantity}</span>
                                        </td>
                                        <td className="pm-td pm-td--hide-sm">{formatDate(b.manufactureDate)}</td>
                                        <td className="pm-td">
                                            <span className={expired ? "batch-date batch-date--expired" : expiringSoon ? "batch-date batch-date--soon" : ""}>
                                                {formatDate(b.expiryDate)}
                                            </span>
                                        </td>
                                        <td className="pm-td pm-td--hide-sm">
                                            {!b.expiryDate ? (
                                                <span className="batch-status batch-status--none">No Expiry</span>
                                            ) : expired ? (
                                                <span className="batch-status batch-status--expired">Expired</span>
                                            ) : expiringSoon ? (
                                                <span className="batch-status batch-status--soon">Expiring Soon</span>
                                            ) : (
                                                <span className="batch-status batch-status--ok">Active</span>
                                            )}
                                        </td>
                                        <td className="pm-td pm-td--right">
                                            <div className="pm-actions">
                                                <button className="pm-action-btn pm-action-btn--edit" onClick={() => setPreviewTarget(b)} title="Preview"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg></button>
                                                <button className="pm-action-btn pm-action-btn--edit" onClick={() => openEdit(b)} title="Edit">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                </button>
                                                <button className="pm-action-btn pm-action-btn--delete" onClick={() => setDeleteTarget(b)} title="Delete">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" /></svg>
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

            {modal && (() => {
                const hasBatch = (pId) => (batches || []).some(b => (b.productId?._id || b.productId) === pId);
                const availableProducts = (products || []).filter(p => {
                    if (modal === "create") return !hasBatch(p._id);
                    // In edit mode, allow the current product + others without batch
                    return !hasBatch(p._id) || p._id === editTarget?.productId?._id || p._id === editTarget?.productId;
                });
                return <BatchModal mode={modal} form={form} setForm={setForm} products={availableProducts} onClose={() => setModal(null)} onSubmit={handleSubmit} loading={submitting} />;
            })()}
            {previewTarget && <BatchPreviewModal batch={previewTarget} productName={productName(previewTarget.productId)} onClose={() => setPreviewTarget(null)} />}
            {deleteTarget && <DeleteConfirm productName={`Batch ${deleteTarget.batchNumber}`} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} />}
            {toast && <div className={`pm-toast pm-toast--${toast.type}`}>{toast.type === "success" && "✓ "}{toast.type === "error" && "✗ "}{toast.type === "info" && "ℹ "}{toast.msg}</div>}
        </AdminLayout>
    );
};

export default Batches;
