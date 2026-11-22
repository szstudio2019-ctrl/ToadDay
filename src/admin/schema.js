// Which fields the admin panel shows for every site section, and how.
// Field types: text, textarea, url, number, image, video, file (PDF etc.), list.
// group decides the tab the field appears under.

const t = (key, label, extra = {}) => ({ key, label, type: "text", group: "text", ...extra });
const ta = (key, label, extra = {}) => ({ key, label, type: "textarea", group: "text", ...extra });
const url = (key, label, extra = {}) => ({ key, label, type: "url", group: "links", ...extra });
const img = (key, label, extra = {}) => ({ key, label, type: "image", group: "media", ...extra });
const vid = (key, label, extra = {}) => ({ key, label, type: "video", group: "media", ...extra });
const list = (key, label, itemFields, extra = {}) => ({ key, label, type: "list", group: "list", itemFields, ...extra });

export const GROUPS = { text: "טקסטים", media: "מדיה", list: "פריטים", links: "קישורים" };

export const SECTIONS = {
  hero: {
    name: "פתיחה (הירו)",
    anchor: "",
    fields: [
      t("badge", "תגית עליונה"),
      t("title", "כותרת ראשית"),
      ta("subtitle", "טקסט משנה"),
      t("primaryBtn", "טקסט כפתור ראשי"),
      t("instagramBtn", "טקסט כפתור אינסטגרם"),
      url("instagramUrl", "קישור אינסטגרם"),
      vid("video", "סרטון רקע", { hint: "MP4 רוחבי, מומלץ עד 20MB. מתנגן בלופ ללא קול." }),
    ],
  },
  story: {
    name: "הסיפור שלנו",
    anchor: "our-story",
    fields: [
      t("tag", "תגית"),
      ta("title", "כותרת"),
      ta("p1", "פסקה 1"),
      ta("p2", "פסקה 2 (מודגשת)"),
      ta("quote", "ציטוט"),
      t("quoteAuthor", "שם בעל/ת הציטוט"),
      t("linkText", "טקסט כפתור"),
      url("linkUrl", "קישור כפתור"),
      img("image", "תמונה (גריד)"),
      vid("video", "סרטון קטן (גריד)"),
    ],
  },
  whyDay: {
    name: "למה יום לקרפדה?",
    anchor: "why-day",
    fields: [
      t("title", "כותרת"),
      ta("p1", "פסקה ראשונה (תמיד גלויה)"),
      ta("p2", "פסקה 2 (בלחיצה על Read more)"),
      ta("p3", "פסקה 3 (בלחיצה על Read more)"),
      vid("video", "סרטון רקע"),
    ],
  },
  surprisingFact: {
    name: "עובדה מפתיעה",
    anchor: "surprising-fact",
    fields: [
      t("tag", "תגית"),
      t("title", "כותרת"),
      ta("p1", "פסקה 1", { hint: "טקסט בין *כוכביות* יוצג בנטוי (לשמות מדעיים)." }),
      ta("p2", "פסקה 2"),
    ],
  },
  facts: {
    name: "עובדות על הקרפדה",
    anchor: "facts",
    fields: [
      t("tag", "תגית"),
      t("title", "כותרת"),
      ta("subtitle", "טקסט משנה"),
      vid("video", "סרטון רקע"),
      list("items", "עובדות בגלגל", [t("title", "כותרת העובדה"), ta("text", "טקסט")], { itemTitle: "title", addLabel: "הוספת עובדה" }),
    ],
  },
  toadOrFrog: {
    name: "קרפדה או צפרדע?",
    anchor: "toad-or-frog",
    fields: [
      t("tag", "תגית"),
      t("title", "כותרת"),
      ta("note", "הערה מתחת"),
      t("linkText", "טקסט כפתור"),
      url("linkUrl", "קישור כפתור"),
      vid("video", "סרטון השוואה"),
      list("pairs", "השוואות", [t("label", "נושא (באמצע)"), ta("toad", "קרפדה"), ta("frog", "צפרדע")], { itemTitle: "label", addLabel: "הוספת השוואה" }),
    ],
  },
  vote: {
    name: "הצבעה",
    anchor: "vote-section",
    fields: [
      t("title", "כותרת"),
      t("label", "מילה מתחת למונה"),
      t("button", "טקסט כפתור"),
      t("thanks", "הודעה אחרי הצבעה"),
      vid("video", "סרטון רקע"),
    ],
  },
  partners: {
    name: "ארגונים תומכים",
    anchor: "join-celebration",
    fields: [
      t("title", "כותרת"),
      ta("text", "טקסט"),
      list("items", "ארגונים", [t("name", "שם הארגון"), url("href", "קישור לאתר"), img("logo", "לוגו")], { itemTitle: "name", addLabel: "הוספת ארגון", hint: "מעל 5 ארגונים – השורה הופכת לסליידר נע." }),
    ],
  },
  recognition: {
    name: "הכרה והשתתפות",
    anchor: "recognition",
    fields: [
      t("tag", "תגית"),
      t("title", "כותרת"),
      list("cards", "כרטיסים", [
        ta("title", "כותרת הכרטיס"),
        ta("text", "טקסט פתיחה (לא חובה)"),
        list("items", "שורות", [t("text", "טקסט"), url("href", "קישור (לא חובה)")], { itemTitle: "text", addLabel: "הוספת שורה" }),
      ], { itemTitle: "title", addLabel: "הוספת כרטיס" }),
    ],
  },
  media: {
    name: "מאמרים / בתקשורת",
    anchor: "in-the-media",
    fields: [
      t("title", "כותרת האזור"),
      list("articles", "מאמרים", [
        t("title", "כותרת המאמר"),
        ta("text", "תקציר"),
        t("subtitle", "שורת משנה (אפורה)"),
        url("url", "קישור למאמר"),
        t("linkText", "טקסט הקישור"),
        img("image", "תמונה"),
      ], { itemTitle: "title", addLabel: "הוספת מאמר" }),
    ],
  },
  socialVideos: {
    name: "סרטונים לרשתות",
    anchor: "social-videos",
    fields: [
      t("tag", "תגית"),
      t("title", "כותרת"),
      ta("text", "טקסט"),
      list("videos", "סרטונים", [
        t("title", "כותרת"),
        t("note", "פרטים (פורמט, אורך)"),
        vid("src", "קובץ הסרטון", { hint: "סרטון 9:16. הגולשים יוכלו להוריד אותו." }),
        img("poster", "תמונת פתיחה"),
      ], { itemTitle: "title", addLabel: "הוספת סרטון" }),
    ],
  },
  kids: {
    name: "פעילויות לילדים",
    anchor: "kids",
    fields: [
      t("tag", "תגית"),
      t("title", "כותרת"),
      ta("text", "טקסט"),
      list("slides", "דפי פעילות", [
        t("title", "כותרת"),
        ta("text", "תיאור"),
        img("img", "תמונה"),
        { key: "file", label: "קובץ להורדה (PDF)", type: "file", group: "media", accept: "application/pdf,image/*" },
        { key: "zoom", label: "זום לתמונה (1 = ללא)", type: "number", group: "text", step: 0.1 },
        t("alt", "תיאור תמונה לנגישות"),
      ], { itemTitle: "title", addLabel: "הוספת דף" }),
    ],
  },
  footer: {
    name: "פוטר",
    anchor: "site-footer",
    noHide: true,
    fields: [
      t("siteName", "שם האתר"),
      t("copyright", "זכויות יוצרים"),
      t("email", "אימייל"),
      url("instagramUrl", "אינסטגרם"),
      url("facebookUrl", "פייסבוק"),
      url("websiteUrl", "אתר"),
      t("websiteLabel", "טקסט קישור האתר"),
      img("background", "תמונת רקע"),
    ],
  },
};

// A short line for the sections list ("6 עובדות", "3 מאמרים"...).
export function summarize(key, data) {
  const def = SECTIONS[key];
  const l = def.fields.find((f) => f.type === "list");
  if (l && Array.isArray(data[l.key])) return `${data[l.key].length} ${l.label}`;
  return data.title || data.siteName || "";
}

// First image/video in a section, for its thumbnail.
export function thumbOf(key, data) {
  for (const f of SECTIONS[key].fields) {
    if ((f.type === "image" || f.type === "video") && data[f.key]) return { type: f.type, src: data[f.key] };
    if (f.type === "list" && Array.isArray(data[f.key])) {
      for (const it of data[f.key]) for (const sf of f.itemFields) {
        if ((sf.type === "image" || sf.type === "video") && it?.[sf.key]) return { type: sf.type, src: it[sf.key] };
      }
    }
  }
  return null;
}

export function emptyItem(itemFields) {
  const o = {};
  for (const f of itemFields) o[f.key] = f.type === "list" ? [] : f.type === "number" ? 1 : "";
  return o;
}
