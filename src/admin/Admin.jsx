import { useEffect, useMemo, useRef, useState } from "react";
import { supabase, fetchSectionRows, MEDIA_BUCKET } from "../content/supabase.js";
import { DEFAULT_CONTENT, SECTION_KEYS, mergeContent } from "../content/defaults.js";
import { SECTIONS, GROUPS, summarize, thumbOf, emptyItem } from "./schema.js";
import "./admin.css";

const clone = (o) => JSON.parse(JSON.stringify(o));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/* ───────────── icons ───────────── */
const I = {
  toad: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><ellipse cx="12" cy="15" rx="8" ry="6"/><circle cx="8" cy="8" r="2.3"/><circle cx="16" cy="8" r="2.3"/><circle cx="8" cy="8" r=".7" fill="currentColor"/><circle cx="16" cy="8" r=".7" fill="currentColor"/></svg>,
  layers: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/></svg>,
  site: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/></svg>,
  logout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 4h4a1 1 0 011 1v14a1 1 0 01-1 1h-4"/><path d="M10 16l-4-4 4-4"/><path d="M6 12h10"/></svg>,
  pencil: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h4L19 9l-4-4L4 16v4z"/></svg>,
  eye: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeOff: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 3l18 18"/><path d="M10.6 5.1A10.4 10.4 0 0112 5c6.5 0 10 7 10 7a17 17 0 01-3.2 4.2M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7c1.6 0 3-.4 4.3-1"/></svg>,
  reset: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 109-9 9 9 0 00-6.4 2.6L3 8"/><path d="M3 3v5h5"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10"/></svg>,
  chevron: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>,
  down: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>,
  up: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 15l6-6 6 6"/></svg>,
  trash: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  upload: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3"/></svg>,
  file: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H6a1 1 0 00-1 1v16a1 1 0 001 1h12a1 1 0 001-1V8z"/><path d="M14 3v5h5"/></svg>,
  grip: <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>,
};

/* ───────────── auth gate ───────────── */
export default function Admin() {
  const [session, setSession] = useState(undefined);
  const [isAdmin, setIsAdmin] = useState(null);
  const [recovery, setRecovery] = useState(false);

  useEffect(() => {
    document.title = "מערכת ניהול – International Toad Day";
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    supabase.rpc("is_admin").then(({ data }) => setIsAdmin(!!data));
  }, [session]);

  // Dev-only look at the dashboard without signing in (saving is still blocked by RLS).
  if (import.meta.env.DEV && new URLSearchParams(window.location.search).has("demo")) return <Dashboard email="demo@local" />;
  if (session === undefined) return <div className="adm-center"><div className="adm-spinner" /></div>;
  if (recovery && session) return <SetPassword onDone={() => setRecovery(false)} />;
  if (!session) return <Login />;
  if (isAdmin === null) return <div className="adm-center"><div className="adm-spinner" /></div>;
  if (!isAdmin) {
    return (
      <div className="adm-center">
        <div className="adm-login">
          <div className="adm-login-logo">{I.toad}</div>
          <h1>אין הרשאת ניהול</h1>
          <p>המשתמש {session.user.email} מחובר, אבל אינו מורשה לערוך את האתר.</p>
          <button className="adm-btn adm-btn-primary" onClick={() => supabase.auth.signOut()}>התנתקות</button>
        </div>
      </div>
    );
  }
  return <Dashboard email={session.user.email} />;
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setMsg({ err: true, text: "אימייל או סיסמה שגויים" });
  };
  const forgot = async () => {
    if (!email.trim()) { setMsg({ err: true, text: "כתבו את האימייל ואז לחצו על 'שכחתי סיסמה'" }); return; }
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/admin` });
    setBusy(false);
    setMsg(error ? { err: true, text: "שליחת המייל נכשלה. נסו שוב מאוחר יותר." } : { text: "נשלח מייל עם קישור לאיפוס הסיסמה." });
  };

  return (
    <div className="adm-center adm-login-bg">
      <form className="adm-login" onSubmit={submit}>
        <div className="adm-login-logo">{I.toad}</div>
        <h1><span>מערכת ניהול</span><br />International Toad Day</h1>
        <label className="adm-field">
          <span>אימייל</span>
          <input type="email" dir="ltr" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="adm-field">
          <span>סיסמה</span>
          <input type="password" dir="ltr" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {msg && <div className={msg.err ? "adm-msg adm-msg-err" : "adm-msg"}>{msg.text}</div>}
        <button className="adm-btn adm-btn-primary adm-btn-block" disabled={busy}>{busy ? "רגע…" : "כניסה"}</button>
        <button type="button" className="adm-link" onClick={forgot} disabled={busy}>שכחתי סיסמה</button>
      </form>
    </div>
  );
}

function SetPassword({ onDone }) {
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState(null);
  const submit = async (e) => {
    e.preventDefault();
    if (pw.length < 8) { setMsg("לפחות 8 תווים"); return; }
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) setMsg("העדכון נכשל: " + error.message); else onDone();
  };
  return (
    <div className="adm-center adm-login-bg">
      <form className="adm-login" onSubmit={submit}>
        <div className="adm-login-logo">{I.toad}</div>
        <h1>בחירת סיסמה חדשה</h1>
        <label className="adm-field">
          <span>סיסמה חדשה</span>
          <input type="password" dir="ltr" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} />
        </label>
        {msg && <div className="adm-msg adm-msg-err">{msg}</div>}
        <button className="adm-btn adm-btn-primary adm-btn-block">שמירה</button>
      </form>
    </div>
  );
}

/* ───────────── dashboard ───────────── */
function Dashboard({ email }) {
  const [saved, setSaved] = useState(null);       // published content per section
  const [drafts, setDrafts] = useState({});      // edited copies, per section
  const [meta, setMeta] = useState({});          // updated_at per section
  const [active, setActive] = useState("hero");
  const [mode, setMode] = useState("edit");
  const [tab, setTab] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [loadErr, setLoadErr] = useState(null);
  const [previewKey, setPreviewKey] = useState(0);

  const load = async () => {
    try {
      const { rows, meta } = await fetchSectionRows();
      const merged = mergeContent(rows);
      setSaved(merged); setMeta(meta); setDrafts(clone(merged)); setLoadErr(null);
    } catch (e) { setLoadErr(e.message || String(e)); }
  };
  useEffect(() => { load(); }, []);

  const dirty = useMemo(() => {
    const d = {};
    if (saved) for (const k of SECTION_KEYS) d[k] = !same(saved[k], drafts[k]);
    return d;
  }, [saved, drafts]);
  const anyDirty = Object.values(dirty).some(Boolean);

  useEffect(() => {
    const h = (e) => { if (anyDirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [anyDirty]);

  const flash = (text, err = false) => { setToast({ text, err }); setTimeout(() => setToast(null), 3200); };

  if (loadErr) return <div className="adm-center"><div className="adm-login"><h1>שגיאה בטעינה</h1><p dir="ltr">{loadErr}</p><button className="adm-btn adm-btn-primary" onClick={load}>נסו שוב</button></div></div>;
  if (!saved) return <div className="adm-center"><div className="adm-spinner" /></div>;

  const def = SECTIONS[active];
  const data = drafts[active];
  const groups = [...new Set(def.fields.map((f) => f.group))];
  const curTab = groups.includes(tab) ? tab : groups[0];
  const setData = (next) => setDrafts((d) => ({ ...d, [active]: next }));

  const publish = async () => {
    setSaving(true);
    const { error } = await supabase.from("site_sections").upsert({ key: active, data: drafts[active], updated_at: new Date().toISOString(), updated_by: email });
    setSaving(false);
    if (error) { flash("השמירה נכשלה: " + error.message, true); return; }
    setSaved((s) => ({ ...s, [active]: clone(drafts[active]) }));
    setMeta((m) => ({ ...m, [active]: new Date().toISOString() }));
    setPreviewKey((k) => k + 1);
    flash("נשמר ופורסם באתר ✓");
  };
  const discard = () => setDrafts((d) => ({ ...d, [active]: clone(saved[active]) }));
  const resetDefaults = () => {
    if (confirm(`להחזיר את "${def.name}" לתוכן המקורי? השינוי יפורסם רק אחרי "שמירה ופרסום".`)) setData(clone(DEFAULT_CONTENT[active]));
  };
  const toggleHidden = () => setData({ ...data, hidden: !data.hidden });

  return (
    <div className="adm-shell" dir="rtl">
      <aside className="adm-rail">
        <div className="adm-rail-logo" title="International Toad Day">{I.toad}</div>
        <nav>
          <button className="adm-rail-btn is-active" title="אזורי האתר">{I.layers}</button>
          <a className="adm-rail-btn" href="/" target="_blank" rel="noopener noreferrer" title="פתיחת האתר">{I.site}</a>
        </nav>
        <div className="adm-rail-bottom">
          <div className="adm-avatar" title={email}>{email[0]?.toUpperCase()}</div>
          <button className="adm-rail-btn" title="התנתקות" onClick={() => { if (!anyDirty || confirm("יש שינויים שלא נשמרו. להתנתק בכל זאת?")) supabase.auth.signOut(); }}>{I.logout}</button>
        </div>
      </aside>

      <main className="adm-main">
        <header className="adm-top">
          <h1><span>מערכת ניהול</span> – עריכת האתר</h1>
          <span className="adm-top-site" dir="ltr">International Toad Day</span>
        </header>

        <div className="adm-panels">
          {/* sections list */}
          <section className="adm-card adm-list">
            <div className="adm-list-head">
              <h2>אזורי האתר</h2>
              <span className="adm-chip">{SECTION_KEYS.length} אזורים</span>
            </div>
            <div className="adm-list-scroll">
              {SECTION_KEYS.map((k) => {
                const d = drafts[k];
                const th = thumbOf(k, d);
                const status = dirty[k] ? ["לא נשמר", "warn"] : d.hidden ? ["מוסתר", "muted"] : ["מפורסם", "ok"];
                return (
                  <button key={k} className={"adm-row" + (k === active ? " is-active" : "")} onClick={() => { setActive(k); setTab(null); }}>
                    <span className="adm-row-grip" aria-hidden="true">{I.grip}</span>
                    <span className="adm-thumb">
                      {th?.type === "image" ? <img src={th.src} alt="" loading="lazy" /> :
                       th?.type === "video" ? <video src={th.src + "#t=1"} muted preload="metadata" /> :
                       <span className="adm-thumb-icon">{I.toad}</span>}
                    </span>
                    <span className="adm-row-text">
                      <strong>{SECTIONS[k].name}</strong>
                      <small dir="auto">{summarize(k, d)}</small>
                      <span className={"adm-pill adm-pill-" + status[1]}>{status[0]}</span>
                    </span>
                    <span className="adm-row-go">{I.chevron}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* editor */}
          <section className="adm-card adm-editor">
            <div className="adm-ed-head">
              <h2>{def.name}</h2>
              <div className="adm-steps">
                {groups.map((g, i) => (
                  <span key={g} className="adm-step-wrap">
                    {i > 0 && <span className="adm-step-line" />}
                    <button className={"adm-step" + (g === curTab && mode === "edit" ? " is-current" : "")} onClick={() => { setTab(g); setMode("edit"); }}>
                      <span className="adm-step-dot">{g === curTab && mode === "edit" ? i + 1 : I.check}</span>
                      {GROUPS[g]}
                    </button>
                  </span>
                ))}
              </div>
              <div className="adm-ed-tools">
                <div className="adm-toggle">
                  <button className={mode === "edit" ? "is-on" : ""} onClick={() => setMode("edit")}>{I.pencil} עריכה</button>
                  <button className={mode === "view" ? "is-on" : ""} onClick={() => setMode("view")}>{I.eye} צפייה</button>
                </div>
                {!def.noHide && (
                  <button className="adm-icon-btn" onClick={toggleHidden} title={data.hidden ? "הצגת האזור באתר" : "הסתרת האזור מהאתר"}>{data.hidden ? I.eyeOff : I.eye}</button>
                )}
                <button className="adm-icon-btn" onClick={resetDefaults} title="שחזור התוכן המקורי">{I.reset}</button>
              </div>
            </div>

            <div className="adm-ed-body">
              {mode === "edit" ? (
                <>
                  {data.hidden && <div className="adm-banner">האזור הזה מוסתר באתר. לחצו על סמל העין למעלה כדי להציג אותו שוב.</div>}
                  {def.fields.filter((f) => f.group === curTab).map((f) => (
                    <Field key={f.key} f={f} section={active} value={data[f.key]} onChange={(v) => setData({ ...data, [f.key]: v })} />
                  ))}
                </>
              ) : (
                <div className="adm-preview">
                  {dirty[active] && <div className="adm-banner">התצוגה מראה את הגרסה המפורסמת. השינויים שלך יופיעו כאן אחרי "שמירה ופרסום".</div>}
                  <iframe key={previewKey + active} title="תצוגה מקדימה" src={`/${def.anchor ? "#" + def.anchor : ""}`} />
                </div>
              )}
            </div>

            <footer className="adm-ed-foot">
              <span className="adm-meta">{meta[active] ? `עודכן לאחרונה: ${new Date(meta[active]).toLocaleString("he-IL")}` : "תוכן מקורי (טרם נערך)"}</span>
              <div className="adm-foot-btns">
                <button className="adm-btn adm-btn-outline" onClick={discard} disabled={!dirty[active] || saving}>ביטול שינויים</button>
                <button className="adm-btn adm-btn-primary" onClick={publish} disabled={!dirty[active] || saving}>{saving ? "שומר…" : "שמירה ופרסום"}</button>
              </div>
            </footer>
          </section>
        </div>
      </main>

      {toast && <div className={"adm-toast" + (toast.err ? " is-err" : "")}>{toast.text}</div>}
    </div>
  );
}

/* ───────────── fields ───────────── */
function Field({ f, value, onChange, section }) {
  if (f.type === "list") return <ListField f={f} value={value || []} onChange={onChange} section={section} />;
  if (f.type === "image" || f.type === "video" || f.type === "file") return <MediaField f={f} value={value || ""} onChange={onChange} section={section} />;
  return (
    <label className="adm-field">
      <span>{f.label}</span>
      {f.type === "textarea" ? (
        <AutoTextarea value={value ?? ""} onChange={onChange} />
      ) : f.type === "number" ? (
        <input type="number" step={f.step || 1} dir="ltr" value={value ?? ""} onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))} />
      ) : (
        <input type={f.type === "url" ? "url" : "text"} dir={f.type === "url" ? "ltr" : "auto"} value={value ?? ""} placeholder={f.type === "url" ? "https://" : ""} onChange={(e) => onChange(e.target.value)} />
      )}
      {f.hint && <em>{f.hint}</em>}
    </label>
  );
}

function AutoTextarea({ value, onChange }) {
  const ref = useRef(null);
  useEffect(() => { const el = ref.current; if (el) { el.style.height = "auto"; el.style.height = el.scrollHeight + 2 + "px"; } }, [value]);
  return <textarea ref={ref} dir="auto" rows={2} value={value} onChange={(e) => onChange(e.target.value)} />;
}

function MediaField({ f, value, onChange, section }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const inputRef = useRef(null);
  const accept = f.accept || (f.type === "image" ? "image/*" : f.type === "video" ? "video/mp4,video/webm,video/*" : "*/*");

  const upload = async (file) => {
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) { setErr("הקובץ גדול מ-50MB. כווצו אותו ונסו שוב."); return; }
    setBusy(true); setErr(null);
    const safe = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").slice(-60) || "file";
    const path = `${section}/${Date.now()}-${safe}`;
    const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, { cacheControl: "31536000", contentType: file.type || undefined });
    setBusy(false);
    if (error) { setErr("ההעלאה נכשלה: " + error.message); return; }
    onChange(supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl);
  };

  return (
    <div className="adm-field adm-media">
      <span>{f.label}</span>
      <div className="adm-media-row">
        <div className={"adm-media-prev adm-media-" + f.type}>
          {!value ? <span className="adm-media-empty">אין קובץ</span> :
            f.type === "image" ? <img src={value} alt="" /> :
            f.type === "video" ? <video src={value} muted loop playsInline controls preload="metadata" /> :
            <a href={value} target="_blank" rel="noopener noreferrer" className="adm-media-file">{I.file}<span>פתיחת הקובץ</span></a>}
        </div>
        <div className="adm-media-side">
          <input type="url" dir="ltr" value={value} placeholder="קישור לקובץ, או העלאה מהמחשב" onChange={(e) => onChange(e.target.value)} />
          <div className="adm-media-btns">
            <button type="button" className="adm-btn adm-btn-soft" onClick={() => inputRef.current?.click()} disabled={busy}>
              {busy ? <><span className="adm-spinner adm-spinner-sm" /> מעלה…</> : <>{I.upload} {value ? "החלפת קובץ" : "העלאת קובץ"}</>}
            </button>
            {value && <button type="button" className="adm-btn adm-btn-ghost" onClick={() => onChange("")} disabled={busy}>הסרה</button>}
          </div>
          <input ref={inputRef} type="file" accept={accept} hidden onChange={(e) => { upload(e.target.files?.[0]); e.target.value = ""; }} />
          {f.hint && <em>{f.hint}</em>}
          {err && <div className="adm-msg adm-msg-err">{err}</div>}
        </div>
      </div>
    </div>
  );
}

function ListField({ f, value, onChange, section }) {
  const [open, setOpen] = useState(() => (value.length ? 0 : -1));
  const move = (i, d) => {
    const j = i + d; if (j < 0 || j >= value.length) return;
    const next = [...value]; [next[i], next[j]] = [next[j], next[i]]; onChange(next);
    if (open === i) setOpen(j); else if (open === j) setOpen(i);
  };
  const remove = (i) => {
    const name = value[i]?.[f.itemTitle] || `פריט ${i + 1}`;
    if (!confirm(`למחוק את "${String(name).slice(0, 60)}"?`)) return;
    onChange(value.filter((_, k) => k !== i)); setOpen(-1);
  };
  const add = () => { onChange([...value, emptyItem(f.itemFields)]); setOpen(value.length); };

  return (
    <div className="adm-field adm-list-field">
      <div className="adm-list-field-head"><span>{f.label}</span><span className="adm-chip">{value.length}</span></div>
      {f.hint && <em>{f.hint}</em>}
      <div className="adm-items">
        {value.map((it, i) => {
          const th = f.itemFields.find((x) => (x.type === "image" || x.type === "video") && it?.[x.key]);
          return (
            <div key={i} className={"adm-item" + (open === i ? " is-open" : "")}>
              <div className="adm-item-head" onClick={() => setOpen(open === i ? -1 : i)}>
                <span className="adm-item-num">{i + 1}</span>
                {th && (th.type === "image" ? <img className="adm-item-thumb" src={it[th.key]} alt="" /> : <video className="adm-item-thumb" src={it[th.key] + "#t=1"} muted preload="metadata" />)}
                <span className="adm-item-title" dir="auto">{String(it?.[f.itemTitle] || "").replace(/\n/g, " ") || <i>ללא כותרת</i>}</span>
                <span className="adm-item-tools" onClick={(e) => e.stopPropagation()}>
                  <button type="button" className="adm-icon-btn sm" onClick={() => move(i, -1)} disabled={i === 0} title="למעלה">{I.up}</button>
                  <button type="button" className="adm-icon-btn sm" onClick={() => move(i, 1)} disabled={i === value.length - 1} title="למטה">{I.down}</button>
                  <button type="button" className="adm-icon-btn sm danger" onClick={() => remove(i)} title="מחיקה">{I.trash}</button>
                </span>
                <span className="adm-item-caret">{open === i ? I.up : I.down}</span>
              </div>
              {open === i && (
                <div className="adm-item-body">
                  {f.itemFields.map((sf) => (
                    <Field key={sf.key} f={sf} section={section} value={it?.[sf.key]} onChange={(v) => onChange(value.map((x, k) => (k === i ? { ...x, [sf.key]: v } : x)))} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button type="button" className="adm-btn adm-btn-add" onClick={add}>{I.plus} {f.addLabel || "הוספה"}</button>
    </div>
  );
}
