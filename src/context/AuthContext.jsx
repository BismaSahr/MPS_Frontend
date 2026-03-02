import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem("mps_token"));
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check token expiry
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setAdmin(decoded);
                }
            } catch {
                logout();
            }
        }
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem("mps_token", newToken);
        setToken(newToken);
        try {
            setAdmin(jwtDecode(newToken));
        } catch {
            setAdmin(null);
        }
    };

    const logout = () => {
        localStorage.removeItem("mps_token");
        setToken(null);
        setAdmin(null);
    };

    return (
        <AuthContext.Provider value={{ token, admin, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
