import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageRippleEffect } from "@/components/ui/image-ripple-effect";

// ============================================================================
// TYPES & MOCK AVAILABILITY DATA
// ============================================================================

export interface TimeSlot {
    time: string;
    available: boolean;
}

export interface DayAvailability {
    id: string;
    dateLabel: string;
    fullDateLabel: string;
    status: "good" | "limited" | "full";
    times: TimeSlot[];
}

// ============================================================================
// GENERATE MOCK AVAILABILITY
// ============================================================================

function generateMockDays(): DayAvailability[] {
    const days: DayAvailability[] = [];

    const today = new Date();

    const dayNames = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
    ];

    const fullDayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    const standardTimes = [
        "5:30 PM",
        "6:00 PM",
        "6:30 PM",
        "7:00 PM",
        "7:30 PM",
        "8:00 PM",
        "8:30 PM",
        "9:00 PM",
        "9:30 PM",
    ];

    for (let i = 1; i <= 10; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);

        const dayName = dayNames[d.getDay()];
        const fullDayName = fullDayNames[d.getDay()];
        const monthName = monthNames[d.getMonth()];
        const dateNum = d.getDate();

        let status: "good" | "limited" | "full" = "good";

        if (i === 3 || i === 7) {
            status = "full";
        } else if (i === 2 || i === 5 || i === 9) {
            status = "limited";
        }

        const times: TimeSlot[] = standardTimes.map((t, idx) => {
            if (status === "full") {
                return {
                    time: t,
                    available: false,
                };
            }

            if (status === "limited") {
                return {
                    time: t,
                    available: idx !== 3 && idx !== 4 && idx !== 5,
                };
            }

            return {
                time: t,
                available: idx !== 4,
            };
        });

        days.push({
            id: d.toISOString().split("T")[0],
            dateLabel: `${dayName} ${dateNum}`,
            fullDateLabel: `${fullDayName}, ${monthName} ${dateNum}`,
            status,
            times,
        });
    }

    return days;
}

const MOCK_DAYS = generateMockDays();

export type Step =
    | "party"
    | "date"
    | "time"
    | "details"
    | "confirmed";

// ============================================================================
// RESERVATION SECTION
// ============================================================================

export default function ReservationSection() {
    // =========================================================================
    // FORM & FLOW STATE
    // =========================================================================

    const [step, setStep] = useState<Step>("party");

    const [partySize, setPartySize] =
        useState<number | "7+">(2);

    const [showCallNotice, setShowCallNotice] =
        useState(false);

    const [selectedDate, setSelectedDate] =
        useState<DayAvailability>(MOCK_DAYS[0]);

    const [selectedTime, setSelectedTime] =
        useState<string>("7:00 PM");

    const [formDetails, setFormDetails] = useState({
        name: "",
        phone: "",
        email: "",
        notes: "",
    });

    // =========================================================================
    // STEP INDEX
    // =========================================================================

    const stepOrder: Step[] = [
        "party",
        "date",
        "time",
        "details",
    ];

    const currentStepIndex =
        step === "confirmed"
            ? 4
            : stepOrder.indexOf(step);

    // =========================================================================
    // PARTY SELECT
    // =========================================================================

    const handlePartySelect = (
        size: number | "7+"
    ) => {
        if (size === "7+") {
            setPartySize("7+");
            setShowCallNotice(true);
        } else {
            setPartySize(size);
            setShowCallNotice(false);
            setStep("date");
        }
    };

    // =========================================================================
    // DATE SELECT
    // =========================================================================

    const handleDateSelect = (
        day: DayAvailability
    ) => {
        if (day.status === "full") return;

        setSelectedDate(day);

        const firstAvail = day.times.find(
            (t) => t.available
        );

        if (firstAvail) {
            setSelectedTime(firstAvail.time);
        }

        setStep("time");
    };

    // =========================================================================
    // TIME SELECT
    // =========================================================================

    const handleTimeSelect = (
        time: string,
        available: boolean
    ) => {
        if (!available) return;

        setSelectedTime(time);
        setStep("details");
    };

    // =========================================================================
    // SUBMIT
    // =========================================================================

    const handleSubmitDetails = (
        e: React.FormEvent
    ) => {
        e.preventDefault();
        setStep("confirmed");
    };

    // =========================================================================
    // RESET
    // =========================================================================

    const handleReset = () => {
        setStep("party");
        setPartySize(2);
        setShowCallNotice(false);

        setFormDetails({
            name: "",
            phone: "",
            email: "",
            notes: "",
        });
    };

    // =========================================================================
    // ADD TO CALENDAR
    // =========================================================================

    const handleAddToCalendar = () => {
        const title = encodeURIComponent(
            "Dinner at EMBER Fitzroy"
        );

        const details = encodeURIComponent(
            `Reservation for ${partySize} guests. Fitzroy, Melbourne.`
        );

        const location = encodeURIComponent(
            "EMBER, Fitzroy VIC"
        );

        const googleCalUrl =
            `https://calendar.google.com/calendar/render?action=TEMPLATE` +
            `&text=${title}` +
            `&details=${details}` +
            `&location=${location}`;

        window.open(
            googleCalUrl,
            "_blank"
        );
    };

    // =========================================================================
    // RENDER
    // =========================================================================

    return (
        <section
            id="reservations"
            className="
                relative
                w-full
                overflow-hidden
                bg-[#1B1712]
                px-4
                py-20
                sm:px-6
                lg:py-28
            "
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');

                .font-display {
                    font-family: 'Fraunces', serif;
                }

                .font-ui {
                    font-family: 'Inter', sans-serif;
                }

                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }

                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            {/* ================================================================
                WEBGL IMAGE RIPPLE BACKGROUND
            ================================================================= */}

            <ImageRippleEffect
                images={[
                    {
                        src: "/cta-img.jpg",
                        x: 0,
                        y: 0,
                        widthScale: 1,
                        heightScale: 1,
                    },
                ]}
                distortionStrength={0.12}
                waveCount={100}
                waveSize={70}
                waveRotationSpeed={0.025}
                waveFadeMultiplier={0.95}
                waveGrowth={0.17}
                waveSpawnThreshold={1}
                className="
                    !absolute
                    !inset-0
                    !h-auto
                    !w-auto
                    z-0
                "
            />

            {/* ================================================================
                DARK OVERLAY
            ================================================================= */}

            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    z-[1]
                    bg-black/10
                "
            />

            {/* ================================================================
                MAIN CONTENT
            ================================================================= */}

            <div className="relative z-10 mx-auto max-w-xl">

                {/* ============================================================
                    MAIN RESERVATION CARD
                ============================================================= */}

                <div
                    className="
                        relative
                        overflow-hidden
                        rounded-[32px]
                        bg-[#F4EEE0]
                        p-6
                        text-[#1B1712]
                        shadow-2xl
                        sm:p-10
                    "
                >

                    {/* ========================================================
                        TOP BAR
                    ======================================================== */}

                    <div className="mb-6 flex items-center justify-between">

                        {step !== "party" &&
                            step !== "confirmed" ? (
                            <button
                                onClick={() => {
                                    if (step === "date") {
                                        setStep("party");
                                    }

                                    if (step === "time") {
                                        setStep("date");
                                    }

                                    if (step === "details") {
                                        setStep("time");
                                    }
                                }}
                                className="
                                    flex
                                    items-center
                                    gap-1.5
                                    font-ui
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-[#8A7F68]
                                    transition-colors
                                    hover:text-[#1B1712]
                                "
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>

                                Back
                            </button>
                        ) : (
                            <div
                                className="
                                    font-ui
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[0.2em]
                                    text-[#8A7F68]
                                "
                            >
                                Table Reservations
                            </div>
                        )}

                        {/* Progress dots */}

                        <div className="flex items-center gap-1.5">
                            {[0, 1, 2, 3].map(
                                (idx) => (
                                    <span
                                        key={idx}
                                        className={`
                                            h-2
                                            rounded-full
                                            transition-all
                                            duration-300
                                            ${idx <=
                                                currentStepIndex
                                                ? "w-5 bg-[#1B1712]"
                                                : "w-2 bg-[#D9CDAF]"
                                            }
                                        `}
                                    />
                                )
                            )}
                        </div>
                    </div>

                    {/* ========================================================
                        HEADLINE
                    ======================================================== */}

                    <div className="mb-8">

                        <h2
                            className="
                                font-display
                                text-3xl
                                font-medium
                                tracking-[-0.03em]
                                text-[#1B1712]
                                sm:text-4xl
                            "
                        >
                            Save a seat by the fire.
                        </h2>

                        <p
                            className="
                                mt-1.5
                                font-ui
                                text-sm
                                text-[#8A7F68]
                            "
                        >
                            A table, held just for you.
                        </p>

                    </div>

                    {/* ========================================================
                        STEPS
                    ======================================================== */}

                    <AnimatePresence mode="wait">

                        {/* ====================================================
                            STEP 1: PARTY
                        ==================================================== */}

                        {step === "party" && (
                            <motion.div
                                key="step-party"
                                initial={{
                                    opacity: 0,
                                    x: 20,
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    x: -20,
                                }}
                                transition={{
                                    duration: 0.2,
                                }}
                                className="space-y-6"
                            >

                                <p
                                    className="
                                        font-ui
                                        text-sm
                                        font-medium
                                        text-[#1B1712]
                                    "
                                >
                                    How many are we seating tonight?
                                </p>

                                <div className="flex flex-wrap gap-2.5">

                                    {[
                                        1,
                                        2,
                                        3,
                                        4,
                                        5,
                                        6,
                                        "7+",
                                    ].map((size) => {

                                        const isSelected =
                                            partySize === size;

                                        return (
                                            <button
                                                key={size}
                                                type="button"
                                                onClick={() =>
                                                    handlePartySelect(
                                                        size as
                                                        | number
                                                        | "7+"
                                                    )
                                                }
                                                className={`
                                                    flex
                                                    h-13
                                                    min-w-[56px]
                                                    flex-1
                                                    items-center
                                                    justify-center
                                                    rounded-2xl
                                                    font-ui
                                                    text-lg
                                                    font-medium
                                                    transition-all
                                                    duration-150
                                                    active:scale-95
                                                    ${isSelected
                                                        ? "bg-[#1B1712] text-[#F4EEE0] shadow-md"
                                                        : "bg-[#EFE6D2] text-[#1B1712] hover:bg-[#E5DAC0]"
                                                    }
                                                `}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}

                                </div>

                                {/* 7+ Notice */}

                                {showCallNotice && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: 8,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        className="
                                            rounded-2xl
                                            border
                                            border-[#D9CDAF]
                                            bg-[#EFE6D2]/60
                                            p-4
                                            font-ui
                                            text-sm
                                            text-[#3A2A16]
                                        "
                                    >

                                        <p className="mb-2 leading-relaxed">
                                            For groups of 7 or more, please call us — we'll take great care of you.
                                        </p>

                                        <a
                                            href="tel:0394170000"
                                            className="
                                                inline-flex
                                                items-center
                                                gap-2
                                                font-semibold
                                                text-[#1B1712]
                                                underline
                                                underline-offset-4
                                            "
                                        >
                                            <svg
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                            </svg>

                                            Call (03) 9417 0000
                                        </a>

                                    </motion.div>
                                )}

                            </motion.div>
                        )}

                        {/* ====================================================
                            STEP 2: DATE
                        ==================================================== */}

                        {step === "date" && (
                            <motion.div
                                key="step-date"
                                initial={{
                                    opacity: 0,
                                    x: 20,
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    x: -20,
                                }}
                                transition={{
                                    duration: 0.2,
                                }}
                                className="space-y-6"
                            >

                                <div className="flex items-center justify-between">

                                    <p
                                        className="
                                            font-ui
                                            text-sm
                                            font-medium
                                            text-[#1B1712]
                                        "
                                    >
                                        Which night?
                                    </p>

                                    <span
                                        className="
                                            font-ui
                                            text-xs
                                            text-[#8A7F68]
                                        "
                                    >
                                        {partySize}{" "}
                                        {partySize === 1
                                            ? "guest"
                                            : "guests"}
                                    </span>

                                </div>

                                {/* Date Pills */}

                                <div className="no-scrollbar flex gap-2.5 overflow-x-auto py-1">

                                    {MOCK_DAYS.map(
                                        (day) => {

                                            const isSelected =
                                                selectedDate.id ===
                                                day.id;

                                            const isFull =
                                                day.status ===
                                                "full";

                                            return (
                                                <button
                                                    key={day.id}
                                                    type="button"
                                                    disabled={isFull}
                                                    onClick={() =>
                                                        handleDateSelect(
                                                            day
                                                        )
                                                    }
                                                    className={`
                                                        relative
                                                        flex
                                                        flex-shrink-0
                                                        min-w-[80px]
                                                        flex-col
                                                        items-center
                                                        justify-center
                                                        rounded-2xl
                                                        px-4
                                                        py-3.5
                                                        font-ui
                                                        transition-all
                                                        duration-150
                                                        active:scale-95
                                                        ${isFull
                                                            ? "cursor-not-allowed bg-[#EFE6D2]/40 opacity-40"
                                                            : isSelected
                                                                ? "bg-[#1B1712] text-[#F4EEE0] shadow-md"
                                                                : "bg-[#EFE6D2] text-[#1B1712] hover:bg-[#E5DAC0]"
                                                        }
                                                    `}
                                                >

                                                    {!isFull && (
                                                        <span
                                                            className={`
                                                                absolute
                                                                right-2.5
                                                                top-2.5
                                                                h-2
                                                                w-2
                                                                rounded-full
                                                                ${day.status ===
                                                                    "good"
                                                                    ? "bg-[#3F5B43]"
                                                                    : "bg-[#D99A4E]"
                                                                }
                                                            `}
                                                        />
                                                    )}

                                                    <span
                                                        className="
                                                            text-xs
                                                            font-semibold
                                                            uppercase
                                                            tracking-wider
                                                            opacity-70
                                                        "
                                                    >
                                                        {
                                                            day.dateLabel.split(
                                                                " "
                                                            )[0]
                                                        }
                                                    </span>

                                                    <span className="text-lg font-bold">
                                                        {
                                                            day.dateLabel.split(
                                                                " "
                                                            )[1]
                                                        }
                                                    </span>

                                                </button>
                                            );
                                        }
                                    )}

                                </div>

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-4
                                        text-xs
                                        font-ui
                                        text-[#8A7F68]
                                    "
                                >

                                    <span className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-[#3F5B43]" />
                                        Good availability
                                    </span>

                                    <span className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-[#D99A4E]" />
                                        Limited seats
                                    </span>

                                </div>

                            </motion.div>
                        )}

                        {/* ====================================================
                            STEP 3: TIME
                        ==================================================== */}

                        {step === "time" && (
                            <motion.div
                                key="step-time"
                                initial={{
                                    opacity: 0,
                                    x: 20,
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    x: -20,
                                }}
                                transition={{
                                    duration: 0.2,
                                }}
                                className="space-y-6"
                            >

                                <div className="flex items-center justify-between">

                                    <p
                                        className="
                                            font-ui
                                            text-sm
                                            font-medium
                                            text-[#1B1712]
                                        "
                                    >
                                        What time works?
                                    </p>

                                    <span
                                        className="
                                            font-ui
                                            text-xs
                                            font-medium
                                            text-[#7A3B2E]
                                        "
                                    >
                                        {selectedDate.fullDateLabel}
                                    </span>

                                </div>

                                {/* Time Grid */}

                                <div className="grid grid-cols-3 gap-2.5">

                                    {selectedDate.times.map(
                                        (slot) => {

                                            const isSelected =
                                                selectedTime ===
                                                slot.time;

                                            return (
                                                <button
                                                    key={slot.time}
                                                    type="button"
                                                    disabled={
                                                        !slot.available
                                                    }
                                                    onClick={() =>
                                                        handleTimeSelect(
                                                            slot.time,
                                                            slot.available
                                                        )
                                                    }
                                                    className={`
                                                        relative
                                                        flex
                                                        h-12
                                                        items-center
                                                        justify-center
                                                        rounded-2xl
                                                        font-ui
                                                        text-sm
                                                        font-medium
                                                        transition-all
                                                        duration-150
                                                        active:scale-95
                                                        ${!slot.available
                                                            ? "cursor-not-allowed bg-[#EFE6D2]/40 text-[#8A7F68] opacity-40"
                                                            : isSelected
                                                                ? "text-[#F4EEE0]"
                                                                : "bg-[#EFE6D2] text-[#1B1712] hover:bg-[#E5DAC0]"
                                                        }
                                                    `}
                                                >

                                                    {isSelected &&
                                                        slot.available && (
                                                            <motion.div
                                                                layoutId="time-selection-highlight"
                                                                className="
                                                                absolute
                                                                inset-0
                                                                rounded-2xl
                                                                bg-[#1B1712]
                                                                shadow-md
                                                            "
                                                                transition={{
                                                                    type: "spring",
                                                                    stiffness: 400,
                                                                    damping: 30,
                                                                }}
                                                            />
                                                        )}

                                                    <span className="relative z-10">
                                                        {slot.time}
                                                    </span>

                                                </button>
                                            );
                                        }
                                    )}

                                </div>

                            </motion.div>
                        )}

                        {/* ====================================================
                            STEP 4: DETAILS
                        ==================================================== */}

                        {step === "details" && (
                            <motion.div
                                key="step-details"
                                initial={{
                                    opacity: 0,
                                    x: 20,
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    x: -20,
                                }}
                                transition={{
                                    duration: 0.2,
                                }}
                            >

                                {/* Summary */}

                                <div
                                    className="
                                        mb-4
                                        rounded-xl
                                        bg-[#EFE6D2]/60
                                        px-4
                                        py-2.5
                                        font-ui
                                        text-xs
                                        font-medium
                                        text-[#3A2A16]
                                    "
                                >
                                    Reservation summary:{" "}

                                    <span className="font-semibold text-[#1B1712]">
                                        {partySize} guests
                                    </span>{" "}

                                    on{" "}

                                    <span className="font-semibold text-[#1B1712]">
                                        {selectedDate.dateLabel}
                                    </span>{" "}

                                    at{" "}

                                    <span className="font-semibold text-[#1B1712]">
                                        {selectedTime}
                                    </span>
                                </div>

                                <form
                                    onSubmit={
                                        handleSubmitDetails
                                    }
                                    className="space-y-4"
                                >

                                    {/* Full Name */}

                                    <div>

                                        <label
                                            className="
                                                mb-1
                                                block
                                                font-ui
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wider
                                                text-[#8A7F68]
                                            "
                                        >
                                            Full Name *
                                        </label>

                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Marcus Vance"
                                            value={
                                                formDetails.name
                                            }
                                            onChange={(e) =>
                                                setFormDetails({
                                                    ...formDetails,
                                                    name: e.target.value,
                                                })
                                            }
                                            className="
                                                w-full
                                                rounded-2xl
                                                border
                                                border-[#D9CDAF]
                                                bg-white/70
                                                px-4
                                                py-3
                                                font-ui
                                                text-sm
                                                text-[#1B1712]
                                                outline-none
                                                focus:border-[#1B1712]
                                                focus:bg-white
                                            "
                                        />

                                    </div>

                                    {/* Phone / Email */}

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                        <div>

                                            <label
                                                className="
                                                    mb-1
                                                    block
                                                    font-ui
                                                    text-xs
                                                    font-semibold
                                                    uppercase
                                                    tracking-wider
                                                    text-[#8A7F68]
                                                "
                                            >
                                                Phone Number *
                                            </label>

                                            <input
                                                type="tel"
                                                required
                                                placeholder="0400 000 000"
                                                value={
                                                    formDetails.phone
                                                }
                                                onChange={(e) =>
                                                    setFormDetails({
                                                        ...formDetails,
                                                        phone: e.target.value,
                                                    })
                                                }
                                                className="
                                                    w-full
                                                    rounded-2xl
                                                    border
                                                    border-[#D9CDAF]
                                                    bg-white/70
                                                    px-4
                                                    py-3
                                                    font-ui
                                                    text-sm
                                                    text-[#1B1712]
                                                    outline-none
                                                    focus:border-[#1B1712]
                                                    focus:bg-white
                                                "
                                            />

                                        </div>

                                        <div>

                                            <label
                                                className="
                                                    mb-1
                                                    block
                                                    font-ui
                                                    text-xs
                                                    font-semibold
                                                    uppercase
                                                    tracking-wider
                                                    text-[#8A7F68]
                                                "
                                            >
                                                Email Address *
                                            </label>

                                            <input
                                                type="email"
                                                required
                                                placeholder="marcus@example.com"
                                                value={
                                                    formDetails.email
                                                }
                                                onChange={(e) =>
                                                    setFormDetails({
                                                        ...formDetails,
                                                        email: e.target.value,
                                                    })
                                                }
                                                className="
                                                    w-full
                                                    rounded-2xl
                                                    border
                                                    border-[#D9CDAF]
                                                    bg-white/70
                                                    px-4
                                                    py-3
                                                    font-ui
                                                    text-sm
                                                    text-[#1B1712]
                                                    outline-none
                                                    focus:border-[#1B1712]
                                                    focus:bg-white
                                                "
                                            />

                                        </div>

                                    </div>

                                    {/* Notes */}

                                    <div>

                                        <label
                                            className="
                                                mb-1
                                                block
                                                font-ui
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wider
                                                text-[#8A7F68]
                                            "
                                        >
                                            Anything we should know?{" "}
                                            <span className="font-normal opacity-70">
                                                (Optional)
                                            </span>
                                        </label>

                                        <textarea
                                            rows={2}
                                            placeholder="Dietary allergies, anniversary, seating preferences..."
                                            value={
                                                formDetails.notes
                                            }
                                            onChange={(e) =>
                                                setFormDetails({
                                                    ...formDetails,
                                                    notes: e.target.value,
                                                })
                                            }
                                            className="
                                                w-full
                                                resize-none
                                                rounded-2xl
                                                border
                                                border-[#D9CDAF]
                                                bg-white/70
                                                px-4
                                                py-3
                                                font-ui
                                                text-sm
                                                text-[#1B1712]
                                                outline-none
                                                focus:border-[#1B1712]
                                                focus:bg-white
                                            "
                                        />

                                    </div>

                                    {/* Submit */}

                                    <button
                                        type="submit"
                                        className="
                                            mt-2
                                            w-full
                                            rounded-2xl
                                            bg-[#1B1712]
                                            py-4.5
                                            font-ui
                                            text-base
                                            font-medium
                                            text-[#F4EEE0]
                                            shadow-lg
                                            transition-transform
                                            hover:bg-[#2C261F]
                                            active:scale-[0.99]
                                        "
                                    >
                                        Confirm reservation
                                    </button>

                                    <p
                                        className="
                                            text-center
                                            font-ui
                                            text-xs
                                            text-[#8A7F68]
                                        "
                                    >
                                        We'll confirm within a few minutes.
                                    </p>

                                </form>

                            </motion.div>
                        )}

                        {/* ====================================================
                            STEP 5: CONFIRMED
                        ==================================================== */}

                        {step === "confirmed" && (
                            <motion.div
                                key="step-confirmed"
                                initial={{
                                    opacity: 0,
                                    scale: 0.95,
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                }}
                                exit={{
                                    opacity: 0,
                                }}
                                transition={{
                                    duration: 0.25,
                                }}
                                className="
                                    space-y-6
                                    py-4
                                    text-center
                                "
                            >

                                {/* Checkmark */}

                                <div
                                    className="
                                        mx-auto
                                        flex
                                        h-16
                                        w-16
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-[#3F5B43]
                                        text-2xl
                                        text-[#F4EEE0]
                                        shadow-md
                                    "
                                >
                                    ✓
                                </div>

                                {/* Confirmation */}

                                <div className="space-y-2">

                                    <h3
                                        className="
                                            font-display
                                            text-2xl
                                            font-medium
                                            text-[#1B1712]
                                        "
                                    >
                                        You're in.
                                    </h3>

                                    <p
                                        className="
                                            font-ui
                                            text-base
                                            leading-relaxed
                                            text-[#3A2A16]
                                        "
                                    >
                                        <span className="font-semibold">
                                            {selectedDate.fullDateLabel}
                                        </span>{" "}
                                        at{" "}
                                        <span className="font-semibold">
                                            {selectedTime}
                                        </span>{" "}
                                        for{" "}
                                        <span className="font-semibold">
                                            {partySize} guests
                                        </span>
                                        .
                                    </p>

                                    {formDetails.name && (
                                        <p
                                            className="
                                                font-ui
                                                text-xs
                                                text-[#8A7F68]
                                            "
                                        >
                                            Confirmation sent to{" "}
                                            {formDetails.email ||
                                                "your email"}.
                                        </p>
                                    )}

                                </div>

                                {/* Confirmation buttons */}

                                <div className="flex flex-col gap-3 pt-2">

                                    <button
                                        type="button"
                                        onClick={
                                            handleAddToCalendar
                                        }
                                        className="
                                            w-full
                                            rounded-2xl
                                            bg-[#1B1712]
                                            py-3.5
                                            font-ui
                                            text-sm
                                            font-medium
                                            text-[#F4EEE0]
                                            shadow-md
                                            transition-transform
                                            hover:bg-[#2C261F]
                                        "
                                    >
                                        Add to calendar
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            handleReset
                                        }
                                        className="
                                            w-full
                                            rounded-2xl
                                            border
                                            border-[#D9CDAF]
                                            bg-[#EFE6D2]/60
                                            py-3
                                            font-ui
                                            text-xs
                                            font-semibold
                                            uppercase
                                            tracking-wider
                                            text-[#3A2A16]
                                            hover:bg-[#E5DAC0]
                                        "
                                    >
                                        Make another booking
                                    </button>

                                </div>

                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

                {/* ============================================================
                    BELOW CARD MICRO COPY
                ============================================================ */}

                <div
                    className="
                        mt-8
                        flex
                        flex-col
                        items-center
                        justify-between
                        gap-4
                        font-ui
                        text-sm
                        text-[#8A7F68]
                        sm:flex-row
                    "
                >

                    <div>
                        Prefer to call?{" "}

                        <a
                            href="tel:0394170000"
                            className="
                                font-medium
                                text-[#F4EEE0]
                                underline
                                underline-offset-4
                                hover:text-[#D99A4E]
                            "
                        >
                            (03) 9417 0000
                        </a>
                    </div>

                    <a
                        href="#private-dining"
                        className="
                            flex
                            items-center
                            gap-1
                            font-medium
                            text-[#D99A4E]
                            transition-transform
                            hover:translate-x-1
                        "
                    >
                        Planning something bigger? Enquire about private dining &rarr;
                    </a>

                </div>

            </div>
        </section>
    );
}