import { useEffect, useRef, useState } from "react";
import "./ProductModal.css";

const COAModal = ({ mode, form, setForm, batches, products, onClose, onSubmit, loading }) => {
    const firstRef = useRef(null);
    const [filePreview, setFilePreview] = useState(null);

    useEffect(() => {
        firstRef.current?.focus();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "file") {
            const file = files[0];
            setForm((p) => ({ ...p, file }));
            if (file) {
                // If image, show preview. If PDF, just show name.
                if (file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onloadend = () => setFilePreview(reader.result);
                    reader.readAsDataURL(file);
                } else {
                    setFilePreview(null);
                }
            }
        } else {
            setForm((p) => ({ ...p, [name]: value }));
        }
    };

    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdrop}>
            <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="coa-modal-title">
                {/* Header */}
                <div className="modal-header">
                    <div className="modal-header-left">
                        <div className="modal-icon-wrap">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                        </div>
                        <h2 id="coa-modal-title" className="modal-title">
                            {mode === "create" ? "Upload COA Document" : "Update Document"}
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
                    <form id="coa-form" onSubmit={onSubmit} className="product-form">
                        <div className="form-grid">
                            {/* Batch Selection */}
                            <div className="form-field form-field--full">
                                <label className="form-label">Associated Batch <span className="req">*</span></label>
                                <select
                                    ref={firstRef}
                                    name="batchId"
                                    value={form.batchId}
                                    onChange={handleChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="">— Select a batch —</option>
                                    {batches.map((b) => {
                                        const pName = products.find(p => p._id === (b.productId?._id || b.productId))?.name || b.productId?.name || "Unknown";
                                        return (
                                            <option key={b._id} value={b._id}>
                                                {b.batchNumber} ({pName})
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            {/* Lab Name */}
                            <div className="form-field">
                                <label className="form-label">Lab / Testing Agency</label>
                                <input
                                    type="text"
                                    name="labName"
                                    value={form.labName}
                                    onChange={handleChange}
                                    placeholder="e.g. Eurofins Lab"
                                    className="form-input"
                                />
                            </div>

                            {/* Purity */}
                            <div className="form-field">
                                <label className="form-label">Purity Level</label>
                                <input
                                    type="text"
                                    name="purity"
                                    value={form.purity}
                                    onChange={handleChange}
                                    placeholder="e.g. 99.8%"
                                    className="form-input"
                                />
                            </div>

                            {/* File Upload */}
                            <div className="form-field form-field--full">
                                <label className="form-label">COA File (PDF or Image) <span className="req">*</span></label>
                                <div className="image-manager">
                                    <div className="image-add-options" style={{ display: 'flex', gap: '1rem' }}>
                                        <label className="image-upload-box" style={{ width: '100%', height: '120px', flex: 1 }}>
                                            <input
                                                type="file"
                                                name="file"
                                                accept=".pdf,image/*"
                                                onChange={handleChange}
                                                required={mode === "create"}
                                            />
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                                <polyline points="17 8 12 3 7 8" />
                                                <line x1="12" y1="3" x2="12" y2="15" />
                                            </svg>
                                            <span>{form.file ? form.file.name : "Choose File..."}</span>
                                        </label>

                                        {filePreview && (
                                            <div className="image-preview-item" style={{ width: '120px' }}>
                                                <img src={filePreview} alt="File preview" />
                                            </div>
                                        )}
                                    </div>
                                    <span className="form-hint">Upload the original testing document. PDFs are recommended.</span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
                    <button type="submit" form="coa-form" className="btn-primary" disabled={loading}>
                        {loading ? (
                            <span className="btn-spinner" />
                        ) : mode === "create" ? (
                            <>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="btn-icon">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                Upload Document
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

export default COAModal;
