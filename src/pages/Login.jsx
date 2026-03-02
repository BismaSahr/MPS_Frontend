import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginAdmin } from "../api/auth";
import logo from "../assets/logo.png";
import "./Login.css";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const errs = {};
        if (!form.email.trim()) {
            errs.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errs.email = "Please enter a valid email address.";
        }
        if (!form.password) {
            errs.password = "Password is required.";
        } else if (form.password.length < 6) {
            errs.password = "Password must be at least 6 characters.";
        }
        return errs;
    };

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
        setApiError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        setLoading(true);
        try {
            const data = await loginAdmin(form);
            login(data.token);
            navigate("/dashboard");
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Invalid credentials. Please try again.";
            setApiError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-bg">
            {/* Animated floating orbs */}
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
            <div className="orb orb-4" />

            {/* Particle grid overlay */}
            <div className="grid-overlay" />

            <div className="login-card-wrapper">
                <div className="login-card">
                    {/* Logo */}
                    <div className="login-logo-wrap">
                        <img src={logo} alt="Miami Pro Science" className="login-logo" />
                    </div>

                    <div className="login-header">
                        <h1 className="login-title">Admin Portal</h1>
                        <p className="login-subtitle">Miami Pro Science — Secure Access</p>
                    </div>

                    {apiError && (
                        <div className="alert-error" role="alert">
                            <span className="alert-icon">⚠</span>
                            {apiError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="login-form" noValidate>
                        {/* Email Field */}
                        <div className={`field-group ${errors.email ? "has-error" : ""}`}>
                            <label htmlFor="email" className="field-label">
                                Email Address
                            </label>
                            <div className="field-input-wrap">
                                <span className="field-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="admin@miamiproscience.com"
                                    className="field-input"
                                    autoComplete="email"
                                />
                            </div>
                            {errors.email && <span className="field-error">{errors.email}</span>}
                        </div>

                        {/* Password Field */}
                        <div className={`field-group ${errors.password ? "has-error" : ""}`}>
                            <label htmlFor="password" className="field-label">
                                Password
                            </label>
                            <div className="field-input-wrap">
                                <span className="field-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0110 0v4" />
                                    </svg>
                                </span>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="field-input"
                                    autoComplete="current-password"
                                />
                            </div>
                            {errors.password && <span className="field-error">{errors.password}</span>}
                        </div>

                        <button
                            type="submit"
                            className="login-btn"
                            disabled={loading}
                            id="login-submit-btn"
                        >
                            {loading ? (
                                <span className="btn-spinner" />
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    {/* <div className="login-footer">
                        <span className="lock-icon">🔒</span>
                        Secured with JWT Authentication
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default Login;
