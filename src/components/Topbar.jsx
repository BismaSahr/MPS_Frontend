import { useLocation } from "react-router-dom";
import "./Topbar.css";

const PAGE_TITLES = {
    "/dashboard": { title: "Dashboard", subtitle: "Overview & quick stats" },
    "/products": { title: "Products", subtitle: "Manage your product catalog" },
    "/batches": { title: "Batches", subtitle: "Track production batches" },
};

const Topbar = ({ actions }) => {
    const { pathname } = useLocation();
    const meta = PAGE_TITLES[pathname] || { title: "Admin", subtitle: "" };

    return (
        <header className="topbar">
            <div className="topbar-left">
                <h1 className="topbar-title">{meta.title}</h1>
                {meta.subtitle && <p className="topbar-subtitle">{meta.subtitle}</p>}
            </div>
            {actions && <div className="topbar-actions">{actions}</div>}
        </header>
    );
};

export default Topbar;
