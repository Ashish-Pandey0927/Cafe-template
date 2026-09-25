import { useState } from "react";

/**
 * EMBER — Footer
 * React + Tailwind CSS
 *
 * Four stacked sections:
 * 1. Newsletter band — dark charcoal slab, pill-shaped email capture
 * 2. Instagram grid — 6-image strip with hover scrim
 * 3. Link columns — Visit / Explore / Follow
 * 4. Bottom bar — logo mark, copyright, legal links
 *
 * Wire-up notes:
 * - Newsletter submit currently mocks success with a timeout. Replace
 *   `handleSubmit` with a real POST to Mailchimp/Klaviyo/your backend.
 * - INSTAGRAM_POSTS is a manually maintained array — swap for a live feed
 *   (Instagram Graph API, or a widget like SnapWidget) whenever you're
 *   ready; the layout doesn't need to change.
 */

const INSTAGRAM_POSTS = [
    { image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400&auto=format&fit=crop", link: "https://instagram.com", likes: 214 },
    { image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=400&auto=format&fit=crop", link: "https://instagram.com", likes: 189 },
    { image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop", link: "https://instagram.com", likes: 302 },
    { image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=400&auto=format&fit=crop", link: "https://instagram.com", likes: 176 },
    { image: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?q=80&w=400&auto=format&fit=crop", link: "https://instagram.com", likes: 241 },
    { image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=400&auto=format&fit=crop", link: "https://instagram.com", likes: 158 },
];

const EXPLORE_LINKS = [
    { label: "Menu", href: "#menu" },
    { label: "Reservations", href: "#reservations" },
    { label: "Private Dining", href: "#private-dining" },
    { label: "Our Story", href: "#story" },
    { label: "Gallery", href: "#gallery" },
];

function InstagramGlyph({ size = 20 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4.2" />
            <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
        </svg>
    );
}

function LinkedInIcon() {
    return (
        <svg role="img" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <title>LinkedIn</title>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    );
}

export default function Footer() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || submitting) return;
        setSubmitting(true);
        // Replace this with a real POST to your email provider.
        setTimeout(() => {
            setSubmitting(false);
            setSubmitted(true);
        }, 600);
    };

    return (
        <footer className="bg-[#F4EEE0] font-ui">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-ui { font-family: 'Inter', sans-serif; }
      `}</style>

            <div className="mx-auto max-w-[1800px] px-3 pt-3 sm:px-4 sm:pt-4">
                {/* ---- 1. Newsletter band ---- */}
                <div className="rounded-t-[32px] bg-[#1B1712] px-6 py-16 text-center sm:px-12 sm:py-20">
                    <h2 className="font-display text-4xl leading-tight text-[#F4EEE0] sm:text-[44px]">
                        Know before the menu changes.
                    </h2>
                    <p className="mx-auto mt-3 max-w-sm text-sm text-[#C9BFAE]">
                        Once or twice a month. No spam, just food.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="mx-auto mt-8 flex max-w-[440px] items-center rounded-full bg-[#2A241C] p-1.5"
                    >
                        {submitted ? (
                            <span className="flex w-full items-center justify-center py-2.5 text-sm font-medium text-[#F4EEE0]">
                                You're on the list 🔥
                            </span>
                        ) : (
                            <>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your email"
                                    className="w-full flex-1 bg-transparent px-4 py-2.5 text-sm text-[#F4EEE0] outline-none placeholder:text-[#8A7F68]"
                                />
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-shrink-0 rounded-full bg-[#D99A4E] px-5 py-2.5 text-sm font-medium text-[#1B1712] transition-transform hover:scale-[1.03] disabled:opacity-60"
                                >
                                    {submitting ? "..." : "Subscribe"}
                                </button>
                            </>
                        )}
                    </form>
                </div>

                {/* ---- 2. Instagram grid ---- */}
                <div className="py-12 sm:py-16">
                    <div className="mb-5 flex items-baseline justify-between">
                        <span className="font-display text-xl text-[#1B1712] sm:text-2xl">
                            @ember.restaurant
                        </span>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-[#8A7F68] transition-colors hover:text-[#1B1712]"
                        >
                            Follow us →
                        </a>
                    </div>

                    <div className="grid grid-cols-3 gap-[2px] sm:grid-cols-6">
                        {INSTAGRAM_POSTS.map((post, i) => (
                            <a
                                key={i}
                                href={post.link}
                                target="_blank"
                                rel="noreferrer"
                                className={`group relative block aspect-square overflow-hidden ${i === 0 ? "rounded-l-2xl" : ""
                                    } ${i === INSTAGRAM_POSTS.length - 1 ? "rounded-r-2xl" : ""}`}
                            >
                                <img
                                    src={post.image}
                                    alt="Ember Instagram post"
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                />
                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-1.5 bg-black/0 text-white opacity-0 transition-all duration-200 [@media(hover:hover)]:group-hover:bg-black/60 [@media(hover:hover)]:group-hover:opacity-100">
                                    <InstagramGlyph size={16} />
                                    <span className="text-sm font-medium">{post.likes}</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* ---- 3. Link columns + contact recap ---- */}
                <div className="grid grid-cols-1 gap-10 border-t border-[#D9CDAF] py-14 sm:grid-cols-3">
                    <div>
                        <h3 className="mb-3 text-xs uppercase tracking-wide text-[#8A7F68]">
                            Visit
                        </h3>
                        <p className="text-sm text-[#3A342A]">
                            14 Gertrude Street
                            <br />
                            Fitzroy VIC 3065
                        </p>
                        <p className="mt-2 text-sm text-[#8A7F68]">
                            Tue–Thu, Sun 5–10PM
                            <br />
                            Fri–Sat 5–11PM
                        </p>
                        <a
                            href="tel:+61300000000"
                            className="mt-2 inline-block text-sm text-[#8A7F68] transition-colors hover:text-[#1B1712]"
                        >
                            (03) 0000 0000
                        </a>
                    </div>

                    <div>
                        <h3 className="mb-3 text-xs uppercase tracking-wide text-[#8A7F68]">
                            Explore
                        </h3>
                        <ul className="space-y-2">
                            {EXPLORE_LINKS.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-[#3A342A] transition-colors hover:text-[#1B1712]"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-3 text-xs uppercase tracking-wide text-[#8A7F68]">
                            Follow
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 text-sm text-[#3A342A] transition-colors hover:text-[#1B1712]"
                                >
                                    <InstagramGlyph size={15} />
                                    Instagram
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://linkedin.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 text-sm text-[#3A342A] transition-colors hover:text-[#1B1712]"
                                >
                                    <LinkedInIcon />
                                    LinkedIn
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* ---- 4. Bottom bar ---- */}
                <div className="flex flex-col items-center justify-between gap-3 border-t border-[#D9CDAF] py-6 text-xs text-[#8A7F68] sm:flex-row">
                    <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1B1712] text-[11px] font-semibold text-[#F4EEE0]">
                            E
                        </span>
                        <span className="font-display text-sm text-[#1B1712]">Ember</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span>© 2026 Ember. All rights reserved.</span>
                        <span aria-hidden="true">·</span>
                        <a href="#" className="transition-colors hover:text-[#1B1712]">
                            Privacy Policy
                        </a>
                        <span aria-hidden="true">·</span>
                        <a href="#" className="transition-colors hover:text-[#1B1712]">
                            Terms
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}