"use client";

import { useState } from "react";
import { Mail, Lock, User, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear field-specific error when user starts typing
        if (fieldErrors[e.target.name]) {
            setFieldErrors({ ...fieldErrors, [e.target.name]: undefined });
        }
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setFieldErrors({});

        // Client-side validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    // Handle field-specific validation errors
                    setFieldErrors(data.errors);
                    setError("Please fix the errors below");
                } else {
                    setError(data.message || "Signup failed");
                }
                setIsLoading(false);
                return;
            }

            if (data.success) {
                // Redirect to dashboard after successful signup
                router.push("/dashboard");
            } else {
                setError(data.message || "Signup failed");
            }
        } catch (err) {
            setError("Network error. Please try again.");
            console.error("Signup error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#2a2a2a] via-[#1e1e1e] to-[#151515] font-sans relative overflow-hidden">
            {/* Background effects matching sidebar */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.08)_0%,transparent_40%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.04)_0%,transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />

            {/* Subtle noise texture */}
            <div
                className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}
            />

            <main className="relative z-10 w-full max-w-md px-8 py-12">
                {/* Card with glossy effect */}
                <div className="bg-gradient-to-b from-[#2d2d2d] via-[#252525] to-[#1f1f1f] border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] p-8 backdrop-blur-sm">
                    <div className="text-center mb-1">
                        <h1 className="text-2xl font-semibold text-white mb-2">
                            Sign Up
                        </h1>
                        <p className="text-base text-white/60">
                            Create your new account
                        </p>
                    </div>

                    <div className="space-y-5">
                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className={`w-full h-12 pl-12 pr-4 rounded-xl bg-gradient-to-b from-[#1a1a1a] to-[#151515] border ${fieldErrors.name ? 'border-red-500/50' : 'border-white/10'
                                        } text-white placeholder:text-white/30 transition-all focus:outline-none focus:border-white/30 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.05)] disabled:opacity-50 disabled:cursor-not-allowed`}
                                    placeholder="Enter your full name"
                                />
                            </div>
                            {fieldErrors.name && (
                                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {fieldErrors.name[0]}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className={`w-full h-12 pl-12 pr-4 rounded-xl bg-gradient-to-b from-[#1a1a1a] to-[#151515] border ${fieldErrors.email ? 'border-red-500/50' : 'border-white/10'
                                        } text-white placeholder:text-white/30 transition-all focus:outline-none focus:border-white/30 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.05)] disabled:opacity-50 disabled:cursor-not-allowed`}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            {fieldErrors.email && (
                                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {fieldErrors.email[0]}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className={`w-full h-12 pl-12 pr-4 rounded-xl bg-gradient-to-b from-[#1a1a1a] to-[#151515] border ${fieldErrors.password ? 'border-red-500/50' : 'border-white/10'
                                        } text-white placeholder:text-white/30 transition-all focus:outline-none focus:border-white/30 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.05)] disabled:opacity-50 disabled:cursor-not-allowed`}
                                    placeholder="Create a password"
                                    required
                                />
                            </div>
                            {fieldErrors.password && (
                                <div className="mt-1.5 space-y-1">
                                    {fieldErrors.password.map((err, idx) => (
                                        <p key={idx} className="text-xs text-red-400 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {err}
                                        </p>
                                    ))}
                                </div>
                            )}
                            {!fieldErrors.password && (
                                <p className="mt-1.5 text-xs text-white/40">
                                    Must be 8+ characters with uppercase, lowercase, number & special character
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-gradient-to-b from-[#1a1a1a] to-[#151515] border border-white/10 text-white placeholder:text-white/30 transition-all focus:outline-none focus:border-white/30 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.05)] disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Confirm your password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full h-12 rounded-xl bg-gradient-to-b from-[#404040] via-[#353535] to-[#2a2a2a] border border-white/15 text-white font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:from-[#454545] hover:via-[#3a3a3a] hover:to-[#2f2f2f] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[#404040] disabled:hover:via-[#353535] disabled:hover:to-[#2a2a2a] disabled:active:scale-100 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </button>
                    </div>

                    <div className="mt-1 text-center">
                        <p className="text-sm text-white/60">
                            Already have an account?{" "}
                            <a href="/login" className="font-medium text-white hover:text-white/80 transition-colors">
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}