import { useEffect, useRef, useState } from "react";
import "./ProductModal.css";

const CategoryModal = ({ mode, category, onClose, onSubmit, loading, error }) => {
    const firstRef = useRef(null);
    const [name, setName] = useState(category?.name || "");
    const [validationError, setValidationError] = useState("");

    // Focus first field on open
    useEffect(() => {
        firstRef.current?.focus();
        setValidationError("");
        if (mode === "edit" && category) {
            setName(category.name);
        } else {
            setName("");
        }
    }, [mode, category]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setValidationError("");

        if (!name.trim()) {
            setValidationError("Category name is required");
            return;
        }

        onSubmit({ name: name.trim() });
    };

    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") onClose();
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdrop} onKeyDown={handleKeyDown} tabIndex={-1}>
            <div className="modal-panel" style={{ maxWidth: '400px' }} role="dialog" aria-modal="true">
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
                        <h2 className="modal-title">
                            {mode === "create" ? "Add New Category" : "Edit Category"}
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
                    {(error || validationError) && (
                        <div className="pm-error-state" style={{ padding: '0.75rem', marginBottom: '1.5rem', background: 'rgba(255, 27, 33, 0.1)' }}>
                            <p style={{ margin: 0, color: 'var(--primary)', fontSize: '0.9rem' }}>{error || validationError}</p>
                        </div>
                    )}
                    <form id="category-form" onSubmit={handleFormSubmit} noValidate>
                        <div className="form-field form-field--full">
                            <label className="form-label">Category Name <span className="req">*</span></label>
                            <input
                                ref={firstRef}
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setValidationError("");
                                }}
                                placeholder="e.g. Consumables"
                                className={`form-input ${(error || validationError) ? "form-input--error" : ""}`}
                            />
                        </div>
                    </form>
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn-ghost" onClick={onClose} disabled={loading}>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="category-form"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="btn-spinner" />
                        ) : mode === "create" ? (
                            "Create Category"
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryModal;
