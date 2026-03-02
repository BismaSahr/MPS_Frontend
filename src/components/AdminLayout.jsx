import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./AdminLayout.css";

const AdminLayout = ({ children, topbarActions }) => {
    return (
        <div className="admin-layout">
            <Sidebar />
            <div className="admin-body">
                <Topbar actions={topbarActions} />
                <main className="admin-content">{children}</main>
            </div>
        </div>
    );
};

export default AdminLayout;
