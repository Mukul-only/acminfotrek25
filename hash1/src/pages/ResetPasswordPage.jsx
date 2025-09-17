import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Wrapper from "../util/Wrapper";
import { FiLock, FiArrowLeft, FiCheck } from "react-icons/fi";

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

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError(
        "Invalid or missing reset token. Please request a new password reset."
      );
    }
  }, [token]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError("");
  }, []);

  const validateForm = () => {
    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Both password fields are required.");
      return false;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token,
              newPassword: formData.newPassword,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to reset password.");
        }

        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (err) {
        setError(err.message);
        console.error("Reset Password Error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [formData, token, navigate, validateForm]
  );

  if (success) {
    return (
      <div className="relative min-h-screen text-white bg-background">
        <Header />
        <Wrapper className="flex items-center justify-center min-h-screen px-4 py-12">
          <div className="w-full max-w-md text-center">
            <div className="p-8 border shadow-2xl bg-gradient-to-br from-white/10 to-white/5 border-white/20 rounded-3xl">
              <div className="flex justify-center mb-6">
                <div className="p-4 border bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-3xl border-white/10">
                  <FiCheck className="w-16 h-16 text-green-400" />
                </div>
              </div>

              <h1 className="mb-4 text-3xl font-bold text-white">
                Password Reset Successful!
              </h1>

              <p className="mb-6 text-neutral-300">
                Your password has been updated successfully. You will be
                redirected to the login page in a few seconds.
              </p>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-200 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105"
              >
                Go to Login
                <FiArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          </div>
        </Wrapper>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white bg-background">
      <Header />

      {/* Background */}
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
              Reset Password
            </h1>

            <p className="text-lg text-neutral-300">
              Create a new password for your account
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
                    <div className="font-semibold">Error</div>
                    <div className="text-sm">{error}</div>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Input */}
              <FormInput
                icon={FiLock}
                name="newPassword"
                type="password"
                label="New Password"
                placeholder="••••••••"
                value={formData.newPassword}
                onChange={handleChange}
                required
                error={error && !formData.newPassword}
              />

              {/* Confirm Password Input */}
              <FormInput
                icon={FiLock}
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                error={error && !formData.confirmPassword}
              />

              {/* Password Requirements */}
              <div className="p-4 border rounded-2xl bg-blue-500/10 border-blue-500/30">
                <p className="text-sm text-blue-300">
                  Password must be at least 6 characters long
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !token}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-white text-lg transition-all duration-200 ${
                  isLoading || !token
                    ? "bg-neutral-600 text-neutral-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02]"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
                    Resetting Password...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    Reset Password
                    <FiCheck className="w-6 h-6" />
                  </div>
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-8 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 font-semibold text-blue-400 transition-colors duration-200 hover:text-blue-300"
              >
                <FiArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default ResetPasswordPage;
