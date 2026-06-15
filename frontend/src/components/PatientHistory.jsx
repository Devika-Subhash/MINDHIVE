function PatientHistory({ show, onClose, patientId }) {
  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>

        <h2>📁 Patient Medical History</h2>

        {/* BASIC INFO */}
        <div style={styles.section}>
          <p><b>Name:</b> Patient A</p>
          <p><b>Age:</b> 65</p>
          <p><b>Patient ID:</b> {patientId}</p>
        </div>

        {/* MEDICAL DETAILS */}
        <div style={styles.section}>
          <p><b>Conditions:</b> Hypertension, Type 2 Diabetes</p>
          <p><b>Allergies:</b> Penicillin</p>
          <p><b>Medications:</b> BP Tablet, Diabetes Tablet</p>
          <p><b>Last Visit:</b> 2026-01-02</p>
        </div>

        <hr />

        {/* VITAL HISTORY */}
        <h3>📊 Vitals History (Jan – March)</h3>

        <div style={styles.vitalCard}>
          <b>January</b>
          <p>❤️ Heart Rate: 68 – 105 bpm</p>
          <p>🫁 SpO₂: 95 – 99%</p>
        </div>

        <div style={styles.vitalCard}>
          <b>February</b>
          <p>❤️ Heart Rate: 70 – 110 bpm</p>
          <p>🫁 SpO₂: 94 – 98%</p>
        </div>

        <div style={styles.vitalCard}>
          <b>March</b>
          <p>❤️ Heart Rate: 72 – 115 bpm</p>
          <p>🫁 SpO₂: 93 – 97%</p>
        </div>

        {/* CLOSE BUTTON */}
        <button style={styles.closeBtn} onClick={onClose}>
          Close
        </button>

      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    width: "650px",
    maxHeight: "80vh",
    overflowY: "auto",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  },

  section: {
    background: "#f8f9fb",
    padding: "12px",
    borderRadius: "8px",
    marginTop: "10px",
  },

  vitalCard: {
    background: "#f1f3f6",
    padding: "12px",
    borderRadius: "10px",
    marginTop: "10px",
  },

  closeBtn: {
    marginTop: "15px",
    padding: "10px",
    width: "100%",
    border: "none",
    background: "#1976d2",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default PatientHistory;