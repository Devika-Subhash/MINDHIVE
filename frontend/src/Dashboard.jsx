import { useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";

import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Vitals from "./components/Vitals";
import Schedule from "./components/Schedule";
import PatientHistory from "./components/PatientHistory";
import CheckupReminder from "./components/CheckupReminder";

// ✅ PATIENT PROFILE DATA
const PATIENT = {
  name: "Patient A",
  age: 65,
  id: "P001",
  conditions: ["Hypertension", "Type 2 Diabetes"],
  allergies: ["Penicillin"],
  medications: ["BP Tablet", "Diabetes Tablet"],
  lastVisit: "2026-01-02",
};

// ✅ MINI GRAPH COMPONENT
function MiniGraph({ data, color, label }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || data.length < 2) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const min = Math.min(...data) - 5;
    const max = Math.max(...data) + 5;
    const range = max - min || 1;

    const points = data.map((v, i) => ({
      x: (i / (data.length - 1)) * w,
      y: h - ((v - min) / range) * h,
    }));

    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, color + "33");
    grad.addColorStop(1, color + "00");
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();

    // Dots
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.fill();
    });
  }, [data, color]);

  return (
    <div style={{ marginTop: "14px" }}>
      <p style={{ margin: "0 0 5px", fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label}
      </p>
      <canvas ref={canvasRef} width={400} height={55} style={{ width: "100%", height: "55px" }} />
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();

  const [alerts, setAlerts] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isMuted, setIsMuted] = useState(localStorage.getItem("mute") === "true");

  const [vitals, setVitals] = useState({ heartRate: 0, spo2: 0, temperature: 0 });
  const [prevVitals, setPrevVitals] = useState({ heartRate: 0, spo2: 0, temperature: 0 });
  const [fingerDetected, setFingerDetected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [timeAgo, setTimeAgo] = useState("Never");
  const [history, setHistory] = useState([]);

  // ✅ FETCH LATEST VITALS
  useEffect(() => {
    if (!user?.patientId) return;
    const fetchVitals = () => {
      fetch(`http://localhost:5000/vitals/${user.patientId}`)
        .then(res => res.json())
        .then(data => {
          if (data) {
            const hr = data.heart_rate || 0;
            setPrevVitals(v => ({ ...v }));
            setVitals({ heartRate: hr, spo2: data.spo2 || 0, temperature: data.temperature || 0 });
            setFingerDetected(hr > 0);
            if (hr > 0) setLastUpdated(new Date());
          }
        })
        .catch(err => console.log("Vitals error:", err));
    };
    fetchVitals();
    const interval = setInterval(fetchVitals, 3000);
    return () => clearInterval(interval);
  }, [user]);

  // ✅ FETCH HISTORY
  useEffect(() => {
    if (!user?.patientId) return;
    const fetchHistory = () => {
      fetch(`http://localhost:5000/vitals/history/${user.patientId}`)
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setHistory(data); })
        .catch(err => console.log("History error:", err));
    };
    fetchHistory();
    const interval = setInterval(fetchHistory, 10000);
    return () => clearInterval(interval);
  }, [user]);

  // ✅ TIME AGO TICKER
  useEffect(() => {
    const tick = setInterval(() => {
      if (!lastUpdated) { setTimeAgo("Never"); return; }
      const diff = Math.floor((new Date() - lastUpdated) / 1000);
      if (diff < 10) setTimeAgo("Just now");
      else if (diff < 60) setTimeAgo(`${diff}s ago`);
      else setTimeAgo(`${Math.floor(diff / 60)}m ago`);
    }, 1000);
    return () => clearInterval(tick);
  }, [lastUpdated]);

  // ✅ TREND
  const getTrend = (current, previous) => {
    if (!previous || previous === 0) return "—";
    if (current > previous) return "↑";
    if (current < previous) return "↓";
    return "→";
  };
  const trendColor = (trend) => {
    if (trend === "↑") return "#ef4444";
    if (trend === "↓") return "#3b82f6";
    return "#94a3b8";
  };

  const bpmHistory = history.map(h => h.heart_rate);
  const spo2History = history.map(h => h.spo2);
  const tempHistory = history.map(h => h.temperature);

  return (
    <div style={styles.container}>
      <Navbar />
      <Header />

      {/* TOP STATUS BAR */}
      <div style={styles.topRow}>
        <div style={{
          ...styles.fingerBox,
          background: fingerDetected ? "#f0fdf4" : "#fff1f2",
          border: fingerDetected ? "1.5px solid #bbf7d0" : "1.5px solid #fecaca",
        }}>
          <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: fingerDetected ? "#22c55e" : "#ef4444", display: "inline-block", flexShrink: 0 }}></span>
          <span style={{ color: fingerDetected ? "#16a34a" : "#dc2626", fontWeight: "600", fontSize: "13px" }}>
            {fingerDetected ? "Sensor Active — Reading vitals live" : "No finger detected on sensor"}
          </span>
          {lastUpdated && (
            <span style={styles.timestamp}>🕒 {timeAgo}</span>
          )}
        </div>
        <div style={styles.actionRow}>
          <button style={styles.muteBtn} onClick={() => { const s = !isMuted; setIsMuted(s); localStorage.setItem("mute", s); }}>
            {isMuted ? "🔇 Unmute" : "🔊 Mute"}
          </button>
          <button style={styles.historyBtn} onClick={() => setShowHistory(true)}>
            📁 Patient History
          </button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div style={styles.mainGrid}>

        {/* LEFT */}
        <div style={styles.col}>

          {/* PATIENT PROFILE */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>👤 Patient Profile</h3>
            <div style={styles.profileTop}>
              <div style={styles.avatar}>{PATIENT.name.charAt(0)}</div>
              <div>
                <p style={styles.patientName}>{PATIENT.name}</p>
                <p style={styles.patientSub}>Age {PATIENT.age} • ID: {PATIENT.id}</p>
                <p style={styles.patientSub}>Last Visit: {PATIENT.lastVisit}</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { label: "Conditions", items: PATIENT.conditions, style: styles.tagRed },
                { label: "Allergies", items: PATIENT.allergies, style: styles.tagOrange },
                { label: "Medications", items: PATIENT.medications, style: styles.tagBlue },
              ].map((row, i) => (
                <div key={i}>
                  <p style={styles.profileLabel}>{row.label}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {row.items.map((item, j) => <span key={j} style={row.style}>{item}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ALERTS */}
          <div style={{
            ...styles.card,
            background: alerts.length > 0 || reminders.length > 0 ? "#fff1f2" : "white",
            border: alerts.length > 0 || reminders.length > 0 ? "1.5px solid #fecaca" : "1.5px solid #e2e8f0",
          }}>
            <h3 style={styles.cardTitle}>{alerts.length > 0 || reminders.length > 0 ? "🚨 Active Alerts" : "✅ System Status"}</h3>
            <p style={{ margin: "2px 0 12px", fontSize: "12px", color: "#94a3b8" }}>
              {alerts.length > 0 || reminders.length > 0 ? `${alerts.length + reminders.length} item(s) need attention` : "All vitals within normal range"}
            </p>
            {alerts.length === 0 && reminders.length === 0 ? (
              <div style={styles.okBox}>🎉 All good! No alerts or reminders.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {alerts.map((a, i) => <div key={i} style={styles.alertItem}><span style={styles.dotRed}></span><p style={{ margin: 0, color: "#dc2626", fontWeight: "500", fontSize: "13px" }}>{a}</p></div>)}
                {reminders.map((r, i) => <div key={i} style={styles.reminderItem}><span style={styles.dotBlue}></span><p style={{ margin: 0, color: "#1d4ed8", fontWeight: "500", fontSize: "13px" }}>{r}</p></div>)}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT */}
        <div style={styles.col}>

          {/* LIVE VITALS WITH TRENDS */}
          <div style={styles.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={styles.cardTitle}>📊 Live Vitals</h3>
              <span style={styles.liveBadge}><span style={styles.liveDot}></span> LIVE</span>
            </div>
            <div style={styles.vitalsRow}>
              {[
                { label: "Heart Rate", icon: "❤️", value: vitals.heartRate, unit: "bpm", prev: prevVitals.heartRate, color: "#ef4444" },
                { label: "SpO₂", icon: "🫁", value: vitals.spo2, unit: "%", prev: prevVitals.spo2, color: "#3b82f6" },
                { label: "Temperature", icon: "🌡", value: vitals.temperature, unit: "°C", prev: prevVitals.temperature, color: "#f59e0b" },
              ].map((v, i) => {
                const trend = getTrend(v.value, v.prev);
                return (
                  <div key={i} style={styles.vitalCard}>
                    <p style={{ margin: "0 0 8px", fontSize: "22px" }}>{v.icon}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                      <h2 style={{ margin: 0, fontSize: "32px", fontWeight: "800", color: v.color, fontFamily: "Georgia, serif" }}>{v.value}</h2>
                      <span style={{ fontSize: "20px", fontWeight: "700", color: trendColor(trend) }}>{trend}</span>
                    </div>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#94a3b8" }}>{v.unit}</p>
                    <p style={{ margin: "4px 0 0", fontSize: "11px", fontWeight: "600", color: "#374151" }}>{v.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* HISTORY GRAPH */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📈 Vitals Trend Graph</h3>
            <p style={{ margin: "2px 0 4px", fontSize: "12px", color: "#94a3b8" }}>Last {history.length} readings from sensor</p>
            {history.length < 2 ? (
              <div style={styles.noData}>📡 Not enough data yet — place finger on sensor to start recording</div>
            ) : (
              <>
                <MiniGraph data={bpmHistory} color="#ef4444" label="Heart Rate (bpm)" />
                <MiniGraph data={spo2History} color="#3b82f6" label="SpO₂ (%)" />
                <MiniGraph data={tempHistory} color="#f59e0b" label="Temperature (°C)" />
              </>
            )}
          </div>

        </div>
      </div>

      {/* VITALS COMPONENT — for alert logic only, hidden visually */}
      <div style={{ display: "none" }}>
        <Vitals vitals={vitals} setAlerts={setAlerts} isMuted={isMuted} />
      </div>

      {/* BOTTOM */}
      <div style={styles.bottomGrid}>
        <Schedule setReminders={setReminders} />
        <CheckupReminder setReminders={setReminders} />
      </div>

      <PatientHistory show={showHistory} onClose={() => setShowHistory(false)} patientId={user?.patientId} />
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#f8fafc", padding: "20px", fontFamily: "Segoe UI, sans-serif", maxWidth: "1200px", margin: "0 auto" },
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", gap: "12px", flexWrap: "wrap" },
  fingerBox: { display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", borderRadius: "10px", flex: 1, minWidth: "250px" },
  timestamp: { marginLeft: "auto", fontSize: "12px", color: "#94a3b8", fontWeight: "500" },
  actionRow: { display: "flex", gap: "10px" },
  muteBtn: { padding: "9px 16px", borderRadius: "8px", border: "1.5px solid #e2e8f0", background: "white", color: "#374151", fontSize: "13px", fontWeight: "600", cursor: "pointer" },
  historyBtn: { padding: "9px 18px", background: "#0f4c81", color: "white", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" },
  mainGrid: { display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "16px", marginTop: "16px" },
  col: { display: "flex", flexDirection: "column", gap: "16px" },
  card: { background: "white", borderRadius: "16px", padding: "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1.5px solid #e2e8f0" },
  cardTitle: { margin: "0 0 14px", fontSize: "15px", fontWeight: "700", color: "#0f172a", fontFamily: "Georgia, serif" },
  profileTop: { display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f1f5f9" },
  avatar: { width: "52px", height: "52px", borderRadius: "14px", background: "linear-gradient(135deg, #0f4c81, #1a6fb5)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "700", flexShrink: 0 },
  patientName: { margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" },
  patientSub: { margin: "2px 0 0", fontSize: "12px", color: "#94a3b8" },
  profileLabel: { margin: "0 0 5px", fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" },
  tagRed: { background: "#fff1f2", color: "#dc2626", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", border: "1px solid #fecaca" },
  tagOrange: { background: "#fffbeb", color: "#b45309", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", border: "1px solid #fde68a" },
  tagBlue: { background: "#eff6ff", color: "#1d4ed8", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", border: "1px solid #bfdbfe" },
  liveBadge: { display: "flex", alignItems: "center", gap: "5px", background: "#f0fdf4", color: "#16a34a", padding: "4px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: "700", letterSpacing: "1px", border: "1px solid #bbf7d0" },
  liveDot: { width: "6px", height: "6px", background: "#22c55e", borderRadius: "50%", display: "inline-block" },
  vitalsRow: { display: "flex", gap: "12px", flexWrap: "wrap" },
  vitalCard: { flex: 1, minWidth: "100px", background: "#f8fafc", borderRadius: "12px", padding: "16px", textAlign: "center", border: "1.5px solid #e2e8f0" },
  noData: { background: "#f8fafc", border: "1.5px dashed #e2e8f0", borderRadius: "10px", padding: "24px", textAlign: "center", color: "#94a3b8", fontSize: "13px", marginTop: "10px" },
  okBox: { background: "#f0fdf4", padding: "12px 16px", borderRadius: "10px", color: "#16a34a", fontWeight: "500", fontSize: "14px", border: "1px solid #bbf7d0" },
  alertItem: { display: "flex", alignItems: "center", gap: "10px", background: "#fff1f2", padding: "10px 14px", borderRadius: "8px", border: "1px solid #fecaca" },
  reminderItem: { display: "flex", alignItems: "center", gap: "10px", background: "#eff6ff", padding: "10px 14px", borderRadius: "8px", border: "1px solid #bfdbfe" },
  dotRed: { width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", flexShrink: 0, display: "inline-block" },
  dotBlue: { width: "8px", height: "8px", borderRadius: "50%", background: "#3b82f6", flexShrink: 0, display: "inline-block" },
  bottomGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" },
};

export default Dashboard;