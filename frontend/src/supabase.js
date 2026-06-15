import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://klazeovloewiqjjdamla.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsYXplb3Zsb2V3aXFqamRhbWxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTY3NDQsImV4cCI6MjA4MzYzMjc0NH0.fGpTHhCBEgAcRVtC70dgGuc-yNRjmNds-8-mCvoaSks";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
