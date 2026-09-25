import React from "react";

interface MenuItem {
    title: string;
    image: string;
    bg: string;
    textColor?: string;
    accentColor?: string;
}

const menuItems: MenuItem[] = [
    {
        title: "Small Plates",
        image:
            "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
        bg: "#B96A3C",
    },
    {
        title: "Wood Fired",
        image:
            "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=85",
        bg: "#5453A6",
    },
    {
        title: "Mains",
        image:
            "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=900&q=85",
        bg: "#4DBB83",
        textColor: "#F4EEE0",
    },
    {
        title: "Chef's Table",
        image:
            "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=85",
        bg: "#0D4CC9",
    },
    {
        title: "From The Grill",
        image:
            "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85",
        bg: "#7A3B2E",
    },
    {
        title: "Vegetables",
        image:
            "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85",
        bg: "#6A6C29",
    },
    {
        title: "Desserts",
        image:
            "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=85",
        bg: "#D59A58",
    },
    {
        title: "Drinks",
        image:
            "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=85",
        bg: "#A85355",
    },
];

/* Duplicate the data so the marquee can loop seamlessly. */
const topRow = [...menuItems, ...menuItems];
const bottomRow = [...menuItems.slice(4), ...menuItems.slice(0, 4), ...menuItems];

function MenuCard({
    item,
}: {
    item: MenuItem;
}) {
    return (
        <a
            href="#menu"
            className="menu-card group relative block h-[315px] w-[515px] flex-shrink-0 overflow-hidden"
            style={{
                backgroundColor: item.bg,
                color: item.textColor || "#F4EEE0",
            }}
        >
            {/* Main card content */}

            <div className="relative z-10 h-full w-full">
                {/* Title */}
                <h3
                    className="absolute left-[38px] top-[28px] max-w-[280px] font-display text-[42px] font-medium leading-[0.98] tracking-[-0.04em]"
                >
                    {item.title}
                </h3>

                {/* Circular food image */}
                <div className="absolute left-1/2 top-1/2 h-[265px] w-[265px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full">
                    <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                    />

                    {/* Slight cinematic tint */}
                    <div className="absolute inset-0 bg-black/5 transition-colors duration-500 group-hover:bg-black/0" />
                </div>

                {/* Learn more */}
                <span className="absolute bottom-[22px] right-[90px] font-ui text-[22px] tracking-[-0.03em] transition-transform duration-300 group-hover:-translate-x-1">
                    Learn more
                </span>
            </div>

            {/* Background-colored socket behind arrow */}
            <div
                className="pointer-events-none absolute bottom-0 right-0 z-20 h-[76px] w-[76px] rounded-tl-full bg-[#F4EEE0]"
            />

            {/* Floating Arrow */}
            <span className="absolute bottom-0 right-0 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-[#1B1712] text-2xl text-[#F4EEE0] transition-transform duration-300 group-hover:translate-x-1">
                →
            </span>

            {/* Corner notch above arrow socket */}
            <span
                className="pointer-events-none absolute bottom-[71px] right-0 z-20 h-[28px] w-[28px] bg-[#f4eee0]"
                style={{
                    mask: "radial-gradient(circle at top left, transparent 0 27px, black 28px)",
                    WebkitMask:
                        "radial-gradient(circle at top left, transparent 0 27px, black 28px)",
                }}
            ></span>

            {/* Corner notch left of arrow socket */}
            <span
                className="pointer-events-none absolute bottom-[0px] right-[71px] z-20 h-[28px] w-[28px] bg-[#f4eee0]"
                style={{
                    mask: "radial-gradient(circle at top left, transparent 0 27px, black 28px)",
                    WebkitMask:
                        "radial-gradient(circle at top left, transparent 0 27px, black 28px)",
                }}
            ></span>
        </a>
    );
}

export default function RestaurantMenu() {
    return (
        <section
            id="menu"
            className="relative w-full overflow-hidden bg-[#F4EEE0] py-20"
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');

                .font-display {
                    font-family: 'Fraunces', serif;
                }

                .font-ui {
                    font-family: 'Inter', sans-serif;
                }

                /*
                 * Card shape
                 *
                 * Rounded convex corners everywhere,
                 * then the bottom-right is visually carved out
                 * for the floating arrow.
                 */
                .menu-card {
                    border-radius: 34px;
                    isolation: isolate;
                }

                /*
                 * Extra large outer curvature makes the cards
                 * feel closer to the reference image.
                 */
                .menu-card::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    border-radius: 34px;
                    pointer-events: none;
                    z-index: 1;
                }

                /*
                 * Endless horizontal movement
                 */
                .menu-track-left {
                    animation: menuMoveLeft 42s linear infinite;
                }

                .menu-track-right {
                    animation: menuMoveRight 42s linear infinite;
                }

                @keyframes menuMoveLeft {
                    from {
                        transform: translate3d(0, 0, 0);
                    }
                    to {
                        transform: translate3d(-50%, 0, 0);
                    }
                }

                @keyframes menuMoveRight {
                    from {
                        transform: translate3d(-50%, 0, 0);
                    }
                    to {
                        transform: translate3d(0, 0, 0);
                    }
                }

                /*
                 * Slight card rotation while hovering only.
                 * The rows themselves remain smoothly horizontal.
                 */
                .menu-card:hover {
                    transform: translateY(-3px);
                }

                /*
                 * Pause each row when the user hovers it.
                 * Makes the interaction feel intentional.
                 */
                .menu-row:hover .menu-track-left,
                .menu-row:hover .menu-track-right {
                    animation-play-state: paused;
                }

                @media (prefers-reduced-motion: reduce) {
                    .menu-track-left,
                    .menu-track-right {
                        animation: none !important;
                        transform: none !important;
                    }
                }

                @media (max-width: 768px) {
                    .menu-card {
                        width: 360px;
                        height: 255px;
                    }

                    .menu-card h3 {
                        left: 24px;
                        top: 22px;
                        font-size: 32px;
                    }

                    .menu-card > div > div:nth-child(2) {
                        width: 205px;
                        height: 205px;
                    }

                    .menu-card span {
                        font-size: 18px;
                    }
                }
            `}</style>

            {/* ----------------------------------------------------------
                SECTION HEADER
            ----------------------------------------------------------- */}
            <div className="relative z-20 mx-auto mb-12 max-w-[1800px] px-5 sm:px-8">
                <div className="flex items-end justify-between gap-6">
                    <div>
                        <span className="font-ui text-xs uppercase tracking-[0.2em] text-[#8A7F68]">
                            What's on the table
                        </span>

                        <h2 className="mt-3 max-w-[700px] font-display text-[42px] leading-[0.95] tracking-[-0.045em] text-[#1B1712] sm:text-[56px] lg:text-[72px]">
                            A menu built
                            <br />
                            around fire.
                        </h2>
                    </div>

                    <a
                        href="#full-menu"
                        className="hidden rounded-full bg-[#1B1712] px-6 py-3 font-ui text-sm text-[#F4EEE0] transition-transform duration-300 hover:scale-[1.03] sm:block"
                    >
                        View full menu
                    </a>
                </div>
            </div>

            {/* ----------------------------------------------------------
                ROW 1
                Moves LEFT
            ----------------------------------------------------------- */}
            <div className="menu-row relative mb-4 w-full overflow-hidden">
                <div className="menu-track-left flex w-max gap-3">
                    {topRow.map((item, index) => (
                        <MenuCard
                            key={`top-${item.title}-${index}`}
                            item={item}
                        />
                    ))}
                </div>
            </div>

            {/* ----------------------------------------------------------
                ROW 2
                Moves RIGHT
            ----------------------------------------------------------- */}
            <div className="menu-row relative w-full overflow-hidden">
                <div className="menu-track-right flex w-max gap-3">
                    {bottomRow.map((item, index) => (
                        <MenuCard
                            key={`bottom-${item.title}-${index}`}
                            item={item}
                        />
                    ))}
                </div>
            </div>

            {/* Optional bottom spacing */}
            <div className="mx-auto mt-10 flex justify-center sm:hidden">
                <a
                    href="#full-menu"
                    className="rounded-full bg-[#1B1712] px-6 py-3 font-ui text-sm text-[#F4EEE0]"
                >
                    View full menu
                </a>
            </div>
        </section>
    );
}