import { useEffect, useRef } from "react";
import "./ProductModal.css"; /* reuse same modal base styles */
import "./BatchModal.css";

const EMPTY = {
    productId: "",
    batchNumber: "",
    manufactureDate: "",
    expiryDate: "",
};

const BatchModal = ({ mode, form, setForm, products, onClose, onSubmit, loading }) => {
    const firstRef = useRef(null);

    useEffect(() => { firstRef.current?.focus(); }, []);

    const handleChange = (e) => {
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

    return (
        <div className="modal-backdrop" onClick={handleBackdrop}>
            <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="batch-modal-title">
                {/* Header */}
                <div className="modal-header">
                    <div className="modal-header-left">
                        <div className="modal-icon-wrap">
                            {mode === "create" ? (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                            )}
                        </div>
                        <h2 id="batch-modal-title" className="modal-title">
                            {mode === "create" ? "New Batch" : "Edit Batch"}
                        </h2>
                    </div>
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="modal-body">
                    <form id="batch-form" onSubmit={onSubmit} className="product-form">
                        <div className="form-grid">

                            {/* Product */}
                            <div className="form-field form-field--full">
                                <label className="form-label">Product <span className="req">*</span></label>
                                <select
                                    ref={firstRef}
                                    name="productId"
                                    value={form.productId}
                                    onChange={handleChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="">— Select a product —</option>
                                    {products.map((p) => (
                                        <option key={p._id} value={p._id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Batch Number */}
                            <div className="form-field">
                                <label className="form-label">Batch Number <span className="req">*</span></label>
                                <input
                                    type="text"
                                    name="batchNumber"
                                    value={form.batchNumber}
                                    onChange={handleChange}
                                    placeholder="e.g. MPS-2024-001"
                                    className="form-input"
                                    required
                                />
                            </div>

                            {/* Quantity */}
                            <div className="form-field">
                                <label className="form-label">Quantity <span className="req">*</span></label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={form.quantity}
                                    onChange={handleChange}
                                    placeholder="e.g. 500"
                                    className="form-input"
                                    min="1"
                                    required
                                />
                            </div>

                            {/* Manufacture Date */}
                            <div className="form-field">
                                <label className="form-label">Manufacture Date</label>
                                <input
                                    type="date"
                                    name="manufactureDate"
                                    value={form.manufactureDate}
                                    onChange={handleChange}
                                    className="form-input form-input--date"
                                />
                            </div>

                            {/* Expiry Date */}
                            <div className="form-field">
                                <label className="form-label">Expiry Date</label>
                                <input
                                    type="date"
                                    name="expiryDate"
                                    value={form.expiryDate}
                                    onChange={handleChange}
                                    className="form-input form-input--date"
                                />
                            </div>

                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button className="btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
                    <button type="submit" form="batch-form" className="btn-primary" disabled={loading}>
                        {loading ? (
                            <span className="btn-spinner" />
                        ) : mode === "create" ? (
                            <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="btn-icon"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>Create Batch</>
                        ) : (
                            <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="btn-icon"><polyline points="20 6 9 17 4 12" /></svg>Save Changes</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BatchModal;
