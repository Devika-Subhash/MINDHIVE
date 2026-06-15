import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();

// ✅ CORS
app.use(cors({
origin: ["http://localhost:5173", "http://localhost:5174"],
methods: ["GET", "POST"],
credentials: true
}));

app.use(express.json());

// ✅ Supabase
const supabase = createClient(
process.env.SUPABASE_URL,
process.env.SUPABASE_KEY
);

// ================= ROOT =================
app.get("/", (req, res) => {
res.send("Backend is running ✅");
});

// ================= SIGNUP =================
app.post("/signup", async (req, res) => {
try {
const { name, email, password, patientId } = req.body;

const { data, error } = await supabase.auth.signUp({
  email,
  password,
});

if (error) return res.status(400).json({ error: error.message });

// ✅ insert profile
const { error: insertError } = await supabase.from("caregivers").insert([
  {
    id: data.user.id,
    name,
    email,
    patient_id: patientId,
  },
]);

if (insertError) {
  return res.status(400).json({ error: insertError.message });
}

res.json({ message: "Signup successful" });

} catch (err) {
res.status(500).json({ error: err.message });
}
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
try {
const { email, password } = req.body;

const { data, error } =
  await supabase.auth.signInWithPassword({
    email,
    password,
  });

if (error) return res.status(400).json({ error: error.message });

console.log("AUTH USER ID:", data.user.id);

const { data: profile, error: profileError } = await supabase
  .from("caregivers")
  .select("*")
  .eq("id", data.user.id)
  .single();

// ✅ FIX: HANDLE NULL PROFILE
if (profileError || !profile) {
  return res.status(404).json({
    error: "Profile not found. Please signup again."
  });
}

res.json({
  user: {
    name: profile.name,
    email: profile.email,
    patientId: profile.patient_id,
  },
});

} catch (err) {
res.status(500).json({ error: err.message });
}
});

// ================= SAVE VITALS =================
app.post("/vitals", async (req, res) => {
try {
const { patientId, heartRate, spo2, temperature } = req.body;

const { error } = await supabase.from("vitals").insert([
  {
    patient_id: patientId,
    heart_rate: heartRate,
    spo2,
    temperature,
  },
]);

if (error) return res.status(400).json({ error: error.message });

res.json({ message: "Vitals saved ✅" });

} catch (err) {
res.status(500).json({ error: err.message });
}
});

// ================= GET LATEST =================
app.get("/vitals/:patientId", async (req, res) => {
try {
const { patientId } = req.params;

const { data, error } = await supabase
  .from("vitals")
  .select("*")
  .eq("patient_id", patientId)
  .gt("heart_rate", 0)
  .order("created_at", { ascending: false })
  .limit(1);

if (error) return res.status(400).json({ error: error.message });

res.json(data[0] || null);

} catch (err) {
res.status(500).json({ error: err.message });
}
});

// ================= HISTORY =================
app.get("/vitals/history/:patientId", async (req, res) => {
try {
const { patientId } = req.params;

const { data, error } = await supabase
  .from("vitals")
  .select("*")
  .eq("patient_id", patientId)
  .gt("heart_rate", 0)
  .order("created_at", { ascending: false })
  .limit(10);

if (error) return res.status(400).json({ error: error.message });

res.json(data.reverse());

} catch (err) {
res.status(500).json({ error: err.message });
}
});

// ================= START =================
app.listen(5000, "0.0.0.0", () => {
console.log("🚀 Server running on http://localhost:5000");
});