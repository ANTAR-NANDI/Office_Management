import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { setToken, isAuthenticated } from "../../utils/auth";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated()) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            });
            
            setToken(response.data.token,response.data.employee.id);
            navigate("/dashboard");
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Login Failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-cyan-100 via-sky-50 to-teal-50 px-4 relative overflow-hidden">
            {/* Background Decorative Shapes */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse delay-700"></div>

            {/* Login Card */}
            <div className="w-full max-w-md bg-white/70 backdrop-blur-md border border-white/40 shadow-2xl p-8 rounded-3xl relative z-10">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2">
                        Office Management System
                    </h2>
                    <p className="text-slate-500 text-sm">
                        Login to Enter Dashboard
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Input */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                EMAIL ADDRESS
                            </label>
                            <a href="#forgot" className="text-xs font-medium text-cyan-600 hover:text-cyan-700 transition-colors">
                              
                            </a>
                        </div>
                        <div className="relative rounded-xl shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                required
                                placeholder="name@company.com"
                                className="w-full pl-10 pr-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 text-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Password
                            </label>
                            <a href="#forgot" className="text-xs font-medium text-cyan-600 hover:text-cyan-700 transition-colors">
                                Forgot Password?
                            </a>
                        </div>
                        <div className="relative rounded-xl shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 text-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-cyan-500/20 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <>
                                Sign In
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

               
            </div>

            {/* Copyright Note */}
            <p className="absolute bottom-6 text-xs text-slate-400 tracking-wide z-10">
                &copy; {new Date().getFullYear()} Office Management Inc. All rights reserved.
            </p>
        </div>
    );
}

export default Login;