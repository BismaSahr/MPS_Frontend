import { useEffect, useRef, useState } from "react";
import "./ProductModal.css";

const QRGenerateModal = ({ batches, coas, onClose, onGenerate, loading }) => {
    const [selectedBatch, setSelectedBatch] = useState("");
    const [error, setError] = useState("");
    const firstRef = useRef(null);

    useEffect(() => {
        firstRef.current?.focus();
    }, []);

    const handleGenerate = (e) => {
        e.preventDefault();
        setError("");

        if (!selectedBatch) {
            setError("Please select a batch.");
            return;
        }

        // Check if batch has COA
        const hasCOA = coas.some(c => (c.batchId?._id || c.batchId) === selectedBatch);
        if (!hasCOA) {
            setError("This batch doesn't have an uploaded COA yet. Upload the COA first.");
            return;
        }

        onGenerate(selectedBatch);
    };

    return (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-panel" style={{ maxWidth: '450px' }}>
                <div className="modal-header">
                    <div className="modal-header-left">
                        <div className="modal-icon-wrap" style={{ background: '#eff6ff', color: 'var(--primary)' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                                <rect x="3" y="14" width="7" height="7" /><path d="M14 14h7v7h-7z" />
                            </svg>
                        </div>
                        <h2 className="modal-title">Generate QR Codes</h2>
                    </div>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    <p className="modal-desc" style={{ marginBottom: '1.5rem', color: '#64748b' }}>
                        This will generate a unique QR code for every single unit in the selected batch. Ensure the batch quantity is correct.
                    </p>

                    <form id="qr-gen-form" onSubmit={handleGenerate}>
                        <div className="form-field form-field--full">
                            <label className="form-label">Select Batch <span className="req">*</span></label>
                            <select
                                ref={firstRef}
                                value={selectedBatch}
                                onChange={(e) => { setSelectedBatch(e.target.value); setError(""); }}
                                className="form-select"
                                required
                            >
                                <option value="">— Select Batch —</option>
                                {batches.map(b => (
                                    <option key={b._id} value={b._id}>
                                        {b.batchNumber} ({b.productId?.name || "Unknown"}) — {b.quantity} units
                                    </option>
                                ))}
                            </select>
                            {error && <span className="field-error" style={{ display: 'block', marginTop: '0.5rem' }}>{error}</span>}
                        </div>
                    </form>
                </div>

                <div className="modal-footer">
                    <button className="btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
                    <button type="submit" form="qr-gen-form" className="btn-primary" disabled={loading}>
                        {loading ? <span className="btn-spinner" /> : "Generate Codes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QRGenerateModal;
