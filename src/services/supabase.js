import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://euqltdmywwvmacfsrkjk.supabase.co";

const supabaseKey =
  "sb_publishable_fnz5kXWVhr6puQbfK2VqBA_VvzrN0fB";

export const supabase =
  createClient(
    supabaseUrl,
    supabaseKey
  );