import { useState } from "react";
import { useAuth } from "./AuthContext";

function Login() {
  const { login, signup } = useAuth();

  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email || !password || (mode === "signup" && (!name || !patientId))) {
      setError("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        await signup(name, email, password, patientId);
        setError("Signup successful! Please login.");
        setMode("login");
        setName(""); setPatientId(""); setEmail(""); setPassword("");
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>

      {/* LEFT PANEL */}
      <div style={styles.leftPanel}>
        <div style={styles.brandWrap}>
          <div style={styles.logoBox}>🧠</div>
          <h1 style={styles.brandName}>MindHive</h1>
          <p style={styles.brandSub}>Smart Care Platform</p>
        </div>

        <div style={styles.features}>
          {[
            { icon: "❤️", text: "Real-time vitals monitoring" },
            { icon: "🔔", text: "Instant health alerts" },
            { icon: "📋", text: "Patient history tracking" },
            { icon: "🔒", text: "Secure caregiver access" },
          ].map((f, i) => (
            <div key={i} style={styles.featureItem}>
              <span style={styles.featureIcon}>{f.icon}</span>
              <span style={styles.featureText}>{f.text}</span>
            </div>
          ))}
        </div>

        <p style={styles.leftFooter}>Empowering caregivers with technology</p>
      </div>

      {/* RIGHT PANEL */}
      <div style={styles.rightPanel}>
        <div style={styles.card}>

          <div style={styles.tabRow}>
            <button
              style={{ ...styles.tab, ...(mode === "login" ? styles.tabActive : {}) }}
              onClick={() => { setMode("login"); setError(""); }}
            >
              Login
            </button>
            <button
              style={{ ...styles.tab, ...(mode === "signup" ? styles.tabActive : {}) }}
              onClick={() => { setMode("signup"); setError(""); }}
            >
              Sign Up
            </button>
          </div>

          <h2 style={styles.title}>
            {mode === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p style={styles.subtitle}>
            {mode === "login"
              ? "Sign in to monitor your patient"
              : "Register as a caregiver"}
          </p>

          {mode === "signup" && (
            <>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Patient ID</label>
                <input
                  placeholder="e.g. P001"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  style={styles.input}
                />
              </div>
            </>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          {error && (
            <div style={{
              ...styles.errorBox,
              background: error.includes("successful") ? "#f0fdf4" : "#fff1f2",
              color: error.includes("successful") ? "#16a34a" : "#dc2626",
              border: error.includes("successful") ? "1px solid #bbf7d0" : "1px solid #fecaca",
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            style={styles.button}
            onMouseEnter={e => e.target.style.background = "#0f4c81"}
            onMouseLeave={e => e.target.style.background = "#1a6fb5"}
          >
            {loading ? "Please wait..." : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>

          <p style={styles.toggle} onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}>
            {mode === "login" ? "Don't have an account? " : "Already registered? "}
            <span style={styles.toggleLink}>
              {mode === "login" ? "Sign up" : "Login"}
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    fontFamily: "Segoe UI, sans-serif",
  },
  leftPanel: {
    flex: 1,
    background: "linear-gradient(160deg, #0f4c81 0%, #1a6fb5 60%, #2196f3 100%)",
    padding: "50px 40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    color: "white",
  },
  brandWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  logoBox: {
    fontSize: "40px",
    background: "rgba(255,255,255,0.15)",
    width: "64px",
    height: "64px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "8px",
  },
  brandName: {
    margin: 0,
    fontSize: "36px",
    fontWeight: "800",
    fontFamily: "Georgia, serif",
    letterSpacing: "1px",
  },
  brandSub: {
    margin: 0,
    fontSize: "14px",
    color: "rgba(255,255,255,0.65)",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  features: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "rgba(255,255,255,0.1)",
    padding: "12px 16px",
    borderRadius: "10px",
    backdropFilter: "blur(4px)",
  },
  featureIcon: {
    fontSize: "20px",
  },
  featureText: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.9)",
  },
  leftFooter: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.45)",
    letterSpacing: "0.5px",
  },
  rightPanel: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8fafc",
    padding: "40px",
  },
  card: {
    background: "white",
    padding: "40px",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
  },
  tabRow: {
    display: "flex",
    background: "#f1f5f9",
    borderRadius: "10px",
    padding: "4px",
    marginBottom: "24px",
  },
  tab: {
    flex: 1,
    padding: "8px",
    border: "none",
    borderRadius: "8px",
    background: "transparent",
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  tabActive: {
    background: "white",
    color: "#0f4c81",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  title: {
    margin: "0 0 4px",
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f172a",
    fontFamily: "Georgia, serif",
  },
  subtitle: {
    margin: "0 0 24px",
    fontSize: "13px",
    color: "#94a3b8",
  },
  inputGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "6px",
    letterSpacing: "0.3px",
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1.5px solid #e2e8f0",
    fontSize: "14px",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    transition: "border 0.2s",
  },
  errorBox: {
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "16px",
  },
  button: {
    width: "100%",
    padding: "13px",
    background: "#1a6fb5",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "background 0.2s",
    letterSpacing: "0.3px",
  },
  toggle: {
    textAlign: "center",
    marginTop: "16px",
    fontSize: "13px",
    color: "#64748b",
    cursor: "pointer",
  },
  toggleLink: {
    color: "#1a6fb5",
    fontWeight: "700",
  },
};

export default Login;