import { useEffect } from "react";

function Vitals({ vitals, setAlerts, isMuted }) {
  const heartRate = vitals?.heartRate || 0;
  const spo2 = vitals?.spo2 || 0;
  const temp = vitals?.temperature || 0;

  const getStatus = (type, value) => {
    if (type === "heart") {
      if (value > 130) return "alert";
      if (value > 100) return "warning";
      return "normal";
    }
    if (type === "spo2") {
      if (value < 90) return "alert";
      if (value < 95) return "warning";
      return "normal";
    }
    if (type === "temp") {
      if (value >= 39) return "alert";
      if (value >= 37.5) return "warning";
      return "normal";
    }
  };

  useEffect(() => {
    let arr = [];
    if (heartRate > 130) arr.push("🚨 Heart Rate abnormal");
    if (spo2 < 90) arr.push("🚨 Oxygen critical");
    if (temp >= 39) arr.push("🚨 High Temperature");
    setAlerts(arr);

    if (arr.length > 0 && !isMuted) {
      const audio = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
      audio.play();
    }
  }, [heartRate, spo2, temp, isMuted]);

  const statusColors = {
    normal:  { border: "#22c55e", bg: "#f0fdf4", badge: "#16a34a", badgeBg: "#dcfce7" },
    warning: { border: "#f59e0b", bg: "#fffbeb", badge: "#b45309", badgeBg: "#fef3c7" },
    alert:   { border: "#ef4444", bg: "#fff1f2", badge: "#dc2626", badgeBg: "#fee2e2" },
  };

  const vitalsData = [
    { label: "Heart Rate", icon: "❤️", value: heartRate, type: "heart", unit: "bpm", desc: "Cardiac rhythm" },
    { label: "SpO₂",       icon: "🫁", value: spo2,      type: "spo2",  unit: "%",   desc: "Oxygen saturation" },
    { label: "Temperature", icon: "🌡", value: temp,      type: "temp",  unit: "°C",  desc: "Body temperature" },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.heading}>Patient Vitals</h3>
          <p style={styles.subheading}>Real-time health monitoring</p>
        </div>
        <div style={styles.liveBadge}>
          <span style={styles.liveDot}></span>
          LIVE
        </div>
      </div>

      <div style={styles.grid}>
        {vitalsData.map((v, i) => {
          const status = getStatus(v.type, v.value);
          const colors = statusColors[status];

          return (
            <div key={i} style={{
              ...styles.card,
              borderTop: `4px solid ${colors.border}`,
              background: colors.bg,
            }}>
              <div style={styles.cardTop}>
                <div style={styles.iconWrap}>{v.icon}</div>
                <span style={{
                  ...styles.statusBadge,
                  color: colors.badge,
                  background: colors.badgeBg,
                }}>
                  {status.toUpperCase()}
                </span>
              </div>

              <h2 style={{ ...styles.value, color: colors.badge }}>
                {v.value}
                <span style={styles.unit}> {v.unit}</span>
              </h2>

              <p style={styles.label}>{v.label}</p>
              <p style={styles.desc}>{v.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "white",
    padding: "24px",
    borderRadius: "16px",
    marginTop: "16px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  },
  heading: {
    margin: 0,
    fontSize: "17px",
    fontWeight: "700",
    color: "#0f172a",
    fontFamily: "Georgia, serif",
  },
  subheading: {
    margin: "3px 0 0",
    fontSize: "12px",
    color: "#94a3b8",
  },
  liveBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#f0fdf4",
    color: "#16a34a",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1px",
    border: "1px solid #bbf7d0",
  },
  liveDot: {
    width: "7px",
    height: "7px",
    background: "#22c55e",
    borderRadius: "50%",
    display: "inline-block",
    animation: "pulse 1.5s infinite",
  },
  grid: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  card: {
    flex: 1,
    minWidth: "200px",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  iconWrap: {
    fontSize: "24px",
  },
  statusBadge: {
    fontSize: "10px",
    fontWeight: "700",
    padding: "3px 8px",
    borderRadius: "10px",
    letterSpacing: "0.5px",
  },
  value: {
    margin: "0 0 4px",
    fontSize: "36px",
    fontWeight: "800",
    fontFamily: "Georgia, serif",
  },
  unit: {
    fontSize: "16px",
    fontWeight: "400",
  },
  label: {
    margin: "0 0 2px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
  },
  desc: {
    margin: 0,
    fontSize: "11px",
    color: "#9ca3af",
  },
};

export default Vitals;