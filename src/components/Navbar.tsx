import { useEffect, useState } from "react";

/**
 * EMBER — Sticky Navbar
 * React + Tailwind CSS
 *
 * This ports the actual technique used in the reference site's markup
 * (not a guess at it): the "wave" corner is one simple quarter-circle SVG
 * path —
 *   M100,0 H0 V100 C0,44.77 44.77,0 100,0 Z
 * — filled solid. 44.77 is just 100 × (1 − 0.5523), the standard
 * circle-with-bezier constant, so the curve is a true quarter circle, not
 * a hand-drawn blob. Reused at different corners (flipped via CSS
 * transform) it can round a viewport corner, cut a concave notch into a
 * card, or both — that's <Notch /> below.
 *
 * Structure:
 * 0. TOP_STRIP — a solid horizontal band pinned above absolutely
 *    everything else (highest z-index), full viewport width.
 * 1. Thin scroll-progress bar, sitting just below the strip.
 * 2. LogoCard — opaque card, bottom-right corner cut with the notch.
 * 3. NavPill — links + socials + search, translucent, floats over the
 *    hero image/video, firms up once scrolled.
 * 4. Two tiny corner notches pinned to the browser viewport's top-left
 *    and top-right corners, matching the reference's rounded-viewport
 *    detail (purely decorative — safe to delete if you don't want it).
 *
 * Swap NAV_ITEMS, the socials hrefs, and the copy for your own.
 */

const TOP_STRIP_HEIGHT = 10; // px — bump this to make the strip thicker

const NAV_ITEMS = [
    { label: "Menu", href: "#menu" },
    {
        label: "Private Dining",
        href: "#private-dining",
        submenu: [
            { label: "Chef's Table", href: "#chefs-table" },
            { label: "Group Bookings", href: "#groups" },
            { label: "Events", href: "#events" },
        ],
    },
    { label: "Reservations", href: "#reservations" },
    { label: "Our Story", href: "#story" },
    { label: "Contact", href: "#contact" },
];

// The exact quarter-circle notch from the reference markup.
// flip: "none" | "x" | "y" | "xy" — reuse one path for any corner.
function Notch({ size = 28, color = "#F4EEE0", flip = "none" }) {
    const transform = {
        none: "none",
        x: "scaleX(-1)",
        y: "scaleY(-1)",
        xy: "scale(-1,-1)",
    }[flip];

    return (
        <svg
            aria-hidden="true"
            width={size}
            height={size}
            viewBox="0 0 100 100"
            style={{ transform }}
        >
            <path d="M100,0H0v100C0,44.77,44.77,0,100,0Z" fill={color} />
        </svg>
    );
}

// LinkedIn / Instagram — standard brand glyphs
function LinkedInIcon() {
    return (
        <svg role="img" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <title>LinkedIn</title>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    );
}

function InstagramIcon() {
    return (
        <svg role="img" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <title>Instagram</title>
            <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
        </svg>
    );
}

function SearchIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 43 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="25.4375" cy="16.5657" r="14.5657" stroke="currentColor" strokeWidth="4" />
            <path d="M14.1482 27.852L1.99999 40.0002" stroke="currentColor" strokeWidth="4" />
        </svg>
    );
}

const CHEVRON_PATH =
    "M19.4481 3.525L7.99812 15L19.4481 26.475L15.9231 30L0.92312 15L15.9231 1.59918e-06L19.4481 3.525Z";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [progress, setProgress] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 48);
            const max = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-ui { font-family: 'Inter', sans-serif; }
      `}</style>

            {/* ---- 0. Top strip — solid band above absolutely everything ---- */}
            <div
                className="fixed inset-x-0 top-0 z-[80] bg-[#F4EEE0]"
                style={{ height: TOP_STRIP_HEIGHT }}
            />

            {/* Decorative viewport-corner rounding — optional, remove freely.
          Sits just below the strip, so it doesn't poke out above it. */}
            <span
                className="fixed left-0 z-[60]"
                style={{ top: TOP_STRIP_HEIGHT }}
            >
                <Notch size={20} color="#F4EEE0" flip="none" />
            </span>
            <span
                className="fixed right-0 z-[60]"
                style={{ top: TOP_STRIP_HEIGHT }}
            >
                <Notch size={20} color="#F4EEE0" flip="x" />
            </span>

            {/* Scroll progress bar — just below the strip */}
            {/* <div
                className="fixed inset-x-0 z-[60] h-[3px] bg-[#E5DAC0]"
                style={{ top: TOP_STRIP_HEIGHT }}
            >
                <div
                    className="h-full bg-[#D99A4E] transition-[width] duration-150 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div> */}

            <header
                className="fixed inset-x-0 z-50 flex items-start gap-3 px-3 sm:px-4"
                style={{ top: TOP_STRIP_HEIGHT, paddingTop: 0 }}
            >
                {/* ---- 1. Logo card — opaque, quarter-circle notch bottom-right ---- */}
                <div
                    className="relative z-10 flex-shrink-0 rounded-tl-[0px] rounded-tr-[0px] rounded-bl-[0px] bg-[#F4EEE0] px-6 py-4 font-ui"
                    style={{ borderBottomRightRadius: 28 }}
                >
                    <span className="pointer-events-none absolute -bottom-[30px] right-[128px] translate-x-[1px] translate-y-[1px]">
                        <Notch size={32} color="#F4EEE0" />
                    </span>
                    <span className="pointer-events-none absolute -top-[1px] -right-[30px] translate-x-[1px] translate-y-[1px]">
                        <Notch size={32} color="#F4EEE0" />
                    </span>

                    <span className="block text-[11px] tracking-wide text-[#8A7F68]">
                        Fitzroy, Melbourne
                    </span>
                    <div className="mt-1 flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1B1712] text-sm font-semibold text-[#F4EEE0]">
                            E
                        </span>
                        <span className="font-display text-2xl text-[#1B1712]">
                            Ember
                        </span>
                    </div>
                </div>

                {/* Mobile menu toggle */}
                <button
                    onClick={() => setMobileOpen((v) => !v)}
                    className="ml-auto flex-shrink-0 self-center rounded-full bg-[#1B1712] px-4 py-2 font-ui text-sm text-[#F4EEE0] md:hidden"
                >
                    {mobileOpen ? "Close" : "Menu"}
                </button>

                {/* ---- 2. Nav pill — translucent capsule ---- */}
                <nav
                    className={`hidden w-full max-w-[800px] items-center justify-between gap-6 mt-[10px] rounded-full px-6 py-2 font-ui backdrop-blur-xl transition-all duration-500 ease-out md:flex ${scrolled
                        ? "bg-[#F4EEE0]/95 shadow-[0_10px_30px_rgba(27,23,18,0.15)]"
                        : "bg-[#F4EEE0]/30 shadow-none"
                        }`}
                >
                    <ul className="flex items-center gap-6 text-[15px] text-[#3A342A]">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.label} className="group relative">
                                <a
                                    href={item.href}
                                    className="flex items-center gap-1 py-2 transition-colors hover:text-[#1B1712]"
                                >
                                    {item.label}
                                    {item.submenu && (
                                        <svg
                                            width="9"
                                            height="14"
                                            viewBox="0 0 20 30"
                                            fill="none"
                                            className="rotate-90 opacity-60"
                                        >
                                            <path d={CHEVRON_PATH} fill="currentColor" />
                                        </svg>
                                    )}
                                </a>

                                {item.submenu && (
                                    <ul className="invisible absolute left-0 top-full mt-2 w-48 rounded-2xl bg-[#F4EEE0] p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
                                        {item.submenu.map((sub) => (
                                            <li key={sub.label}>
                                                <a
                                                    href={sub.href}
                                                    className="block rounded-xl px-3 py-2 text-sm text-[#3A342A] hover:bg-[#EFE6D2] hover:text-[#1B1712]"
                                                >
                                                    {sub.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center gap-4">
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Instagram"
                            className="text-[#1B1712] transition-opacity hover:opacity-70"
                        >
                            <InstagramIcon />
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="LinkedIn"
                            className="text-[#1B1712] transition-opacity hover:opacity-70"
                        >
                            <LinkedInIcon />
                        </a>

                        {/* Search */}
                        <div className="flex items-center gap-2">
                            {searchOpen && (
                                <input
                                    type="text"
                                    placeholder="Search the menu..."
                                    autoFocus
                                    className="w-40 rounded-full border border-[#D9CDAF] bg-white/70 px-3 py-1.5 text-sm text-[#1B1712] outline-none placeholder:text-[#8A7F68]"
                                />
                            )}
                            <button
                                onClick={() => setSearchOpen((v) => !v)}
                                aria-label="Toggle search"
                                className="text-[#1B1712]"
                            >
                                <SearchIcon />
                            </button>
                        </div>

                        <a
                            href="#reservations"
                            className="rounded-full bg-[#1B1712] px-5 py-2.5 text-sm font-medium text-[#F4EEE0] transition-transform hover:scale-[1.03]"
                        >
                            Book a table
                        </a>
                    </div>
                </nav>
            </header>

            {/* ---- Mobile menu panel ---- */}
            {mobileOpen && (
                <div
                    className="fixed inset-x-3 z-40 rounded-[28px] bg-[#F4EEE0] p-6 font-ui shadow-2xl md:hidden"
                    style={{ top: TOP_STRIP_HEIGHT + 92 }}
                >
                    <ul className="flex flex-col gap-1">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.label}>
                                <a
                                    href={item.href}
                                    className="block rounded-xl px-3 py-3 text-lg text-[#1B1712]"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {item.label}
                                </a>
                                {item.submenu && (
                                    <ul className="ml-4 flex flex-col gap-1 border-l border-[#D9CDAF] pl-4">
                                        {item.submenu.map((sub) => (
                                            <li key={sub.label}>
                                                <a
                                                    href={sub.href}
                                                    className="block rounded-lg px-2 py-2 text-sm text-[#5A5142]"
                                                    onClick={() => setMobileOpen(false)}
                                                >
                                                    {sub.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 flex items-center gap-4 border-t border-[#D9CDAF] pt-4">
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-[#1B1712]">
                            <InstagramIcon />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-[#1B1712]">
                            <LinkedInIcon />
                        </a>
                        <a
                            href="#reservations"
                            className="ml-auto rounded-full bg-[#1B1712] px-5 py-2.5 text-sm font-medium text-[#F4EEE0]"
                            onClick={() => setMobileOpen(false)}
                        >
                            Book a table
                        </a>
                    </div>
                </div>
            )}
        </>
    );
}