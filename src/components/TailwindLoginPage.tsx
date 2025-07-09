import React, { useState } from "react";
import { useLogin, useNotify } from "react-admin";
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

interface TailwindLoginPageProps {
  title?: string;
  subtitle?: string;
}

export const TailwindLoginPage: React.FC<TailwindLoginPageProps> = ({
  title = "Welcome Back",
  subtitle = "Sign in to your account to continue",
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const login = useLogin();
  const notify = useNotify();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ email, password });
    } catch (error) {
      notify("Invalid email or password", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-project-green-800 to-project-green-700 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full animate-float">
          <div className="absolute top-1/5 left-1/5 w-96 h-96 bg-project-green-800/30 rounded-full blur-3xl"></div>
          <div className="absolute top-4/5 right-1/5 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute top-2/5 left-2/5 w-80 h-80 bg-project-green-700/20 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl transition-all duration-300 hover:-translate-y-1">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-project-green-800 to-project-green-700 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
              <LockClosedIcon className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-project-green-800 to-project-green-700 bg-clip-text text-transparent mb-2">
              {title}
            </h1>
            <p className="text-project-green-400 text-base font-medium">
              {subtitle}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-project-green-800/10 focus:border-project-green-800 focus:bg-white hover:border-gray-300 hover:bg-white"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-project-green-800/10 focus:border-project-green-800 focus:bg-white hover:border-gray-300 hover:bg-white"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-project-green-800 transition-colors duration-200 hover:bg-project-green-800/5 rounded-lg"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-project-green-800 to-project-green-700 text-white font-semibold py-4 px-6 rounded-xl text-sm transition-all duration-200 hover:from-project-green-900 hover:to-project-green-800 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-3 focus:ring-project-green-800/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Forgot Password Link */}
            <div className="text-center">
              <a
                href="#"
                className="text-sm font-medium text-project-green-800 hover:text-project-green-900 transition-colors duration-200 hover:underline"
              >
                Forgot password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TailwindLoginPage;
