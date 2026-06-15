import { useAuth } from "../AuthContext";

function Header() {
  const { user } = useAuth();

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

  return (
    <div style={styles.header}>
      <div style={styles.left}>
        <p style={styles.greeting}>Good day,</p>
        <h2 style={styles.name}>{user?.name || "Caregiver"} 👩‍⚕️</h2>
        <div style={styles.badge}>
          <span style={styles.dot}></span>
          Patient ID: <strong>{user?.patientId}</strong>
        </div>
      </div>
      <div style={styles.right}>
        <p style={styles.time}>{timeStr}</p>
        <p style={styles.date}>{dateStr}</p>
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "white",
    borderRadius: "16px",
    padding: "20px 28px",
    marginTop: "16px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    borderLeft: "5px solid #0f4c81",
  },
  left: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  greeting: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "13px",
    letterSpacing: "0.5px",
  },
  name: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a",
    fontFamily: "Georgia, serif",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#eff6ff",
    color: "#1e40af",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    width: "fit-content",
    marginTop: "4px",
  },
  dot: {
    width: "7px",
    height: "7px",
    background: "#22c55e",
    borderRadius: "50%",
    display: "inline-block",
  },
  right: {
    textAlign: "right",
  },
  time: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
    color: "#0f4c81",
    fontFamily: "Georgia, serif",
  },
  date: {
    margin: 0,
    fontSize: "12px",
    color: "#94a3b8",
    marginTop: "4px",
  },
};

export default Header;