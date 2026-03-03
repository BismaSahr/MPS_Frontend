import { useState, useEffect, useCallback } from "react";
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../api/products";
import AdminLayout from "../components/AdminLayout";
import ProductModal from "../components/ProductModal";
import ProductPreviewModal from "../components/ProductPreviewModal";
import DeleteConfirm from "../components/DeleteConfirm";
import "./Products.css";

const EMPTY_FORM = {
    name: "", slug: "", description: "", storage: "", packaging: "", images: [],
};

const formToPayload = (form) => ({
    ...form,
    images: Array.isArray(form.images) ? form.images.map((s) => s.trim()).filter(Boolean) : [],
});

const payloadToForm = (p) => ({
    name: p.name || "",
    slug: p.slug || "",
    description: p.description || "",
    storage: p.storage || "",
    packaging: p.packaging || "",
    images: Array.isArray(p.images) ? [...p.images] : [],
});

const Products = () => {
    const [products, setProducts] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [fetchError, setFetchError] = useState("");
    const [search, setSearch] = useState("");

    const [modal, setModal] = useState(null);
    const [editTarget, setEditTarget] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [modalError, setModalError] = useState("");

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
            setProducts(await getProducts());
        } catch {
            setFetchError("Failed to load products. Check your backend connection.");
        } finally {
            setFetching(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const filtered = products.filter(
        (p) =>
            p.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.slug?.toLowerCase().includes(search.toLowerCase())
    );

    const openCreate = () => { setForm(EMPTY_FORM); setModalError(""); setModal("create"); };
    const openEdit = (product) => { setEditTarget(product); setForm(payloadToForm(product)); setModalError(""); setModal("edit"); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setModalError("");
        try {
            if (modal === "create") {
                await createProduct(formToPayload(form));
                showToast("Product created successfully!");
            } else {
                await updateProduct(editTarget._id, formToPayload(form));
                showToast("Product updated successfully!");
            }
            setModal(null);
            load();
        } catch (err) {
            setModalError(err?.response?.data?.message || "Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteProduct(deleteTarget._id);
            showToast("Product deleted.", "info");
            setDeleteTarget(null);
            load();
        } catch {
            showToast("Failed to delete product.", "error");
            setDeleteTarget(null);
        } finally {
            setDeleting(false);
        }
    };

    // Topbar action buttons
    const topbarActions = (
        <>
            <div className="pm-search-wrap">
                <svg className="pm-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="text"
                    className="pm-search"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <button className="pm-add-btn" onClick={openCreate} id="add-product-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Product
            </button>
        </>
    );

    return (
        <AdminLayout topbarActions={topbarActions}>
            {/* Stats bar */}
            <div className="pm-stats-bar">
                <div className="pm-stat">
                    <span className="pm-stat-val">{products.length}</span>
                    <span className="pm-stat-label">Total Products</span>
                </div>
                <div className="pm-stat">
                    <span className="pm-stat-val">{products.filter(p => p.images?.length > 0).length}</span>
                    <span className="pm-stat-label">With Images</span>
                </div>
                <div className="pm-stat">
                    <span className="pm-stat-val">{filtered.length}</span>
                    <span className="pm-stat-label">Showing</span>
                </div>
            </div>

            {/* Table */}
            {fetching ? (
                <div className="pm-center"><div className="pm-spinner" /><p className="pm-loading-text">Loading products…</p></div>
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
                                <path d="M21 16V8a2 2 0 00-1-1.73L13 2.27a2 2 0 00-2 0L4 6.27A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                            </svg>
                        </div>
                        <h3>{search ? "No products match your search." : "No products yet."}</h3>
                        {!search && <button className="pm-add-btn" onClick={openCreate}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>Add First Product</button>}
                    </div>
                </div>
            ) : (
                <div className="pm-table-wrap">
                    <table className="pm-table">
                        <thead>
                            <tr>
                                <th className="pm-th">#</th>
                                <th className="pm-th">Product</th>
                                <th className="pm-th pm-th--hide-sm">Slug</th>
                                <th className="pm-th pm-th--hide-md">Storage</th>
                                <th className="pm-th pm-th--hide-md">Packaging</th>
                                <th className="pm-th">Images</th>
                                <th className="pm-th pm-th--right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((p, i) => (
                                <tr key={p._id} className="pm-tr">
                                    <td className="pm-td pm-td--num">{i + 1}</td>
                                    <td className="pm-td">
                                        <div className="pm-product-cell">
                                            {p.images?.[0] ? (
                                                <img src={p.images[0]} alt={p.name} className="pm-product-thumb" onError={(e) => { e.target.style.display = "none"; }} />
                                            ) : (
                                                <div className="pm-product-thumb-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg></div>
                                            )}
                                            <div>
                                                <div className="pm-product-name">{p.name}</div>
                                                {p.description && <div className="pm-product-desc">{p.description.slice(0, 60)}{p.description.length > 60 ? "…" : ""}</div>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="pm-td pm-td--hide-sm"><code className="pm-slug">{p.slug}</code></td>
                                    <td className="pm-td pm-td--hide-md">{p.storage ? <span className="pm-badge">{p.storage}</span> : <span className="pm-muted">—</span>}</td>
                                    <td className="pm-td pm-td--hide-md">{p.packaging || <span className="pm-muted">—</span>}</td>
                                    <td className="pm-td"><span className="pm-image-count">{p.images?.length || 0} img{p.images?.length !== 1 ? "s" : ""}</span></td>
                                    <td className="pm-td pm-td--right">
                                        <div className="pm-actions">
                                            <button className="pm-action-btn pm-action-btn--edit" onClick={() => setPreviewTarget(p)} title="Preview"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg></button>
                                            <button className="pm-action-btn pm-action-btn--edit" onClick={() => openEdit(p)} title="Edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg></button>
                                            <button className="pm-action-btn pm-action-btn--delete" onClick={() => setDeleteTarget(p)} title="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" /></svg></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {modal && <ProductModal mode={modal} product={editTarget} form={form} setForm={setForm} onClose={() => setModal(null)} onSubmit={handleSubmit} loading={submitting} error={modalError} />}
            {previewTarget && <ProductPreviewModal product={previewTarget} onClose={() => setPreviewTarget(null)} />}
            {deleteTarget && <DeleteConfirm productName={deleteTarget.name} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} />}
            {toast && <div className={`pm-toast pm-toast--${toast.type}`}>{toast.type === "success" && "✓ "}{toast.type === "error" && "✗ "}{toast.type === "info" && "ℹ "}{toast.msg}</div>}
        </AdminLayout>
    );
};

export default Products;
