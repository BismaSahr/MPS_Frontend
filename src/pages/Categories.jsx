import { useState, useEffect, useCallback } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../api/categories";
import AdminLayout from "../components/AdminLayout";
import CategoryModal from "../components/CategoryModal";
import DeleteConfirm from "../components/DeleteConfirm";
import "./Products.css";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [fetchError, setFetchError] = useState("");
    const [search, setSearch] = useState("");

    const [modal, setModal] = useState(null);
    const [editTarget, setEditTarget] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [modalError, setModalError] = useState("");

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
            setCategories(await getCategories());
        } catch {
            setFetchError("Failed to load categories. Check your backend connection.");
        } finally {
            setFetching(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const filtered = categories.filter(
        (c) => c.name?.toLowerCase().includes(search.toLowerCase())
    );

    const openCreate = () => { setModalError(""); setModal("create"); };
    const openEdit = (category) => { setEditTarget(category); setModalError(""); setModal("edit"); };

    const handleSubmit = async (data) => {
        setSubmitting(true);
        setModalError("");
        try {
            if (modal === "create") {
                await createCategory(data);
                showToast("Category created successfully!");
            } else {
                await updateCategory(editTarget._id, data);
                showToast("Category updated successfully!");
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
            await deleteCategory(deleteTarget._id);
            showToast("Category deleted.", "error");
            setDeleteTarget(null);
            load();
        } catch {
            showToast("Failed to delete category.", "error");
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
                    placeholder="Search categories..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <button className="pm-add-btn" onClick={openCreate}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Category
            </button>
        </>
    );

    return (
        <AdminLayout topbarActions={topbarActions}>
            <div className="pm-stats-bar" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <div className="pm-stat">
                    <span className="pm-stat-val">{categories.length}</span>
                    <span className="pm-stat-label">Total Categories</span>
                </div>
                <div className="pm-stat">
                    <span className="pm-stat-val">{filtered.length}</span>
                    <span className="pm-stat-label">Showing Results</span>
                </div>
            </div>

            {fetching ? (
                <div className="pm-center"><div className="pm-spinner" /><p className="pm-loading-text">Loading categories…</p></div>
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
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <path d="M3 9h18M9 21V9" />
                            </svg>
                        </div>
                        <h3>{search ? "No categories match your search." : "No categories yet."}</h3>
                        {!search && <button className="pm-add-btn" onClick={openCreate}>Add First Category</button>}
                    </div>
                </div>
            ) : (
                <div className="pm-table-wrap">
                    <table className="pm-table">
                        <thead>
                            <tr>
                                <th className="pm-th">#</th>
                                <th className="pm-th">Category Name</th>
                                <th className="pm-th">Created Date</th>
                                <th className="pm-th pm-th--right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((c, i) => (
                                <tr key={c._id} className="pm-tr">
                                    <td className="pm-td pm-td--num">{i + 1}</td>
                                    <td className="pm-td">
                                        <div className="pm-product-name">{c.name}</div>
                                    </td>
                                    <td className="pm-td">
                                        <span className="pm-badge">
                                            {new Date(c.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                        </span>
                                    </td>
                                    <td className="pm-td pm-td--right">
                                        <div className="pm-actions">
                                            <button className="pm-action-btn pm-action-btn--edit" onClick={() => openEdit(c)} title="Edit">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                </svg>
                                            </button>
                                            <button className="pm-action-btn pm-action-btn--delete" onClick={() => setDeleteTarget(c)} title="Delete">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                                    <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {modal && (
                <CategoryModal
                    mode={modal}
                    category={editTarget}
                    onClose={() => setModal(null)}
                    onSubmit={handleSubmit}
                    loading={submitting}
                    error={modalError}
                />
            )}
            {deleteTarget && (
                <DeleteConfirm
                    productName={`Category: ${deleteTarget.name}`}
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={handleDelete}
                    loading={deleting}
                />
            )}
            {toast && <div className={`pm-toast pm-toast--${toast.type}`}>{toast.msg}</div>}
        </AdminLayout>
    );
};

export default Categories;
