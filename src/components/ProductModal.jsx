import { useEffect, useRef } from "react";
import "./ProductModal.css";

const EMPTY = {
    name: "",
    slug: "",
    description: "",
    storage: "",
    packaging: "",
    images: "",
};

const ProductModal = ({ mode, product, form, setForm, onClose, onSubmit, loading }) => {
    const firstRef = useRef(null);

    // Focus first field on open
    useEffect(() => {
        firstRef.current?.focus();
    }, []);

    // Auto-generate slug from name
    const handleNameChange = (e) => {
        const name = e.target.value;
        const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-");
        setForm((p) => ({ ...p, name, slug }));
    };

    const handleChange = (e) => {
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") onClose();
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdrop} onKeyDown={handleKeyDown} tabIndex={-1}>
            <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                {/* Header */}
                <div className="modal-header">
                    <div className="modal-header-left">
                        <div className="modal-icon-wrap">
                            {mode === "create" ? (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            )}
                        </div>
                        <h2 id="modal-title" className="modal-title">
                            {mode === "create" ? "Add New Product" : "Edit Product"}
                        </h2>
                    </div>
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="modal-body">
                    <form id="product-form" onSubmit={onSubmit} className="product-form">
                        <div className="form-grid">
                            {/* Name */}
                            <div className="form-field">
                                <label className="form-label">Product Name <span className="req">*</span></label>
                                <input
                                    ref={firstRef}
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleNameChange}
                                    placeholder="e.g. MPS Lab Reagent Pro"
                                    className="form-input"
                                    required
                                />
                            </div>

                            {/* Slug */}
                            <div className="form-field">
                                <label className="form-label">Slug <span className="req">*</span></label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={form.slug}
                                    onChange={handleChange}
                                    placeholder="e.g. mps-lab-reagent-pro"
                                    className="form-input"
                                    required
                                />
                                <span className="form-hint">Auto-generated from name, or customize</span>
                            </div>

                            {/* Storage */}
                            <div className="form-field">
                                <label className="form-label">Storage</label>
                                <input
                                    type="text"
                                    name="storage"
                                    value={form.storage}
                                    onChange={handleChange}
                                    placeholder="e.g. 2–8°C, dry place"
                                    className="form-input"
                                />
                            </div>

                            {/* Packaging */}
                            <div className="form-field">
                                <label className="form-label">Packaging</label>
                                <input
                                    type="text"
                                    name="packaging"
                                    value={form.packaging}
                                    onChange={handleChange}
                                    placeholder="e.g. 500ml glass bottle"
                                    className="form-input"
                                />
                            </div>

                            {/* Description */}
                            <div className="form-field form-field--full">
                                <label className="form-label">Description</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Enter a detailed product description..."
                                    className="form-textarea"
                                    rows={4}
                                />
                            </div>

                            {/* Images */}
                            <div className="form-field form-field--full">
                                <label className="form-label">Image URLs</label>
                                <textarea
                                    name="images"
                                    value={form.images}
                                    onChange={handleChange}
                                    placeholder="Enter image URLs, one per line&#10;https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                                    className="form-textarea"
                                    rows={3}
                                />
                                <span className="form-hint">One URL per line</span>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button className="btn-ghost" onClick={onClose} disabled={loading}>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="product-form"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="btn-spinner" />
                        ) : mode === "create" ? (
                            <>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="btn-icon">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                Create Product
                            </>
                        ) : (
                            <>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="btn-icon">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
