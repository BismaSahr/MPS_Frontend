import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./AdminLayout.css";

const AdminLayout = ({ children, topbarActions }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="admin-layout">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
            )}

            <div className="admin-body">
                <Topbar
                    actions={topbarActions}
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <main className="admin-content">{children}</main>
            </div>
        </div>
    );
};

export default AdminLayout;
