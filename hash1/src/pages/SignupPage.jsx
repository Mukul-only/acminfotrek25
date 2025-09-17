import React, { useState, useCallback, useMemo } from "react";
import Header from "../components/Header";
import Wrapper from "../util/Wrapper";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiInfo,
  FiHash,
  FiCreditCard,
} from "react-icons/fi";
import { IoPersonAddOutline } from "react-icons/io5";

// Optimized FormInput component without animations
const FormInput = React.memo(({ icon: Icon, error, ...props }) => {
  return (
    <div>
      <label
        htmlFor={props.name}
        className="block mb-2 text-sm font-medium text-neutral-200"
      >
        {props.label}
        {props.required && <span className="ml-1 text-red-400">*</span>}
        {props.optional && (
          <span className="ml-2 text-xs text-neutral-400">(Optional)</span>
        )}
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
      {error && (
        <p className="flex items-center gap-2 mt-2 text-sm text-red-400">
          <div className="w-4 h-4 text-red-400">⚠️</div>
          {error}
        </p>
      )}
    </div>
  );
});

FormInput.displayName = "FormInput";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    dept: "",
    branch: "",
    mobno: "",
    rollNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiMessage, setApiMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
    setApiMessage({ type: "", text: "" });
  }, []);

  const handleOtpChange = useCallback((e) => {
    setOtp(e.target.value);
    setApiMessage({ type: "", text: "" });
  }, []);

  const validateInitialForm = useCallback(() => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required.";
    if (!formData.dept.trim()) newErrors.dept = "Department is required.";
    if (!formData.mobno.trim()) newErrors.mobno = "Mobile Number is required.";
    else if (!/^\d{10}$/.test(formData.mobno))
      newErrors.mobno = "Mobile Number must be 10 digits.";
    if (!formData.rollNumber.trim())
      newErrors.rollNumber = "Roll Number is required.";
    if (!formData.email.trim()) newErrors.email = "Email Address is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email address is invalid.";
    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters long.";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required.";
    else if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Passwords do not match.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleRequestOtp = useCallback(
    async (e) => {
      e.preventDefault();
      setApiMessage({ type: "", text: "" });
      if (!validateInitialForm()) return;

      setIsLoading(true);
      try {
        const payload = {
          username: formData.name,
          dept: formData.dept,
          branch: formData.branch,
          mobno: formData.mobno,
          rollNumber: formData.rollNumber,
          email: formData.email,
          password: formData.password,
        };

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/signup/request`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            data.error || "Failed to request OTP. " + (data.message || "")
          );
        }
        setApiMessage({
          type: "success",
          text: data.message || "OTP sent successfully!",
        });
        setIsOtpStep(true);
      } catch (error) {
        setApiMessage({ type: "error", text: error.message });
        console.error("OTP Request Error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [formData, validateInitialForm]
  );

  const handleVerifyOtp = useCallback(
    async (e) => {
      e.preventDefault();
      setApiMessage({ type: "", text: "" });
      if (!otp.trim() || otp.length !== 6) {
        setApiMessage({
          type: "error",
          text: "Please enter a valid 6-digit OTP.",
        });
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/signup/verify`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.email, otp }),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            data.error || "OTP verification failed. " + (data.message || "")
          );
        }
        setApiMessage({
          type: "success",
          text: data.message + " You can now log in.",
        });
        setFormData({
          name: "",
          dept: "",
          branch: "",
          mobno: "",
          rollNumber: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setOtp("");
        setIsOtpStep(false);
        setTimeout(() => navigate("/login"), 2000);
      } catch (error) {
        setApiMessage({ type: "error", text: error.message });
        console.error("OTP Verification Error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [formData.email, otp, navigate]
  );

  const handleBackToRegistration = useCallback(() => {
    setIsOtpStep(false);
    setApiMessage({ type: "", text: "" });
    setErrors({});
  }, []);

  return (
    <div className="relative min-h-screen text-white bg-background">
      <Header />

      {/* Simplified background with static gradients */}
      <div className="fixed inset-0 overflow-hidden opacity-50 pointer-events-none">
        <div className="absolute rounded-full top-20 left-20 w-72 h-72 bg-blue-500/5 blur-3xl"></div>
        <div className="absolute rounded-full bottom-20 right-20 w-96 h-96 bg-purple-500/5 blur-3xl"></div>
      </div>

      <Wrapper className="flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 border bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl border-white/10">
                <div className="flex items-center justify-center w-16 h-16 text-4xl">
                  {isOtpStep ? "🔐" : "🚀"}
                </div>
              </div>
            </div>

            <h1 className="mb-4 text-4xl font-black text-transparent md:text-5xl lg:text-6xl bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text">
              {isOtpStep ? "Verify Your Email" : "Join INFOTREK'25"}
            </h1>

            <p className="max-w-md mx-auto text-lg text-neutral-300">
              {isOtpStep
                ? "Enter the 6-digit code sent to your email address"
                : "Create your account to register for amazing events"}
            </p>
          </div>

          {/* Form Container */}
          <div className="p-8 border shadow-2xl bg-gradient-to-br from-white/10 to-white/5 border-white/20 rounded-3xl md:p-10">
            {/* Success/Error Messages */}
            {apiMessage.text && (
              <div
                className={`mb-6 p-4 rounded-2xl border transition-all duration-200 ${
                  apiMessage.type === "error"
                    ? "bg-red-500/10 border-red-500/30 text-red-300"
                    : "bg-green-500/10 border-green-500/30 text-green-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {apiMessage.type === "error" ? "❌" : "✅"}
                  </div>
                  <div>
                    <div className="font-semibold">
                      {apiMessage.type === "error" ? "Error" : "Success"}
                    </div>
                    <div className="text-sm">{apiMessage.text}</div>
                  </div>
                </div>
              </div>
            )}

            {!isOtpStep ? (
              <form onSubmit={handleRequestOtp} className="space-y-6">
                {/* Name and Department Row */}
                <div className="grid gap-6 md:grid-cols-2">
                  <FormInput
                    icon={FiUser}
                    name="name"
                    type="text"
                    label="Full Name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    error={errors.name}
                  />
                  <FormInput
                    icon={FiInfo}
                    name="dept"
                    type="text"
                    label="Department"
                    placeholder="e.g., Computer Science"
                    value={formData.dept}
                    onChange={handleChange}
                    required
                    error={errors.dept}
                  />
                </div>

                {/* Branch and Mobile Row */}
                <div className="grid gap-6 md:grid-cols-2">
                  <FormInput
                    icon={FiHash}
                    name="branch"
                    type="text"
                    label="Branch"
                    placeholder="e.g., AI, Software Engineering"
                    value={formData.branch}
                    onChange={handleChange}
                    optional
                    error={errors.branch}
                  />
                  <FormInput
                    icon={FiPhone}
                    name="mobno"
                    type="tel"
                    label="Mobile Number"
                    placeholder="10-digit mobile number"
                    value={formData.mobno}
                    onChange={handleChange}
                    required
                    error={errors.mobno}
                  />
                </div>

                {/* Roll Number and Email Row */}
                <div className="grid gap-6 md:grid-cols-2">
                  <FormInput
                    icon={FiCreditCard}
                    name="rollNumber"
                    type="text"
                    label="Roll Number"
                    placeholder="Your university roll number"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    required
                    error={errors.rollNumber}
                  />
                  <FormInput
                    icon={FiMail}
                    name="email"
                    type="email"
                    label="Email Address"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    error={errors.email}
                  />
                </div>

                {/* Password Row */}
                <div className="grid gap-6 md:grid-cols-2">
                  <FormInput
                    icon={FiLock}
                    name="password"
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    error={errors.password}
                  />
                  <FormInput
                    icon={FiLock}
                    name="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    error={errors.confirmPassword}
                  />
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
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      Get OTP
                      <IoPersonAddOutline className="w-6 h-6" />
                    </div>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-8">
                {/* OTP Input */}
                <div className="text-center">
                  <label
                    htmlFor="otp"
                    className="block mb-4 text-lg font-medium text-neutral-200"
                  >
                    Enter 6-Digit OTP
                  </label>
                  <div className="max-w-xs mx-auto">
                    <input
                      type="text"
                      name="otp"
                      id="otp"
                      value={otp}
                      onChange={handleOtpChange}
                      required
                      maxLength="6"
                      className="w-full px-6 py-4 font-mono text-2xl tracking-widest text-center text-white transition-all duration-200 border-2 bg-white/5 border-white/20 rounded-2xl placeholder-neutral-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20"
                      placeholder="000000"
                    />
                  </div>
                  <p className="mt-3 text-sm text-neutral-400">
                    Check your email for the verification code
                  </p>
                </div>

                {/* Buttons */}
                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-white text-lg transition-all duration-200 ${
                      isLoading
                        ? "bg-neutral-600 text-neutral-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:scale-[1.02]"
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
                        Verifying...
                      </div>
                    ) : (
                      "Verify & Create Account 🎉"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleBackToRegistration}
                    disabled={isLoading}
                    className="w-full px-6 py-3 font-medium transition-all duration-200 border rounded-2xl text-neutral-300 border-white/20 hover:bg-white/5 hover:border-white/30"
                  >
                    ← Back to Registration
                  </button>
                </div>
              </form>
            )}

            {/* Footer Link */}
            <p className="mt-8 text-center text-neutral-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-400 transition-colors duration-200 hover:text-blue-300"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default SignupPage;
