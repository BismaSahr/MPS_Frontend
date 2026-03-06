import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import Login from "./pages/Login";
import Products from "./pages/Products";
import COAs from "./pages/COAs";
import QRCodes from "./pages/QRCodes";
import Batches from "./pages/Batches";
import Categories from "./pages/Categories";
import Dashboard from "./pages/Dashboard";
import "./index.css";



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
          <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
