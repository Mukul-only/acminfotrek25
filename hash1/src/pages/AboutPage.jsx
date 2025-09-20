import React from "react";
import Header from "../components/Header";
import Wrapper from "../util/Wrapper";
import {
  CodeBracketIcon,
  LightBulbIcon,
  TrophyIcon,
  SparklesIcon,
  UserGroupIcon,
  AcademicCapIcon,
  RocketLaunchIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

const AboutPage = () => {
  const features = [
    {
      icon: CodeBracketIcon,
      title: "Tech Events",
      description: "Coding competitions, UI/UX battles, and tech quizzes",
    },
    {
      icon: AcademicCapIcon,
      title: "Workshops & Talks",
      description: "Learn from industry leaders, innovators, and alumni",
    },
    {
      icon: UserGroupIcon,
      title: "Networking Opportunities",
      description: "Meet like-minded individuals and potential collaborators",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-white">
      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Cosmic background accents */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-purple-800/10 to-black/30"></div>
        <div className="absolute w-48 h-48 rounded-full top-24 left-12 bg-blue-500/10 blur-3xl"></div>
        <div className="absolute w-64 h-64 rounded-full bottom-16 right-24 bg-purple-500/10 blur-3xl"></div>

        <Wrapper>
          <div className="relative px-4 py-20 md:py-24">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-8">
                <div className="p-6 border bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full backdrop-blur-md border-white/10 shadow-lg">
                  <RocketLaunchIcon className="w-14 h-14 text-blue-300" />
                </div>
              </div>
              <h1 className="mb-6 text-5xl font-extrabold text-transparent md:text-7xl bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text tracking-wide">
                About INFOTREK'25
              </h1>
              <p className="text-lg leading-relaxed md:text-2xl max-w-2xl mx-auto text-neutral-300">
                The premier platform for innovation, technology, and creative
                problem-solving
              </p>
            </div>
          </div>
        </Wrapper>
      </div>

      <Wrapper>
        <div className="px-4 pb-20">
          {/* Main Description Card */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="p-10 border shadow-2xl bg-gradient-to-br from-white/5 to-black/20 rounded-3xl backdrop-blur-md border-white/10">
              <p className="text-lg leading-relaxed md:text-xl text-txt">
                INFOTREK'25 is the annual techno-cultural fest organized by the
                ACM Student Chapter NIT Trichy. A celebration of innovation,
                creativity, and collaboration, INFOTREK serves as a vibrant
                platform for students across the country to showcase their
                technical prowess and artistic talents.
              </p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto space-y-20">
            {/* Mission Section */}
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
                    <LightBulbIcon className="w-9 h-9 text-green-400" />
                  </div>
                  <h2 className="text-3xl font-bold md:text-4xl text-neutral-200 tracking-tight">
                    Our Mission
                  </h2>
                </div>
                <p className="text-lg leading-relaxed text-txt">
                  At INFOTREK, we believe in fostering a culture where
                  technology meets imagination. Our mission is to bridge the gap
                  between academia and the real world by encouraging students to
                  engage with the latest trends in computer science, participate
                  in hands-on events, and build meaningful connections.
                </p>
              </div>
              <div className="relative">
                <div className="p-8 border bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl border-green-500/20">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 text-center bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                      <CodeBracketIcon className="w-9 h-9 mx-auto mb-2 text-green-400" />
                      <p className="text-sm text-neutral-300">Innovation</p>
                    </div>
                    <div className="p-4 text-center bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                      <UserGroupIcon className="w-9 h-9 mx-auto mb-2 text-green-400" />
                      <p className="text-sm text-neutral-300">Collaboration</p>
                    </div>
                    <div className="p-4 text-center bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                      <AcademicCapIcon className="w-9 h-9 mx-auto mb-2 text-green-400" />
                      <p className="text-sm text-neutral-300">Learning</p>
                    </div>
                    <div className="p-4 text-center bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                      <SparklesIcon className="w-9 h-9 mx-auto mb-2 text-green-400" />
                      <p className="text-sm text-neutral-300">Creativity</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legacy Section */}
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div className="relative md:order-1">
                <div className="p-8 border bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl border-purple-500/20">
                  <div className="space-y-6 text-center">
                    <TrophyIcon className="w-16 h-16 mx-auto text-purple-400" />
                    <div className="grid grid-cols-3 gap-6 text-center">
                      <div className="p-4 bg-white/5 rounded-xl">
                        <div className="text-2xl font-bold text-purple-400">
                          500+
                        </div>
                        <div className="text-sm text-neutral-300">
                          Participants
                        </div>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl">
                        <div className="text-2xl font-bold text-purple-400">
                          50+
                        </div>
                        <div className="text-sm text-neutral-300">Events</div>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl">
                        <div className="text-2xl font-bold text-purple-400">
                          10+
                        </div>
                        <div className="text-sm text-neutral-300">Years</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6 md:order-2">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                    <StarIcon className="w-9 h-9 text-purple-400" />
                  </div>
                  <h2 className="text-3xl font-bold md:text-4xl text-neutral-200 tracking-tight">
                    Our Legacy
                  </h2>
                </div>
                <p className="text-lg leading-relaxed text-txt">
                  INFOTREK has grown from a modest student-driven initiative
                  into a major campus event known for its diverse blend of
                  technical contests, workshops, cultural nights, and keynote
                  talks. Over the years, we've hosted hundreds of participants,
                  sparked countless ideas, and witnessed the birth of many
                  innovations.
                </p>
                <div className="p-5 border-l-4 border-purple-400 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl">
                  <p className="font-medium text-neutral-200 italic">
                    "As we enter INFOTREK'25, we aim to set the bar even higher
                    with new events, bigger challenges, and unforgettable
                    experiences."
                  </p>
                </div>
              </div>
            </div>

            {/* Why Attend Section */}
            <div className="space-y-12">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="mb-6 text-4xl font-extrabold md:text-5xl text-neutral-200 tracking-tight">
                  Why Attend INFOTREK'25?
                </h2>
                <p className="text-lg md:text-xl text-txt">
                  Discover endless opportunities for growth, learning, and
                  networking
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="p-8 transition-all duration-300 border group bg-gradient-to-br from-white/5 to-white/10 rounded-3xl backdrop-blur-md border-white/10 hover:border-white/20 hover:scale-105"
                  >
                    <div className="space-y-4 text-center">
                      <div className="p-5 mx-auto transition-transform duration-300 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl w-fit group-hover:scale-110">
                        <feature.icon className="w-12 h-12 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-neutral-200">
                        {feature.title}
                      </h3>
                      <p className="leading-relaxed text-txt">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default AboutPage;
