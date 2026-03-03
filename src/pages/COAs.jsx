import { useState, useEffect, useCallback } from "react";
import { getCOAs, createCOA, updateCOA, deleteCOA, API_BASE } from "../api/coas";
import { getBatches } from "../api/batches";
import { getProducts } from "../api/products";
import AdminLayout from "../components/AdminLayout";
import COAModal from "../components/COAModal";
import DeleteConfirm from "../components/DeleteConfirm";
import "./Products.css"; // Reuse table and stats styles

const EMPTY_FORM = { batchId: "", labName: "", purity: "", file: null };

const payloadToForm = (c) => ({
    batchId: c.batchId?._id || c.batchId || "",
    labName: c.labName || "",
    purity: c.purity || "",
    file: null,
});

const formToPayload = (form) => {
    const fd = new FormData();
    fd.append("batchId", form.batchId || "");
    fd.append("labName", form.labName || "");
    fd.append("purity", form.purity || "");
    if (form.file) {
        fd.append("file", form.file);
    }
    return fd;
};

const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const COAs = () => {
    const [coas, setCoas] = useState([]);
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
            const [c, b, p] = await Promise.all([getCOAs(), getBatches(), getProducts()]);
            // Defensive checks in case backend returns unexpected format
            setCoas(Array.isArray(c) ? c : []);
            setBatches(Array.isArray(b) ? b : []);
            setProducts(Array.isArray(p) ? p : []);
        } catch (err) {
            console.error("COA Load Error:", err);
            setFetchError("Failed to load COAs. Check your backend connection.");
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

    const filtered = (Array.isArray(coas) ? coas : []).filter(
        (c) =>
            c.labName?.toLowerCase().includes(search.toLowerCase()) ||
            c.batchId?.batchNumber?.toLowerCase().includes(search.toLowerCase())
    );

    const openCreate = () => { setForm(EMPTY_FORM); setModal("create"); };
    const openEdit = (c) => { setEditTarget(c); setForm(payloadToForm(c)); setModal("edit"); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = formToPayload(form);

            if (modal === "create") {
                await createCOA(payload);
                showToast("COA uploaded successfully!");
            } else {
                await updateCOA(editTarget._id, payload);
                showToast("COA updated successfully!");
            }
            setModal(null);
            load();
        } catch (err) {
            showToast(err?.response?.data?.message || "Failed to save COA.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteCOA(deleteTarget._id);
            showToast("Document deleted.", "info");
            setDeleteTarget(null);
            load();
        } catch {
            showToast("Failed to delete document.", "error");
            setDeleteTarget(null);
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
                    placeholder="Search Lab or Batch..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <button className="pm-add-btn" onClick={openCreate} id="add-coa-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="21 15 21 19 3 19 3 15" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload COA
            </button>
        </>
    );

    return (
        <AdminLayout topbarActions={topbarActions}>
            {/* Stats */}
            <div className="pm-stats-bar">
                <div className="pm-stat">
                    <span className="pm-stat-val">{coas.length}</span>
                    <span className="pm-stat-label">Total Documents</span>
                </div>
                <div className="pm-stat">
                    <span className="pm-stat-val batch-stat--ok">
                        {Array.isArray(batches) && Array.isArray(coas)
                            ? batches.filter(b => coas.some(c => (c.batchId?._id || c.batchId) === b._id)).length
                            : 0}
                    </span>
                    <span className="pm-stat-label">Batches with COA</span>
                </div>
                <div className="pm-stat">
                    <span className="pm-stat-val">{filtered.length}</span>
                    <span className="pm-stat-label">Showing</span>
                </div>
            </div>

            {fetching ? (
                <div className="pm-center"><div className="pm-spinner" /><p className="pm-loading-text">Loading documents…</p></div>
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
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                        </div>
                        <h3>{search ? "No documents match." : "No COAs yet."}</h3>
                        {!search && <button className="pm-add-btn" onClick={openCreate}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>Upload First COA</button>}
                    </div>
                </div>
            ) : (
                <div className="pm-table-wrap">
                    <table className="pm-table">
                        <thead>
                            <tr>
                                <th className="pm-th">Batch No.</th>
                                <th className="pm-th">Lab Name</th>
                                <th className="pm-th pm-th--hide-sm">Purity</th>
                                <th className="pm-th pm-th--hide-md">Version</th>
                                <th className="pm-th">Uploaded</th>
                                <th className="pm-th pm-th--right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((c) => (
                                <tr key={c._id} className="pm-tr">
                                    <td className="pm-td">
                                        <div className="pm-product-name">{c.batchId?.batchNumber || "Unknown"}</div>
                                        <div className="pm-product-desc">{productName(c.batchId?.productId)}</div>
                                    </td>
                                    <td className="pm-td">{c.labName || <span className="pm-muted">N/A</span>}</td>
                                    <td className="pm-td pm-td--hide-sm">
                                        {c.purity ? <span className="pm-badge">{c.purity}</span> : <span className="pm-muted">—</span>}
                                    </td>
                                    <td className="pm-td pm-td--hide-md">v{c.version || 1}</td>
                                    <td className="pm-td">{formatDate(c.uploadedAt)}</td>
                                    <td className="pm-td pm-td--right">
                                        <div className="pm-actions">
                                            <a
                                                href={c.fileUrl?.startsWith('http') ? c.fileUrl : `${API_BASE}${c.fileUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="pm-action-btn pm-action-btn--edit"
                                                title="View Document"
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                            </a>
                                            <button className="pm-action-btn pm-action-btn--edit" onClick={() => openEdit(c)} title="Edit Details"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg></button>
                                            <button className="pm-action-btn pm-action-btn--delete" onClick={() => setDeleteTarget(c)} title="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" /></svg></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {modal && (() => {
                const hasCOA = (bId) => (coas || []).some(c => (c.batchId?._id || c.batchId) === bId);
                const availableBatches = (batches || []).filter(b => {
                    if (modal === "create") return !hasCOA(b._id);
                    return !hasCOA(b._id) || b._id === editTarget?.batchId?._id || b._id === editTarget?.batchId;
                });
                return <COAModal mode={modal} form={form} setForm={setForm} batches={availableBatches} products={products} onClose={() => setModal(null)} onSubmit={handleSubmit} loading={submitting} />;
            })()}
            {deleteTarget && <DeleteConfirm productName={`COA for Batch ${deleteTarget.batchId?.batchNumber}`} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} />}
            {toast && <div className={`pm-toast pm-toast--${toast.type}`}>{toast.type === "success" && "✓ "}{toast.type === "error" && "✗ "}{toast.type === "info" && "ℹ "}{toast.msg}</div>}
        </AdminLayout>
    );
};

export default COAs;
