import { createClient } from "@supabase/supabase-js";
import { mergeContent } from "./defaults.js";

// Publishable key: safe to ship in the browser; writes are guarded by RLS
// (only emails listed in public.admins can change content or upload media).
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://drqtijeoxzedxahklaix.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || "sb_publishable_cmqE76VzEsGfDmne21pOpA_v-7EGelH";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export const MEDIA_BUCKET = "media";

export async function fetchSectionRows() {
  const { data, error } = await supabase.from("site_sections").select("key,data,updated_at");
  if (error) throw error;
  const rows = {};
  const meta = {};
  for (const r of data || []) { rows[r.key] = r.data; meta[r.key] = r.updated_at; }
  return { rows, meta };
}

// Used by the public site: waits briefly for saved content, falls back to the
// built-in defaults if the database is slow or unreachable.
export async function loadContent(timeoutMs = 2500) {
  try {
    const { rows } = await Promise.race([
      fetchSectionRows(),
      new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), timeoutMs)),
    ]);
    return mergeContent(rows);
  } catch {
    return mergeContent({});
  }
}
