"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check, X } from "lucide-react";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    age: "",
    password: "",
    confirmPassword: "",
    email: "",
    nativeLanguage: "",
    learningLanguage: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: ""
  });

  const validateUsername = (username) => {
    if (username.length < 3) return "Username must be at least 3 characters";
    if (username.length > 20) return "Username must be less than 20 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username can only contain letters, numbers, and underscores";
    return "";
  };

  const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) score++;
    else feedback.push("Use at least 8 characters");
    
    if (/[A-Z]/.test(password)) score++;
    else feedback.push("Add uppercase letters");
    
    if (/[0-9]/.test(password)) score++;
    else feedback.push("Add numbers");
    
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    else feedback.push("Add special characters");

    const strengthMap = {
      0: { text: "Very Weak", color: "text-red-500", bg: "bg-red-500", width: "25%" },
      1: { text: "Weak", color: "text-orange-500", bg: "bg-orange-500", width: "50%" },
      2: { text: "Fair", color: "text-yellow-500", bg: "bg-yellow-500", width: "75%" },
      3: { text: "Good", color: "text-green-500", bg: "bg-green-500", width: "100%" },
      4: { text: "Strong", color: "text-green-600", bg: "bg-green-600", width: "100%" }
    };

    return {
      score,
      strength: strengthMap[score],
      feedback: feedback.join(", ")
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "username") {
      const error = validateUsername(value);
      setErrors({ ...errors, username: error });
    }

    if (name === "password") {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors({ ...errors, confirmPassword: "Passwords do not match" });
      } else {
        setErrors({ ...errors, confirmPassword: "" });
      }
    }

    if (name === "confirmPassword") {
      if (value !== formData.password) {
        setErrors({ ...errors, confirmPassword: "Passwords do not match" });
      } else {
        setErrors({ ...errors, confirmPassword: "" });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const usernameError = validateUsername(formData.username);
    if (usernameError) {
      setErrors({ ...errors, username: usernameError });
      return;
    }

    if (passwordStrength.score < 2) {
      alert("Please use a stronger password");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors({ ...errors, confirmPassword: "Passwords do not match" });
      return;
    }

    if (!formData.age || formData.age < 13 || formData.age > 120) {
      alert("Please enter a valid age (13-120)");
      return;
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Success - redirect to login
    alert("Sign up successful! Please login.");
    router.push("/login");
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
            className="absolute -top-12 left-0 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            ← Back to Home
        </Link>
        <div className="glass-panel rounded-2xl p-8 border border-accent-primary/20">
          <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>
          <p className="text-textSecondary text-center mb-8">Start your language learning journey</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-2">Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-bg-secondary border border-accent-primary/20 focus:border-accent-primary focus:outline-none transition-colors"
                required
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-bg-secondary border border-accent-primary/20 focus:border-accent-primary focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium mb-2">Age *</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="13"
                max="120"
                className="w-full px-4 py-2 rounded-lg bg-bg-secondary border border-accent-primary/20 focus:border-accent-primary focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Native Language */}
            <div>
              <label className="block text-sm font-medium mb-2">Native Language</label>
              <select
                name="learningLanguage"
                value={formData.learningLanguage}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-bg-secondary text-textPrimary border border-accent-primary/20 focus:border-accent-primary focus:outline-none transition-colors">
                <option value="" className="bg-bg-secondary text-textPrimary">Select language to learn</option>
                <option value="es" className="bg-bg-secondary text-textPrimary">Spanish</option>
                <option value="fr" className="bg-bg-secondary text-textPrimary">French</option>
                <option value="de" className="bg-bg-secondary text-textPrimary">German</option>
                <option value="zh" className="bg-bg-secondary text-textPrimary">Chinese</option>
                <option value="ja" className="bg-bg-secondary text-textPrimary">Japanese</option>
                <option value="hi" className="bg-bg-secondary text-textPrimary">Hindi</option>
                <option value="ar" className="bg-bg-secondary text-textPrimary">Arabic</option>
            </select>
            </div>

            {/* Learning Language */}
            <div>
              <label className="block text-sm font-medium mb-2">Language to Learn</label>
              <select
                name="learningLanguage"
                value={formData.learningLanguage}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-bg-secondary border border-accent-primary/20 focus:border-accent-primary focus:outline-none transition-colors"
              >
                <option value="">Select language to learn</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
                <option value="hi">Hindi</option>
                <option value="ar">Arabic</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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
              
              {formData.password && (
                <div className="mt-2">
                  <div className="h-1 bg-bg-highlight rounded-full overflow-hidden">
                    <div className={`h-full ${passwordStrength.strength?.bg} transition-all duration-300`} style={{ width: passwordStrength.strength?.width }} />
                  </div>
                  <p className={`text-xs mt-1 ${passwordStrength.strength?.color}`}>
                    {passwordStrength.strength?.text}
                    {passwordStrength.feedback && ` - ${passwordStrength.feedback}`}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-bg-secondary border border-accent-primary/20 focus:border-accent-primary focus:outline-none transition-colors"
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 mt-6">
              Sign Up
            </button>
          </form>

          <p className="text-textSecondary text-center mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-accent-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}