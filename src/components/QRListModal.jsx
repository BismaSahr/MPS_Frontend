import React from "react";
import "./QRListModal.css";

const QRListModal = ({ batch, qrs, onClose, onExport, loadingExport }) => {
    if (!batch) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-panel qr-list-panel" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">Batch QR Codes</h2>
                        <p className="modal-subtitle">
                            {batch.productId?.name} — Batch: {batch.batchNumber}
                        </p>
                    </div>
                    <div className="modal-header-actions">
                        <button
                            className="pm-add-btn pm-add-btn--export"
                            onClick={() => onExport(batch)}
                            disabled={loadingExport}
                        >
                            {loadingExport ? (
                                <div className="btn-spinner" />
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                            )}
                            Export CSV
                        </button>
                        <button className="modal-close" onClick={onClose}>&times;</button>
                    </div>
                </div>

                <div className="modal-body">
                    <div className="pm-table-wrap">
                        <table className="pm-table">
                            <thead>
                                <tr>
                                    <th className="pm-th">#</th>
                                    <th className="pm-th">QR String</th>
                                    <th className="pm-th">Status</th>
                                    <th className="pm-th pm-th--right">Scans</th>
                                </tr>
                            </thead>
                            <tbody>
                                {qrs.map((q, i) => (
                                    <tr key={q._id} className="pm-tr">
                                        <td className="pm-td pm-td--num">{i + 1}</td>
                                        <td className="pm-td">
                                            <code className="pm-code">{q.qrCode}</code>
                                        </td>
                                        <td className="pm-td">
                                            <span className={`pm-status pm-status--${q.status === 'unused' ? 'active' : 'expired'}`}>
                                                {q.status}
                                            </span>
                                        </td>
                                        <td className="pm-td pm-td--right">
                                            <span className="pm-badge">{q.scanCount || 0}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRListModal;
