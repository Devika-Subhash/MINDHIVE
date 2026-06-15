function Navbar() {
  return (
    <div style={styles.navbar}>
      <div style={styles.brand}>
        <div style={styles.logoCircle}>🧠</div>
        <div>
          <h2 style={styles.brandName}>MindHive</h2>
          <p style={styles.brandTag}>Smart Care Platform</p>
        </div>
      </div>
      <button
        style={styles.logout}
        onMouseEnter={e => e.target.style.background = "#fee2e2"}
        onMouseLeave={e => e.target.style.background = "#fff5f5"}
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
      >
        ⎋ Logout
      </button>
    </div>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f4c81 0%, #1a6fb5 100%)",
    padding: "14px 28px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(15,76,129,0.3)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoCircle: {
    background: "rgba(255,255,255,0.15)",
    borderRadius: "12px",
    width: "42px",
    height: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    backdropFilter: "blur(4px)",
  },
  brandName: {
    margin: 0,
    color: "white",
    fontSize: "20px",
    fontWeight: "700",
    letterSpacing: "0.5px",
    fontFamily: "Georgia, serif",
  },
  brandTag: {
    margin: 0,
    color: "rgba(255,255,255,0.65)",
    fontSize: "11px",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  logout: {
    background: "#fff5f5",
    border: "1px solid #fecaca",
    padding: "7px 14px",
    borderRadius: "8px",
    color: "#dc2626",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    letterSpacing: "0.3px",
    transition: "background 0.2s",
  },
};

export default Navbar;