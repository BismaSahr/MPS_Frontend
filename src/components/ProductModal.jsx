import { useEffect, useRef, useState } from "react";
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
    const [errors, setErrors] = useState({});

    // Focus first field on open
    useEffect(() => {
        firstRef.current?.focus();
        setErrors({});
    }, [mode, product]);

    const validate = () => {
        const newErrors = {};
        if (!form.name?.trim()) newErrors.name = "Product name is required";
        if (!form.slug?.trim()) {
            newErrors.slug = "Slug is required";
        } else if (!/^[a-z0-9-]+$/.test(form.slug)) {
            newErrors.slug = "Slug can only contain lowercase letters, numbers, and hyphens";
        }
        if (!form.images || form.images.length === 0) {
            newErrors.images = "At least one product image is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(e);
        }
    };

    // Auto-generate slug from name
    const handleNameChange = (e) => {
        const name = e.target.value;
        const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-");
        setForm((p) => ({ ...p, name, slug }));
        if (errors.name) setErrors(prev => ({ ...prev, name: "" }));
        if (errors.slug) setErrors(prev => ({ ...prev, slug: "" }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
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
                    <form id="product-form" onSubmit={handleFormSubmit} className="product-form" noValidate>
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
                                    className={`form-input ${errors.name ? "form-input--error" : ""}`}
                                />
                                {errors.name && <span className="error-text">{errors.name}</span>}
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
                                    className={`form-input ${errors.slug ? "form-input--error" : ""}`}
                                />
                                {errors.slug && <span className="error-text">{errors.slug}</span>}
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

                            {/* Images Management */}
                            <div className="form-field form-field--full">
                                <label className="form-label">Product Images</label>

                                <div className="image-manager">
                                    <div className="image-previews">
                                        {Array.isArray(form.images) && form.images.map((url, idx) => (
                                            <div key={idx} className="image-preview-item">
                                                <img src={url} alt={`Preview ${idx + 1}`} />
                                                <button
                                                    type="button"
                                                    className="image-remove-btn"
                                                    onClick={() => {
                                                        const next = [...form.images];
                                                        next.splice(idx, 1);
                                                        setForm(p => ({ ...p, images: next }));
                                                    }}
                                                >
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}

                                        <div className="image-add-options">
                                            <label className="image-upload-box" title="Upload local image">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={(e) => {
                                                        const files = Array.from(e.target.files);
                                                        files.forEach(file => {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setForm(p => ({
                                                                    ...p,
                                                                    images: [...p.images, reader.result]
                                                                }));
                                                            };
                                                            reader.readAsDataURL(file);
                                                        });
                                                        e.target.value = null;
                                                        if (errors.images) setErrors(prev => ({ ...prev, images: "" }));
                                                    }}
                                                />
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                                    <polyline points="17 8 12 3 7 8" />
                                                    <line x1="12" y1="3" x2="12" y2="15" />
                                                </svg>
                                                <span>Upload</span>
                                            </label>

                                            <button
                                                type="button"
                                                className="image-url-btn"
                                                title="Add image via URL"
                                                onClick={() => {
                                                    const url = prompt("Enter Image URL:");
                                                    if (url && url.trim()) {
                                                        setForm(p => ({ ...p, images: [...p.images, url.trim()] }));
                                                        if (errors.images) setErrors(prev => ({ ...prev, images: "" }));
                                                    }
                                                }}
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                                                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                                                </svg>
                                                <span>URL</span>
                                            </button>
                                        </div>
                                    </div>
                                    {errors.images && <span className="error-text">{errors.images}</span>}
                                    <span className="form-hint">JPG/PNG supported. For better performance, use optimized images.</span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn-ghost" onClick={onClose} disabled={loading}>
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
