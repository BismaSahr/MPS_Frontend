import { useLocation } from "react-router-dom";
import "./Topbar.css";

const PAGE_TITLES = {
    "/dashboard": { title: "Dashboard", subtitle: "Overview & quick stats" },
    "/products": { title: "Products", subtitle: "Manage your product catalog" },
    "/batches": { title: "Batches", subtitle: "Track production batches" },
};

const Topbar = ({ actions, onMenuClick }) => {
    const { pathname } = useLocation();
    const meta = PAGE_TITLES[pathname] || { title: "Admin", subtitle: "" };

    return (
        <header className="topbar">
            <div className="topbar-left">
                <button className="topbar-toggle" onClick={onMenuClick} title="Open Menu">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
                <div className="topbar-info">
                    <h1 className="topbar-title">{meta.title}</h1>
                    {meta.subtitle && <p className="topbar-subtitle">{meta.subtitle}</p>}
                </div>
            </div>
            {actions && <div className="topbar-actions">{actions}</div>}
        </header>
    );
};

export default Topbar;
