import React from "react";

const StarryBackground = () => {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2,
    size: Math.random() > 0.9 ? "w-0.5 h-0.5" : "w-px h-px",
  }));

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Dark Background */}
      <div className="absolute inset-0 bg-background"></div>

      {/* Light Sources - Distant glowing orbs */}
      <div className="absolute w-32 h-32 rounded-full top-1/4 right-1/4 bg-blue-500/5 blur-3xl"></div>
      <div className="absolute w-24 h-24 rounded-full bottom-1/3 left-1/5 bg-purple-500/4 blur-2xl"></div>
      <div className="absolute w-20 h-20 rounded-full top-2/3 right-1/3 bg-indigo-400/3 blur-2xl"></div>

      {/* Subtle Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute ${star.size} bg-white/60 rounded-full animate-pulse`}
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}

      {/* Subtle shooting star */}
      <div
        className="absolute w-px h-12 rotate-45 top-1/3 left-1/2 bg-gradient-to-b from-white/40 to-transparent opacity-30 animate-pulse"
        style={{ animationDuration: "4s", animationDelay: "2s" }}
      ></div>
    </div>
  );
};

export default StarryBackground;
