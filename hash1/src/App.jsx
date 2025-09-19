// src/App.jsx - Updated with confirmation alert and logout-on-close functionality
import React, { useState, useEffect, Suspense } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import SvgLoading from "./util/SvgLoading";

// Lazy load heavy components
const HomePage = React.lazy(() => import("./pages/HomePage"));
const EventsPage = React.lazy(() => import("./pages/EventsPage"));
const TeamPage = React.lazy(() => import("./pages/TeamPage"));
const AboutPage = React.lazy(() => import("./pages/AboutPage"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const SignupPage = React.lazy(() => import("./pages/SignupPage"));
const ForgotPasswordPage = React.lazy(() =>
  import("./pages/ForgotPasswordPage")
);
const ResetPasswordPage = React.lazy(() => import("./pages/ResetPasswordPage"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-b-2 border-white rounded-full animate-spin"></div>
  </div>
);

const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gray-900">
    <h1 className="mb-4 text-6xl font-bold">404</h1>
    <p className="mb-8 text-2xl">Page Not Found</p>
    <Link
      to="/"
      className="px-6 py-3 font-semibold bg-indigo-600 rounded-lg hover:bg-indigo-700"
    >
      Go Home
    </Link>
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(() => {
    const hasLoadedBefore = localStorage.getItem("appInitialLoadComplete");
    return hasLoadedBefore !== "true";
  });
  const [fadeOutLoading, setFadeOutLoading] = useState(false);
  useEffect(() => {
    if (isLoading) {
      const fadeOutTimer = setTimeout(() => {
        setFadeOutLoading(true);
      }, 5500);
      const completeLoadingTimer = setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem("appInitialLoadComplete", "true");
      }, 6000);
      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(completeLoadingTimer);
      };
    }
  }, [isLoading]);

  // useEffect(() => {
  //   const handleTabClose = (event) => {
  //     const token = localStorage.getItem("authToken");
  //     if (token) {
  //       // event.preventDefault();
  //       event.returnValue = "";
  //       const logoutUrl = `${
  //         import.meta.env.VITE_API_BASE_URL
  //       }/api/auth/beacon-signout`;
  //       const headers = { type: "application/json" };
  //       const blob = new Blob([JSON.stringify({ token: token })], headers);
  //       navigator.sendBeacon(logoutUrl, blob);
  //     }
  //   };
  //   window.addEventListener("beforeunload", handleTabClose);
  //   return () => {
  //     window.removeEventListener("beforeunload", handleTabClose);
  //   };
  // }, []);

  if (isLoading) {
    return (
      <div
        className={`fixed inset-0 z-[9999] transition-opacity duration-300 ease-out ${
          fadeOutLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <SvgLoading />
      </div>
    );
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
