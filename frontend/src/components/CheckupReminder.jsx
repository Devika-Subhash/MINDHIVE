import { useState, useEffect } from "react";

function CheckupReminder({ setReminders }) {
  const [date, setDate] = useState("");
  const [notified, setNotified] = useState(false);

  // 🔔 CHECK DAILY FOR REMINDER
  useEffect(() => {
    const interval = setInterval(() => {
      if (!date) return;

      const today = new Date().toISOString().split("T")[0];

      if (today === date && !notified) {
        setReminders((prev) => [
          ...prev,
          "📅 Today is patient checkup day!",
        ]);
        setNotified(true);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [date, notified]);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📅 Next Checkup</h3>

      <div style={styles.box}>
        <label style={styles.label}>Select Checkup Date:</label>

        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setNotified(false);
          }}
          style={styles.input}
        />

        {date && (
          <p style={styles.info}>
            Next checkup scheduled on: <b>{date}</b>
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#f0f1f5",
    padding: "20px",
    borderRadius: "16px",
    marginTop: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },

  title: {
    marginBottom: "10px",
  },

  box: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  label: {
    fontSize: "14px",
    color: "#555",
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "200px",
  },

  info: {
    marginTop: "5px",
    color: "#1976d2",
  },
};

export default CheckupReminder;