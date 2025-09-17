import React, { useState, useContext, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Wrapper from "../util/Wrapper";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";

// Optimized FormInput component without animations
const FormInput = React.memo(({ icon: Icon, error, ...props }) => {
  return (
    <div>
      <label
        htmlFor={props.name}
        className="block mb-2 text-sm font-medium text-neutral-200"
      >
        {props.label}
        <span className="ml-1 text-red-400">*</span>
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-4 pointer-events-none">
          <Icon
            className={`w-5 h-5 transition-colors duration-200 ${
              error
                ? "text-red-400"
                : "text-neutral-400 group-focus-within:text-blue-400"
            }`}
          />
        </div>
        <input
          {...props}
          className={`w-full pl-12 pr-4 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-neutral-400 
            focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 
            transition-all duration-200
            hover:border-white/20 hover:bg-white/10
            ${
              error
                ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                : ""
            }`}
        />
        {error && (
          <div className="absolute inset-0 border-2 opacity-50 pointer-events-none rounded-2xl border-red-400/50" />
        )}
      </div>
    </div>
  );
});

FormInput.displayName = "FormInput";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError("");
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!formData.email || !formData.password) {
        setError("Email and password are required.");
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/signin`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Login failed. Please check your credentials."
          );
        }

        login(data.data.token, data.data.user);
        navigate("/");
      } catch (err) {
        setError(err.message);
        console.error("Login Error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [formData, login, navigate]
  );

  return (
    <div className="relative min-h-screen text-white bg-background">
      <Header />

      {/* Simplified background with static gradients */}
      <div className="fixed inset-0 overflow-hidden opacity-50 pointer-events-none">
        <div className="absolute rounded-full top-20 left-20 w-72 h-72 bg-blue-500/5 blur-3xl"></div>
        <div className="absolute rounded-full bottom-20 right-20 w-96 h-96 bg-purple-500/5 blur-3xl"></div>
      </div>

      <Wrapper className="flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 border bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl border-white/10">
                <div className="flex items-center justify-center w-16 h-16 text-4xl">
                  🔐
                </div>
              </div>
            </div>

            <h1 className="mb-4 text-4xl font-black text-transparent md:text-5xl lg:text-6xl bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text">
              Welcome Back
            </h1>

            <p className="text-lg text-neutral-300">
              Sign in to access your INFOTREK'25 account
            </p>
          </div>

          {/* Form Container */}
          <div className="p-8 border shadow-2xl bg-gradient-to-br from-white/10 to-white/5 border-white/20 rounded-3xl md:p-10">
            {/* Error Message */}
            {error && (
              <div className="p-4 mb-6 text-red-300 transition-all duration-200 border rounded-2xl bg-red-500/10 border-red-500/30">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">❌</div>
                  <div>
                    <div className="font-semibold">Login Failed</div>
                    <div className="text-sm">{error}</div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <FormInput
                icon={FiMail}
                name="email"
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                error={error && !formData.email}
              />

              {/* Password Input */}
              <FormInput
                icon={FiLock}
                name="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                error={error && !formData.password}
              />

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-400 transition-colors duration-200 hover:text-blue-300"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-white text-lg transition-all duration-200 ${
                  isLoading
                    ? "bg-neutral-600 text-neutral-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02]"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    Sign In
                    <FiLogIn className="w-6 h-6" />
                  </div>
                )}
              </button>
            </form>

            {/* Footer Link */}
            <p className="mt-8 text-center text-neutral-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-blue-400 transition-colors duration-200 hover:text-blue-300"
              >
                Create Account
              </Link>
            </p>
          </div>

          {/* Additional Features */}
          <div className="mt-8 text-center">
            <div className="flex justify-center space-x-8 text-sm text-neutral-400">
              <Link
                to="/privacy"
                className="transition-colors duration-200 hover:text-blue-400"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="transition-colors duration-200 hover:text-blue-400"
              >
                Terms of Service
              </Link>
              <Link
                to="/help"
                className="transition-colors duration-200 hover:text-blue-400"
              >
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default LoginPage;
