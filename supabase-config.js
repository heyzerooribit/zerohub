const SUPABASE_URL = "https://lyaekgkmfvecptvygqjz.supabase.co";
const SUPABASE_KEY = "sb_publishable_j06bXGs4i_lXOVwJapC55Q_W4f3dckg";
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function isAdmin(user) {
  if (!user || user.is_anonymous) return false;
  const { data } = await sb.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  return !!data;
}
