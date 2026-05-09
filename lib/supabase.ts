import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://psitfprlywjoqcqyelmt.supabase.co";

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";

export const supabase = createClient(supabaseUrl, supabaseKey);