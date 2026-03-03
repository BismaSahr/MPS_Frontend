import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./AdminLayout.css";

const AdminLayout = ({ children, topbarActions }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="admin-layout">
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            {/* Mobile Backdrop */}
            {isSidebarOpen && <div className="mobile-backdrop" onClick={closeSidebar}></div>}

            <div className="admin-body">
                <Topbar actions={topbarActions} onMenuClick={toggleSidebar} />
                <main className="admin-content">{children}</main>
            </div>
        </div>
    );
};

export default AdminLayout;
