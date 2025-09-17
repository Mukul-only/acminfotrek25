import React, { useState, useMemo, useEffect } from "react";
import Header from "../components/Header";
import Wrapper from "../util/Wrapper";
import EventCard from "../components/EventCard";
import All from "../assets/all.svg?react";
import Ball from "../assets/ball.svg?react";
import Laptop from "../assets/laptop.svg?react";

const EventsPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [motion, setMotion] = useState(null);

  useEffect(() => {
    if (!document.body.classList.contains("cosmic-body-active")) {
      document.body.style.backgroundColor = "#111827";
      document.body.style.overflow = "auto";
    }

    // Load event data dynamically
    const loadEventData = async () => {
      try {
        const { events } = await import("../data/eventsData");
        setEventsData(events);
      } catch (error) {
        console.error("Failed to load events:", error);
      } finally {
        setLoading(false);
      }
    };

    // Load Framer Motion only when needed
    const loadFramerMotion = async () => {
      try {
        const framerMotion = await import("framer-motion");
        setMotion(framerMotion);
      } catch (error) {
        console.error("Failed to load Framer Motion:", error);
      }
    };

    loadEventData();
    loadFramerMotion();

    return () => {};
  }, []);

  const filteredEvents = useMemo(() => {
    if (activeFilter === "all") return eventsData;
    return eventsData.filter((event) => event.eventType === activeFilter);
  }, [activeFilter, eventsData]);

  const FilterButton = ({
    filterType,
    label,
    icon,
    currentFilter,
    setFilter,
  }) => {
    const ButtonComponent = motion?.motion?.button || "button";
    const buttonProps = motion
      ? {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
        }
      : {};

    return (
      <ButtonComponent
        {...buttonProps}
        onClick={() => setFilter(filterType)}
        className={`px-4 py-2 sm:px-8 sm:py-2 rounded-full gap-2 text-xs sm:text-base font-medium flex items-center justify-center transition-all duration-200 ease-in-out cursor-pointer border border-bdr
          ${
            currentFilter === filterType
              ? "bg-white text-gray-900 shadow-md"
              : "text-txt hover:bg-neutral-700 hover:text-white"
          }`}
      >
        {icon}
        {label}
      </ButtonComponent>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="w-12 h-12 border-b-2 border-white rounded-full animate-spin"></div>
      </div>
    );
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const MotionDiv = motion?.motion?.div || "div";

  return (
    <div className="relative">
      <div className="absolute inset-0 min-h-screen overflow-y-auto text-white bg-black/30">
        <Header />
        <Wrapper>
          <MotionDiv
            className="py-12 md:py-16"
            {...(motion
              ? {
                  initial: { opacity: 0, y: 40 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.6 },
                }
              : {})}
          >
            <MotionDiv
              className="mb-8 text-center md:mb-12"
              {...(motion
                ? {
                    initial: { opacity: 0, y: 40 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.6 },
                  }
                : {})}
            >
              <h1 className="mb-3 text-4xl font-bold sm:text-5xl">EVENTS</h1>
              <p className="max-w-2xl mx-auto text-sm leading-snug text-txt sm:text-base">
                Welcome to INFOTREK'25, presented by the ACM Club. Browse
                through a range of technical and non-technical events and
                register to be part of the excitement. Pick your interests, join
                the action, and showcase your skills!
              </p>
            </MotionDiv>

            <MotionDiv
              className="flex flex-wrap justify-start gap-2 mb-2"
              {...(motion
                ? {
                    initial: { opacity: 0, y: 40 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.6 },
                  }
                : {})}
            >
              <FilterButton
                filterType="all"
                label="All"
                icon={<All className="w-4 h-4 sm:w-6 sm:h-6" />}
                currentFilter={activeFilter}
                setFilter={setActiveFilter}
              />
              <FilterButton
                filterType="technical"
                label="Technical"
                icon={<Laptop className="w-4 h-4 sm:w-6 sm:h-6" />}
                currentFilter={activeFilter}
                setFilter={setActiveFilter}
              />
              <FilterButton
                filterType="non-tech"
                label="Non-Tech"
                icon={<Ball className="w-4 h-4 sm:w-6 sm:h-6" />}
                currentFilter={activeFilter}
                setFilter={setActiveFilter}
              />
            </MotionDiv>

            <MotionDiv
              {...(motion
                ? {
                    initial: "hidden",
                    whileInView: "visible",
                    viewport: { once: true, amount: 0.3 },
                    variants: fadeUp,
                  }
                : {})}
              className="mb-8 text-xs text-txt sm:text-sm md:mb-10"
            >
              (click on the events for details)
            </MotionDiv>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => {
                  const EventWrapper = motion?.motion?.div || "div";
                  const eventProps = motion
                    ? {
                        initial: { opacity: 0, y: 30 },
                        whileInView: { opacity: 1, y: 0 },
                        viewport: { once: true },
                        transition: { duration: 0.4, delay: index * 0.08 },
                      }
                    : {};

                  return (
                    <EventWrapper key={event.id} {...eventProps}>
                      <EventCard event={event} />
                    </EventWrapper>
                  );
                })
              ) : (
                <p className="py-8 text-center text-gray-400 col-span-full">
                  No events found for this filter.
                </p>
              )}
            </div>
          </MotionDiv>
        </Wrapper>
      </div>
    </div>
  );
};

export default EventsPage;
