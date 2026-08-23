import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const G = { dark: "#1a4a1a", mid: "#2d7a2d", btn: "#006E1C", accent: "#4caf50" };
const ff = "'Heebo', sans-serif";
const FACTS_RING_RADIUS = 130;
const FACTS_RING_CIRCUMFERENCE = 2 * Math.PI * FACTS_RING_RADIUS;

const kidsSlides = [
  { img: "https://i.imgur.com/GNDyrR4.png", alt: "Original Hebrew toad coloring activity page", file: "/דף-צביעה-לקרפדות.pdf", title: "Original Activity Page", text: "The original printable creative activity prepared for the first International Toad Day.", zoom: 1.4 },
  // coloring-page-en.png has built-in white margin around the artwork (unlike GNDyrR4.png,
  // which bleeds to the edges), so objectFit:"cover" alone can't fill the frame with it.
  // zoom scales the image up inside its overflow:hidden card to crop that margin away.
  // Tune this value visually against the actual file if it doesn't look right yet.
  { img: "/coloring-page-en.png", alt: "English toad coloring page", file: "/international-toad-day-coloring-page.pdf", title: "English Coloring Page", text: "A new English printable featuring a toad\nin its natural habitat.", zoom: 1.4 },
];

// Fluid value that scales continuously with viewport width between minVw and maxVw,
// instead of jumping between two fixed sizes at a single breakpoint.
const fluid = (min, max, minVw = 360, maxVw = 1280) => {
  const slope = (max - min) / (maxVw - minVw);
  const base = min - slope * minVw;
  return `clamp(${Math.min(min, max)}px, ${base.toFixed(2)}px + ${(slope * 100).toFixed(4)}vw, ${Math.max(min, max)}px)`;
};

// A button that lifts and gently scales on hover/press — used for primary CTAs.
function MagButton({ as: Tag = "button", style, children, ...rest }) {
  const ref = useRef(null);
  return (
    <Tag ref={ref} {...rest}
      onMouseEnter={(e) => { gsap.to(ref.current, { y: -4, scale: 1.04, duration: 0.3, ease: "power2.out" }); rest.onMouseEnter?.(e); }}
      onMouseLeave={(e) => { gsap.to(ref.current, { y: 0, scale: 1, duration: 0.3, ease: "power2.out" }); rest.onMouseLeave?.(e); }}
      onMouseDown={(e) => { gsap.to(ref.current, { scale: 0.97, duration: 0.15 }); rest.onMouseDown?.(e); }}
      onMouseUp={(e) => { gsap.to(ref.current, { scale: 1.04, duration: 0.15 }); rest.onMouseUp?.(e); }}
      style={style}>
      {children}
    </Tag>
  );
}

export default function App() {
  const [voted, setVoted] = useState(false);
  const [count, setCount] = useState(42851);
  const [displayCount, setDisplayCount] = useState(42851);
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  const [slide, setSlide] = useState(0);
  const [vsIndex, setVsIndex] = useState(0);
  const [factsRevealed, setFactsRevealed] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const heroImgRef = useRef(null);
  const voteVideoRef = useRef(null);
  const storySectionRef = useRef(null);
  const heroBadgeRef = useRef(null);
  const heroH1Ref = useRef(null);
  const heroPRef = useRef(null);
  const heroBtnsRef = useRef(null);
  const counterRef = useRef(null);
  const countObjRef = useRef({ val: 42851 });
  const bioVideoRef = useRef(null);
  const vsScrollRef = useRef(null);
  const vsPillsRowRef = useRef(null);
  const vsIndexRef = useRef(0);
  const factsScrollRef = useRef(null);
  const factsRevealedRef = useRef(0);
  const factsRingRef = useRef(null);
  const navMenuRef = useRef(null);
  const navBtnRef = useRef(null);

  // Structural layout switch: tablets (<1024) get the safer stacked layout,
  // laptops and up (≥1024) get the side-by-side desktop layout.
  const isDesktop = width >= 1024;
  const compact = !isDesktop;
  const layout = (desktopVal, compactVal) => (isDesktop ? desktopVal : compactVal);

  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;800;900&display=swap";
    document.head.appendChild(l);

    const onResize = () => setWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Eased mousewheel smooth-scroll across the whole page (like the WordPress
  // "MouseWheel Smooth Scroll" plugin). Drives real window scroll (not a
  // transformed container), so it stays compatible with position:sticky and
  // with ScrollTrigger, which we keep in sync via lenis's own scroll event.
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const hero = heroImgRef.current;
        if (hero) {
          const rect = hero.parentElement.getBoundingClientRect();
          const buffer = rect.height * 0.15; // image is oversized by 15% top/bottom
          const offset = Math.max(-buffer, Math.min(buffer, rect.top * 0.3));
          hero.style.transform = `translateY(${offset}px)`;
        }
        const voteVideo = voteVideoRef.current;
        if (voteVideo) {
          const rect = voteVideo.parentElement.getBoundingClientRect();
          const buffer = rect.height * 0.15; // video is oversized by 15% top/bottom
          const offset = Math.max(-buffer, Math.min(buffer, rect.top * 0.3));
          voteVideo.style.transform = `translateY(${offset}px)`;
        }
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hero entrance: badge → heading → paragraph → buttons, staggered in on load.
  // useLayoutEffect so GSAP applies the hidden "from" state before the browser
  // paints — otherwise there'd be a one-frame flash of fully visible content.
  useLayoutEffect(() => {
    const targets = [heroBadgeRef.current, heroH1Ref.current, heroPRef.current, heroBtnsRef.current].filter(Boolean);
    if (!targets.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(targets,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.14, delay: 0.15 }
      );
    });
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (bioVideoRef.current) gsap.set(bioVideoRef.current, { scale: 1.15, transformOrigin: "50% 50%" });
  }, []);

  // Nav dropdown: scale/fade the panel in and stagger its links each time it opens.
  useLayoutEffect(() => {
    if (!navOpen || !navMenuRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(navMenuRef.current,
        { opacity: 0, y: -10, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(1.7)" }
      );
      gsap.fromTo(navMenuRef.current.children,
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.35, ease: "power2.out", stagger: 0.05, delay: 0.05 }
      );
    });
    return () => ctx.revert();
  }, [navOpen]);

  // Reusable scroll-reveal: any element with data-reveal fades/slides up once when
  // it scrolls into view; any element with data-reveal-group staggers its direct
  // children in the same way. This drives every section's entrance across the page.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-reveal]").forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 44 },
          {
            opacity: 1, y: 0, duration: 0.85, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
          }
        );
      });
      gsap.utils.toArray("[data-reveal-group]").forEach((group) => {
        gsap.fromTo(group.children,
          { opacity: 0, y: 34 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.12,
            scrollTrigger: { trigger: group, start: "top 85%", toggleActions: "play none none reverse" },
          }
        );
      });
      // VS watermark: scale + fade in as it enters view.
      gsap.utils.toArray("[data-reveal-scale]").forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, scale: 0.85 },
          {
            opacity: 1, scale: 1, duration: 1, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none reverse" },
          }
        );
      });
    });
    return () => ctx.revert();
  }, [isDesktop]);

  // Vote counter: count up from its current value to the real vote total once the
  // section scrolls into view, then stays in sync with live votes afterward.
  useEffect(() => {
    const el = counterRef.current;
    if (!el) return;
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => {
        gsap.to(countObjRef.current, {
          val: count,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => setDisplayCount(Math.round(countObjRef.current.val)),
        });
      },
    });
    return () => trigger.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Toad-or-Frog comparison: as the pinned strip scrolls past, step through the
  // five trait pairs (Skin/Habitat/Movement/Legs/Defense) one at a time.
  useEffect(() => {
    if (!isDesktop || !vsScrollRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: vsScrollRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const idx = Math.min(4, Math.floor(self.progress * 5));
        if (idx !== vsIndexRef.current) {
          vsIndexRef.current = idx;
          setVsIndex(idx);
        }
      },
    });
    return () => trigger.kill();
  }, [isDesktop]);

  useEffect(() => {
    if (vsPillsRowRef.current) {
      gsap.fromTo(vsPillsRowRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" });
    }
  }, [vsIndex]);

  // Facts wheel: as the pinned strip scrolls past, the ring fills
  // continuously with scroll while the centered fact and its orbit dot
  // advance in six discrete steps.
  useEffect(() => {
    if (!isDesktop || !factsScrollRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: factsScrollRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (factsRingRef.current) {
          factsRingRef.current.style.strokeDashoffset = FACTS_RING_CIRCUMFERENCE * (1 - self.progress);
        }
        const idx = Math.min(5, Math.floor(self.progress * 6));
        if (idx !== factsRevealedRef.current) {
          factsRevealedRef.current = idx;
          setFactsRevealed(idx);
        }
      },
    });
    return () => trigger.kill();
  }, [isDesktop]);

  const castVote = () => {
    if (voted) return;
    setVoted(true);
    setCount((c) => {
      const next = c + 1;
      countObjRef.current.val = next;
      setDisplayCount(next);
      return next;
    });
  };

  const cardHover = {
    onMouseEnter: (e) => gsap.to(e.currentTarget, { y: -6, boxShadow: "0 20px 30px -10px rgba(0,0,0,0.18)", duration: 0.3, ease: "power2.out" }),
    onMouseLeave: (e) => gsap.to(e.currentTarget, { y: 0, boxShadow: "0 0px 0px 0px rgba(0,0,0,0)", duration: 0.3, ease: "power2.out" }),
  };

  const navItems = [
    { id: "our-story", label: "Our Story" },
    { id: "why-day", label: "Why a Toad Day?" },
    { id: "surprising-fact", label: "Surprising Fact" },
    { id: "toad-or-frog", label: "Toad or Frog?" },
    { id: "vote-section", label: "Vote" },
    { id: "facts", label: "Facts" },
    { id: "kids", label: "Kids' Activities" },
  ];

  const goToSection = (id) => {
    setNavOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const factItems = [
    { title: "They Still Need Protection", text: "Wetland loss, pesticide use, pollution, roads, disease and climate change threaten amphibian populations worldwide." },
    { title: "They Do Not Cause Warts", text: "The bumpy texture of a toad's skin is part of its natural anatomy. The old claim that touching a toad causes human warts is a myth." },
    { title: "Natural Pest Controllers", text: "Toads feed on insects and other invertebrates and can be valuable neighbors in gardens and agricultural landscapes." },
    { title: "Remarkable Resilience", text: "Many toads can use terrestrial habitats and tolerate drier conditions better than many other amphibians." },
    { title: "Night Hunter", text: "A single toad can eat hundreds of insects in one night — mosquitoes, cockroaches and harmful larvae." },
    { title: "Loyal to Its Home", text: "Toads tend to return to the same hiding spots night after night, year after year." },
  ];

  const vsPairs = [
    { label: "Skin", toad: "Drier-looking, thicker\nand bumpier skin", frog: "Smoother,\nmoist-looking skin" },
    { label: "Habitat", toad: "Often spends more time on land\nand returns to water to breed", frog: "Often remains close\nto water" },
    { label: "Movement", toad: "Walking and shorter,\nsturdy hops", frog: "Longer\nleaps" },
    { label: "Legs", toad: "Often shorter,\nstronger legs", frog: "Often longer\nhind legs" },
    { label: "Defense", toad: "Deterrent secretions from skin\nand parotoid glands", frog: "Rapid escape, frequently\ntoward water" },
  ];

  const bioVideoParallax = {
    onMouseMove: (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(bioVideoRef.current, { x: relX * 28, y: relY * 28, duration: 0.6, ease: "power3.out" });
    },
    onMouseLeave: () => {
      gsap.to(bioVideoRef.current, { x: 0, y: 0, duration: 0.6, ease: "power3.out" });
    },
  };

  return (
    <div style={{ fontFamily: ff, direction: "ltr", color: "#1a1a1a", background: "#fff", width: "100%" }}>

      {/* ── STICKY NAV ── */}
      <div style={{ position: "fixed", top: fluid(16, 24), left: fluid(16, 24), zIndex: 100, background: "rgba(0,110,28,0.35)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 20, boxShadow: "0 10px 30px -8px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", gap: 12, padding: "10px 16px 10px 12px" }}>
        <button ref={navBtnRef} onClick={() => setNavOpen((o) => !o)} aria-label="Menu"
          onMouseEnter={() => gsap.to(navBtnRef.current, { scale: 1.1, duration: 0.25, ease: "power2.out" })}
          onMouseLeave={() => gsap.to(navBtnRef.current, { scale: 1, duration: 0.25, ease: "power2.out" })}
          onMouseDown={() => gsap.to(navBtnRef.current, { scale: 0.9, duration: 0.12 })}
          onMouseUp={() => gsap.to(navBtnRef.current, { scale: 1.1, duration: 0.12 })}
          style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 9999, width: 40, height: 40, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          {navOpen ? (
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M4 4l12 12M16 4L4 16" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M3 10h14M3 15h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
          )}
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 17, color: "#fff", whiteSpace: "nowrap" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="15" rx="8" ry="6" stroke="#fff" strokeWidth="1.6"/><circle cx="8" cy="8" r="2.3" stroke="#fff" strokeWidth="1.6"/><circle cx="16" cy="8" r="2.3" stroke="#fff" strokeWidth="1.6"/><circle cx="8" cy="8" r="0.7" fill="#fff"/><circle cx="16" cy="8" r="0.7" fill="#fff"/></svg>
          International Toad Day
        </div>

        {navOpen && (
          <div ref={navMenuRef} style={{ position: "absolute", top: "100%", left: 0, marginTop: 8, background: "rgba(0,80,20,0.6)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 16, padding: 12, display: "flex", flexDirection: "column", gap: 4, minWidth: 220, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.35)" }}>
            {navItems.map((item) => (
              <button key={item.id} onClick={() => goToSection(item.id)}
                style={{ background: "transparent", border: "none", textAlign: "left", padding: "10px 14px", borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: ff }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                  gsap.to(e.currentTarget, { x: 6, duration: 0.25, ease: "power2.out" });
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  gsap.to(e.currentTarget, { x: 0, duration: 0.25, ease: "power2.out" });
                }}>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── HERO ── */}
      <div style={{ position: "relative", minHeight: fluid(680, 920), display: "flex", alignItems: "center", overflow: "hidden" }}>
        <video autoPlay muted loop playsInline preload="auto" src="/hiro.mp4"
          style={{ position: "absolute", left: 0, right: 0, top: "-15%", width: "100%", height: "130%", objectFit: "cover", zIndex: 0, willChange: "transform" }}
          ref={heroImgRef}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0) 65%)", zIndex: 1 }} />
        <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1300, margin: "0 auto", padding: `0 ${fluid(24, 96)}` }}>
          <div ref={heroBadgeRef} style={{ marginBottom: 20 }}>
            <span style={{ display: "inline-flex", alignItems: "center", padding: `${fluid(6, 8)} ${fluid(16, 24)}`, background: "rgba(76,175,80,0.2)", border: "1.66px solid rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", borderRadius: 9999, fontWeight: 700, fontSize: fluid(13, 16), letterSpacing: 2, color: "#94F990" }}>Observed annually · May 15</span>
          </div>
          <h1 ref={heroH1Ref} style={{ fontWeight: 900, fontSize: fluid(24, 36), lineHeight: "1.05", color: "#fff", textAlign: "left", textShadow: "0 3px 10px rgba(0,0,0,0.3)", margin: "0 0 20px", maxWidth: layout(640, "100%") }}>International Toad Day</h1>
          <p ref={heroPRef} style={{ fontWeight: 700, fontSize: 19, lineHeight: "1.5", color: "#fff", textAlign: "left", textShadow: "0 4px 12px rgba(0,0,0,0.3)", margin: "0 0 32px", maxWidth: layout(580, "100%") }}>A global day dedicated to toads, their ecological importance and the protection of their habitats.</p>
          <div ref={heroBtnsRef} style={{ display: "flex", flexWrap: "wrap", gap: fluid(12, 16) }}>
            <MagButton onClick={() => storySectionRef.current?.scrollIntoView({behavior:'smooth'})}
              style={{ display: "inline-flex", alignItems: "center", gap: 10, background: G.btn, color: "#fff", border: "none", borderRadius: 9999, padding: `${fluid(14, 18)} ${fluid(28, 44)}`, fontFamily: ff, fontWeight: 700, fontSize: fluid(16, 20), cursor: "pointer", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.15)" }}>
              Discover International Toad Day
            </MagButton>
            <MagButton as="a" href="https://www.instagram.com/internationaltoadday/" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.12)", color: "#fff", border: "1.66px solid rgba(255,255,255,0.3)", backdropFilter: "blur(10px)", borderRadius: 9999, padding: `${fluid(14, 18)} ${fluid(28, 44)}`, fontFamily: ff, fontWeight: 700, fontSize: fluid(16, 20), cursor: "pointer", textDecoration: "none" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
              Follow us on Instagram
            </MagButton>
          </div>
        </div>
      </div>

      {/* ── WHY TOAD ── */}
      <div id="our-story" ref={storySectionRef} style={{ background: "#FBF9F8", display: "flex", flexDirection: "column", alignItems: "center", padding: `${fluid(80, 120)} 0 ${fluid(60, 100)}` }}>
        <div data-reveal style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16, padding: `0 ${fluid(24, 96)}`, width: "100%", maxWidth: 1300, boxSizing: "border-box", marginBottom: fluid(24, 40) }}>
          <div style={{ background: "#D9E6DA", borderRadius: 9999, padding: "4px 16px", fontWeight: 700, fontSize: 14, color: "#5B675E", textTransform: "uppercase", letterSpacing: 1 }}>Our Story</div>
        </div>
        <div style={{ display: "flex", flexDirection: layout("row-reverse", "column"), alignItems: "center", padding: `0 ${fluid(24, 96)}`, gap: fluid(40, 64), width: "100%", maxWidth: 1300, boxSizing: "border-box" }}>

          {/* Right: image grid */}
          {isDesktop && (
            <div data-reveal-group style={{ width: 512, flexShrink: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 12, height: 480 }}>
              {/* top-left: light green card with leaf icon */}
              <div style={{ background: "#D9E6DA", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="15" rx="8" ry="6" stroke="#166534" strokeWidth="1.6"/><circle cx="8" cy="8" r="2.3" stroke="#166534" strokeWidth="1.6"/><circle cx="16" cy="8" r="2.3" stroke="#166534" strokeWidth="1.6"/><circle cx="8" cy="8" r="0.7" fill="#166534"/><circle cx="16" cy="8" r="0.7" fill="#166534"/></svg>
              </div>
              {/* top-right: toad close-up eye */}
              <div style={{ borderRadius: 20, overflow: "hidden" }}>
                <img src="https://i.imgur.com/CBCh5f7.jpeg" alt="Toad eye close-up" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              {/* bottom-left: toad video */}
              <div {...bioVideoParallax} style={{ borderRadius: 20, overflow: "hidden" }}>
                <video ref={bioVideoRef} src="/comp1.mp4" autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              {/* bottom-right: dark green card with icon */}
              <div style={{ background: "#006E1C", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="15" rx="8" ry="6" stroke="#fff" strokeWidth="1.6"/><circle cx="8" cy="8" r="2.3" stroke="#fff" strokeWidth="1.6"/><circle cx="16" cy="8" r="2.3" stroke="#fff" strokeWidth="1.6"/><circle cx="8" cy="8" r="0.7" fill="#fff"/><circle cx="16" cy="8" r="0.7" fill="#fff"/></svg>
              </div>
            </div>
          )}

          {/* Left: text */}
          <div data-reveal style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 24, flex: 1, width: "100%" }}>
            <h2 style={{ fontWeight: 900, fontSize: fluid(24, 36), lineHeight: "1.1", color: "#006E1C", textAlign: "left", margin: 0, width: "100%" }}>From an Israeli initiative to a<br />growing international day</h2>
            <p style={{ fontWeight: 400, fontSize: 19, lineHeight: "1.7", color: "#3F4A3C", textAlign: "left", margin: 0 }}>International Toad Day was founded in Israel in 2026 by Avi Zobel and Reptiles of Israel. It was created to challenge old myths, give toads the recognition they deserve and encourage education, research and habitat conservation around the world.</p>
            <p style={{ fontWeight: 700, fontSize: 19, lineHeight: "1.7", color: "#1B1C1C", textAlign: "left", margin: 0 }}>The first International Toad Day was observed on May 15, 2026. During its inaugural year, it entered Israel's educational and natural-history calendars and was marked by nature, wildlife and educational communities in several countries — laying the foundation for a new annual global tradition.</p>
          </div>
        </div>

        {/* Quote — its own full-width row */}
        <div data-reveal style={{ width: "100%", maxWidth: 1300, padding: `${fluid(24, 40)} ${fluid(24, 96)} ${fluid(48, 80)}`, boxSizing: "border-box" }}>
          <div style={{ background: "#F6F3F2", borderLeft: "8px solid #006E1C", borderRadius: 24, padding: fluid(24, 40), display: "flex", flexDirection: "column", gap: 16, width: "100%", boxSizing: "border-box" }}>
            <p style={{ fontWeight: 500, fontSize: 19, lineHeight: "1.5", color: "#1B1C1C", textAlign: "left", margin: 0 }}>"The initiative for International Toad Day was born to shatter old myths and give toads everywhere the respect they deserve as a critical link in the food chain — both in the wild and in our home gardens."</p>
            <span style={{ fontWeight: 700, fontSize: 17, color: "#006E1C", textAlign: "left", marginBottom: 16 }}>— Avi Zobel, Founder</span>
            <a href="https://www.israelreptiles.co.il/" target="_blank" rel="noopener noreferrer" style={{ alignSelf:"flex-end", background:"#006E1C", color:"#fff", borderRadius:9999, padding:"12px 28px", fontFamily:ff, fontWeight:700, fontSize: 17, textDecoration:"none", display:"inline-flex", alignItems:"center", gap:8 }}>
              Check out the project ↗
            </a>
          </div>
        </div>

        {/* Why the toad needs its own day — full-width video background card */}
        <div id="why-day" data-reveal style={{ position: "relative", width: "100%", minHeight: fluid(520, 760), overflow: "hidden", borderRadius: layout(24, 0), display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
          <video autoPlay muted loop playsInline
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, transform: "scaleX(-1)" }}>
            <source src="/magnific_a-green-spotted-toad-jump_4R3pqGy9Aa.mp4" type="video/mp4" />
          </video>
          <div style={{ position: "relative", zIndex: 2, width: "33%", minWidth: 320, marginLeft: fluid(24, 64), boxSizing: "border-box", padding: fluid(24, 40), display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", gap: 16, background: "rgba(0,90,24,0.4)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 24, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)" }}>
            <h2 style={{ fontWeight: 900, fontSize: fluid(24, 36), lineHeight: "1.1", color: "#fff", textAlign: "left", margin: "0 0 8px", width: "100%" }}>Why does the toad need its<br />own day?</h2>
            <p style={{ fontWeight: 400, fontSize: 17, lineHeight: "1.6", color: "rgba(255,255,255,0.9)", textAlign: "left", margin: 0, width: "100%" }}>For years, toads have been cast in the shadow of frogs. Frogs and toads belong to the same biological order, Anura, but they often represent very different ways of life.</p>
            <p style={{ fontWeight: 400, fontSize: 17, lineHeight: "1.6", color: "rgba(255,255,255,0.9)", textAlign: "left", margin: 0, width: "100%" }}>Toads typically evolved thicker, more water-resistant skin, powerful chemical defenses and a greater ability to survive away from water. In many ways, they represent a tougher, more terrestrial path within amphibian evolution.</p>
            <p style={{ fontWeight: 400, fontSize: 17, lineHeight: "1.6", color: "rgba(255,255,255,0.9)", textAlign: "left", margin: 0, width: "100%" }}>The toad is not "just another frog." It is a fascinating, resilient creature and an important ecological partner. Toads consume many insects and other invertebrates, while species around the world face increasing pressure from habitat destruction, climate change, disease and pollution.</p>
          </div>
        </div>

        {/* Surprising fact — plain */}
        <div id="surprising-fact" data-reveal style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: layout(`${fluid(160, 200)} ${fluid(24, 96)} ${fluid(98, 138)}`, `${fluid(48, 64)} ${fluid(24, 32)}`), width: "100%", maxWidth: 1300, boxSizing: "border-box", textAlign: "center" }}>
          <div style={{ background: "#D9E6DA", borderRadius: 9999, padding: "4px 16px", fontWeight: 700, fontSize: 14, color: "#5B675E", textTransform: "uppercase", letterSpacing: 1 }}>A Surprising Fact</div>
          <h2 style={{ fontWeight: 900, fontSize: fluid(24, 36), lineHeight: "1.1", color: "#006E1C", textAlign: "center", margin: 0, width: "100%" }}>Israel has only one true toad species</h2>
          <p style={{ fontWeight: 400, fontSize: 19, lineHeight: "1.7", color: "#3F4A3C", textAlign: "center", margin: 0, maxWidth: 760 }}>Israel has only one true toad species: the Green Toad (<i>Bufotes viridis</i>). Although it is sometimes confused with other amphibians, it is the country's only representative of the true toad family, Bufonidae.</p>
          <p style={{ fontWeight: 400, fontSize: 19, lineHeight: "1.7", color: "#3F4A3C", textAlign: "center", margin: 0, maxWidth: 760 }}>Protecting Israel's toads therefore means protecting an entire, unique species and an irreplaceable part of the local ecosystem.</p>
        </div>
      </div>

      {/* ── FACTS + HOW TO HELP ── */}
      <div id="facts" style={{ background:"#F6FFF5" }}>
        {isDesktop ? (
          <div ref={factsScrollRef} style={{ position: "relative", width: "100%", height: `${factItems.length * 60}vh` }}>
            <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <video src="/Cycles.mp4" autoPlay muted loop playsInline
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} />
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,40,10,0.25)", zIndex: 0 }} />

              <div style={{ position: "relative", zIndex: 1, width: "100%", padding: `0 ${fluid(24, 48)}`, boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
                <div data-reveal style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: "100%", maxWidth: 900, textAlign: "center", alignSelf: "center" }}>
                  <div style={{ background: "#D9E6DA", borderRadius: 9999, padding: "4px 16px", fontWeight: 700, fontSize: 14, color: "#5B675E", textTransform: "uppercase", letterSpacing: 1 }}>Must-Know Facts</div>
                  <h2 style={{ fontWeight:900, fontSize: fluid(24, 36), lineHeight:"1.1", color:"#fff", textAlign:"center", margin:0, width:"100%", whiteSpace:"nowrap", textShadow:"0 2px 12px rgba(0,0,0,0.35)" }}>Facts You Need to Know About the Toad</h2>
                  <p style={{ fontWeight:500, fontSize: 19, lineHeight:"24px", color:"#fff", textAlign:"center", margin:0, whiteSpace:"nowrap", textShadow:"0 2px 8px rgba(0,0,0,0.3)" }}>Turns out they're so much more than we thought. Meet the superhero of the garden.</p>
                </div>
                <div style={{ position: "relative", width: fluid(320, 460), height: fluid(320, 460), alignSelf: "center", flexShrink: 0 }}>
                  <svg viewBox="0 0 300 300" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                    <circle cx="150" cy="150" r={FACTS_RING_RADIUS} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="14" />
                    <circle ref={factsRingRef} cx="150" cy="150" r={FACTS_RING_RADIUS} fill="none" stroke="#4ADE80" strokeWidth="14" strokeLinecap="round"
                      strokeDasharray={FACTS_RING_CIRCUMFERENCE} strokeDashoffset={FACTS_RING_CIRCUMFERENCE} />
                  </svg>

                  {factItems.map((it, i) => {
                    const angle = (i * (360 / factItems.length) - 90) * (Math.PI / 180);
                    const dotLeft = 50 + 43.3 * Math.cos(angle);
                    const dotTop = 50 + 43.3 * Math.sin(angle);
                    return (
                      <div key={it.title} style={{ position: "absolute", left: `${dotLeft}%`, top: `${dotTop}%`, transform: "translate(-50%, -50%)", width: 16, height: 16, borderRadius: 9999, background: i <= factsRevealed ? "#4ADE80" : "rgba(255,255,255,0.35)", border: "2px solid rgba(0,60,15,0.7)", boxShadow: i <= factsRevealed ? "0 0 10px rgba(74,222,128,0.7)" : "none", transition: "background 0.3s ease, box-shadow 0.3s ease", zIndex: 3 }} />
                    );
                  })}

                  <div style={{ position: "absolute", inset: "13%", borderRadius: "50%", overflow: "hidden", background: "rgba(0,90,24,0.55)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,0.22)", boxShadow: "0 15px 30px -10px rgba(0,0,0,0.4)" }}>
                    {factItems.map((it, i) => (
                      <div key={it.title} style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, padding: "18%", boxSizing: "border-box", textAlign: "center", opacity: i === factsRevealed ? 1 : 0, transition: "opacity 0.5s ease" }}>
                        <div style={{ width: 36, height: 36, borderRadius: 9999, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M16.667 5L7.5 14.167 3.333 10" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 19, lineHeight: "24px", color: "#fff" }}>{it.title}</div>
                        <div style={{ fontWeight: 400, fontSize: 15, lineHeight: "19px", color: "rgba(255,255,255,0.85)" }}>{it.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ position: "relative", padding: `${fluid(60, 128)} 0`, overflow: "hidden" }}>
            <video src="/Cycles.mp4" autoPlay muted loop playsInline
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,40,10,0.25)", zIndex: 0 }} />
            <div style={{ position: "relative", zIndex: 1, width: "100%", padding: `0 ${fluid(24, 48)}`, boxSizing: "border-box", display:"flex", flexDirection:"column", gap:40 }}>
              <div data-reveal style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", gap:12, width:"100%", textAlign:"left" }}>
                <div style={{ background: "#D9E6DA", borderRadius: 9999, padding: "4px 16px", fontWeight: 700, fontSize: 14, color: "#5B675E", textTransform: "uppercase", letterSpacing: 1 }}>Must-Know Facts</div>
                <h2 style={{ fontWeight:900, fontSize: fluid(24, 36), lineHeight:"1.1", color:"#fff", textAlign:"left", margin:0, width:"100%", textShadow:"0 2px 12px rgba(0,0,0,0.35)" }}>Facts You Need to Know<br />About the Toad</h2>
                <p style={{ fontWeight:500, fontSize: 19, lineHeight:"24px", color:"#fff", textAlign:"left", margin:0, width:"100%", textShadow:"0 2px 8px rgba(0,0,0,0.3)" }}>Turns out they're so much more than we thought. Meet the superhero of the garden.</p>
              </div>
              <div data-reveal-group style={{ display:"grid", gridTemplateColumns: "1fr", gap:20, width:"100%" }}>
                {factItems.map((it) => (
                  <div key={it.title} {...cardHover} style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", gap:12, background:"rgba(0,90,24,0.45)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.22)", borderRadius:20, padding:24, boxShadow:"0 15px 30px -12px rgba(0,0,0,0.3)" }}>
                    <div style={{ width:40, height:40, borderRadius:9999, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M16.667 5L7.5 14.167 3.333 10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div style={{ fontWeight:700, fontSize:20, lineHeight:"28px", color:"#fff", textAlign:"center", width:"100%" }}>{it.title}</div>
                    <div style={{ fontWeight:400, fontSize: 19, lineHeight:"24px", color:"rgba(255,255,255,0.85)", textAlign:"center", width:"100%" }}>{it.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── VS ── */}
      <div id="toad-or-frog" style={{ background: "linear-gradient(180deg,#FBF9F8 33%,#fff 56%)", padding: `${fluid(40, 44)} ${fluid(16, 32)}` }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          {!isDesktop && (
            <div data-reveal style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
              <div style={{ background: "#D9E6DA", borderRadius: 9999, padding: "4px 16px", fontWeight: 700, fontSize: 14, color: "#5B675E", textTransform: "uppercase", letterSpacing: 1 }}>Know the Difference</div>
              <h2 style={{ fontWeight: 900, fontSize: fluid(24, 36), lineHeight: "1.1", color: "#006E1C", textAlign: "center", margin: 0 }}>Toad or Frog?</h2>
            </div>
          )}

          {isDesktop ? (
            <div ref={vsScrollRef} style={{ position: "relative", width: "100%", maxWidth: 1176, height: `${5 * 70}vh` }}>
              <div style={{ position: "sticky", top: 0, height: "100vh", boxSizing: "border-box", padding: "20px 0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                <div style={{ position: "absolute", right: fluid(16, 40), top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, zIndex: 3 }}>
                  {vsPairs.map((p, i) => (
                    <div key={p.label} style={{ width: 4, height: i === vsIndex ? 32 : 16, borderRadius: 9999, background: i === vsIndex ? "#006E1C" : "rgba(0,110,28,0.25)", transition: "height 0.3s ease, background 0.3s ease" }} />
                  ))}
                </div>
                <div data-reveal style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <div style={{ background: "#D9E6DA", borderRadius: 9999, padding: "4px 16px", fontWeight: 700, fontSize: 14, color: "#5B675E", textTransform: "uppercase", letterSpacing: 1 }}>Know the Difference</div>
                  <h2 style={{ fontWeight: 900, fontSize: fluid(24, 36), lineHeight: "1.1", color: "#006E1C", textAlign: "center", margin: 0 }}>Toad or Frog?</h2>
                </div>

                <div ref={vsPillsRowRef} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, width: "100%", maxWidth: 1176 }}>
                  <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                    <div {...cardHover} style={{ background:"rgba(0,110,28,0.55)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", borderRadius:20, width:380, minHeight:92, boxSizing:"border-box", padding:"20px 24px", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:fluid(15, 18), letterSpacing:1, color:"#fff", textAlign:"center", whiteSpace:"pre-line", boxShadow:"0 10px 25px -10px rgba(0,60,15,0.35)" }}>{vsPairs[vsIndex].toad}</div>
                  </div>
                  <div style={{ width: 120, height: 120, background:"#DFFFE2", borderRadius:"50%", flexShrink: 0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontWeight:700, fontSize: 17, color:"#3F4A3C", textAlign:"center" }}>{vsPairs[vsIndex].label}</span>
                  </div>
                  <div style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
                    <div {...cardHover} style={{ background:"rgba(0,110,28,0.55)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", borderRadius:20, width:380, minHeight:92, boxSizing:"border-box", padding:"20px 24px", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:fluid(15, 18), letterSpacing:1, color:"#fff", textAlign:"center", whiteSpace:"pre-line", boxShadow:"0 10px 25px -10px rgba(0,60,15,0.35)" }}>{vsPairs[vsIndex].frog}</div>
                  </div>
                </div>

                <div data-reveal-scale style={{ position: "relative", width: "100%", height: 560, margin: "0 auto" }}>
                  {/* VS text */}
                  <div style={{ position:"absolute", left:"50%", top:0, transform:"translateX(-50%)", fontWeight:900, fontSize:388, lineHeight:"432px", background:"linear-gradient(180deg,#C4FEC2 31.86%,#E2FEE0 47.33%,#fff 73.48%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", zIndex:0, userSelect:"none", whiteSpace:"nowrap" }}>VS</div>
                  {/* frogs video */}
                  <video src="/magnific_subtle-slow-motion.-the-t_IfaxexJtvE.mp4" autoPlay muted loop playsInline
                    style={{ position:"absolute", left:0, top:45, width:"100%", height:515, objectFit:"cover", zIndex:1, mixBlendMode:"multiply", borderRadius:16,
                      maskImage: "radial-gradient(ellipse 50% 50% at center, #000 78%, transparent 100%)",
                      WebkitMaskImage: "radial-gradient(ellipse 50% 50% at center, #000 78%, transparent 100%)" }} />
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 1176 }}>
              <div data-reveal-group style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontWeight: 800, fontSize: 19, color: "#006E1C", textAlign: "center", marginBottom: 8 }}>🦎 True Toad - typically</div>
                {vsPairs.map((p, i) => (
                  <div key={i} {...cardHover} style={{ background:"rgba(0,110,28,0.55)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", borderRadius:9999, padding:"14px 20px", fontWeight:700, fontSize:fluid(15, 18), letterSpacing:1, color:"#fff", textAlign:"center", whiteSpace:"pre-line", boxShadow:"0 10px 25px -10px rgba(0,60,15,0.35)" }}>{p.toad}</div>
                ))}
              </div>
              <div data-reveal-group style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontWeight: 800, fontSize: 19, color: "#006E1C", textAlign: "center", marginBottom: 8 }}>🐸 Frog - typically</div>
                {vsPairs.map((p, i) => (
                  <div key={i} {...cardHover} style={{ background:"rgba(0,110,28,0.55)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", borderRadius:9999, padding:"14px 20px", fontWeight:700, fontSize:fluid(15, 18), letterSpacing:1, color:"#fff", textAlign:"center", whiteSpace:"pre-line", boxShadow:"0 10px 25px -10px rgba(0,60,15,0.35)" }}>{p.frog}</div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, maxWidth: 700, textAlign: "center" }}>
            <p style={{ fontWeight: 400, fontSize: 17, lineHeight: "1.5", color: "#3F4A3C", margin: 0 }}>These are useful general tendencies, not strict scientific rules. "Frog" and "toad" are common names within the same order.</p>
            <a href="https://www.israelreptiles.co.il/%d7%9e%d7%92%d7%93%d7%99%d7%a8-%d7%93%d7%95-%d7%97%d7%99%d7%99%d7%9d/" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, fontSize: 14, color: "#006E1C" }}>Explore the complete Israel amphibian guide.</a>
          </div>
        </div>
      </div>

      {/* ── VOTE ── */}
      <div id="vote-section" style={{ position:"relative", height: fluid(500, 688), overflow:"hidden", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <video ref={voteVideoRef} src="/magnific_a-green-spotted-toad-jump_4R3pqGy9Aa.mp4" autoPlay muted loop playsInline
          style={{ position:"absolute", left:0, right:0, top:"-15%", width:"100%", height:"130%", objectFit:"cover", zIndex:0, willChange:"transform" }} />
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)", zIndex:1 }} />
        <div data-reveal style={{ position:"relative", zIndex:2, display:"flex", flexDirection:"column", alignItems:"center", gap: fluid(32, 64), padding: "0 24px" }}>
          <h2 style={{ fontWeight:900, fontSize: fluid(24, 36), lineHeight:"1.1", color:"#fff", textAlign:"center", margin:0 }}>Together We'll Make History!</h2>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
            <div ref={counterRef} style={{ fontWeight:900, fontSize: fluid(80, 192), lineHeight:"1", letterSpacing: fluid(-9.6, -3), color:"#fff", textAlign:"center" }}>{displayCount.toLocaleString()}</div>
            <div style={{ fontWeight:700, fontSize: fluid(24, 48), color:"#fff", textAlign:"center", marginBottom: fluid(24, 32) }}>voters</div>
            <MagButton onClick={castVote}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(196,254,194,0.4)";
                e.currentTarget.style.color = "#006E1C";
                e.currentTarget.querySelectorAll("path").forEach((p) => p.setAttribute("stroke", "#006E1C"));
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0,90,24,0.55)";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.querySelectorAll("path").forEach((p) => p.setAttribute("stroke", "#fff"));
              }}
              style={{ background:"rgba(0,90,24,0.55)", backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)", border:"1px solid rgba(255,255,255,0.25)", borderRadius:9999, padding: `${fluid(14, 18)} ${fluid(28, 44)}`, fontFamily:ff, fontWeight:700, fontSize: fluid(16, 20), color:"#fff", cursor:"pointer", boxShadow:"0 25px 50px -12px rgba(0,0,0,0.25)", display:"inline-flex", alignItems:"center", gap:12, transition:"background 0.3s ease, color 0.3s ease" }}>
              {voted ? "Thanks for voting! 👍" : <><svg width="20" height="19" viewBox="0 0 42 40" fill="none"><path d="M6 20l8 8L36 6" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>I'm Voting for the Toad</>}
            </MagButton>
          </div>
        </div>
      </div>

      {/* ── KIDS ACTIVITY ── */}
      <div id="kids" style={{ position:"relative", background:"#F6FFF5", padding: `${fluid(60, 128)} ${fluid(24, 32)} ${fluid(90, 160)}`, display:"flex", justifyContent:"center", alignItems:"center", overflow:"hidden" }}>
        <div style={{ display:"flex", flexDirection: layout("row", "column"), alignItems:"center", gap: fluid(40, 111), width:"100%", maxWidth:1152, minHeight: isDesktop ? fluid(420, 560) : "auto" }}>
          <div data-reveal style={{ position:"relative", display:"flex", flexDirection:"column", alignItems:"flex-start", justifyContent:"center", gap:24, flex:1, width:"100%", alignSelf:"stretch" }}>
            <div style={{ background:"#C4FEC2", borderRadius:9999, padding:"4px 16px", fontWeight:700, fontSize:14, color:"#006E1C", alignSelf:"flex-start" }}>For Children and Educators</div>
            <h2 style={{ fontWeight:900, fontSize: fluid(24, 36), lineHeight:"1.1", color:"#006E1C", textAlign:"left", margin:0, width:"100%" }}>Kids' Creative Activities</h2>
            <p style={{ fontWeight:400, fontSize: 19, lineHeight:"1.6", color:"#3F4A3C", textAlign:"left", margin:0 }}>Download, print and use these activities to introduce children to toads and their habitats.</p>
            {isDesktop && (
              <video autoPlay muted loop playsInline preload="auto"
                style={{ position:"absolute", left: 0, top: "100%", marginTop: -240, height: fluid(260, 340), width: "auto", zIndex: 5, transform: "scaleX(-1)", pointerEvents:"none" }}>
                <source src="/toad_jump_alpha.webm" type="video/webm" />
                <source src="/toad_jump_compressed.mp4" type="video/mp4" />
              </video>
            )}
          </div>
          <div data-reveal style={{ width: layout(502, "100%"), flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:20 }}>
            <div style={{ width:"100%", aspectRatio:"1 / 1", position:"relative" }}>
              {kidsSlides.map((s, i) => (
                <div key={i} style={{ position:"absolute", inset:0, opacity: slide===i ? 1 : 0, transition:"opacity 0.4s", pointerEvents: slide===i ? "auto" : "none" }}>
                  <div style={{ width:"100%", height:"100%", borderRadius:16, overflow:"hidden", transform: "rotate(-4deg)", boxShadow:"0 25px 50px -12px rgba(0,0,0,0.25)", position:"relative" }}>
                    <img src={s.img} alt={s.alt} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", transform: `scale(${s.zoom || 1})`, transformOrigin:"center" }} />
                    <a href={s.file} download style={{ position:"absolute", bottom:16, right:16, width:48, height:48, borderRadius:9999, background:"#006E1C", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 10px 15px -3px rgba(0,0,0,0.2)" }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3v11M5 9l5 5 5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </a>
                  </div>
                </div>
              ))}
              <button onClick={() => setSlide((slide - 1 + kidsSlides.length) % kidsSlides.length)} aria-label="Previous slide"
                style={{ position:"absolute", left:-16, top:"50%", transform:"translateY(-50%)", zIndex:3, width:40, height:40, borderRadius:9999, border:"none", background:"#006E1C", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 10px 15px -3px rgba(0,0,0,0.2)" }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button onClick={() => setSlide((slide + 1) % kidsSlides.length)} aria-label="Next slide"
                style={{ position:"absolute", right:-16, top:"50%", transform:"translateY(-50%)", zIndex:3, width:40, height:40, borderRadius:9999, border:"none", background:"#006E1C", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 10px 15px -3px rgba(0,0,0,0.2)" }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              {kidsSlides.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)} aria-label={`Show slide ${i + 1}`} style={{ width:10, height:10, padding:0, borderRadius:9999, border:"none", cursor:"pointer", background: slide===i ? "#006E1C" : "#C7D6C8" }} />
              ))}
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontWeight:700, fontSize: 17, color:"#006E1C" }}>{kidsSlides[slide].title}</div>
              <div style={{ fontWeight:400, fontSize: 17, color:"#3F4A3C", marginTop:4, whiteSpace:"pre-line" }}>{kidsSlides[slide].text}</div>
            </div>
          </div>
        </div>

      </div>

      {/* ── FOOTER ── */}
      <div id="site-footer" style={{ background:"#fff", padding: `${fluid(32, 48)} ${fluid(24, 48)}`, display:"flex", flexDirection: layout("row", "column"), justifyContent:"space-between", alignItems:"center", gap:16 }}>
        <div style={{ display:"flex", flexDirection:"row", gap:24, alignItems:"center", flexWrap:"wrap", justifyContent: layout("flex-start", "center") }}>
          <a href="https://www.instagram.com/internationaltoadday/" target="_blank" rel="noopener noreferrer"
            style={{ display:"inline-flex", alignItems:"center", gap:6, fontWeight:400, fontSize: 17, color:"#3F4A3C", textDecoration:"none", cursor:"pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
            Instagram
          </a>
          <a href="mailto:zisraelreptiles@gmail.com"
            style={{ display:"inline-flex", alignItems:"center", gap:6, fontWeight:400, fontSize: 17, color:"#3F4A3C", textDecoration:"none", cursor:"pointer" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="3" stroke="#15803D" strokeWidth="2"/><path d="M3 6.5L12 13L21 6.5" stroke="#15803D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            zisraelreptiles@gmail.com
          </a>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="15" rx="8" ry="6" stroke="#166534" strokeWidth="1.6"/><circle cx="8" cy="8" r="2.3" stroke="#166534" strokeWidth="1.6"/><circle cx="16" cy="8" r="2.3" stroke="#166534" strokeWidth="1.6"/><circle cx="8" cy="8" r="0.7" fill="#166534"/><circle cx="16" cy="8" r="0.7" fill="#166534"/></svg>
          <span style={{ fontWeight:700, fontSize: 19, color:"#166534" }}>International Toad Day</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap", justifyContent: layout("flex-end", "center") }}>
          <span style={{ fontWeight:700, fontSize: 17, color:"#3F4A3C" }}>© israelreptiles. All rights reserved.</span>
          <a href="https://www.israelreptiles.co.il" target="_blank" rel="noopener noreferrer"
            style={{ display:"inline-flex", alignItems:"center", gap:6, fontWeight:400, fontSize: 17, color:"#3F4A3C", textDecoration:"none", cursor:"pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><ellipse cx="12" cy="12" rx="4" ry="9" stroke="currentColor" strokeWidth="1.8"/><path d="M3 12h18M4.5 7.5h15M4.5 16.5h15" stroke="currentColor" strokeWidth="1.8"/></svg>
            www.israelreptiles.co.il
          </a>
          <a href="https://www.facebook.com/reptilesofisrael" target="_blank" rel="noopener noreferrer"
            style={{ display:"inline-flex", alignItems:"center", gap:6, fontWeight:400, fontSize: 17, color:"#3F4A3C", textDecoration:"none", cursor:"pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14 13.5h2.5l1-4H14V7c0-1 .3-1.5 1.8-1.5H18V2h-2.7C12 2 11 3.6 11 6.3v3.2H9v4h2V22h3z"/></svg>
            Facebook
          </a>
          <img src="/logo.png" alt="Reptiles of Israel" style={{ width:36, height:36, objectFit:"contain", flexShrink:0 }} />
        </div>
      </div>

    </div>
  );
}
