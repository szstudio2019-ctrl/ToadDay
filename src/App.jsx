import { useState, useEffect } from "react";

const G = { dark: "#1a4a1a", mid: "#2d7a2d", btn: "#006E1C", accent: "#4caf50" };
const ff = "'Heebo', sans-serif";

export default function App() {
  const [voted, setVoted] = useState(false);
  const [count, setCount] = useState(42851);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;800;900&display=swap";
    document.head.appendChild(l);

    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const px = (d, m) => isMobile ? m : d;

  return (
    <div style={{ fontFamily: ff, direction: "rtl", color: "#1a1a1a", background: "#fff", width: "100%" }}>

      {/* ── HERO ── */}
      <div style={{ position: "relative", minHeight: px(793, 560), display: "flex", alignItems: "center", overflow: "hidden" }}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Bufo_bufo_Luc_Viatour.jpg/1280px-Bufo_bufo_Luc_Viatour.jpg"
          alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.6))", zIndex: 1 }} />
        <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1280, margin: "0 auto", padding: px("0 96px", "0 24px") }}>
          <div style={{ marginBottom: 20 }}>
            <span style={{ display: "inline-flex", alignItems: "center", padding: px("10px 32px", "8px 20px"), background: "rgba(76,175,80,0.2)", border: "1.66px solid rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", borderRadius: 9999, fontWeight: 700, fontSize: px(36, 20), letterSpacing: 4, color: "#94F990" }}>15 למאי</span>
          </div>
          <div style={{ fontWeight: 700, fontSize: px(48, 22), lineHeight: "1.3", color: "#fff", textAlign: "right", marginBottom: 8 }}>יום הצפרדע הבינלאומי</div>
          <h1 style={{ fontWeight: 900, fontSize: px(80, 36), lineHeight: "1.05", color: "#fff", textAlign: "right", textShadow: "0 3px 10px rgba(0,0,0,0.3)", margin: "0 0 20px", maxWidth: px(640, "100%") }}>מצדיעים לשומרת הגינה של ישראל!</h1>
          <p style={{ fontWeight: 700, fontSize: px(24, 16), lineHeight: "1.5", color: "#fff", textAlign: "right", opacity: 0.9, textShadow: "0 4px 12px rgba(0,0,0,0.3)", margin: "0 0 32px", maxWidth: px(580, "100%") }}>לצפרדעים כבר יש יום משלהן, עכשיו תורנו.<br/>הצביעו כדי להפוך את יום הקרפדה למציאות.</p>
          <button onClick={() => document.getElementById('vote-section').scrollIntoView({behavior:'smooth'})}
            style={{ background: G.btn, color: "#fff", border: "none", borderRadius: 9999, padding: px("18px 44px", "14px 28px"), fontFamily: ff, fontWeight: 700, fontSize: px(20, 16), cursor: "pointer", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.15)" }}>אני מצדיע/ה לקרפדה</button>
        </div>
        <div style={{ position: "absolute", bottom: 20, left: px(64, 16), zIndex: 2, fontWeight: 300, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>יום הצפרדע הבינלאומי · החברה להגנת הטבע</div>
      </div>

      {/* ── WHY TOAD ── */}
      <div style={{ background: "#FBF9F8", display: "flex", justifyContent: "center", alignItems: "center", padding: px("60px 0", "48px 0") }}>
        <div style={{ display: "flex", flexDirection: px("row-reverse", "column"), alignItems: "center", padding: px("0 96px", "0 24px"), gap: px(64, 40), width: "100%", maxWidth: 1280, boxSizing: "border-box" }}>

          {/* Left: image grid */}
          {!isMobile && (
            <div style={{ width: 512, flexShrink: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 12, height: 480 }}>
              {/* top-left: light green card with leaf icon */}
              <div style={{ background: "#D9E6DA", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M8 40C8 40 12 20 32 12C32 12 36 28 20 36" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 40L20 28" stroke="#166534" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </div>
              {/* top-right: toad close-up eye */}
              <div style={{ borderRadius: 20, overflow: "hidden" }}>
                <img src="https://i.imgur.com/CBCh5f7.jpeg" alt="עין קרפדה" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              {/* bottom-left: toad photo */}
              <div style={{ borderRadius: 20, overflow: "hidden" }}>
                <img src="https://i.imgur.com/nRwQ5Hh.jpeg" alt="קרפדה" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              {/* bottom-right: dark green card with icon */}
              <div style={{ background: "#006E1C", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="10" stroke="#fff" strokeWidth="2.5"/><path d="M24 8v4M24 36v4M8 24h4M36 24h4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </div>
            </div>
          )}

          {/* Right: text */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 24, flex: 1, width: "100%" }}>
            <div style={{ background: "#D9E6DA", borderRadius: 9999, padding: "4px 16px", fontWeight: 700, fontSize: 14, color: "#5B675E", textTransform: "uppercase", letterSpacing: 1 }}>THE MISSION</div>
            <h2 style={{ fontWeight: 900, fontSize: px(60, 32), lineHeight: "1.1", color: "#006E1C", textAlign: "right", margin: 0, width: "100%" }}>למה הקרפדה צריכה יום משלה?</h2>
            <p style={{ fontWeight: 400, fontSize: px(18, 15), lineHeight: "1.7", color: "#3F4A3C", textAlign: "right", margin: 0 }}>במשך שנים, הקרפדות נדחקו הצידה בצל של הצפרדעים. הן נתפסו כפחות אסתטיות, אולי אפילו מפחידות, אבל המציאות שונה לחלוטין.</p>
            <p style={{ fontWeight: 700, fontSize: px(18, 15), lineHeight: "1.7", color: "#1B1C1C", textAlign: "right", margin: 0 }}>הקרפדות הן הדו-חיים שבחרו בדרך הקשה יותר — הן ביצעו צעד אמיץ אל היבשה, פיתחו עמידות מרשימה ליובש והפכו לשומרות האמיתיות של המערכת האקולוגית בחצרות הבתים שלנו.</p>
            <div style={{ background: "#F6F3F2", borderRight: "8px solid #006E1C", borderRadius: 24, padding: px(40, 24), display: "flex", flexDirection: "column", gap: 16, width: "100%", boxSizing: "border-box" }}>
              <p style={{ fontWeight: 500, fontSize: px(24, 18), lineHeight: "1.5", color: "#1B1C1C", textAlign: "right", margin: 0 }}>"היוזמה ליום הקרפדה הבינלאומי נולדה כדי לנפץ מיתוסים ישנים ולהעניק ליצור המופלא הזה את הכבוד המגיע לו."</p>
              <span style={{ fontWeight: 700, fontSize: 16, color: "#006E1C", textAlign: "right" }}>— אבי צובל, מייסד שומרים על זוחלי הארץ</span>
              <a href="https://www.israelreptiles.co.il/" target="_blank" rel="noopener noreferrer" style={{ alignSelf:"flex-end", background:"#006E1C", color:"#fff", borderRadius:9999, padding:"12px 28px", fontFamily:ff, fontWeight:700, fontSize:16, textDecoration:"none", display:"inline-flex", alignItems:"center", gap:8 }}>
                מוזמנים לצפות במיזם ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── VS ── */}
      <div style={{ background: "linear-gradient(180deg,#FBF9F8 33%,#fff 56%)", padding: px("44px 32px", "40px 16px") }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <h2 style={{ fontWeight: 900, fontSize: px(60, 32), lineHeight: "1.1", color: "#006E1C", textAlign: "center", margin: 0 }}>ראש בראש קרפדה מול צפרדע</h2>
          <p style={{ fontWeight: 700, fontSize: px(28, 18), lineHeight: "1.5", color: "#3F4A3C", textAlign: "center", margin: 0, maxWidth: 509 }}>מזהים את ההבדלים? המדריך המהיר להבחין בין השתיים בטבע.</p>

          {!isMobile && (
            <div style={{ position: "relative", width: "100%", maxWidth: 1176, height: 690, margin: "0 auto" }}>
              {/* VS text */}
              <div style={{ position:"absolute", left:"50%", top:0, transform:"translateX(-50%)", fontWeight:900, fontSize:478, lineHeight:"532px", background:"linear-gradient(180deg,#C4FEC2 31.86%,#E2FEE0 47.33%,#fff 73.48%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", zIndex:0, userSelect:"none", whiteSpace:"nowrap" }}>VS</div>
              {/* frogs image */}
              <img src="https://i.imgur.com/kWQWN9P.png"
                alt="קרפדה מול צפרדע" style={{ position:"absolute", left:0, top:56, width:"100%", height:634, objectFit:"cover", zIndex:1, mixBlendMode:"multiply", borderRadius:16 }} />
            </div>
          )}

          <div style={{ display: "flex", flexDirection: px("row", "column"), justifyContent: "space-between", alignItems: px("flex-start", "stretch"), gap: 16, width: "100%", maxWidth: 1176 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent:"space-between", alignSelf:"stretch" }}>
              {isMobile && <div style={{ fontWeight: 800, fontSize: 18, color: "#006E1C", textAlign: "center", marginBottom: 8 }}>🐸 צפרדע</div>}
              {["חלק, לח ומבריק","צמודה למקור מים קבוע","זינוקים ארוכים וגבוהים","רגליים אחוריות ארוכות מאוד","בורחת בזינוק מהיר למים"].map((t,i)=>(
                <div key={i} style={{ background:"#fff", border:"0.86px solid #15803D", borderRadius:9999, padding:"14px 20px", fontWeight:700, fontSize:px(17,14), letterSpacing:1, color:"#3F4A3C", textAlign:"center" }}>{t}</div>
              ))}
            </div>
            {!isMobile && (
              <div style={{ width:200, background:"#DFFFE2", borderRadius:20, display:"flex", flexDirection:"column", justifyContent:"space-between", alignItems:"center", flexShrink:0, alignSelf:"stretch", padding:"14px 0" }}>
                {["מראה העור","מקום מגורים","צורת תנועה","מבנה הרגליים","הגנה"].map((t,i)=>(
                  <div key={i} style={{ fontWeight:700, fontSize:16, color:"#3F4A3C", textAlign:"center", padding:"0 8px", width:"100%" }}>{t}</div>
                ))}
              </div>
            )}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 12 }}>
              {isMobile && <div style={{ fontWeight: 800, fontSize: 18, color: "#006E1C", textAlign: "center", marginBottom: 8 }}>🦎 קרפדה</div>}
              {["יבש, גבשושי ו\"יבלתי\"","חיה ביבשה, מחפשת מקור מים רק להטלה, קיימת אוכלוסייה גם בדיונות צחיחות.","הליכה, זחילה או ניתורים קצרים","רגליים קצרות וחזקות להליכה, וחפירה.","הפרשת חומר חלבי מרתיע (בלוטות הפרוטיד) שחרור רעלן בעל ריח וטעם דוחים + השפעה טוקסית."].map((t,i)=>(
                <div key={i} style={{ background:"#fff", border:"0.86px solid #15803D", borderRadius:9999, padding:"14px 20px", fontWeight:700, fontSize:px(17,14), letterSpacing:1, color:"#3F4A3C", textAlign:"center" }}>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── VOTE ── */}
      <div id="vote-section" style={{ position:"relative", height: px(688, 500), overflow:"hidden", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Bufo_bufo_Luc_Viatour.jpg/1280px-Bufo_bufo_Luc_Viatour.jpg"
          alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", zIndex:0 }} />
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)", zIndex:1 }} />
        <div style={{ position:"relative", zIndex:2, display:"flex", flexDirection:"column", alignItems:"center", gap: px(64, 32), padding: "0 24px" }}>
          <h2 style={{ fontWeight:900, fontSize: px(72, 36), lineHeight:"1.1", color:"#fff", textAlign:"center", margin:0 }}>יחד נעשה היסטוריה!</h2>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
            <div style={{ fontWeight:900, fontSize: px(192, 80), lineHeight:"1", letterSpacing: px("-9.6px", "-3px"), color:"#fff", textAlign:"center" }}>{count.toLocaleString()}</div>
            <div style={{ fontWeight:700, fontSize: px(48, 24), color:"#fff", textAlign:"center", marginBottom: px(32, 24) }}>מצביעים</div>
            <button onClick={()=>{ if(!voted){setVoted(true);setCount(c=>c+1);}}}
              style={{ background:"#fff", border:"none", borderRadius:9999, padding: px("32px 64px", "18px 32px"), fontFamily:ff, fontWeight:900, fontSize: px(36, 20), color:"#01380F", cursor:"pointer", boxShadow:"0 25px 50px -12px rgba(0,0,0,0.25)", display:"inline-flex", alignItems:"center", gap:12 }}>
              {voted ? "תודה על ההצבעה! 👍" : <><svg width="32" height="30" viewBox="0 0 42 40" fill="none"><path d="M6 20l8 8L36 6" stroke="#01380F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>אני מצביע/ה לקרפדה</>}
            </button>
          </div>
        </div>
      </div>

      {/* ── FACTS ── */}
      <div style={{ background:"#F6FFF5", padding: px("128px 0", "60px 0") }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding: px("0 32px", "0 24px"), display:"flex", flexDirection:"column", gap:40 }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:12, width:"100%" }}>
            <h2 style={{ fontWeight:900, fontSize: px(60, 32), lineHeight:"1.1", color:"#1B1C1C", textAlign:"right", margin:0, width:"100%" }}>עובדות שחובה להכיר על הקרפדה</h2>
            <p style={{ fontWeight:500, fontSize:16, lineHeight:"24px", color:"#3F4A3C", textAlign:"right", margin:0, width:"100%" }}>מסתבר שהן הרבה יותר ממה שחשבנו. הכירו את הסופר-הירו של הגינה.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns: px("repeat(3,1fr)", "1fr"), gap:20 }}>
            {[
              { icon:<svg width="28" height="18" viewBox="0 0 28 18" fill="none"><path d="M2 9l8 7L26 2" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, title:"לא ליבלות, לא מדבקת", text:"הבליטות על העור הן בלוטות רעל שמגינות עליהן מטורפים, ולא מדבקות לאדם." },
              { icon:<svg width="20" height="23" viewBox="0 0 20 23" fill="none"><path d="M10 1v21M1 12l9 9 9-9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, title:"ציידת לילה", text:"קרפדה בודדת יכולה לאכול מאות חרקים בלילה אחד — יתושים, תיקנים וזחלים מזיקים." },
              { icon:<svg width="24" height="25" viewBox="0 0 24 25" fill="none"><circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2.5"/><path d="M12 7v5l4 2" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>, title:"נאמנה למקום", text:"קרפדות נוטות לחזור לאותם מקומות מסתור לילה אחרי לילה, שנה אחר שנה." }
            ].map(({icon,title,text},i)=>(
              <div key={i} style={{ background:"#DFFFE2", borderRadius:24, padding: px(40, 24), display:"flex", flexDirection:"column", alignItems:"flex-end", gap:20, boxSizing:"border-box" }}>
                <div style={{ width:64, height:64, background:"#006E1C", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center" }}>{icon}</div>
                <div style={{ fontWeight:900, fontSize: px(24, 20), lineHeight:"1.4", color:"#1B1C1C", textAlign:"right", width:"100%" }}>{title}</div>
                <div style={{ fontWeight:400, fontSize:16, lineHeight:"1.6", color:"#3F4A3C", textAlign:"right", width:"100%" }}>{text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW TO HELP ── */}
      <div style={{ background:"linear-gradient(180deg,#fff 0%,#FBF9F8 100%)", display:"flex", flexDirection: px("row", "column"), alignItems:"stretch", minHeight: px(820, "auto") }}>
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"flex-end", justifyContent:"center", padding: px("128px 96px 128px 64px", "48px 24px") }}>
          <h2 style={{ fontWeight:900, fontSize: px(90, 40), lineHeight:"1.1", color:"#009D3A", textAlign:"right", margin:"0 0 48px" }}>איך אתם יכולים לעזור?</h2>
          <div style={{ display:"flex", flexDirection:"column", gap:32, width:"100%", maxWidth: px(402, "100%") }}>
            {[["צמצמו חומרי הדברה","הקרפדות סופגות חומרים דרך העור. חומרי הדברה פוגעים בהן ישירות ומרעילים את מזונן."],["הכינו מקלט בגינה","הניחו עציץ חרס הפוך בפינה מוצלת ולחה בגינה, עם פתח קטן לכניסה. זהו המקלט המושלם עבורן."],["דווחו על תצפיות","ראיתם קרפדה? צלמו אותה ודווחו לנו. המידע הזה קריטי למחקר ולשימור הדו-חיים בישראל."]].map(([title,text])=>(
              <div key={title} style={{ display:"flex", flexDirection:"row", alignItems:"flex-start", gap:24, direction:"rtl" }}>
                <div style={{ width:48, height:48, borderRadius:9999, background:"#D9E6DA", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16.667 5L7.5 14.167 3.333 10" stroke="#006E1C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8 }}>
                  <div style={{ fontWeight:700, fontSize:20, lineHeight:"28px", color:"#1B1C1C", textAlign:"right", width:"100%" }}>{title}</div>
                  <div style={{ fontWeight:400, fontSize:16, lineHeight:"24px", color:"#3F4A3C", textAlign:"right", width:"100%" }}>{text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {!isMobile && (
          <div style={{ width:565, flexShrink:0, position:"relative", minHeight:820 }}>
            <img src="https://i.imgur.com/5LuF6CP.png" alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
          </div>
        )}
        {isMobile && (
                      <img src="https://i.imgur.com/5LuF6CP.png" alt="" style={{ width:"100%", height:260, objectFit:"cover" }} />
        )}
      </div>

      {/* ── KIDS ACTIVITY ── */}
      <div style={{ background:"#F6FFF5", padding: px("128px 32px", "60px 24px"), display:"flex", justifyContent:"center", alignItems:"center" }}>
        <div style={{ display:"flex", flexDirection: px("row", "column-reverse"), alignItems:"center", gap: px(111, 40), width:"100%", maxWidth:1152 }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:24, flex:1, width:"100%" }}>
            <div style={{ background:"#C4FEC2", borderRadius:9999, padding:"4px 16px", fontWeight:700, fontSize:14, color:"#006E1C", alignSelf:"flex-end" }}>כיף לכולם</div>
            <h2 style={{ fontWeight:900, fontSize: px(60, 32), lineHeight:"1.1", color:"#1B1C1C", textAlign:"right", margin:0, width:"100%" }}>עבודת יצירה לילדים</h2>
            <p style={{ fontWeight:400, fontSize: px(20, 16), lineHeight:"1.6", color:"#3F4A3C", textAlign:"right", margin:0 }}>הורידו את דף הצביעה הרשמי של יום הקרפדה הבינלאומי! דרך מצוינת ללמד את הדור הבא לאהוב ולכבד את הטבע.</p>
            <button style={{ background:"#006E1C", color:"#fff", border:"none", borderRadius:9999, padding: px("24px 48px", "16px 32px"), fontFamily:ff, fontWeight:900, fontSize: px(24, 18), cursor:"pointer", alignSelf:"flex-end", display:"inline-flex", alignItems:"center", gap:12 }}>
              הורידו עכשיו
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3v11M5 9l5 5 5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
          <div style={{ width: px(502, "100%"), height: px(502, 280), position:"relative", flexShrink:0 }}>
            <div style={{ position:"absolute", left:-40, top:-40, width:240, height:240, background:"#C4FEC2", filter:"blur(32px)", borderRadius:9999, zIndex:0 }} />
            <div style={{ position:"absolute", inset:0, background:"#fff", border:"1px solid rgba(190,202,185,0.2)", borderRadius:16, transform: px("matrix(1,0.06,-0.05,1,0,0)", "none"), boxShadow:"0 25px 50px -12px rgba(0,0,0,0.25)", zIndex:1, padding: px(48, 24), display:"flex", alignItems:"center", justifyContent:"center" }}>
              <img src="https://i.imgur.com/GNDyrR4.png" alt="דף צביעה קרפדה" style={{ width:"100%", height:"100%", objectFit:"contain", borderRadius:8 }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── REPORT BANNER ── */}
      <div style={{ padding: px("39px 36px", "24px 16px"), background:"#f0f0f0" }}>
        <div style={{ position:"relative", height: px(320, 280), borderRadius:24, overflow:"hidden", background:"#1a4a1a" }}>
          <img src="https://i.imgur.com/etgzLZ8.jpeg"
            alt="" style={{ position:"absolute", left:0, right:0, top:"-30%", width:"100%", height:"160%", objectFit:"cover", zIndex:0, willChange:"transform" }}
            ref={el => {
              if (!el) return;
              const onScroll = () => {
                const rect = el.parentElement.getBoundingClientRect();
                const offset = (rect.top / window.innerHeight) * 40;
                el.style.transform = `translateY(${offset}px)`;
              };
              window.addEventListener("scroll", onScroll, { passive: true });
            }}
          />

          {/* Right: text */}
          <div style={{ position:"absolute", right:0, top:0, width: px(559, "60%"), height:"100%", background:"rgba(0,110,28,0.55)", backdropFilter:"blur(6px)", borderRadius: px("0 20px 20px 0", "0"), zIndex:2, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"flex-end", padding: px("24px 40px", "16px 20px"), gap:16 }}>
            <h2 style={{ fontWeight:900, fontSize: px(40, 20), lineHeight:"1.1", color:"#fff", textAlign:"right", margin:0, width:"100%" }}>מצאתם דו-חי מעניין?<br/>צלמו ודווחו לנו באתר!</h2>
            <p style={{ fontWeight:700, fontSize: px(18, 13), lineHeight:"1.5", color:"#fff", textAlign:"right", margin:0, opacity:0.85, width:"100%" }}>שומרים על זוחלי הארץ ועל הדו-חיים יחד.<br/>כל דיווח עוזר לנו להבין טוב יותר את מצב הטבע בישראל.</p>
          </div>

          {/* Left: buttons */}
          <div style={{ position:"absolute", left:0, top:0, width: px(260, "40%"), height:"100%", zIndex:2, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"flex-start", padding: px("24px 40px", "16px 20px"), gap:16 }}>
            <button style={{ background:"#94F990", border:"none", borderRadius:9999, padding: px("20px 40px", "12px 20px"), fontFamily:ff, fontWeight:900, fontSize: px(20, 14), color:"#002204", cursor:"pointer", whiteSpace:"nowrap", boxShadow:"0 10px 15px -3px rgba(0,0,0,0.1)" }}>אני מצביע/ה</button>
            <button onClick={() => document.getElementById('vote-section').scrollIntoView({behavior:'smooth'})} style={{ background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.2)", backdropFilter:"blur(6px)", borderRadius:9999, padding: px("18px 40px", "12px 20px"), fontFamily:ff, fontWeight:700, fontSize: px(18, 14), color:"#fff", cursor:"pointer", whiteSpace:"nowrap" }}>לדיווח תצפית</button>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ background:"#F6F3F2", padding: px("48px", "32px 24px"), display:"flex", flexDirection: px("row", "column"), justifyContent:"space-between", alignItems:"center", gap:16 }}>
        <div style={{ display:"flex", flexDirection:"row", gap:24, alignItems:"center", flexWrap:"wrap", justifyContent: px("flex-start", "center") }}>
          {[["פייסבוק","#3F4A3C"],["אינסטגרם","#3F4A3C"],["טוויטר","#3F4A3C"],["צרו קשר","#15803D"]].map(([t,c])=>(
            <span key={t} style={{ fontWeight: t==="צרו קשר"?700:400, fontSize:14, color:c, textDecoration: t==="צרו קשר"?"underline":"none", cursor:"pointer" }}>{t}</span>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M8.5 1.5C4.63 1.5 1.5 4.63 1.5 8.5s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7z" stroke="#166534" strokeWidth="1.5"/><path d="M8.5 5v3.5l2.5 1.5" stroke="#166534" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <span style={{ fontWeight:700, fontSize:18, color:"#166534" }}>יום הקרפדה הבינלאומי</span>
        </div>
        <p style={{ fontWeight:400, fontSize:14, color:"#3F4A3C", margin:0, textAlign: px("right", "center") }}>© 2024 יום הקרפדה הבינלאומי. כל הזכויות שמורות.</p>
      </div>

    </div>
  );
}
