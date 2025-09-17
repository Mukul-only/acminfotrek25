import React, { useEffect, useState } from "react";
import { getEventRichDetailsById } from "../data/eventRichDetails";
import DetailsIcon from "../assets/view-details.svg?react";
import { motion, AnimatePresence } from "framer-motion";

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
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

const EventDetailsModal = ({ isOpen, onClose, event: basicEventData }) => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (isOpen && basicEventData) {
      const richDetails = getEventRichDetailsById(basicEventData.id);
      setDetails(richDetails);
    } else {
      setDetails(null);
    }
  }, [isOpen, basicEventData]);

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

  if (!basicEventData) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const displayTitle = details?.title || basicEventData.title;
  const displayImage = details?.detailsImage || basicEventData.image;
  const displayIntroduction =
    details?.introduction || basicEventData.description;

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Minimal animation variants - only for modal open/close
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

  const getEventTypeColor = (eventType) => {
    if (eventType === "technical") return "from-cyan-500 to-blue-500";
    if (eventType === "non-tech") return "from-orange-500 to-red-500";
    return "from-violet-500 to-purple-500";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
        >
          {/* Simplified backdrop */}
          <div className="absolute inset-0 bg-black/80 "></div>

          <motion.div
            className="relative bg-gradient-to-br from-white/10 to-white/5 border backdrop-blur-2xl border-white/20 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden"
            variants={modalVariants}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Static border */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${getEventTypeColor(
                basicEventData.eventType
              )} opacity-20 rounded-3xl p-[1px]`}
            >
              <div className="w-full h-full bg-background/95 rounded-3xl"></div>
            </div>

            {/* Modal Header */}
            <div className="relative flex items-center justify-between flex-shrink-0 p-4 border-b sm:p-6 border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 bg-gradient-to-r ${getEventTypeColor(
                    basicEventData.eventType
                  )} rounded-xl`}
                >
                  <DetailsIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white sm:text-xl">
                    Event Details
                  </h2>
                  <p className="text-sm text-neutral-300">
                    {capitalizeFirstLetter(basicEventData.eventType)} Event
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

            {/* Scrollable Content */}
            <div className="relative flex-grow p-4 space-y-6 overflow-y-auto sm:p-6 custom-scrollbar">
              {/* Hero Section */}
              <div className="flex flex-col items-start gap-6 p-6 border lg:flex-row bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border-white/10">
                <div className="flex-shrink-0 w-full lg:w-80">
                  <div className="relative overflow-hidden rounded-2xl">
                    <img
                      src={displayImage}
                      alt={`${displayTitle} details`}
                      className="object-cover w-full h-auto aspect-video"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/400x300?text=Event+Image";
                      }}
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="mb-2 text-2xl font-black text-transparent sm:text-3xl lg:text-4xl bg-gradient-to-r from-white via-neutral-200 to-neutral-300 bg-clip-text">
                      {displayTitle}
                    </h3>
                    {details?.tagline && (
                      <p className="text-lg font-medium sm:text-xl text-neutral-300">
                        {details.tagline}
                      </p>
                    )}
                  </div>

                  {/* Event Meta Info */}
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {basicEventData.eventType && (
                      <div className="p-3 border bg-white/5 rounded-xl border-white/10">
                        <div className="text-xs tracking-wider uppercase text-neutral-400">
                          Type
                        </div>
                        <div
                          className={`text-sm font-semibold bg-gradient-to-r ${getEventTypeColor(
                            basicEventData.eventType
                          )} bg-clip-text text-transparent`}
                        >
                          {capitalizeFirstLetter(basicEventData.eventType)}
                        </div>
                      </div>
                    )}
                    {basicEventData.playerMode && (
                      <div className="p-3 border bg-white/5 rounded-xl border-white/10">
                        <div className="text-xs tracking-wider uppercase text-neutral-400">
                          Mode
                        </div>
                        <div className="text-sm font-semibold text-white">
                          {capitalizeFirstLetter(basicEventData.playerMode)}
                        </div>
                      </div>
                    )}
                    {basicEventData.subCategory && (
                      <div className="p-3 border bg-white/5 rounded-xl border-white/10">
                        <div className="text-xs tracking-wider uppercase text-neutral-400">
                          Category
                        </div>
                        <div className="text-sm font-semibold text-white">
                          {capitalizeFirstLetter(basicEventData.subCategory)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Introduction */}
              {displayIntroduction && (
                <section className="p-6 border bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border-white/10">
                  <h4 className="flex items-center gap-3 mb-4 text-xl font-bold text-white sm:text-2xl">
                    <div className="w-2 h-8 rounded-full bg-gradient-to-b from-orange-500 to-violet-500"></div>
                    {details
                      ? `What is ${displayTitle}?`
                      : `About ${displayTitle}`}
                  </h4>
                  <p className="leading-relaxed whitespace-pre-line text-neutral-300">
                    {displayIntroduction}
                  </p>
                </section>
              )}

              {/* Rich Details Sections */}
              {details && (
                <>
                  {/* Duration Details */}
                  {details.durationDetails && (
                    <section className="p-6 border bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl border-cyan-500/20">
                      <h4 className="flex items-center gap-3 mb-4 text-xl font-bold text-white">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
                          <div className="w-4 h-4 text-white">⏰</div>
                        </div>
                        Event Timeline
                      </h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {Object.entries(details.durationDetails).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="p-4 bg-white/5 rounded-xl"
                            >
                              <div className="mb-1 text-xs tracking-wider uppercase text-cyan-300">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </div>
                              <div className="font-medium text-white">
                                {value}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </section>
                  )}

                  {/* Format & Rules */}
                  {details.formatAndRules?.length > 0 && (
                    <section className="p-6 border bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl border-orange-500/20">
                      <h4 className="flex items-center gap-3 mb-4 text-xl font-bold text-white">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                          <div className="w-4 h-4 text-white">📋</div>
                        </div>
                        Format & Rules
                      </h4>
                      <div className="space-y-3">
                        {details.formatAndRules.map((rule, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-white/5 rounded-xl"
                          >
                            <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                              {index + 1}
                            </div>
                            <p className="leading-relaxed text-neutral-300">
                              {rule}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Judging Criteria */}
                  {details.judgingCriteria?.length > 0 && (
                    <section className="p-6 border bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-2xl border-violet-500/20">
                      <h4 className="flex items-center gap-3 mb-4 text-xl font-bold text-white">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500">
                          <div className="w-4 h-4 text-white">⚖️</div>
                        </div>
                        Judging Criteria
                      </h4>
                      <div className="space-y-3">
                        {details.judgingCriteria.map((criterion, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-white/5 rounded-xl"
                          >
                            <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                              ✓
                            </div>
                            <p className="leading-relaxed text-neutral-300">
                              {criterion}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Prizes & Perks */}
                  {details.prizesAndPerks?.length > 0 && (
                    <section className="p-6 border bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl border-yellow-500/20">
                      <h4 className="flex items-center gap-3 mb-4 text-xl font-bold text-white">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500">
                          <div className="w-4 h-4 text-white">🏆</div>
                        </div>
                        Prizes & Perks
                      </h4>
                      <div className="space-y-3">
                        {details.prizesAndPerks.map((perk, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-white/5 rounded-xl"
                          >
                            <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                              🎁
                            </div>
                            <p className="leading-relaxed text-neutral-300">
                              {perk}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Concluding Tagline */}
                  {details.concludingTagline && (
                    <div className="p-6 text-center border bg-gradient-to-r from-white/5 to-white/10 rounded-2xl border-white/20">
                      <p className="text-lg font-semibold text-transparent bg-gradient-to-r from-orange-400 via-cyan-400 to-violet-400 bg-clip-text">
                        {details.concludingTagline.replace(
                          /\[Event Name\]/gi,
                          displayTitle
                        )}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventDetailsModal;
