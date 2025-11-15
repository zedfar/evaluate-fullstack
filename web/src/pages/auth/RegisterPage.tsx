import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, UserPlus, Loader2 } from "lucide-react";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        username: "",
        full_name: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({
        email: "",
        username: "",
        full_name: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        // Clear error when user types
        if (errors[name as keyof typeof errors]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {
            email: "",
            username: "",
            full_name: "",
            password: "",
            confirmPassword: "",
        };

        let isValid = true;

        // Email validation
        if (!form.email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.email)) {
                newErrors.email = "Please enter a valid email address";
                isValid = false;
            }
        }

        // Username validation
        if (!form.username.trim()) {
            newErrors.username = "Username is required";
            isValid = false;
        } else if (form.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
            isValid = false;
        } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
            newErrors.username = "Username can only contain letters, numbers, and underscores";
            isValid = false;
        }

        // Full name validation
        if (!form.full_name.trim()) {
            newErrors.full_name = "Full name is required";
            isValid = false;
        } else if (form.full_name.trim().length < 3) {
            newErrors.full_name = "Full name must be at least 3 characters";
            isValid = false;
        }

        // Password validation
        if (!form.password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (form.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        // Confirm password validation
        if (!form.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
            isValid = false;
        } else if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        setLoading(true);

        try {
            // Register via authService
            const response = await authService.register({
                email: form.email,
                username: form.username,
                full_name: form.full_name,
                password: form.password,
            });

            const user = response.metadata;
            const roleName = user?.role?.name;

            toast.success(`Welcome, ${user.full_name || user.username}!`);

            // Navigate berdasarkan role
            navigate(roleName === "admin" ? "/admin/dashboard" : "/home");
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || "Registration failed";
            toast.error(errorMessage);
            console.error("Registration error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-10"
                style={{
                    backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBolW05KuiQUudy1GrmMmLs9JyPT9wB_vGSYwHRn11osVC2Pcs45k97SqNjnxmJ89BY83SJuMPojhGM8OgFx6mYV55K6IrMWXtVdeCnw33KG0i5TNbaso24umSZBrqqMNnZqO-YBkdag7qwuShaXq8cXgNrObScW952Dge4FgQZZa49ZELhud-ikBZSvL_xFjiNR0mvcUOKIfWjUn2yhrCulaoYUYead3MZBmyMudTd1TaNFLxoC-GVuDkw1UCZei4SDH9jV1egZ4U")',
                }}
            />

            {/* Content */}
            <div className="relative z-20 flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8">
                <div className="w-full max-w-md">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 sm:p-10 space-y-6 border border-slate-200 dark:border-slate-700"
                    >
                        {/* Logo & Title */}
                        <div className="text-center space-y-2">
                            <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-400 dark:to-amber-600 bg-clip-text text-transparent">
                                LOQO
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">
                                Create your account
                            </p>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4">
                            {/* Email */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    className={`w-full px-4 py-3 rounded-lg border ${
                                        errors.email
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-slate-300 dark:border-slate-600 focus:ring-amber-500 dark:focus:ring-amber-600"
                                    } bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                                    disabled={loading}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                                )}
                            </div>

                            {/* Username */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                                >
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={form.username}
                                    onChange={handleChange}
                                    placeholder="Choose a username"
                                    autoComplete="username"
                                    className={`w-full px-4 py-3 rounded-lg border ${
                                        errors.username
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-slate-300 dark:border-slate-600 focus:ring-amber-500 dark:focus:ring-amber-600"
                                    } bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                                    disabled={loading}
                                />
                                {errors.username && (
                                    <p className="text-sm text-red-600 dark:text-red-400">{errors.username}</p>
                                )}
                            </div>

                            {/* Full Name */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="full_name"
                                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                                >
                                    Full Name
                                </label>
                                <input
                                    id="full_name"
                                    name="full_name"
                                    type="text"
                                    value={form.full_name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    autoComplete="name"
                                    className={`w-full px-4 py-3 rounded-lg border ${
                                        errors.full_name
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-slate-300 dark:border-slate-600 focus:ring-amber-500 dark:focus:ring-amber-600"
                                    } bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                                    disabled={loading}
                                />
                                {errors.full_name && (
                                    <p className="text-sm text-red-600 dark:text-red-400">{errors.full_name}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="Create a password (min. 6 characters)"
                                        autoComplete="new-password"
                                        className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                                            errors.password
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-slate-300 dark:border-slate-600 focus:ring-amber-500 dark:focus:ring-amber-600"
                                        } bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
                                        disabled={loading}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                                >
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        autoComplete="new-password"
                                        className={`w-full px-4 py-3 pr-12 rounded-lg border ${
                                            errors.confirmPassword
                                                ? "border-red-500 focus:ring-red-500"
                                                : "border-slate-300 dark:border-slate-600 focus:ring-amber-500 dark:focus:ring-amber-600"
                                        } bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
                                        disabled={loading}
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 dark:from-amber-500 dark:to-amber-600 dark:hover:from-amber-600 dark:hover:to-amber-700 text-white font-semibold shadow-lg shadow-amber-500/30 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Creating account...</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    <span>Create Account</span>
                                </>
                            )}
                        </button>

                        {/* Link to Login */}
                        <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 font-semibold transition-colors"
                                disabled={loading}
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
