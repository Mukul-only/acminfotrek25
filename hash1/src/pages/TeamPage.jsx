import React, { useState, useCallback, useMemo } from "react";
import Header from "../components/Header";
import Wrapper from "../util/Wrapper";

// Optimized team data with different image sizes
const teamMembers = [
  { id: 1, name: "Vanshu Galhotra", imageUrl: "/assets/acm/mai.png" },
  { id: 2, name: "Ayush Kumar", imageUrl: "/assets/acm/ayush.jpg" },
  { id: 3, name: "Chirag Sharma", imageUrl: "/assets/acm/Chirag.png" },
  { id: 4, name: "Muskan Chaurasia", imageUrl: "/assets/acm/muskan.jpg" },
  { id: 5, name: "Ankita Meena", imageUrl: "/assets/acm/ankita.png" },
  { id: 6, name: "Tanmoy Roy", imageUrl: "/assets/acm/tanmoy.jpg" },
  { id: 7, name: "Mukul", imageUrl: "/assets/acm/mukul.jpg" },
  { id: 8, name: "Shivam Das", imageUrl: "/assets/acm/shivam.jpg" },
];

// Optimized Image Component with lazy loading and error handling
const OptimizedImage = React.memo(({ src, alt, className, ...props }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    alt
  )}&size=400&background=3b82f6&color=ffffff&format=png`;

  return (
    <div className="relative w-full h-full">
      {/* Loading skeleton */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse rounded-2xl md:rounded-3xl">
          <div className="flex items-center justify-center w-full h-full">
            <div className="w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
        </div>
      )}

      {/* Actual image */}
      <img
        src={imageError ? fallbackImage : src}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        loading="lazy"
        decoding="async"
        onLoad={handleImageLoad}
        onError={handleImageError}
        {...props}
        // Add responsive image attributes
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />
    </div>
  );
});

OptimizedImage.displayName = "OptimizedImage";

// Highly optimized TeamMemberCard component
const TeamMemberCard = React.memo(({ member, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const memberName = member?.name || "Team Member";
  const memberRole = member?.role || "Office Bearer, ACM Student Chapter NITT";
  const memberImageUrl = member?.imageUrl || "";

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Memoize styles to prevent recalculations
  const cardStyles = useMemo(
    () => ({
      transform: isHovered ? "translateY(-4px)" : "translateY(0px)",
      transition: "transform 0.2s ease-out",
    }),
    [isHovered]
  );

  return (
    <div
      className="group relative bg-gradient-to-br from-white/8 to-white/4 rounded-2xl md:rounded-3xl aspect-[3/4] border border-white/10 shadow-xl overflow-hidden cursor-pointer will-change-transform"
      style={cardStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Simplified background - removed heavy gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>

      {/* Image Container - removed heavy effects */}
      <div className="relative h-full overflow-hidden rounded-2xl md:rounded-3xl">
        <OptimizedImage
          src={memberImageUrl}
          alt={memberName}
          className="absolute inset-0 object-cover w-full h-full"
        />

        {/* Simplified overlay */}
        <div className="absolute inset-0 transition-opacity duration-200 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80"></div>

        {/* Member Info - simplified animations */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-3 text-white sm:p-4 md:p-6">
          <div className="space-y-1 sm:space-y-2">
            <h3 className="text-base font-bold leading-tight text-white sm:text-lg md:text-xl">
              {memberName}
            </h3>
            <p className="text-xs leading-relaxed sm:text-sm text-neutral-200">
              {memberRole}
            </p>
            {/* Simplified indicator */}
            <div className="flex mt-2 space-x-2">
              <div className="w-6 h-1 bg-blue-400 rounded-full sm:w-8"></div>
              <div className="w-3 h-1 bg-purple-400 rounded-full sm:w-4"></div>
            </div>
          </div>
        </div>

        {/* Member Number Badge - simplified */}
        <div className="absolute flex items-center justify-center w-8 h-8 text-xs font-bold text-white rounded-full top-3 sm:top-4 md:top-6 left-3 sm:left-4 md:left-6 sm:w-9 sm:h-9 md:w-10 md:h-10 sm:text-sm bg-blue-500/80">
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
});

TeamMemberCard.displayName = "TeamMemberCard";

// Main TeamPage component - highly optimized
const TeamPage = () => {
  // Memoize team grid to prevent re-renders
  const teamGrid = useMemo(
    () => (
      <div className="relative z-10 grid grid-cols-1 gap-6 px-3 mx-auto max-w-7xl sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-8 sm:px-4 lg:px-8">
        {teamMembers.map((member, index) => (
          <div
            key={member.id}
            className={index % 4 === 1 || index % 4 === 3 ? "lg:mt-12" : ""}
          >
            <TeamMemberCard member={member} index={index} />
          </div>
        ))}
      </div>
    ),
    []
  );

  return (
    <div className="relative min-h-screen text-white bg-background">
      <Header />

      {/* Simplified background - static gradients only */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute w-48 h-48 rounded-full top-20 left-20 sm:w-72 sm:h-72 bg-blue-500/10 blur-3xl"></div>
        <div className="absolute w-64 h-64 rounded-full bottom-20 right-20 sm:w-96 sm:h-96 bg-purple-500/10 blur-3xl"></div>
      </div>

      <Wrapper>
        {/* Hero Section - removed heavy animations */}
        <div className="relative px-3 py-12 text-center sm:px-4 sm:py-16 md:py-24">
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            {/* Static Icons */}
            <div className="flex justify-center mb-6 space-x-4 sm:space-x-8 sm:mb-8">
              <div className="flex items-center justify-center w-12 h-12 text-2xl border sm:w-16 sm:h-16 bg-blue-500/20 rounded-xl sm:rounded-2xl border-white/10 sm:text-3xl">
                👥
              </div>
              <div className="flex items-center justify-center w-10 h-10 text-xl border rounded-lg sm:w-12 sm:h-12 bg-purple-500/20 sm:rounded-xl border-white/10 sm:text-2xl">
                ⭐
              </div>
              <div className="flex items-center justify-center text-3xl border w-14 sm:w-20 h-14 sm:h-20 bg-pink-500/20 rounded-2xl sm:rounded-3xl border-white/10 sm:text-4xl">
                🚀
              </div>
            </div>

            <p className="text-sm sm:text-base font-light tracking-[0.2em] sm:tracking-[0.3em] text-txt uppercase">
              Meet Our
            </p>

            <h1 className="text-4xl font-black leading-none text-transparent sm:text-6xl md:text-8xl lg:text-9xl bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text">
              TEAM
            </h1>

            <div className="max-w-3xl mx-auto">
              <p className="px-2 mb-4 text-base leading-relaxed sm:text-lg md:text-xl text-txt sm:mb-6 sm:px-0">
                INFOTREK'25 is planned, organized, and executed by the dedicated
                members of the ACM Student Chapter. From ideation to
                implementation, this team has worked across different areas to
                bring the fest to life.
              </p>

              {/* Stats */}
              <div className="flex justify-center mt-6 space-x-6 sm:space-x-8 sm:mt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 sm:text-3xl">
                    8+
                  </div>
                  <div className="text-xs sm:text-sm text-txt">
                    Team Members
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 sm:text-3xl">
                    ∞
                  </div>
                  <div className="text-xs sm:text-sm text-txt">Dedication</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-400 sm:text-3xl">
                    1
                  </div>
                  <div className="text-xs sm:text-sm text-txt">
                    Shared Vision
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Grid Section */}
        <div className="relative py-8 sm:py-12 md:py-20 lg:py-32">
          {/* Section Header */}
          <div className="px-3 mb-12 text-center sm:mb-16 sm:px-0">
            <h2 className="mb-3 text-2xl font-bold sm:text-4xl md:text-5xl text-neutral-200 sm:mb-4">
              The Minds Behind The Magic
            </h2>
            <div className="w-16 h-1 mx-auto rounded-full sm:w-24 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          </div>

          {/* Memoized Team Grid */}
          {teamGrid}
        </div>
      </Wrapper>
    </div>
  );
};

export default TeamPage;
