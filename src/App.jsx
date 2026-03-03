import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import Login from "./pages/Login";
import Products from "./pages/Products";
import COAs from "./pages/COAs";
import QRCodes from "./pages/QRCodes";
import Batches from "./pages/Batches";
import "./index.css";

// Dashboard placeholder
const Dashboard = () => {
  const { admin } = useAuth();
  return (
    <AdminLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", padding: "1rem 0" }}>
        <div>
          <h2 style={{ fontFamily: "Outfit,sans-serif", fontSize: "1.75rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.5rem" }}>
            👋 Welcome back, {admin?.name || "Admin"}
          </h2>
          <p style={{ color: "#64748b", margin: 0, fontSize: "1rem", fontWeight: 500 }}>
            Management Portal — Miami Pro Science
          </p>
        </div>
        <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
          {[
            { to: "/products", label: "Manage Products", icon: "📦" },
            { to: "/batches", label: "Manage Batches", icon: "🧪" },
          ].map(({ to, label, icon }) => (
            <Link key={to} to={to} style={{
              display: "flex", alignItems: "center", gap: "1rem",
              padding: "1.25rem 1.75rem",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              color: "#2b5a9e", fontWeight: 600, textDecoration: "none",
              fontSize: "1rem", transition: "all 0.2s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#2b5a9e";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(43, 90, 158, 0.1)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
              }}
            >
              <div style={{
                width: "40px", height: "40px", borderRadius: "10px",
                background: "#eff6ff", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "1.5rem"
              }}>{icon}</div>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* Protected administrative routes */}
          <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/batches" element={<ProtectedRoute><Batches /></ProtectedRoute>} />
          <Route path="/coas" element={<ProtectedRoute><COAs /></ProtectedRoute>} />
          <Route path="/qrcodes" element={<ProtectedRoute><QRCodes /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
