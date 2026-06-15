import { useState, useEffect } from "react";

function Schedule({ setReminders }) {
  const [completed, setCompleted] = useState({});

  const schedule = [
    { id: 1, title: "BP Tablet", type: "Medicine", time: "08:00", icon: "💊" },
    { id: 2, title: "Breakfast", type: "Food", time: "09:00", icon: "🍳" },
    { id: 3, title: "Diabetes Tablet", type: "Medicine", time: "13:00", icon: "💊" },
    { id: 4, title: "Lunch", type: "Food", time: "13:30", icon: "🍛" },
    { id: 5, title: "Dinner", type: "Food", time: "20:00", icon: "🍽" },
  ];

  const toggleComplete = (id) => {
    setCompleted((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ⏰ REMINDER LOGIC
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");

      schedule.forEach((item) => {
        if (item.time === currentTime && !completed[item.id]) {
          setReminders((prev) => [
            ...prev,
            `⏰ Time for ${item.title}`,
          ]);
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [completed]);

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🍽️ Medication & Food Schedule</h3>

      {schedule.map((item) => (
        <div
          key={item.id}
          style={{
            ...styles.card,
            ...(completed[item.id] && styles.completedCard),
          }}
        >
          {/* LEFT SIDE */}
          <div style={styles.left}>
            <input
              type="checkbox"
              checked={!!completed[item.id]}
              onChange={() => toggleComplete(item.id)}
              style={styles.checkbox}
            />

            <span style={styles.icon}>{item.icon}</span>

            <div>
              <div
                style={{
                  ...styles.titleText,
                  ...(completed[item.id] && styles.completedText),
                }}
              >
                {item.title}
              </div>
              <div style={styles.subText}>{item.type}</div>
            </div>
          </div>

          {/* TIME */}
          <div style={styles.time}>
            🕒 {item.time}
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    background: "#e7eef5",
    padding: "20px",
    borderRadius: "16px",
    marginTop: "20px",
  },

  title: {
    marginBottom: "15px",
    fontWeight: "600",
  },

  card: {
    background: "white",
    padding: "14px 18px",
    borderRadius: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
  },

  completedCard: {
    opacity: 0.6,
    background: "#f1f8e9",
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  checkbox: {
    width: "16px",
    height: "16px",
    cursor: "pointer",
  },

  icon: {
    fontSize: "20px",
  },

  titleText: {
    fontWeight: "500",
  },

  subText: {
    fontSize: "12px",
    color: "#777",
  },

  completedText: {
    textDecoration: "line-through",
    color: "#777",
  },

  time: {
    background: "#f1f3f6",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "14px",
  },
};

export default Schedule;