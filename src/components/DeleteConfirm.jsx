import "./DeleteConfirm.css";

const DeleteConfirm = ({ productName, onCancel, onConfirm, loading }) => {
    return (
        <div className="dc-backdrop">
            <div className="dc-panel" role="alertdialog" aria-modal="true">
                <div className="dc-icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                    </svg>
                </div>
                <h3 className="dc-title">Do you really want to delete?</h3>
                <p className="dc-message">
                    This will permanently delete <span className="dc-name">"{productName}"</span>. This action cannot be undone.
                </p>
                <div className="dc-actions">
                    <button className="btn-ghost" onClick={onCancel} disabled={loading}>
                        Cancel
                    </button>
                    <button className="btn-danger" onClick={onConfirm} disabled={loading} id="confirm-delete-btn">
                        {loading ? <span className="btn-spinner" /> : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirm;
