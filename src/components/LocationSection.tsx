import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

// ============================================================================
// TYPES & HOURS DATA
// ============================================================================

interface HourEntry {
    day: string;
    open: string | null; // "HH:MM" 24h, or null = closed
    close: string | null;
}

/**
 * Restaurant trading hours.
 * Array order: Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6
 */
const HOURS: HourEntry[] = [
    { day: "Mon", open: null,    close: null  },
    { day: "Tue", open: "17:00", close: "22:00" },
    { day: "Wed", open: "17:00", close: "22:00" },
    { day: "Thu", open: "17:00", close: "22:00" },
    { day: "Fri", open: "17:00", close: "23:00" },
    { day: "Sat", open: "17:00", close: "23:00" },
    { day: "Sun", open: "17:00", close: "21:00" },
];

// JS Date.getDay() → HOURS array index  (Sun=0 in JS, Mon=0 in our array)
const JS_DAY_TO_HOURS_IDX = [6, 0, 1, 2, 3, 4, 5];

const DIRECTIONS_URL =
    "https://www.google.com/maps/dir/?api=1&destination=14+Gertrude+Street+Fitzroy+VIC+3065+Australia";

// ============================================================================
// HELPERS
// ============================================================================

function formatTime(hhmm: string): string {
    const [h, m] = hhmm.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

interface StatusInfo {
    isOpen: boolean;
    message: string;
}

function getOpenStatus(now: Date): StatusInfo {
    const idx = JS_DAY_TO_HOURS_IDX[now.getDay()];
    const today = HOURS[idx];
    const cur = now.getHours() * 60 + now.getMinutes();

    if (today.open && today.close) {
        const [oh, om] = today.open.split(":").map(Number);
        const [ch, cm] = today.close.split(":").map(Number);
        const openMin  = oh * 60 + om;
        const closeMin = ch * 60 + cm;

        if (cur >= openMin && cur < closeMin) {
            const minsLeft = closeMin - cur;
            if (minsLeft <= 60) {
                // Last seating 30 min before close
                const lsMin = closeMin - 30;
                const lsH   = Math.floor(lsMin / 60);
                const lsM   = lsMin % 60;
                return {
                    isOpen: true,
                    message: `Open — last seating at ${formatTime(`${lsH}:${lsM.toString().padStart(2, "0")}`)}`,
                };
            }
            return { isOpen: true, message: `Open now — until ${formatTime(today.close)}` };
        }
    }

    // Find next open slot (look ahead up to 7 days)
    for (let i = 1; i <= 7; i++) {
        const nextIdx = (idx + i) % 7;
        const next = HOURS[nextIdx];
        if (next.open) {
            const dayLabel = i === 1 ? "tomorrow" : next.day;
            return {
                isOpen: false,
                message: `Closed — opens ${dayLabel} at ${formatTime(next.open)}`,
            };
        }
    }
    return { isOpen: false, message: "Closed" };
}

interface HoursRow {
    dayLabel:   string;
    hoursLabel: string;
    isToday:    boolean;
    isClosed:   boolean;
}

function buildHoursRows(todayIdx: number): HoursRow[] {
    const rows: HoursRow[] = [];
    let i = 0;
    while (i < HOURS.length) {
        const start = i;
        const ref   = HOURS[i];
        while (
            i + 1 < HOURS.length &&
            HOURS[i + 1].open  === ref.open &&
            HOURS[i + 1].close === ref.close
        ) i++;
        const end = i;

        rows.push({
            dayLabel:
                start === end
                    ? HOURS[start].day
                    : `${HOURS[start].day} – ${HOURS[end].day}`,
            hoursLabel:
                ref.open && ref.close
                    ? `${formatTime(ref.open)} – ${formatTime(ref.close)}`
                    : "Closed",
            isToday:  todayIdx >= start && todayIdx <= end,
            isClosed: !ref.open,
        });
        i++;
    }
    return rows;
}

// ============================================================================
// MAP PLACEHOLDER
// ============================================================================
// ─────────────────────────────────────────────────────────────────────────────
// REAL MAP INTEGRATION NOTE
// Replace the <MapPlaceholder /> SVG below with either:
//
//  A) Google Maps JavaScript API (recommended)
//     - Init a map in a <div ref={mapRef}> using new window.google.maps.Map()
//     - Pass a custom `styles` array to match the site palette:
//       land: #EDE5D0, parks: #8FA891, roads: #F4EEE0, labels: #8A7F68
//     - Center: { lat: -37.8039, lng: 144.9793 }
//     - Use AdvancedMarkerElement with the EmberPin SVG below as the icon
//
//  B) Mapbox GL JS
//     - Use a custom Mapbox style (Style Editor or JSON) for the muted palette
//     - new mapboxgl.Marker(el).setLngLat([144.9793, -37.8039]).addTo(map)
//       where el is a DOM node rendered from the EmberPin SVG below
//
// The custom amber marker (EmberPin) should be reused as the actual marker
// icon in either integration — it matches the site's "E" nav logomark exactly.
// ─────────────────────────────────────────────────────────────────────────────

function MapPlaceholder() {
    return (
        <svg
            viewBox="0 0 800 560"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
            aria-label="Placeholder map — Ember restaurant, 14 Gertrude Street Fitzroy"
        >
            {/* ── Land ── */}
            <rect width="800" height="560" fill="#EDE5D0" />

            {/* ── City block fills (slightly darker than land) ── */}
            {/* Row 1 */}
            <rect x="0"   y="0"   width="148" height="118" fill="#E6DCC6" rx="2" />
            <rect x="158" y="0"   width="108" height="118" fill="#E6DCC6" rx="2" />
            <rect x="276" y="0"   width="108" height="118" fill="#E6DCC6" rx="2" />
            <rect x="424" y="0"   width="108" height="118" fill="#E6DCC6" rx="2" />
            <rect x="542" y="0"   width="108" height="118" fill="#E6DCC6" rx="2" />
            <rect x="660" y="0"   width="140" height="118" fill="#E6DCC6" rx="2" />

            {/* Row 2 (between Gertrude and the top minor street) */}
            <rect x="0"   y="128" width="148" height="118" fill="#E6DCC6" rx="2" />
            <rect x="158" y="128" width="108" height="118" fill="#E6DCC6" rx="2" />
            <rect x="424" y="128" width="108" height="118" fill="#E6DCC6" rx="2" />
            <rect x="542" y="128" width="108" height="118" fill="#E6DCC6" rx="2" />
            <rect x="660" y="128" width="140" height="118" fill="#E6DCC6" rx="2" />

            {/* Row 3 (below Gertrude) */}
            <rect x="0"   y="276" width="148" height="118" fill="#E6DCC6" rx="2" />
            <rect x="158" y="276" width="108" height="118" fill="#E6DCC6" rx="2" />
            <rect x="424" y="276" width="108" height="118" fill="#E6DCC6" rx="2" />
            <rect x="542" y="276" width="108" height="118" fill="#E6DCC6" rx="2" />
            <rect x="660" y="276" width="140" height="118" fill="#E6DCC6" rx="2" />

            {/* Row 4 */}
            <rect x="0"   y="404" width="148" height="156" fill="#E6DCC6" rx="2" />
            <rect x="158" y="404" width="108" height="156" fill="#E6DCC6" rx="2" />
            <rect x="424" y="404" width="108" height="156" fill="#E6DCC6" rx="2" />
            <rect x="542" y="404" width="108" height="156" fill="#E6DCC6" rx="2" />
            <rect x="660" y="404" width="140" height="156" fill="#E6DCC6" rx="2" />

            {/* ── Parks ── */}
            {/* Edinburgh Gardens-style — upper area, straddling Smith St */}
            <ellipse cx="276" cy="190" rx="115" ry="70" fill="#8FA891" opacity="0.70" />
            <ellipse cx="258" cy="175" rx="85"  ry="52" fill="#7A9B7C" opacity="0.35" />
            {/* Tree texture dots */}
            <circle cx="238" cy="172" r="10" fill="#6E9070" opacity="0.35" />
            <circle cx="268" cy="162" r="8"  fill="#6E9070" opacity="0.30" />
            <circle cx="294" cy="178" r="11" fill="#6E9070" opacity="0.28" />
            <circle cx="255" cy="196" r="9"  fill="#6E9070" opacity="0.32" />

            {/* Small park — bottom right */}
            <ellipse cx="606" cy="448" rx="70" ry="52" fill="#8FA891" opacity="0.60" />
            <circle  cx="596" cy="440" r="9"            fill="#6E9070" opacity="0.30" />
            <circle  cx="618" cy="455" r="7"            fill="#6E9070" opacity="0.28" />

            {/* Tiny green square — top right corner */}
            <rect x="678" y="34" width="52" height="44" rx="5" fill="#8FA891" opacity="0.55" />

            {/* ── Roads ── */}

            {/* Major horizontal — Gertrude Street ── */}
            <rect x="0" y="248" width="800" height="20" fill="#F4EEE0" />
            <line x1="0" y1="248" x2="800" y2="248" stroke="#CFC2A8" strokeWidth="1" opacity="0.6" />
            <line x1="0" y1="268" x2="800" y2="268" stroke="#CFC2A8" strokeWidth="1" opacity="0.6" />

            {/* Secondary horizontal — top */}
            <rect x="0" y="120" width="800" height="10" fill="#EDE6D4" />
            <line x1="0" y1="120" x2="800" y2="120" stroke="#CFC2A8" strokeWidth="0.75" opacity="0.4" />

            {/* Secondary horizontal — lower */}
            <rect x="0" y="396" width="800" height="10" fill="#EDE6D4" />
            <line x1="0" y1="396" x2="800" y2="396" stroke="#CFC2A8" strokeWidth="0.75" opacity="0.4" />

            {/* Minor horizontal */}
            <rect x="0" y="62" width="800" height="6" fill="#EAE2D0" opacity="0.7" />
            <rect x="0" y="506" width="800" height="6" fill="#EAE2D0" opacity="0.7" />

            {/* Major vertical — Smith Street ── */}
            <rect x="266" y="0" width="18" height="560" fill="#F4EEE0" />
            <line x1="266" y1="0" x2="266" y2="560" stroke="#CFC2A8" strokeWidth="1" opacity="0.6" />
            <line x1="284" y1="0" x2="284" y2="560" stroke="#CFC2A8" strokeWidth="1" opacity="0.6" />

            {/* Secondary vertical — right */}
            <rect x="532" y="0" width="12" height="560" fill="#EDE6D4" />
            <line x1="532" y1="0" x2="532" y2="560" stroke="#CFC2A8" strokeWidth="0.75" opacity="0.4" />

            {/* Secondary vertical — left */}
            <rect x="0" y="0" width="6" height="560" fill="#EDE6D4" opacity="0.5" />

            {/* Minor vertical right-most */}
            <rect x="652" y="0" width="8" height="560" fill="#EAE2D0" opacity="0.7" />

            {/* ── Road labels ── */}
            <text x="316" y="262" fill="#9E9282" fontSize="8.5" fontFamily="Inter, sans-serif"
                letterSpacing="0.12em" opacity="0.75">
                GERTRUDE ST
            </text>

            <g transform="translate(260,190) rotate(-90)">
                <text x="0" y="0" textAnchor="middle" fill="#9E9282"
                    fontSize="8" fontFamily="Inter, sans-serif"
                    letterSpacing="0.10em" opacity="0.65">
                    SMITH ST
                </text>
            </g>

            {/* ── Ember Location Pin ─────────────────────────────────────── */}
            {/* Reuse this marker as the actual AdvancedMarkerElement icon in
                your Google Maps / Mapbox integration. */}

            {/* Drop shadow */}
            <ellipse cx="275" cy="268" rx="22" ry="6" fill="#1B1712" opacity="0.20" />
            {/* White ring */}
            <circle  cx="275" cy="242" r="25" fill="white" filter="url(#pin-shadow)" />
            {/* Amber fill */}
            <circle  cx="275" cy="242" r="20" fill="#D99A4E" />
            {/* "E" monogram */}
            <text
                x="275" y="248"
                textAnchor="middle"
                fill="#1B1712"
                fontSize="17"
                fontWeight="700"
                fontFamily="Georgia, serif"
                letterSpacing="-0.04em"
            >
                E
            </text>

            {/* Soft drop-shadow filter for pin */}
            <defs>
                <filter id="pin-shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#1B1712" floodOpacity="0.22" />
                </filter>
            </defs>
        </svg>
    );
}

// ============================================================================
// PULSE DOT
// ============================================================================

function PulseDot({ isOpen }: { isOpen: boolean }) {
    return (
        <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
            <span
                className="absolute inline-flex h-full w-full rounded-full"
                style={{
                    backgroundColor: isOpen ? "#3F5B43" : "#9CA3AF",
                    animation: isOpen ? "ember-status-pulse 2s ease-in-out infinite" : "none",
                }}
            />
            <span
                className="relative inline-flex h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: isOpen ? "#3F5B43" : "#9CA3AF" }}
            />
        </span>
    );
}

// ============================================================================
// LOCATION SECTION — MAIN COMPONENT
// ============================================================================

export default function LocationSection() {
    const [status, setStatus] = useState<StatusInfo>(() => getOpenStatus(new Date()));

    const todayHoursIdx = useMemo(() => JS_DAY_TO_HOURS_IDX[new Date().getDay()], []);
    const hoursRows     = useMemo(() => buildHoursRows(todayHoursIdx), [todayHoursIdx]);

    // Re-evaluate status every 60 s so the tab stays accurate
    useEffect(() => {
        const id = setInterval(() => setStatus(getOpenStatus(new Date())), 60_000);
        return () => clearInterval(id);
    }, []);

    return (
        <section
            id="location"
            style={{ minHeight: "80vh" }}
            className="w-full bg-[#F4EEE0] px-4 py-16 sm:px-8 lg:py-20"
        >
            {/* ── Font import + keyframes ────────────────────────────────── */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');

                #location .font-display { font-family: 'Fraunces', serif; }
                #location .font-ui      { font-family: 'Inter', sans-serif; }

                @keyframes ember-status-pulse {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50%      { opacity: 1;   transform: scale(1.2); }
                }
            `}</style>

            <div className="mx-auto flex max-w-[1400px] flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-16"
                style={{ minHeight: "calc(80vh - 8rem)" }}>

                {/* ── MAP — 58% ──────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="relative overflow-hidden bg-[#EDE5D0] lg:w-[58%]"
                    style={{
                        minHeight: "40vh",
                        borderRadius: "32px",
                    }}
                >
                    <MapPlaceholder />

                    {/* Subtle inner vignette on all edges to "ground" the map */}
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            borderRadius: "32px",
                            boxShadow: "inset 0 0 60px 12px rgba(237,229,208,0.45)",
                        }}
                    />
                </motion.div>

                {/* ── INFO PANEL — 42% ───────────────────────────────────── */}
                <div className="flex flex-col justify-center gap-7 lg:w-[42%]">

                    {/* 1 · Eyebrow ────────────────────────────────────────── */}
                    <p className="font-ui text-sm leading-relaxed text-[#8A7F68]">
                        Find us on Gertrude Street, two doors down from the old post office.
                    </p>

                    {/* 2 · Address ─────────────────────────────────────────── */}
                    <div>
                        <p className="font-ui mb-1 text-[10px] font-semibold uppercase tracking-[0.20em] text-[#8A7F68]">
                            Our Address
                        </p>
                        <h2 className="font-display text-[28px] font-medium leading-[1.15] tracking-[-0.02em] text-[#1B1712] sm:text-[32px]">
                            14 Gertrude Street,<br />
                            Fitzroy VIC 3065
                        </h2>
                    </div>

                    {/* 3 · Open / Closed status ───────────────────────────── */}
                    <div className="flex items-center gap-2.5">
                        <PulseDot isOpen={status.isOpen} />
                        <span className="font-ui text-sm font-medium text-[#1B1712]">
                            {status.message}
                        </span>
                    </div>

                    {/* 4 · Get Directions ─────────────────────────────────── */}
                    <a
                        href={DIRECTIONS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-ui inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#D99A4E] px-6 py-4 text-base font-semibold text-[#1B1712] transition-all duration-200 hover:scale-[1.02] hover:opacity-90 active:scale-[0.98]"
                    >
                        Get Directions
                        <svg
                            width="16" height="16" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor"
                            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </a>

                    {/* 5 · Secondary contact ──────────────────────────────── */}
                    <div className="font-ui flex flex-wrap items-center gap-6">
                        <a
                            href="tel:0394170000"
                            className="flex items-center gap-1.5 text-sm text-[#8A7F68] opacity-80 transition-opacity duration-150 hover:opacity-100"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            (03)&nbsp;9417&nbsp;0000
                        </a>
                        <a
                            href="mailto:hello@ember.com.au"
                            className="flex items-center gap-1.5 text-sm text-[#8A7F68] opacity-80 transition-opacity duration-150 hover:opacity-100"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                            hello@ember.com.au
                        </a>
                    </div>

                    {/* ── Divider ───────────────────────────────────────────── */}
                    <div className="h-px bg-[#D9CDAF]" />

                    {/* 6 · Hours table ────────────────────────────────────── */}
                    <div>
                        <p className="font-ui mb-3 text-[10px] font-semibold uppercase tracking-[0.20em] text-[#8A7F68]">
                            Opening Hours
                        </p>
                        <div className="font-ui flex flex-col">
                            {hoursRows.map((row, i) => (
                                <div
                                    key={i}
                                    className={`
                                        flex items-center justify-between rounded-xl px-3 py-2 text-sm
                                        ${row.isToday
                                            ? "bg-[#D99A4E]/[0.13] font-semibold text-[#1B1712]"
                                            : "font-normal text-[#5A5142]"
                                        }
                                    `}
                                >
                                    <span>{row.dayLabel}</span>
                                    <span className={row.isClosed ? "text-[#9E9282]" : ""}>
                                        {row.hoursLabel}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Divider ───────────────────────────────────────────── */}
                    <div className="h-px bg-[#D9CDAF]" />

                    {/* 7 · Getting here ───────────────────────────────────── */}
                    <div>
                        <p className="font-ui mb-3 text-[10px] font-semibold uppercase tracking-[0.20em] text-[#8A7F68]">
                            Getting Here
                        </p>
                        <div className="font-ui flex flex-col gap-2.5 text-sm text-[#5A5142]">
                            <div className="flex items-start gap-2.5">
                                <svg className="mt-0.5 flex-shrink-0 text-[#8A7F68]"
                                    width="13" height="13" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 8v4l3 3" />
                                </svg>
                                <p className="leading-relaxed">
                                    Free street parking after 6 PM on Gertrude St.
                                    Secure lot on Rose St, 2 min walk.
                                </p>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <svg className="mt-0.5 flex-shrink-0 text-[#8A7F68]"
                                    width="13" height="13" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 11a8 8 0 0 1 16 0" />
                                    <path d="M4 11v7a1 1 0 0 0 1 1h3" />
                                    <path d="M20 11v7a1 1 0 0 1-1 1h-3" />
                                    <rect x="8" y="19" width="8" height="3" rx="1" />
                                </svg>
                                <p className="leading-relaxed">
                                    Tram 86, Gertrude St / Smith St stop, 1 min walk.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
