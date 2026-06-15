function AlertsPanel({ alerts = [], reminders = [] }) {
  const hasData = alerts.length > 0 || reminders.length > 0;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🚨 Alerts & Reminders</h3>

      {!hasData ? (
        <div style={styles.emptyBox}>
          🎉 All good! No alerts or reminders
        </div>
      ) : (
        <div style={styles.list}>

          {/* ALERTS */}
          {alerts.map((item, index) => (
            <div key={index} style={styles.alertItem}>
              🚨 {item}
            </div>
          ))}

          {/* REMINDERS */}
          {reminders.map((item, index) => (
            <div key={index} style={styles.reminderItem}>
              ⏰ {item}
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: "white",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
    marginTop: "30px",
  },

  title: {
    marginBottom: "12px",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  alertItem: {
    background: "#ffebee",
    padding: "10px",
    borderRadius: "8px",
    color: "#c62828",
    fontWeight: "500",
  },

  reminderItem: {
    background: "#e3f2fd",
    padding: "10px",
    borderRadius: "8px",
    color: "#1976d2",
    fontWeight: "500",
  },

  emptyBox: {
    textAlign: "center",
    padding: "20px",
    color: "#4caf50",
    fontWeight: "600",
    background: "#f1f8e9",
    borderRadius: "10px",
  },
};

export default AlertsPanel;