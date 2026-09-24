import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

export interface GalleryItem {
    id: string;
    src: string;
    alt: string;
    aspectRatio: "portrait" | "landscape" | "square";
    caption?: string;
}

// 16 curated high-res ambience & culinary placeholder images
const DEFAULT_IMAGES: GalleryItem[] = [
    {
        id: "1",
        src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
        alt: "Warm candlelit dining room at EMBER",
        aspectRatio: "landscape",
        caption: "Main Dining Hall under warm amber glow",
    },
    {
        id: "2",
        src: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85",
        alt: "Chef Marcus tending red gum wood embers",
        aspectRatio: "portrait",
        caption: "Live wood fire hearth in action",
    },
    {
        id: "3",
        src: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=900&q=85",
        alt: "Craft cocktail pour with smoky aromatics",
        aspectRatio: "portrait",
        caption: "Signature Smoked Old Fashioned",
    },
    {
        id: "4",
        src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=85",
        alt: "Intimate private dining alcove",
        aspectRatio: "landscape",
        caption: "The Private Cellar Room",
    },
    {
        id: "5",
        src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=85",
        alt: "Charred heirloom carrots over wood fire",
        aspectRatio: "square",
        caption: "Seasonal harvest plated hot",
    },
    {
        id: "6",
        src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=85",
        alt: "Fitzroy night bar seating",
        aspectRatio: "landscape",
        caption: "Nightly bar counter atmosphere",
    },
    {
        id: "7",
        src: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=900&q=85",
        alt: "Sommelier opening vintage Victorian wine",
        aspectRatio: "portrait",
        caption: "Curated Victorian cellar selection",
    },
    {
        id: "8",
        src: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=85",
        alt: "Freshly baked sourdough from hearth oven",
        aspectRatio: "portrait",
        caption: "Daily hearth bread & smoked butter",
    },
    {
        id: "9",
        src: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=85",
        alt: "Tasting menu course plating detail",
        aspectRatio: "landscape",
        caption: "Nine-course tasting menu highlight",
    },
    {
        id: "10",
        src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=85",
        alt: "Chef table hearth view",
        aspectRatio: "square",
        caption: "Six seats directly facing live fire",
    },
    {
        id: "11",
        src: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=85",
        alt: "Courtyard garden evening seating",
        aspectRatio: "landscape",
        caption: "Open air garden courtyard",
    },
    {
        id: "12",
        src: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=85",
        alt: "Fire-roasted prime rib-eye",
        aspectRatio: "portrait",
        caption: "Dry-aged Victorian beef",
    },
    {
        id: "13",
        src: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=85",
        alt: "Smoked dark chocolate & burnt honey dessert",
        aspectRatio: "portrait",
        caption: "Fire-kissed pastry creation",
    },
    {
        id: "14",
        src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85",
        alt: "Wood-fired flatbread with seasonal herbs",
        aspectRatio: "landscape",
        caption: "Wood-fired small plates",
    },
    {
        id: "15",
        src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=85",
        alt: "Late night flame embers close-up",
        aspectRatio: "square",
        caption: "Red gum embers at closing time",
    },
    {
        id: "16",
        src: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=1200&q=85",
        alt: "Bar seating details & copper accents",
        aspectRatio: "landscape",
        caption: "Copper & timber architectural details",
    },
];

// ============================================================================
// PART 1 — PINNED HORIZONTAL SCROLL GALLERY
// ============================================================================
export interface GalleryProps {
    images: GalleryItem[];
    onImageClick: (index: number) => void;
}

export function Gallery({ images, onImageClick }: GalleryProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [scrollDistance, setScrollDistance] = useState(0);

    // Track scroll position within the pinned section
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    // Measure horizontal scroll distance dynamically
    const updateScrollDistance = useCallback(() => {
        if (trackRef.current) {
            const trackWidth = trackRef.current.scrollWidth;
            const windowWidth = window.innerWidth;
            const totalDistance = Math.max(0, trackWidth - windowWidth + 64);
            setScrollDistance(totalDistance);
        }
    }, []);

    useEffect(() => {
        updateScrollDistance();
        window.addEventListener("resize", updateScrollDistance);
        return () => window.removeEventListener("resize", updateScrollDistance);
    }, [updateScrollDistance, images]);

    // Transform vertical scroll progress into horizontal translation
    const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);

    return (
        <div ref={sectionRef} className="relative h-[350vh] w-full bg-[#F4EEE0]">
            {/* Sticky Viewport Frame */}
            <div className="sticky top-0 flex h-screen w-full flex-col justify-between overflow-hidden py-8 sm:py-12">
                {/* Section Header */}
                <div className="mx-auto flex w-full max-w-[1800px] flex-col justify-between gap-4 px-5 sm:flex-row sm:items-end sm:px-8">
                    <div>
                        <div className="mb-2 flex items-center gap-3">
                            <span className="h-px w-8 bg-[#8A7F68]" />
                            <span className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-[#8A7F68]">
                                Pinned Gallery &amp; Ambience
                            </span>
                        </div>
                        <h2 className="font-display text-[38px] leading-[0.98] tracking-[-0.04em] text-[#1B1712] sm:text-[54px] lg:text-[62px]">
                            Living hearth &amp; atmosphere.
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <p className="hidden max-w-sm font-ui text-sm text-[#5A5142] md:block">
                            Scroll down to travel through our dining spaces &amp; hearth moments. Click any frame to inspect.
                        </p>
                    </div>
                </div>

                {/* Horizontal Moving Track */}
                <div className="relative my-auto w-full overflow-hidden">
                    <motion.div
                        ref={trackRef}
                        style={{ x }}
                        className="flex w-max items-center gap-6 px-6 sm:px-12"
                    >
                        {images.map((item, index) => {
                            // Dimension rhythm by aspect ratio
                            let dimensionClasses = "";
                            if (item.aspectRatio === "landscape") {
                                dimensionClasses = "w-[340px] sm:w-[480px] lg:w-[540px] h-[250px] sm:h-[320px] lg:h-[360px]";
                            } else if (item.aspectRatio === "portrait") {
                                dimensionClasses = "w-[220px] sm:w-[280px] lg:w-[320px] h-[330px] sm:h-[400px] lg:h-[440px]";
                            } else {
                                // square
                                dimensionClasses = "w-[260px] sm:w-[320px] lg:w-[360px] h-[260px] sm:h-[320px] lg:h-[360px]";
                            }

                            return (
                                <div
                                    key={item.id}
                                    onClick={() => onImageClick(index)}
                                    className={`group/card relative flex-shrink-0 cursor-pointer overflow-hidden rounded-[24px] bg-[#EFE6D2] shadow-sm transition-shadow duration-300 hover:shadow-2xl ${dimensionClasses}`}
                                >
                                    {/* Motion Image with layoutId */}
                                    <motion.img
                                        layoutId={`gallery-image-${item.id}`}
                                        src={item.src}
                                        alt={item.alt}
                                        className="h-full w-full object-cover transition-all duration-450 ease-out filter saturate-[0.85] [@media(pointer:fine)]:group-hover/card:scale-[1.04] [@media(pointer:fine)]:group-hover/card:saturate-100"
                                    />

                                    {/* Caption Overlay on Hover */}
                                    {item.caption && (
                                        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 opacity-0 transition-opacity duration-250 ease-out [@media(pointer:fine)]:group-hover/card:opacity-100">
                                            <p className="font-ui text-sm font-medium text-[#F4EEE0]">
                                                {item.caption}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </motion.div>
                </div>

                {/* Footer Progress & Scroll Cue */}
                <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between px-5 sm:px-8">
                    <div className="flex items-center gap-3">
                        <span className="font-ui text-xs font-semibold uppercase tracking-wider text-[#8A7F68]">
                            Scroll Progress
                        </span>
                        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-[#E5DAC0] sm:w-48">
                            <motion.div
                                className="h-full rounded-full bg-[#1B1712]"
                                style={{
                                    scaleX: scrollYProgress,
                                    transformOrigin: "left",
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 font-ui text-xs font-medium text-[#5A5142]">
                        <span>Keep scrolling</span>
                        <span className="animate-bounce">↓</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// PART 2 — LIGHTBOX WITH SHARED-ELEMENT TRANSITION
// ============================================================================
export interface LightboxProps {
    images: GalleryItem[];
    openIndex: number | null;
    onClose: () => void;
    onNavigate: (newIndex: number) => void;
}

export function Lightbox({ images, openIndex, onClose, onNavigate }: LightboxProps) {
    const [showControls, setShowControls] = useState(true);
    const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);

    const isOpen = openIndex !== null;
    const currentItem = isOpen ? images[openIndex] : null;

    // Reset inactivity timer to fade controls
    const handleMouseMove = useCallback(() => {
        setShowControls(true);
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }
        inactivityTimerRef.current = setTimeout(() => {
            setShowControls(false);
        }, 2000);
    }, []);

    // Navigation callbacks
    const goPrev = useCallback(() => {
        if (openIndex === null) return;
        const prevIndex = openIndex > 0 ? openIndex - 1 : images.length - 1;
        onNavigate(prevIndex);
    }, [openIndex, images.length, onNavigate]);

    const goNext = useCallback(() => {
        if (openIndex === null) return;
        const nextIndex = openIndex < images.length - 1 ? openIndex + 1 : 0;
        onNavigate(nextIndex);
    }, [openIndex, images.length, onNavigate]);

    // Keyboard controls
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                goPrev();
            } else if (e.key === "ArrowRight") {
                goNext();
            } else if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("mousemove", handleMouseMove);
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current);
            }
        };
    }, [isOpen, goPrev, goNext, onClose, handleMouseMove]);

    // Touch swipe handling
    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStartRef.current) return;
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;

        // Ensure horizontal swipe
        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) {
                goPrev();
            } else {
                goNext();
            }
        }
        touchStartRef.current = null;
    };

    return (
        <AnimatePresence>
            {isOpen && currentItem && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden font-ui"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Background Scrim with 100ms delayed trailing opacity fade */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.92 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, delay: 0.1 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black cursor-pointer"
                    />

                    {/* Left/Right Clickable Invisible Zones for Navigation */}
                    <div
                        onClick={goPrev}
                        aria-label="Previous image zone"
                        className="absolute bottom-0 left-0 top-0 z-10 w-1/3 cursor-pointer"
                    />
                    <div
                        onClick={goNext}
                        aria-label="Next image zone"
                        className="absolute bottom-0 right-0 top-0 z-10 w-1/3 cursor-pointer"
                    />

                    {/* Center Container & Shared Element Image */}
                    <div className="relative z-20 pointer-events-none flex max-h-[85vh] max-w-[90vw] items-center justify-center p-4">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={currentItem.id}
                                layoutId={`gallery-image-${currentItem.id}`}
                                src={currentItem.src}
                                alt={currentItem.alt}
                                initial={{ opacity: 0.2 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0.2 }}
                                transition={{
                                    layout: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.18 },
                                }}
                                className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl pointer-events-auto"
                            />
                        </AnimatePresence>
                    </div>

                    {/* UI Controls (Top right close, counter, arrows) */}
                    {/* Close Button (×) Top Right */}
                    <button
                        onClick={onClose}
                        aria-label="Close lightbox"
                        className={`absolute right-6 top-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-[#F4EEE0] backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:scale-105 ${
                            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                    >
                        ✕
                    </button>

                    {/* Index Counter Top-Left */}
                    <div
                        className={`absolute left-6 top-6 z-30 rounded-full bg-black/40 px-4 py-2 text-sm font-medium text-[#F4EEE0]/80 backdrop-blur-md transition-opacity duration-300 ${
                            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                    >
                        {openIndex! + 1} / {images.length}
                    </div>

                    {/* Explicit Previous Arrow Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goPrev();
                        }}
                        aria-label="Previous image"
                        className={`absolute left-6 top-1/2 z-30 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/10 p-4 text-[#F4EEE0] backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:scale-110 ${
                            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>

                    {/* Explicit Next Arrow Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goNext();
                        }}
                        aria-label="Next image"
                        className={`absolute right-6 top-1/2 z-30 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/10 p-4 text-[#F4EEE0] backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:scale-110 ${
                            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>
            )}
        </AnimatePresence>
    );
}

// ============================================================================
// MAIN COMPOSED COMPONENT — DEFAULT EXPORT
// ============================================================================
export interface GalleryLightboxProps {
    images?: GalleryItem[];
}

export default function GalleryLightbox({ images = DEFAULT_IMAGES }: GalleryLightboxProps) {
    // Single piece of state: openIndex (number | null)
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div id="ambience">
            {/* Part 1: Scroll-Pinned Horizontal Gallery */}
            <Gallery
                images={images}
                onImageClick={(index) => setOpenIndex(index)}
            />

            {/* Part 2: Shared-Element Fullscreen Lightbox */}
            <Lightbox
                images={images}
                openIndex={openIndex}
                onClose={() => setOpenIndex(null)}
                onNavigate={(newIndex) => setOpenIndex(newIndex)}
            />
        </div>
    );
}
