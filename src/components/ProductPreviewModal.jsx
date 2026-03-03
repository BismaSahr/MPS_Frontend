import React, { useState } from "react";
import "./ProductPreviewModal.css";

const ProductPreviewModal = ({ product, onClose }) => {
    const [selectedImg, setSelectedImg] = useState(product?.images?.[0] || "");

    if (!product) return null;

    return (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-panel product-preview-panel">
                <div className="modal-header">
                    <div className="modal-header-left">
                        <div className="modal-icon-wrap" style={{ background: '#eff6ff', color: 'var(--primary)' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                            </svg>
                        </div>
                        <h2 className="modal-title">Product Details</h2>
                    </div>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body product-preview-body">
                    <div className="product-preview-grid">
                        {/* Left: Images */}
                        <div className="product-preview-images">
                            <div className="main-image-wrap">
                                {selectedImg ? (
                                    <img src={selectedImg} alt={product.name} className="main-image" />
                                ) : (
                                    <div className="image-placeholderLarge">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            {product.images?.length > 1 && (
                                <div className="image-thumbnails">
                                    {product.images.map((img, i) => (
                                        <div
                                            key={i}
                                            className={`thumb-wrap ${selectedImg === img ? 'active' : ''}`}
                                            onClick={() => setSelectedImg(img)}
                                        >
                                            <img src={img} alt={`Thumb ${i}`} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Info */}
                        <div className="product-preview-info">
                            <div className="info-group">
                                <label className="info-label">Product Name</label>
                                <div className="info-value name-val">{product.name}</div>
                            </div>

                            <div className="info-group">
                                <label className="info-label">Slug / ID</label>
                                <div className="info-value"><code className="pm-slug">{product.slug}</code></div>
                            </div>

                            <div className="info-grid-small">
                                <div className="info-group">
                                    <label className="info-label">Storage</label>
                                    <div className="info-value">{product.storage || <span className="pm-muted">N/A</span>}</div>
                                </div>
                                <div className="info-group">
                                    <label className="info-label">Packaging</label>
                                    <div className="info-value">{product.packaging || <span className="pm-muted">N/A</span>}</div>
                                </div>
                            </div>

                            <div className="info-group">
                                <label className="info-label">Description</label>
                                <div className="info-value desc-val">{product.description || <span className="pm-muted">No description provided.</span>}</div>
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

export default ProductPreviewModal;
