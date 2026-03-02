import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import Login from "./pages/Login";
import Products from "./pages/Products";
import COAs from "./pages/COAs";
import Batches from "./pages/Batches";
import "./index.css";

// Dashboard placeholder
const Dashboard = () => {
  const { admin } = useAuth();
  return (
    <AdminLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", padding: "1rem 0" }}>
        <div>
          <h2 style={{ fontFamily: "Outfit,sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#fff", margin: "0 0 0.35rem" }}>
            👋 Welcome back, {admin?.name || "Admin"}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", margin: 0, fontSize: "0.9rem" }}>
            What would you like to manage today?
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {[
            { to: "/products", label: "Manage Products", icon: "📦" },
            { to: "/batches", label: "Manage Batches", icon: "🧪" },
          ].map(({ to, label, icon }) => (
            <Link key={to} to={to} style={{
              display: "flex", alignItems: "center", gap: "0.65rem",
              padding: "1rem 1.5rem",
              background: "rgba(0,201,255,0.07)",
              border: "1px solid rgba(0,201,255,0.18)",
              borderRadius: "14px",
              color: "#00c9ff", fontWeight: 600, textDecoration: "none",
              fontSize: "0.95rem", transition: "background 0.2s, transform 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,201,255,0.14)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,201,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <span style={{ fontSize: "1.3rem" }}>{icon}</span>
              {label} →
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

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
