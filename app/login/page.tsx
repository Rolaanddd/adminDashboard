"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your login logic here
    console.log("Login:", { username, password });
    // Navigate to dashboard after successful login
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0A0E27] via-[#1a1f3a] to-[#2a3f6f] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Login to your account
        </h1>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="balaniaa@gmail.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#2196F3] text-white py-3 rounded-lg font-medium hover:bg-[#1976D2] transition-colors"
          >
            Login now
          </button>
        </form>
      </div>
    </div>
  );
}
