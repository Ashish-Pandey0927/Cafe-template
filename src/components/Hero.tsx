import { useEffect, useRef, useState } from "react";

/**
 * EMBER — Restaurant Hero Section
 * React + Tailwind CSS
 *
 * Setup notes:
 * 1. This component assumes Tailwind CSS is already configured in your project.
 * 2. Replace the <video> "src" below with your own footage (a slow, close-up
 *    shot of flame, a dish being plated, or smoke rising works best here).
 * 3. Fonts: this pulls "Fraunces" (display serif) and "Inter" (UI sans) from
 *    Google Fonts via the <style> tag below. Move that @import into your
 *    global CSS if you prefer.
 * 4. Nav lives in its own Navbar component now — mount that separately,
 *    above this Hero, in your page/layout (it's `position: fixed`, so it
 *    doesn't need a slot in this grid anymore).
 *
 * The "attached" corner illusion:
 * The headline card doesn't just round its own corners — where it meets
 * open image, the curve is CONCAVE instead of convex, like a bite taken
 * out of the image. That's the <CornerNotch> component below: a small
 * square with a radial-gradient "hole" the exact size of the radius,
 * positioned right at the joint. Where the card's edge touches the image
 * (left + bottom), the card is flush with no gap, so the two shapes read
 * as one continuous cut sheet instead of a card floating on top.
 */

interface CornerNotchProps {
    corner: "top-right" | "top-left" | "bottom-right" | "bottom-left";
    size?: number;
    color: string;
    className?: string;
}

// Reusable concave "socket" corner — creates the illusion that two
// differently-shaped surfaces were cut from the same sheet.
// corner: which corner of the PARENT this notch sits outside of.
function CornerNotch({
    corner,
    size = 28,
    color,
    className = "",
}: CornerNotchProps) {
    const pos = {
        "top-right": { top: -size, left: 0 },
        "top-left": { top: -size, left: 0 },
        "bottom-right": { bottom: 0, right: -31 },
        "bottom-left": { bottom: -size, left: 0 },
    }[corner];

    const gradientOrigin = {
        "top-right": "top right",
        "top-left": "top left",
        "bottom-right": "bottom right",
        "bottom-left": "bottom left",
    }[corner];

    return (
        <span
            aria-hidden="true"
            className={`pointer-events-none absolute ${className}`.trim()}
            style={{
                width: size,
                height: size,
                ...pos,
                background: `radial-gradient(circle at ${gradientOrigin}, transparent ${size}px, ${color} ${size}px)`,
            }}
        />
    );
}

export default function Hero() {
    const [loaded, setLoaded] = useState(false);
    const [parallaxY, setParallaxY] = useState(0);
    const headlineRef = useRef(null);

    useEffect(() => {
        // single orchestrated load-in — nothing else on the page animates on scroll
        const t = setTimeout(() => setLoaded(true), 80);

        const onScroll = () => {
            setParallaxY(window.scrollY * 0.08);
        };

        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            clearTimeout(t);
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    return (
        <section className="relative w-full bg-[#F4EEE0] p-3 sm:p-4">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');

        .font-display {
          font-family: 'Fraunces', serif;
        }

        .font-ui {
          font-family: 'Inter', sans-serif;
        }

        /*
         * Organic promo-card shape
         *
         * The card keeps its normal rounded outer corners, while the
         * bottom-right corner is "bitten out" with a circular cut.
         * The arrow sits inside that concave socket.
         */
        .organic-card {
          position: relative;
          overflow: hidden;
          border-radius: 30px;
        }

        .organic-card::after {
          content: "";
          position: absolute;
          width: 76px;
          height: 76px;
          right: 0;
          bottom: 0px;
          background: #F4EEE0;
          border-top-left-radius: 100%;
          z-index: 5;
          pointer-events: none;
        }

        /*
         * Small convex transition on the right edge.
         * This makes the cut feel intentional instead of looking
         * like a simple missing corner.
         */
        .organic-card::before {
          content: "";
          position: absolute;
          width: 32px;
          height: 32px;
          right: 0;
          bottom: 76px;
          background: inherit;
          border-bottom-left-radius: 100%;
          z-index: 4;
          pointer-events: none;
        }

        .organic-arrow {
          position: absolute;
          right: 0;
          bottom: 0;
          z-index: 10;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-fade {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

            <div className="mx-auto grid max-w-[1800px] grid-cols-1 gap-3 lg:grid-cols-[1fr_360px]">

                {/* ---- Right column: stat + two cards ---- */}
                <div className="order-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:order-2 lg:grid-cols-1">

                    {/* Stat circle */}
                    <div
                        className={`hero-fade relative flex aspect-square flex-col items-center justify-center rounded-full bg-[#D99A4E] px-6 text-center transition-all delay-150 duration-700 ease-out ${loaded
                            ? "scale-100 opacity-100"
                            : "scale-90 opacity-0"
                            }`}
                    >
                        <span className="font-display text-6xl text-[#1B1712] sm:text-7xl">
                            14
                        </span>

                        <span className="mt-2 font-ui text-sm text-[#3A2A16]">
                            years cooking
                            <br />
                            over open flame
                        </span>
                    </div>


                    {/* =====================================================
                        SIX SEATS / CHEF'S TABLE
                        Organic convex + concave shape
                    ====================================================== */}
                    <a
                        href="#private-dining"
                        className={`hero-fade organic-card group flex min-h-[220px] flex-col justify-between p-6 transition-all delay-200 duration-700 ease-out ${loaded
                            ? "translate-y-0 opacity-100"
                            : "translate-y-4 opacity-0"
                            }`}
                    >

                        {/* Parallax background image */}
                        <div className="absolute inset-0 overflow-hidden">
                            <img
                                src="/hero-2.jpg"
                                alt=""
                                className="absolute inset-0 h-[125%] scale-[1.4] w-full object-cover will-change-transform"
                                style={{
                                    transform: `translate3d(0, ${parallaxY}px, 0)`,
                                }}
                            />

                            {/* Dark cinematic overlay */}
                            <div className="absolute inset-0 bg-black/35 transition-colors duration-500 group-hover:bg-black/25" />
                        </div>

                        {/* Content */}
                        <p className="relative z-10 font-display text-2xl leading-snug text-[#F4EEE0]">
                            Six seats at the fire.
                            <br />
                            Reserve the chef's table.
                        </p>

                        {/* Arrow sitting inside the concave corner */}

                        <span className="organic-arrow flex h-12 w-12 items-center justify-center rounded-full bg-[#1B1712] text-2xl text-[#F4EEE0] transition-transform duration-300 group-hover:translate-x-1">
                            →
                        </span>
                        <span
                            className="absolute bottom-[71px] right-0 z-20 h-[28px] w-[28px] bg-[#f4eee0]"
                            style={{
                                mask: "radial-gradient(circle at top left, transparent 0 27px, black 28px)",
                                WebkitMask:
                                    "radial-gradient(circle at top left, transparent 0 27px, black 28px)",
                            }}
                        ></span>
                        <span
                            className="absolute bottom-[0px] right-[71px] z-20 h-[28px] w-[28px] bg-[#f4eee0]"
                            style={{
                                mask: "radial-gradient(circle at top left, transparent 0 27px, black 28px)",
                                WebkitMask:
                                    "radial-gradient(circle at top left, transparent 0 27px, black 28px)",
                            }}
                        ></span>
                    </a>


                    {/* =====================================================
                        TASTING MENU
                        Same organic convex + concave shape
                    ====================================================== */}
                    <a
                        href="#menu"
                        className={`hero-fade organic-card group flex min-h-[220px] flex-col justify-between bg-[#7A3B2E] p-6 transition-all delay-300 duration-700 ease-out ${loaded
                            ? "translate-y-0 opacity-100"
                            : "translate-y-4 opacity-0"
                            }`}
                    >

                        <p className="relative z-10 font-display text-2xl leading-snug text-[#F4EEE0]">
                            Nine courses.
                            <br />
                            One long table.
                            <br />
                            <span className="text-[#E7B98C]">
                                The tasting menu.
                            </span>
                        </p>

                        {/* Arrow sitting inside the concave corner */}
                        <span className="organic-arrow flex h-12 w-12 items-center justify-center rounded-full bg-[#1B1712] text-2xl text-[#F4EEE0] transition-transform duration-300 group-hover:translate-x-1">
                            →
                        </span>
                        <span
                            className="absolute bottom-[71px] right-0 z-20 h-[28px] w-[28px] bg-[#f4eee0]"
                            style={{
                                mask: "radial-gradient(circle at top left, transparent 0 27px, black 28px)",
                                WebkitMask:
                                    "radial-gradient(circle at top left, transparent 0 27px, black 28px)",
                            }}
                        ></span>
                        <span
                            className="absolute bottom-[0px] right-[71px] z-20 h-[28px] w-[28px] bg-[#f4eee0]"
                            style={{
                                mask: "radial-gradient(circle at top left, transparent 0 27px, black 28px)",
                                WebkitMask:
                                    "radial-gradient(circle at top left, transparent 0 27px, black 28px)",
                            }}
                        ></span>
                    </a>

                </div>


                {/* ---- Main hero media block ---- */}
                <div
                    className={`hero-fade relative order-1 col-span-1 min-h-[560px] overflow-hidden rounded-[32px] transition-all delay-100 duration-700 ease-out lg:order-1 lg:min-h-[720px] ${loaded
                        ? "scale-100 opacity-100"
                        : "scale-[0.98] opacity-0"
                        }`}
                >

                    {/* Replace src with your own footage. Keep muted+loop+playsInline for autoplay. */}
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop"
                        className="absolute inset-0 h-full w-full object-cover"
                    >
                        <source src="/cafe-home.mp4" type="video/mp4" />
                    </video>


                    {/* subtle bottom scrim so the headline card stays legible */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/35 to-transparent" />


                    {/* Headline card — flush against the image's own left/bottom edges */}
                    <div
                        className="absolute bottom-0 left-0 w-[92%] sm:w-[88%] max-w-xl bg-[#F4EEE0] p-6 sm:p-8 lg:p-10"
                        style={{
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 28,
                            borderBottomRightRadius: 0,
                            borderBottomLeftRadius: 32,
                        }}
                    >
                        <CornerNotch
                            corner="top-right"
                            size={32}
                            color="#F4EEE0"
                        />

                        <h1
                            ref={headlineRef}
                            className="font-display text-[36px] leading-[1.05] text-[#1B1712] sm:text-[42px] lg:text-[54px]"
                        >
                            Fire finds its own rhythm, and dinner follows it.
                        </h1>

                        <p className="mt-4 max-w-md font-ui text-[15px] leading-relaxed text-[#5A5142]">
                            A wood-fired kitchen in the heart of Fitzroy — seasonal
                            produce, live coals, and a menu that changes with what
                            arrives at the back door each morning.
                        </p>

                        <CornerNotch
                            corner={"bottom-right"}
                            size={32}
                            className="-right-[31px] -rotate-90 bottom-0"
                            color="#F4EEE0"
                        />
                    </div>


                    {/* Scroll cue, top-left of image */}
                    <button
                        aria-label="Scroll to menu"
                        className="absolute left-[45%] bottom-6 flex h-11 w-11 items-center justify-center rounded-full bg-[#848484] text-[#1B1712] backdrop-blur transition-transform hover:translate-y-0.5"
                        onClick={() =>
                            document
                                .querySelector("#menu")
                                ?.scrollIntoView({
                                    behavior: "smooth",
                                })
                        }
                    >
                        ↓
                    </button>

                </div>
            </div>
        </section>
    );
}