"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Admin credentials check
    if (formData.username === "admin" && formData.password === "admin123") {
      alert("Login successful!");
      router.push("/dashboard");
    } else {
      setError("Invalid username or password. For demo, use: admin / admin123");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-stars overflow-hidden">
      <img 
        src="/hero_blob.png" 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-screen pointer-events-none" 
      />
      <div className="max-w-md w-full relative z-10">
        <Link
          href="/"
          className="absolute -top-12 left-0 flex items-center gap-2 text-textSecondary hover:text-accent-primary transition-colors">
          ← Back to Home
        </Link>
        <div className="glass-panel rounded-2xl p-8 border border-accent-primary/20">
          <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
          <p className="text-textSecondary text-center mb-8">Login to continue learning</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="admin"
                className="w-full px-4 py-2 rounded-lg bg-bg-secondary border border-accent-primary/20 focus:border-accent-primary focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="admin123"
                  className="w-full px-4 py-2 rounded-lg bg-bg-secondary border border-accent-primary/20 focus:border-accent-primary focus:outline-none transition-colors pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit" className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 mt-6">
              Login
            </button>
          </form>

          <p className="text-textSecondary text-center mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-accent-primary hover:underline">
              Sign Up
            </Link>
          </p>

          <div className="mt-4 pt-4 border-t border-accent-primary/20">
            <p className="text-textSecondary text-xs text-center">
              Demo Credentials: admin / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}