import React, { useState } from "react";
import axiosApi from "../api/axiosConfig.jsx";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import BackgroundLayout from "../Layouts/BackgroundLayouts.jsx";

export default function ForgotPasswordPage({ darkMode }) {
    const [role, setRole] = useState("user");
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true); // start loading

        if (!email.trim()) {
            setLoading(false);
            return Swal.fire("Email Error", "Please enter your email.", "error");
        }
        if (!newPassword.trim()) {
            setLoading(false);
            return Swal.fire("Password Error", "Please enter a new password.", "error");
        }

        try {
            const endpoint =
                role === "chef" ? "/auth/chef/forgot-password" : "/auth/user/forgot-password";
            const res = await axiosApi.post(endpoint, { email, newPassword });

            Swal.fire({
                icon: "success",
                title: "Password Updated",
                text: res.data.message,
                confirmButtonText: "Go to Login",
            }).then(() => navigate("/login"));
        } catch (err) {
            const msg = err.response?.data?.message || "Something went wrong";
            Swal.fire("Error", msg, "error");
        } finally {
            setLoading(false); // stop loading always
        }
    };


    return (
        <>
            <BackgroundLayout darkMode={darkMode}>
                <h2 className="text-center mb-3">Forgot Password</h2>

                <form onSubmit={handleForgotPassword}>
                    <div className="mb-3 text-center">
                        <div className="form-check form-check-inline">
                            <input type="radio" id="user" className="form-check-input" value="user" checked={role === "user"} onChange={(e) => setRole(e.target.value)} />
                            <label className="form-check-label" htmlFor="user">User</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input type="radio" id="chef" className="form-check-input" value="chef" checked={role === "chef"} onChange={(e) => setRole(e.target.value)} />
                            <label className="form-check-label" htmlFor="chef">Chef</label>
                        </div>
                    </div>

                    <div className="mb-2">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" placeholder="mail@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="mb-3 position-relative">
                        <label className="form-label">New Password</label>
                        <input type={showPassword ? "text" : "password"} className="form-control" placeholder="**********" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        {/* Eye icon button */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="btn position-absolute top-50 end-0 translate-middle-y"
                            style={{
                                top: "50%",
                                right: "12px",
                                transform: "translateY(-50%)",
                                paddingRight: "10px",
                                paddingTop: "40px",
                                border: "none",
                                background: "transparent",
                                color: "#dc3545", // same as login button
                                fontSize: "1.2rem"
                            }}
                        >
                            <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-danger w-100"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>

                </form>

                <p className="mt-2 text-center">
                    Remembered your password? <Link to="/login">Login</Link>
                </p>
            </BackgroundLayout>
        </>
    );
}
