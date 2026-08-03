import { useState, useEffect, useRef } from "react";

const G = { dark: "#1a4a1a", mid: "#2d7a2d", btn: "#006E1C", accent: "#4caf50" };
const ff = "'Heebo', sans-serif";

const kidsSlides = [
  { img: "https://i.imgur.com/GNDyrR4.png", alt: "Original Hebrew toad coloring activity page", file: "/דף-צביעה-לקרפדות.pdf", title: "Original Activity Page", text: "The original printable creative activity prepared for the first International Toad Day." },
  { img: "/coloring-page-en.png", alt: "English toad coloring page", file: "/international-toad-day-coloring-page.pdf", title: "English Coloring Page", text: "A new English printable featuring a toad in its natural habitat." },
];

// Fluid value that scales continuously with viewport width between minVw and maxVw,
// instead of jumping between two fixed sizes at a single breakpoint.
const fluid = (min, max, minVw = 360, maxVw = 1280) => {
  const slope = (max - min) / (maxVw - minVw);
  const base = min - slope * minVw;
  return `clamp(${Math.min(min, max)}px, ${base.toFixed(2)}px + ${(slope * 100).toFixed(4)}vw, ${Math.max(min, max)}px)`;
};

export default function App() {
  const [voted, setVoted] = useState(false);
  const [count, setCount] = useState(42851);
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  const [slide, setSlide] = useState(0);
  const heroImgRef = useRef(null);
  const bannerImgRef = useRef(null);

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

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const hero = heroImgRef.current;
        if (hero) {
          const rect = hero.parentElement.getBoundingClientRect();
          hero.style.transform = `translateY(${rect.top * 0.3}px)`;
        }
        const banner = bannerImgRef.current;
        if (banner) {
          const rect = banner.parentElement.getBoundingClientRect();
          banner.style.transform = `translateY(${(rect.top / window.innerHeight) * 40}px)`;
        }
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Structural layout switch: tablets (<1024) get the safer stacked layout,
  // laptops and up (≥1024) get the side-by-side desktop layout.
  const isDesktop = width >= 1024;
  const compact = !isDesktop;
  const layout = (desktopVal, compactVal) => (isDesktop ? desktopVal : compactVal);

  return (
    <div style={{ fontFamily: ff, direction: "ltr", color: "#1a1a1a", background: "#fff", width: "100%" }}>

      {/* ── HERO ── */}
      <div style={{ position: "relative", minHeight: fluid(560, 793), display: "flex", alignItems: "center", overflow: "hidden" }}>
        <img src="/bg_hero.jpg"
          alt="" style={{ position: "absolute", left: 0, right: 0, top: "-15%", width: "100%", height: "130%", objectFit: "cover", zIndex: 0, willChange: "transform" }}
          ref={heroImgRef}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.6))", zIndex: 1 }} />
        <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1280, margin: "0 auto", padding: `0 ${fluid(24, 96)}` }}>
          <div style={{ marginBottom: 20 }}>
            <span style={{ display: "inline-flex", alignItems: "center", padding: `${fluid(6, 8)} ${fluid(16, 24)}`, background: "rgba(76,175,80,0.2)", border: "1.66px solid rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", borderRadius: 9999, fontWeight: 700, fontSize: fluid(13, 16), letterSpacing: 2, color: "#94F990" }}>Observed annually · May 15</span>
          </div>
          <h1 style={{ fontWeight: 900, fontSize: fluid(36, 80), lineHeight: "1.05", color: "#fff", textAlign: "left", textShadow: "0 3px 10px rgba(0,0,0,0.3)", margin: "0 0 20px", maxWidth: layout(640, "100%") }}>International Toad Day</h1>
          <p style={{ fontWeight: 700, fontSize: 18, lineHeight: "1.5", color: "#fff", textAlign: "left", opacity: 0.9, textShadow: "0 4px 12px rgba(0,0,0,0.3)", margin: "0 0 32px", maxWidth: layout(580, "100%") }}>A global day dedicated to toads, their ecological importance and the protection of their habitats.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: fluid(12, 16) }}>
            <button onClick={() => document.getElementById('vote-section').scrollIntoView({behavior:'smooth'})}
              style={{ display: "inline-flex", alignItems: "center", gap: 10, background: G.btn, color: "#fff", border: "none", borderRadius: 9999, padding: `${fluid(14, 18)} ${fluid(28, 44)}`, fontFamily: ff, fontWeight: 700, fontSize: fluid(16, 20), cursor: "pointer", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.15)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
              Discover International Toad Day
            </button>
            <button style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1.66px solid rgba(255,255,255,0.3)", backdropFilter: "blur(10px)", borderRadius: 9999, padding: `${fluid(14, 18)} ${fluid(28, 44)}`, fontFamily: ff, fontWeight: 700, fontSize: fluid(16, 20), cursor: "pointer" }}>Follow us on Instagram</button>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 20, right: fluid(16, 64), zIndex: 2, fontWeight: 300, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>International Frog Day · The Society for the Protection of Nature</div>
      </div>

      {/* ── WHY TOAD ── */}
      <div style={{ background: "#FBF9F8", display: "flex", flexDirection: "column", alignItems: "center", padding: `${fluid(48, 60)} 0` }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16, padding: `0 ${fluid(24, 96)}`, width: "100%", maxWidth: 1280, boxSizing: "border-box", marginBottom: fluid(24, 40) }}>
          <div style={{ background: "#D9E6DA", borderRadius: 9999, padding: "4px 16px", fontWeight: 700, fontSize: 14, color: "#5B675E", textTransform: "uppercase", letterSpacing: 1 }}>Our Story</div>
          <h2 style={{ fontWeight: 900, fontSize: fluid(32, 60), lineHeight: "1.1", color: "#006E1C", textAlign: "left", margin: 0, width: "100%" }}>From an Israeli initiative to a growing international day</h2>
        </div>
        <div style={{ display: "flex", flexDirection: layout("row-reverse", "column"), alignItems: "center", padding: `0 ${fluid(24, 96)}`, gap: fluid(40, 64), width: "100%", maxWidth: 1280, boxSizing: "border-box" }}>

          {/* Right: image grid */}
          {isDesktop && (
            <div style={{ width: 512, flexShrink: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 12, height: 480 }}>
              {/* top-left: light green card with leaf icon */}
              <div style={{ background: "#D9E6DA", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M8 40C8 40 12 20 32 12C32 12 36 28 20 36" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 40L20 28" stroke="#166534" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </div>
              {/* top-right: toad close-up eye */}
              <div style={{ borderRadius: 20, overflow: "hidden" }}>
                <img src="https://i.imgur.com/CBCh5f7.jpeg" alt="Toad eye close-up" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              {/* bottom-left: toad photo */}
              <div style={{ borderRadius: 20, overflow: "hidden" }}>
                <img src="https://i.imgur.com/nRwQ5Hh.jpeg" alt="Toad" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              {/* bottom-right: dark green card with icon */}
              <div style={{ background: "#006E1C", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="10" stroke="#fff" strokeWidth="2.5"/><path d="M24 8v4M24 36v4M8 24h4M36 24h4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </div>
            </div>
          )}

          {/* Left: text */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 24, flex: 1, width: "100%" }}>
            <p style={{ fontWeight: 400, fontSize: 18, lineHeight: "1.7", color: "#3F4A3C", textAlign: "left", margin: 0 }}>International Toad Day was founded in Israel in 2026 by Avi Zobel and Reptiles of Israel. It was created to challenge old myths, give toads the recognition they deserve and encourage education, research and habitat conservation around the world.</p>
            <p style={{ fontWeight: 700, fontSize: 18, lineHeight: "1.7", color: "#1B1C1C", textAlign: "left", margin: 0 }}>The first International Toad Day was observed on May 15, 2026. During its inaugural year, it entered Israel's educational and natural-history calendars and was marked by nature, wildlife and educational communities in several countries — laying the foundation for a new annual global tradition.</p>
            <div style={{ background: "#F6F3F2", borderLeft: "8px solid #006E1C", borderRadius: 24, padding: fluid(24, 40), display: "flex", flexDirection: "column", gap: 16, width: "100%", boxSizing: "border-box" }}>
              <p style={{ fontWeight: 500, fontSize: 18, lineHeight: "1.5", color: "#1B1C1C", textAlign: "left", margin: 0 }}>"The initiative for International Toad Day was born to shatter old myths and give toads everywhere the respect they deserve as a critical link in the food chain — both in the wild and in our home gardens."</p>
              <span style={{ fontWeight: 700, fontSize: 16, color: "#006E1C", textAlign: "left" }}>— Avi Zobel, Founder</span>
              <a href="https://www.israelreptiles.co.il/" target="_blank" rel="noopener noreferrer" style={{ alignSelf:"flex-end", background:"#006E1C", color:"#fff", borderRadius:9999, padding:"12px 28px", fontFamily:ff, fontWeight:700, fontSize:16, textDecoration:"none", display:"inline-flex", alignItems:"center", gap:8 }}>
                Check out the project ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── VS ── */}
      <div style={{ background: "linear-gradient(180deg,#FBF9F8 33%,#fff 56%)", padding: `${fluid(40, 44)} ${fluid(16, 32)}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <div style={{ background: "#D9E6DA", borderRadius: 9999, padding: "4px 16px", fontWeight: 700, fontSize: 14, color: "#5B675E", textTransform: "uppercase", letterSpacing: 1 }}>Know the Difference</div>
          <h2 style={{ fontWeight: 900, fontSize: fluid(32, 60), lineHeight: "1.1", color: "#006E1C", textAlign: "center", margin: 0 }}>Frog or Toad?</h2>

          {isDesktop && (
            <div style={{ position: "relative", width: "100%", maxWidth: 1176, height: 690, margin: "0 auto" }}>
              {/* VS text */}
              <div style={{ position:"absolute", left:"50%", top:0, transform:"translateX(-50%)", fontWeight:900, fontSize:478, lineHeight:"532px", background:"linear-gradient(180deg,#C4FEC2 31.86%,#E2FEE0 47.33%,#fff 73.48%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", zIndex:0, userSelect:"none", whiteSpace:"nowrap" }}>VS</div>
              {/* frogs image */}
              <img src="https://i.imgur.com/kWQWN9P.png"
                alt="Toad vs. frog" style={{ position:"absolute", left:0, top:56, width:"100%", height:634, objectFit:"cover", zIndex:1, mixBlendMode:"multiply", borderRadius:16 }} />
            </div>
          )}

          <div style={{ display: "flex", flexDirection: layout("row", "column"), justifyContent: "space-between", alignItems: layout("flex-start", "stretch"), gap: 16, width: "100%", maxWidth: 1176 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent:"space-between", alignSelf:"stretch" }}>
              {compact && <div style={{ fontWeight: 800, fontSize: 18, color: "#006E1C", textAlign: "center", marginBottom: 8 }}>🐸 Frog - typically</div>}
              {["Smoother, moist-looking skin","Often remains close to water","Longer leaps","Often longer hind legs","Rapid escape, frequently toward water"].map((t,i)=>(
                <div key={i} style={{ background:"#fff", border:"0.86px solid #15803D", borderRadius:9999, padding:"14px 20px", fontWeight:700, fontSize:fluid(14, 17), letterSpacing:1, color:"#3F4A3C", textAlign:"center" }}>{t}</div>
              ))}
            </div>
            {isDesktop && (
              <div style={{ width:200, background:"#DFFFE2", borderRadius:20, display:"flex", flexDirection:"column", justifyContent:"space-between", alignItems:"center", flexShrink:0, alignSelf:"stretch", padding:"14px 0" }}>
                {["Skin","Habitat","Movement","Legs","Defense"].map((t,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:4, fontWeight:700, fontSize:16, color:"#3F4A3C", textAlign:"center", padding:"0 8px", width:"100%" }}>
                    <span style={{ color:"#15803D" }}>←</span>
                    <span>{t}</span>
                    <span style={{ color:"#15803D" }}>→</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 12 }}>
              {compact && <div style={{ fontWeight: 800, fontSize: 18, color: "#006E1C", textAlign: "center", marginBottom: 8 }}>🦎 True Toad - typically</div>}
              {["Drier-looking, thicker and bumpier skin","Often spends more time on land and returns to water to breed","Walking and shorter, sturdy hops","Often shorter, stronger legs","Deterrent secretions from skin and parotoid glands"].map((t,i)=>(
                <div key={i} style={{ background:"#fff", border:"0.86px solid #15803D", borderRadius:9999, padding:"14px 20px", fontWeight:700, fontSize:fluid(14, 17), letterSpacing:1, color:"#3F4A3C", textAlign:"center" }}>{t}</div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, maxWidth: 700, textAlign: "center" }}>
            <p style={{ fontWeight: 400, fontSize: 14, lineHeight: "1.5", color: "#3F4A3C", margin: 0 }}>These are useful general tendencies, not strict scientific rules. "Frog" and "toad" are common names within the same order.</p>
            <a href="https://www.israelreptiles.co.il/" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, fontSize: 14, color: "#006E1C" }}>Explore the complete Israel amphibian guide.</a>
          </div>
        </div>
      </div>

      {/* ── VOTE ── */}
      <div id="vote-section" style={{ position:"relative", height: fluid(500, 688), overflow:"hidden", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Bufo_bufo_Luc_Viatour.jpg/1280px-Bufo_bufo_Luc_Viatour.jpg"
          alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", zIndex:0 }} />
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)", zIndex:1 }} />
        <div style={{ position:"relative", zIndex:2, display:"flex", flexDirection:"column", alignItems:"center", gap: fluid(32, 64), padding: "0 24px" }}>
          <h2 style={{ fontWeight:900, fontSize: fluid(36, 72), lineHeight:"1.1", color:"#fff", textAlign:"center", margin:0 }}>Together We'll Make History!</h2>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
            <div style={{ fontWeight:900, fontSize: fluid(80, 192), lineHeight:"1", letterSpacing: fluid(-9.6, -3), color:"#fff", textAlign:"center" }}>{count.toLocaleString()}</div>
            <div style={{ fontWeight:700, fontSize: fluid(24, 48), color:"#fff", textAlign:"center", marginBottom: fluid(24, 32) }}>voters</div>
            <button onClick={()=>{ if(!voted){setVoted(true);setCount(c=>c+1);}}}
              style={{ background:"#fff", border:"none", borderRadius:9999, padding: `${fluid(18, 32)} ${fluid(32, 64)}`, fontFamily:ff, fontWeight:900, fontSize: fluid(20, 36), color:"#01380F", cursor:"pointer", boxShadow:"0 25px 50px -12px rgba(0,0,0,0.25)", display:"inline-flex", alignItems:"center", gap:12 }}>
              {voted ? "Thanks for voting! 👍" : <><svg width="32" height="30" viewBox="0 0 42 40" fill="none"><path d="M6 20l8 8L36 6" stroke="#01380F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>I'm Voting for the Toad</>}
            </button>
          </div>
        </div>
      </div>

      {/* ── FACTS ── */}
      <div style={{ background:"#F6FFF5", padding: `${fluid(60, 128)} 0` }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding: `0 ${fluid(24, 32)}`, display:"flex", flexDirection:"column", gap:40 }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:12, width:"100%" }}>
            <h2 style={{ fontWeight:900, fontSize: fluid(32, 60), lineHeight:"1.1", color:"#1B1C1C", textAlign:"left", margin:0, width:"100%" }}>Facts You Need to Know About the Toad</h2>
            <p style={{ fontWeight:500, fontSize:18, lineHeight:"24px", color:"#3F4A3C", textAlign:"left", margin:0, width:"100%" }}>Turns out they're so much more than we thought. Meet the superhero of the garden.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns: layout("repeat(3,1fr)", "1fr"), gap:20 }}>
            {[
              { icon:<svg width="28" height="18" viewBox="0 0 28 18" fill="none"><path d="M2 9l8 7L26 2" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, title:"Not Warts, Not Contagious", text:"The bumps on their skin are venom glands that protect them from predators — they're not contagious to humans." },
              { icon:<svg width="20" height="23" viewBox="0 0 20 23" fill="none"><path d="M10 1v21M1 12l9 9 9-9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, title:"Night Hunter", text:"A single toad can eat hundreds of insects in one night — mosquitoes, cockroaches and harmful larvae." },
              { icon:<svg width="24" height="25" viewBox="0 0 24 25" fill="none"><circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2.5"/><path d="M12 7v5l4 2" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>, title:"Loyal to Its Home", text:"Toads tend to return to the same hiding spots night after night, year after year." }
            ].map(({icon,title,text},i)=>(
              <div key={i} style={{ background:"#DFFFE2", borderRadius:24, padding: fluid(24, 40), display:"flex", flexDirection:"column", alignItems:"flex-end", gap:20, boxSizing:"border-box" }}>
                <div style={{ width:64, height:64, background:"#006E1C", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center" }}>{icon}</div>
                <div style={{ fontWeight:900, fontSize: fluid(20, 24), lineHeight:"1.4", color:"#1B1C1C", textAlign:"left", width:"100%" }}>{title}</div>
                <div style={{ fontWeight:400, fontSize:18, lineHeight:"1.6", color:"#3F4A3C", textAlign:"left", width:"100%" }}>{text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW TO HELP ── */}
      <div style={{ background:"linear-gradient(180deg,#fff 0%,#FBF9F8 100%)" }}>
        <img src="https://i.imgur.com/5LuF6CP.png" alt="" style={{ width:"100%", height:"auto", display:"block" }} />
        {/* Image fades to transparent below ~65% of its height — text is pulled up into that
            clear zone via a width-relative negative margin so it never sits over the frog/leaf. */}
        <div style={{ marginTop:"-22%", marginLeft:"auto", marginRight:"auto", maxWidth:1280, position:"relative", zIndex:2, padding: `0 ${fluid(24, 96)} ${fluid(48, 128)}`, display:"flex", flexDirection:"column", alignItems:"flex-end" }}>
          <div style={{ background: "#D9E6DA", borderRadius: 9999, padding: "4px 16px", fontWeight: 700, fontSize: 14, color: "#5B675E", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Must-Know Facts</div>
          <h2 style={{ fontWeight:900, fontSize: fluid(40, 90), lineHeight:"1.1", color:"#009D3A", textAlign:"left", margin:"0 0 48px", width:"100%" }}>Four Reasons to Appreciate Toads</h2>
          <div style={{ display:"flex", flexDirection:"column", gap:32, width:"100%", maxWidth: layout(700, "100%") }}>
            {[["They Do Not Cause Warts","The bumpy texture of a toad's skin is part of its natural anatomy. The old claim that touching a toad causes human warts is a myth."],["Natural Pest Controllers","Toads feed on insects and other invertebrates and can be valuable neighbors in gardens and agricultural landscapes."],["Remarkable Resilience","Many toads can use terrestrial habitats and tolerate drier conditions better than many other amphibians."],["They Still Need Protection","Wetland loss, pesticide use, pollution, roads, disease and climate change threaten amphibian populations worldwide."]].map(([title,text])=>(
              <div key={title} style={{ display:"flex", flexDirection:"row", alignItems:"flex-start", gap:24, direction:"ltr" }}>
                <div style={{ width:48, height:48, borderRadius:9999, background:"#D9E6DA", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16.667 5L7.5 14.167 3.333 10" stroke="#006E1C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8 }}>
                  <div style={{ fontWeight:700, fontSize:20, lineHeight:"28px", color:"#1B1C1C", textAlign:"left", width:"100%" }}>{title}</div>
                  <div style={{ fontWeight:400, fontSize:18, lineHeight:"24px", color:"#3F4A3C", textAlign:"left", width:"100%" }}>{text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── KIDS ACTIVITY ── */}
      <div style={{ background:"#F6FFF5", padding: `${fluid(60, 128)} ${fluid(24, 32)}`, display:"flex", justifyContent:"center", alignItems:"center" }}>
        <div style={{ display:"flex", flexDirection: layout("row", "column"), alignItems:"center", gap: fluid(40, 111), width:"100%", maxWidth:1152 }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", gap:24, flex:1, width:"100%" }}>
            <div style={{ background:"#C4FEC2", borderRadius:9999, padding:"4px 16px", fontWeight:700, fontSize:14, color:"#006E1C", alignSelf:"flex-start" }}>For Children and Educators</div>
            <h2 style={{ fontWeight:900, fontSize: fluid(32, 60), lineHeight:"1.1", color:"#1B1C1C", textAlign:"left", margin:0, width:"100%" }}>Kids' Creative Activities</h2>
            <p style={{ fontWeight:400, fontSize: 18, lineHeight:"1.6", color:"#3F4A3C", textAlign:"left", margin:0 }}>Download, print and use these activities to introduce children to toads and their habitats.</p>
          </div>
          <div style={{ width: layout(502, "100%"), flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:20 }}>
            <div style={{ width:"100%", aspectRatio:"1 / 1", position:"relative" }}>
              {kidsSlides.map((s, i) => (
                <div key={i} style={{ position:"absolute", inset:0, opacity: slide===i ? 1 : 0, transition:"opacity 0.4s", pointerEvents: slide===i ? "auto" : "none" }}>
                  <div style={{ width:"100%", height:"100%", borderRadius:16, overflow:"hidden", transform: `rotate(${i % 2 === 0 ? -4 : 4}deg)`, boxShadow:"0 25px 50px -12px rgba(0,0,0,0.25)", position:"relative" }}>
                    <img src={s.img} alt={s.alt} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                    <a href={s.file} download style={{ position:"absolute", bottom:16, right:16, width:48, height:48, borderRadius:9999, background:"#006E1C", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 10px 15px -3px rgba(0,0,0,0.2)" }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3v11M5 9l5 5 5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              {kidsSlides.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)} aria-label={`Show slide ${i + 1}`} style={{ width:10, height:10, padding:0, borderRadius:9999, border:"none", cursor:"pointer", background: slide===i ? "#006E1C" : "#C7D6C8" }} />
              ))}
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontWeight:700, fontSize:16, color:"#1B1C1C" }}>{kidsSlides[slide].title}</div>
              <div style={{ fontWeight:400, fontSize:14, color:"#3F4A3C", marginTop:4 }}>{kidsSlides[slide].text}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── REPORT BANNER ── */}
      <div style={{ padding: `${fluid(24, 39)} ${fluid(16, 36)}`, background:"#f0f0f0" }}>
        <div style={{ position:"relative", height: fluid(280, 320), borderRadius:24, overflow:"hidden", background:"#1a4a1a" }}>
          <img src="https://i.imgur.com/etgzLZ8.jpeg"
            alt="" style={{ position:"absolute", left:0, right:0, top:"-30%", width:"100%", height:"160%", objectFit:"cover", zIndex:0, willChange:"transform" }}
            ref={bannerImgRef}
          />

          {/* Left: text */}
          <div style={{ position:"absolute", left:0, top:0, width: layout(559, "55%"), height:"100%", background:"rgba(0,110,28,0.55)", backdropFilter:"blur(6px)", borderRadius: layout("20px 0 0 20px", "0"), zIndex:2, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"flex-end", padding: `${fluid(16, 24)} ${fluid(12, 40)}`, gap:16 }}>
            <h2 style={{ fontWeight:900, fontSize: fluid(20, 40), lineHeight:"1.1", color:"#fff", textAlign:"left", margin:0, width:"100%" }}>Found an interesting amphibian?<br/>Snap a photo and report it on our site!</h2>
            <p style={{ fontWeight:700, fontSize: 18, lineHeight:"1.5", color:"#fff", textAlign:"left", margin:0, opacity:0.85, width:"100%" }}>Protecting Israel's reptiles and amphibians together.<br/>Every report helps us better understand the state of nature in Israel.</p>
          </div>

          {/* Right: buttons */}
          <div style={{ position:"absolute", right:0, top:0, width: layout(260, "45%"), height:"100%", zIndex:2, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"flex-start", padding: `${fluid(16, 24)} ${fluid(12, 40)}`, gap:16 }}>
            <button style={{ background:"#94F990", border:"none", borderRadius:9999, padding: `${fluid(12, 20)} ${fluid(16, 40)}`, fontFamily:ff, fontWeight:900, fontSize: fluid(13, 20), color:"#002204", cursor:"pointer", whiteSpace: layout("nowrap", "normal"), textAlign:"center", boxShadow:"0 10px 15px -3px rgba(0,0,0,0.1)" }}>I'm Voting</button>
            <button onClick={() => document.getElementById('vote-section').scrollIntoView({behavior:'smooth'})} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", backdropFilter:"blur(6px)", borderRadius:9999, padding: `${fluid(12, 18)} ${fluid(16, 40)}`, fontFamily:ff, fontWeight:700, fontSize: fluid(13, 18), color:"#fff", cursor:"pointer", whiteSpace: layout("nowrap", "normal"), textAlign:"center" }}>Report a Sighting</button>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ background:"#F6F3F2", padding: `${fluid(32, 48)} ${fluid(24, 48)}`, display:"flex", flexDirection: layout("row", "column"), justifyContent:"space-between", alignItems:"center", gap:16 }}>
        <div style={{ display:"flex", flexDirection:"row", gap:24, alignItems:"center", flexWrap:"wrap", justifyContent: layout("flex-start", "center") }}>
          {[["Facebook","#3F4A3C"],["Instagram","#3F4A3C"],["Twitter","#3F4A3C"],["Contact Us","#15803D"]].map(([t,c])=>(
            <span key={t} style={{ fontWeight: t==="Contact Us"?700:400, fontSize:14, color:c, textDecoration: t==="Contact Us"?"underline":"none", cursor:"pointer" }}>{t}</span>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M8.5 1.5C4.63 1.5 1.5 4.63 1.5 8.5s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7z" stroke="#166534" strokeWidth="1.5"/><path d="M8.5 5v3.5l2.5 1.5" stroke="#166534" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <span style={{ fontWeight:700, fontSize:18, color:"#166534" }}>International Toad Day</span>
        </div>
        <p style={{ fontWeight:400, fontSize:14, color:"#3F4A3C", margin:0, textAlign: layout("left", "center") }}>© 2024 International Toad Day. All rights reserved.</p>
      </div>

    </div>
  );
}
