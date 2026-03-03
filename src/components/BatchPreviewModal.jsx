import React from "react";
import "./BatchPreviewModal.css";

const BatchPreviewModal = ({ batch, onClose }) => {
    if (!batch) return null;

    const formatDate = (d) => {
        if (!d) return "—";
        return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    };

    const isExpired = (d) => d && new Date(d) < new Date();
    const isExpiringSoon = (d) => {
        if (!d) return false;
        const diff = new Date(d) - new Date();
        return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
    };

    const expired = isExpired(batch.expiryDate);
    const expiringSoon = isExpiringSoon(batch.expiryDate);

    return (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-panel batch-preview-panel">
                <div className="modal-header">
                    <div className="modal-header-left">
                        <div className="modal-icon-wrap" style={{ background: '#fef3c7', color: '#d97706' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                            </svg>
                        </div>
                        <h2 className="modal-title">Batch Details</h2>
                    </div>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body batch-preview-body">
                    <div className="batch-preview-grid">
                        <div className="info-group">
                            <label className="info-label">Batch Number</label>
                            <div className="info-value"><code className="pm-slug" style={{ fontSize: '1.2rem' }}>{batch.batchNumber}</code></div>
                        </div>

                        <div className="info-group">
                            <label className="info-label">Product</label>
                            <div className="info-value name-val">{batch.productId?.name || "Unknown Product"}</div>
                        </div>

                        <div className="info-grid-small">
                            <div className="info-group">
                                <label className="info-label">Total Quantity</label>
                                <div className="info-value"><span className="pm-badge">{batch.quantity} Units</span></div>
                            </div>
                            <div className="info-group">
                                <label className="info-label">Current Status</label>
                                <div className="info-value">
                                    {!batch.expiryDate ? (
                                        <span className="batch-status batch-status--none">No Expiry</span>
                                    ) : expired ? (
                                        <span className="batch-status batch-status--expired">Expired</span>
                                    ) : expiringSoon ? (
                                        <span className="batch-status batch-status--soon">Expiring Soon</span>
                                    ) : (
                                        <span className="batch-status batch-status--ok">Active / Safe</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <hr className="preview-divider" />

                        <div className="info-grid-small">
                            <div className="info-group">
                                <label className="info-label">Manufacture Date</label>
                                <div className="info-value">{formatDate(batch.manufactureDate)}</div>
                            </div>
                            <div className="info-group">
                                <label className="info-label">Expiry Date</label>
                                <div className="info-value">
                                    <span className={expired ? "batch-date batch-date--expired" : expiringSoon ? "batch-date batch-date--soon" : ""}>
                                        {formatDate(batch.expiryDate)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-primary" onClick={onClose}>Done</button>
                </div>
            </div>
        </div>
    );
};

export default BatchPreviewModal;
