const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8081";

const EXPORT_PDF_ENDPOINT = `${API_BASE_URL}/api/reports/insights/pdf`;

export default function Topbar() {
  function handleExportPdf() {
    window.open(EXPORT_PDF_ENDPOINT, "_blank", "noopener,noreferrer");
  }

  return (
    <div style={styles.topbar} className="topbar-responsive">
      <span style={styles.breadcrumb}>
        RappiMakers / <strong style={styles.breadcrumbActive}>Dashboard</strong>
      </span>

      <div style={styles.right}>
        <div style={styles.liveChip}>
          <div style={styles.liveDot} />
          Live
        </div>

        <button
          type="button"
          style={{ ...styles.chip, ...styles.chipPrimary }}
          onClick={handleExportPdf}
        >
          Exportar PDF
        </button>
      </div>
    </div>
  );
}

const styles = {
  topbar: {
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    padding: "0 28px",
    height: "54px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "0.5px solid rgba(0,0,0,0.07)",
    flexShrink: 0,
    position: "relative",
    zIndex: 10,
  },
  breadcrumb: {
    fontSize: "13px",
    color: "#bbb",
    fontFamily: "'DM Sans', sans-serif",
  },
  breadcrumbActive: {
    color: "#111",
    fontWeight: 500,
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  liveChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 13px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 500,
    border: "0.5px solid rgba(34,197,94,0.3)",
    color: "#16A34A",
    background: "rgba(34,197,94,0.06)",
    fontFamily: "'DM Sans', sans-serif",
  },
  liveDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#22C55E",
    boxShadow: "0 0 0 2px rgba(34,197,94,0.25)",
    animation: "livePulse 2s ease infinite",
  },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
    padding: "5px 13px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 500,
    border: "0.5px solid rgba(0,0,0,0.1)",
    color: "#666",
    background: "#F5F4F0",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "all 0.15s ease",
  },
  chipPrimary: {
    background: "#FF441F",
    color: "white",
    borderColor: "transparent",
    boxShadow: "0 2px 8px rgba(255,68,31,0.25)",
  },
};