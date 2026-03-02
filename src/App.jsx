import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import "./index.css";

// Placeholder Dashboard — replace with your real dashboard component later
const Dashboard = () => {
  const { logout, admin } = useAuth();
  return (
    <div style={{
      minHeight: "100vh",
      background: "#060e1f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "1.5rem",
      fontFamily: "Inter, sans-serif",
      color: "#e8f4ff"
    }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>✅ Dashboard</h1>
      <p style={{ color: "rgba(255,255,255,0.5)" }}>
        Welcome{admin?.name ? `, ${admin.name}` : ""}! You are authenticated.
      </p>
      <button
        onClick={logout}
        style={{
          padding: "0.75rem 2rem",
          background: "linear-gradient(135deg, #0d47a1, #00c9ff)",
          border: "none",
          borderRadius: "12px",
          color: "#fff",
          fontWeight: 600,
          cursor: "pointer",
          fontSize: "0.95rem"
        }}
      >
        Sign Out
      </button>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Catch-all → login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
