import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import "./Sidebar.css";

const NAV_ITEMS = [
    {
        to: "/dashboard",
        label: "Dashboard",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        ),
    },
    {
        to: "/products",
        label: "Products",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 00-1-1.73L13 2.27a2 2 0 00-2 0L4 6.27A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
        ),
    },
    {
        to: "/categories",
        label: "Categories",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
            </svg>
        ),
    },
    {
        to: "/batches",
        label: "Batches",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
        ),
    },
    {
        to: "/coas",
        label: "COA Docs",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
            </svg>
        ),
    },
    {
        to: "/qrcodes",
        label: "QR Management",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="7" y="7" width="3" height="3" />
                <rect x="14" y="7" width="3" height="3" />
                <rect x="7" y="14" width="3" height="3" />
            </svg>
        ),
    },
];

const Sidebar = () => {
    const { logout, admin } = useAuth();

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <img src={logo} alt="Miami Pro Science" />
            </div>

            {/* Nav label */}
            <span className="sidebar-section-label">Main Menu</span>

            {/* Nav items */}
            <nav className="sidebar-nav">
                {NAV_ITEMS.map(({ to, label, icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `sidebar-nav-item${isActive ? " sidebar-nav-item--active" : ""}`
                        }
                    >
                        <span className="sidebar-nav-icon">{icon}</span>
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="sidebar-avatar">
                        {(admin?.name || admin?.email || "A")[0].toUpperCase()}
                    </div>
                    <div className="sidebar-user-text">
                        <span className="sidebar-user-name">{admin?.name || "Admin"}</span>
                        <span className="sidebar-user-role">{admin?.role || "admin"}</span>
                    </div>
                </div>
                <button className="sidebar-logout" onClick={logout} title="Sign out">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
