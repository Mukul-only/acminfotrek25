import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const participationStatements = [
  "I am willing to participate in this event.",
  "I understand that my participation is voluntary.",
  "I will adhere to the event's code of conduct and guidelines.",
  "I acknowledge that the event organizers may capture photos or videos during the event for promotional purposes.",
  "I confirm that the information I provide for registration is accurate.",
];

const RegistrationModal = ({ isOpen, onClose, event }) => {
  const { token, user, addRegisteredEvent } = useContext(AuthContext);

  // Form state
  const [hasAgreedToStatements, setHasAgreedToStatements] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState("");

  // State for team size validation
  const [emailCount, setEmailCount] = useState(0);
  const [isTeamSizeCorrect, setIsTeamSizeCorrect] = useState(false);

  // API call state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isTeamEvent = event?.playerMode === "team based";
  const requiredTeamSize = event?.teamsize
    ? parseInt(event.teamsize, 10)
    : null;

  // Effect to reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setHasAgreedToStatements(false);
      setTeamName("");
      setTeamMembers(user ? user.email + ", " : "");
      setError("");
      setSuccessMessage("");
      setIsLoading(false);
    }
  }, [isOpen, event, user]);

  // Real-time email counting and validation
  useEffect(() => {
    if (isTeamEvent) {
      const members = teamMembers
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);
      setEmailCount(members.length);

      if (requiredTeamSize) {
        setIsTeamSizeCorrect(members.length === requiredTeamSize);
      } else {
        setIsTeamSizeCorrect(true);
      }
    }
  }, [teamMembers, isTeamEvent, requiredTeamSize]);

  // Body overflow handler
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!event) return null;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    if (!token) {
      setError("You must be logged in to register for an event.");
      return;
    }
    setIsLoading(true);

    const payload = {
      eventId: event.id,
      type: isTeamEvent ? "group" : "individual",
    };

    if (isTeamEvent) {
      const memberEmails = teamMembers
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean);
      if (!teamName.trim() || memberEmails.length === 0) {
        setError("Team name and at least one member's email are required.");
        setIsLoading(false);
        return;
      }
      payload.groupName = teamName.trim();
      payload.members = memberEmails;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/event/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! Status: ${response.status}`
        );
      }
      addRegisteredEvent(payload.eventId);
      setSuccessMessage(data.message || "Registration successful!");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getEventTypeColor = (eventType) => {
    if (eventType === "technical") return "from-cyan-500 to-blue-500";
    if (eventType === "non-tech") return "from-orange-500 to-red-500";
    return "from-violet-500 to-purple-500";
  };

  const getEventTypeGlow = (eventType) => {
    if (eventType === "technical") return "shadow-cyan-500/25";
    if (eventType === "non-tech") return "shadow-orange-500/25";
    return "shadow-violet-500/25";
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/80"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className="relative flex flex-col w-full max-w-md overflow-hidden bg-gray-900 border border-white/10 rounded-3xl shadow-2xl max-h-[90vh]"
            variants={modalVariants}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${getEventTypeColor(
                event.eventType
              )} opacity-20 rounded-3xl p-[1px]`}
            >
              <div className="w-full h-full bg-gray-900/95 rounded-3xl"></div>
            </div>

            <div className="relative flex items-center justify-between flex-shrink-0 p-5 border-b sm:p-6 border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 bg-gradient-to-r ${getEventTypeColor(
                    event.eventType
                  )} rounded-xl ${getEventTypeGlow(event.eventType)} shadow-lg`}
                >
                  <div className="w-6 h-6 text-xl text-white">🎯</div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white sm:text-xl">
                    Event Registration
                  </h2>
                  <p className="text-sm text-neutral-300">
                    {isTeamEvent
                      ? "Team Registration"
                      : "Individual Registration"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 transition-colors duration-200 border text-neutral-400 hover:text-white hover:bg-white/10 rounded-xl border-white/10"
                aria-label="Close modal"
              >
                <CloseIcon />
              </button>
            </div>

            {successMessage && (
              <div className="relative p-4 border-b bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30">
                <div className="flex items-center gap-3 text-green-300">
                  <div className="text-2xl">✅</div>
                  <div>
                    <div className="font-semibold">
                      Registration Successful!
                    </div>
                    <div className="text-sm">{successMessage}</div>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="relative p-4 border-b bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-500/30">
                <div className="flex items-center gap-3 text-red-300">
                  <div className="text-2xl">❌</div>
                  <div>
                    <div className="font-semibold">Registration Failed</div>
                    <div className="text-sm">{error}</div>
                  </div>
                </div>
              </div>
            )}

            {!successMessage && (
              <div className="relative flex-grow p-5 overflow-y-auto sm:p-6">
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="p-4 border bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border-white/10">
                    <p className="mb-2 text-sm text-neutral-400">
                      Registering for:
                    </p>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full bg-gradient-to-r ${getEventTypeColor(
                          event.eventType
                        )}`}
                      ></div>
                      <div>
                        <p className="font-semibold text-white">
                          {event.title}
                        </p>
                        <p className="text-sm capitalize text-neutral-300">
                          {event.playerMode}
                        </p>
                      </div>
                    </div>
                  </div>

                  {isTeamEvent && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-200">
                          Team Name <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            required
                            className="w-full px-4 py-3 pl-10 text-white transition-colors duration-200 border bg-white/5 border-white/20 rounded-xl placeholder-neutral-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                            placeholder="Enter your team's name"
                          />
                          <div className="absolute left-3 top-3 text-cyan-400 opacity-60">
                            👥
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-200">
                          Team Members' Emails{" "}
                          <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <textarea
                            value={teamMembers}
                            onChange={(e) => setTeamMembers(e.target.value)}
                            required
                            rows={3}
                            className={`w-full px-4 py-3 pl-10 text-white transition-all duration-200 border resize-none bg-white/5 rounded-xl placeholder-neutral-400 focus:outline-none focus:ring-2 ${
                              requiredTeamSize && emailCount > 0
                                ? isTeamSizeCorrect
                                  ? "border-green-500/50 focus:border-green-400 focus:ring-green-400/20"
                                  : "border-red-500/50 focus:border-red-400 focus:ring-red-400/20"
                                : "border-white/20 focus:border-cyan-400 focus:ring-cyan-400/20"
                            }`}
                            placeholder="your.email@example.com, member2@example.com"
                          />
                          <div className="absolute left-3 top-3 text-cyan-400 opacity-60">
                            📧
                          </div>
                        </div>
                        {requiredTeamSize ? (
                          <p
                            className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                              isTeamSizeCorrect
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            <div className="text-xl">
                              {isTeamSizeCorrect ? "✓" : "✗"}
                            </div>
                            This event requires exactly {requiredTeamSize}{" "}
                            members. (Currently: {emailCount})
                          </p>
                        ) : (
                          <p className="flex items-center gap-2 text-xs text-neutral-400">
                            <div className="text-cyan-400">💡</div>
                            Enter emails separated by commas. Please include
                            your own email.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <p className="flex items-center gap-2 text-sm font-medium text-neutral-200">
                      <div className="text-orange-400">📋</div>Terms &
                      Conditions
                    </p>
                    <div className="p-4 overflow-y-auto border bg-gradient-to-br from-white/5 to-white/10 rounded-xl border-white/10 max-h-48">
                      <ul className="space-y-2 text-sm text-neutral-300">
                        {participationStatements.map((statement, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                              {index + 1}
                            </div>
                            <span className="leading-relaxed">{statement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div
                    className="flex items-start gap-3 p-3 transition-colors duration-200 border cursor-pointer bg-gradient-to-br from-white/5 to-white/10 rounded-xl border-white/10 hover:bg-white/10"
                    onClick={() =>
                      setHasAgreedToStatements(!hasAgreedToStatements)
                    }
                  >
                    <div
                      className={`relative w-5 h-5 rounded border-2 transition-all duration-200 ${
                        hasAgreedToStatements
                          ? `bg-gradient-to-r ${getEventTypeColor(
                              event.eventType
                            )} border-transparent`
                          : "border-white/30 bg-white/5 hover:border-white/50"
                      }`}
                    >
                      {hasAgreedToStatements && (
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                          ✓
                        </div>
                      )}
                    </div>
                    <span className="text-sm leading-relaxed text-neutral-200">
                      I agree to all the above terms and conditions.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={
                      isLoading ||
                      !hasAgreedToStatements ||
                      (isTeamEvent &&
                        (!teamName.trim() ||
                          !teamMembers.trim() ||
                          !isTeamSizeCorrect))
                    }
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-white text-lg transition-all duration-200 ${
                      isLoading ||
                      !hasAgreedToStatements ||
                      (isTeamEvent &&
                        (!teamName.trim() ||
                          !teamMembers.trim() ||
                          !isTeamSizeCorrect))
                        ? "bg-neutral-600 text-neutral-400 cursor-not-allowed"
                        : `bg-gradient-to-r ${getEventTypeColor(
                            event.eventType
                          )} ${getEventTypeGlow(
                            event.eventType
                          )} shadow-xl hover:shadow-2xl hover:scale-[1.02]`
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
                        Processing Registration...
                      </div>
                    ) : (
                      `Register for ${event.title} 🚀`
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegistrationModal;
