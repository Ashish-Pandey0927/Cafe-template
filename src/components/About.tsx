import { useEffect, useRef, useState } from "react";

/**
 * EMBER — About / Our Story Component
 * 
 * Features:
 * - Split layout: Text content + Chef/Interior photo
 * - Scroll fade-in animation using IntersectionObserver
 * - Smooth scroll parallax effect on the image container
 * - Large italic founder/chef quote in display serif (Fraunces)
 * - Corner notch aesthetics matching the EMBER visual theme
 */
export default function About() {
    const [isVisible, setIsVisible] = useState(false);
    const [parallaxY, setParallaxY] = useState(0);
    const sectionRef = useRef<HTMLDivElement>(null);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Intersection observer for scroll fade-in
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.15 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        // Parallax effect on scroll
        const handleScroll = () => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calculate progress through viewport (-1 to 1)
            if (rect.top < windowHeight && rect.bottom > 0) {
                const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
                setParallaxY((scrollProgress - 0.5) * 45); // Smooth subtle translation
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="story"
            className="relative w-full overflow-hidden bg-[#F4EEE0] px-4 py-24 sm:px-8 lg:py-32"
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600&display=swap');

        .font-display {
          font-family: 'Fraunces', serif;
        }

        .font-ui {
          font-family: 'Inter', sans-serif;
        }

        .about-fade-up {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .about-fade-up.in-view {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

            <div className="mx-auto max-w-[1800px]">
                {/* Section Header Badge */}
                <div
                    className={`about-fade-up mb-8 flex items-center gap-3 ${isVisible ? "in-view" : ""}`}
                >
                    <span className="h-px w-8 bg-[#8A7F68]" />
                    <span className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-[#8A7F68]">
                        Our Story & Philosophy
                    </span>
                </div>

                {/* Main Split Grid */}
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
                    {/* Left Column — Text & Story Content */}
                    <div className="flex flex-col justify-between lg:col-span-6 xl:col-span-7">
                        <div className="space-y-8">
                            <h2
                                className={`about-fade-up font-display text-[42px] leading-[1.05] tracking-[-0.03em] text-[#1B1712] sm:text-[56px] xl:text-[64px] ${isVisible ? "in-view" : ""}`}
                                style={{ transitionDelay: "100ms" }}
                            >
                                Craft, coals, &amp; conversation.
                                <br />
                                <span className="italic text-[#7A3B2E]">
                                    Born from live flame.
                                </span>
                            </h2>

                            <div
                                className={`about-fade-up space-y-5 font-ui text-[16px] leading-relaxed text-[#5A5142] sm:text-[17px] ${isVisible ? "in-view" : ""}`}
                                style={{ transitionDelay: "200ms" }}
                            >
                                <p>
                                    At EMBER, we believe the hearth is the soul of every memorable table.
                                    Founded in 2012 in Fitzroy, our kitchen operates without gas or electricity — 
                                    anchored entirely by a custom 3-meter open hearth fueled by Victorian red gum and 
                                    seasoned applewood.
                                </p>
                                <p>
                                    Every morning, fresh produce from small-holder Victorian farms, wild-foraged botanicals,
                                    and day-boat seafood arrive at our back door. We let the rhythm of the fire dictate the 
                                    flavor, searing with intense heat and gently smoking over embers.
                                </p>
                            </div>

                            {/* Large Italic Founder Quote */}
                            <blockquote
                                className={`about-fade-up relative my-8 border-l-2 border-[#7A3B2E] pl-6 sm:pl-8 ${isVisible ? "in-view" : ""}`}
                                style={{ transitionDelay: "300ms" }}
                            >
                                <p className="font-display text-[22px] italic leading-snug text-[#1B1712] sm:text-[28px]">
                                    &ldquo;Fire isn't merely a heat source; it is a living element that demands patience, respect, and instinct.&rdquo;
                                </p>
                                <footer className="mt-4 flex items-center gap-3 font-ui text-sm text-[#3A2A16]">
                                    <span className="font-semibold text-[#1B1712]">Marcus Vance</span>
                                    <span className="text-[#8A7F68]">&mdash;</span>
                                    <span className="text-[#7A3B2E]">Executive Chef &amp; Founder</span>
                                </footer>
                            </blockquote>

                            {/* Feature Pills / Badges */}
                            <div
                                className={`about-fade-up flex flex-wrap items-center gap-3 pt-2 ${isVisible ? "in-view" : ""}`}
                                style={{ transitionDelay: "400ms" }}
                            >
                                <div className="rounded-full bg-[#1B1712] px-5 py-2.5 font-ui text-xs font-medium tracking-wide text-[#F4EEE0]">
                                    Est. 2012
                                </div>
                                <div className="rounded-full border border-[#D9CDAF] bg-[#EFE6D2]/60 px-5 py-2.5 font-ui text-xs font-medium tracking-wide text-[#3A2A16]">
                                    100% Wood-Fired Hearth
                                </div>
                                <div className="rounded-full border border-[#D9CDAF] bg-[#EFE6D2]/60 px-5 py-2.5 font-ui text-xs font-medium tracking-wide text-[#3A2A16]">
                                    Victorian Local Produce
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column — Parallax Image Card with Organic Cutout Notch */}
                    <div
                        className={`about-fade-up relative lg:col-span-6 xl:col-span-5 ${isVisible ? "in-view" : ""}`}
                        style={{ transitionDelay: "250ms" }}
                    >
                        <div
                            ref={imageContainerRef}
                            className="relative min-h-[480px] w-full overflow-hidden rounded-[32px] sm:min-h-[580px] lg:min-h-[640px]"
                        >
                            {/* Parallax Image */}
                            <img
                                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=85"
                                alt="Chef Marcus Vance cooking over live open flames at EMBER hearth"
                                className="absolute inset-0 h-[125%] w-full object-cover will-change-transform"
                                style={{
                                    transform: `translate3d(0, ${parallaxY}px, 0)`,
                                }}
                            />

                            {/* Gradient Overlay for Mood & Legibility */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />

                            {/* Floating Accent Badge on Photo (Top Left) */}
                            <div className="absolute left-6 top-6 rounded-2xl bg-[#1B1712]/80 px-4 py-2.5 font-ui text-xs text-[#F4EEE0] backdrop-blur-md">
                                <span className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-[#D99A4E] animate-pulse" />
                                    Live Hearth &amp; Kitchen
                                </span>
                            </div>

                            {/* Bottom Floating Info Card inside the Photo with Organic Corner Notches */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                                <div className="relative rounded-2xl bg-[#F4EEE0] p-6 text-[#1B1712] shadow-xl">
                                    <p className="font-display text-xl font-medium leading-snug">
                                        &ldquo;Every seat has a view of the flames.&rdquo;
                                    </p>
                                    <p className="mt-2 font-ui text-xs tracking-wide text-[#5A5142]">
                                        Open hearth seating available nightly for dinner &amp; weekend lunch.
                                    </p>
                                </div>
                            </div>

                            {/* Corner notch accent on bottom-right matching site organic cards */}
                            <span
                                className="pointer-events-none absolute bottom-[71px] right-0 z-20 h-[28px] w-[28px] bg-[#F4EEE0]"
                                style={{
                                    mask: "radial-gradient(circle at top left, transparent 0 27px, black 28px)",
                                    WebkitMask:
                                        "radial-gradient(circle at top left, transparent 0 27px, black 28px)",
                                }}
                            />
                            <span
                                className="pointer-events-none absolute bottom-[0px] right-[71px] z-20 h-[28px] w-[28px] bg-[#F4EEE0]"
                                style={{
                                    mask: "radial-gradient(circle at top left, transparent 0 27px, black 28px)",
                                    WebkitMask:
                                        "radial-gradient(circle at top left, transparent 0 27px, black 28px)",
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
