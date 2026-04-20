// ─────────────────────────────────────────────────────────────────────────────
// FilterBar.jsx — Barra de filtros interactivos del dashboard
//
// PROPS:
//   range    {string}   — período seleccionado: "7d" | "15d" | "30d"
//   setRange {function} — actualiza el período
//   city     {string}   — ciudad seleccionada o "Todas"
//   setCity  {function} — actualiza la ciudad
//   status   {string}   — estado de tienda: "Todos" | "Online" | "Offline"
//   setStatus {function} — actualiza el estado
//
// INTEGRACIÓN CON BACKEND:
//   Los valores de estos filtros deben pasarse como query params al endpoint:
//   GET /api/stores?range=30d&city=Bogotá&status=Online
// ─────────────────────────────────────────────────────────────────────────────

export default function FilterBar({ range, setRange, city, setCity, status, setStatus }) {
    const ranges  = ["7d", "15d", "30d"];
    const cities  = ["Todas", "Bogotá", "Medellín", "Cali", "Barranquilla", "Bucaramanga"];
    const statuses = ["Todos", "Online", "Offline"];
  
    return (
      <div style={styles.bar}>
  
        {/* Rango de tiempo */}
        <div style={styles.group}>
          <span style={styles.groupLabel}>Período</span>
          <div style={styles.pills}>
            {ranges.map((r) => (
              <button
                key={r}
                style={{
                  ...styles.pill,
                  ...(range === r ? styles.pillActive : {}),
                }}
                onClick={() => setRange(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
  
        <div style={styles.sep} />
  
        {/* Ciudad */}
        <div style={styles.group}>
          <span style={styles.groupLabel}>Ciudad</span>
          <select
            style={styles.select}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
  
        <div style={styles.sep} />
  
        {/* Estado */}
        <div style={styles.group}>
          <span style={styles.groupLabel}>Estado</span>
          <div style={styles.pills}>
            {statuses.map((s) => (
              <button
                key={s}
                style={{
                  ...styles.pill,
                  ...(status === s ? styles.pillActive : {}),
                  ...(status === s && s === "Online"  ? { background: "#16A34A", borderColor: "#16A34A", color: "white" } : {}),
                  ...(status === s && s === "Offline" ? { background: "#DC2626", borderColor: "#DC2626", color: "white" } : {}),
                }}
                onClick={() => setStatus(s)}
              >
                {s === "Online"  && <span style={styles.statusDot("green")} />}
                {s === "Offline" && <span style={styles.statusDot("red")} />}
                {s}
              </button>
            ))}
          </div>
        </div>
  
        {/* Reset */}
        <button
          style={styles.resetBtn}
          onClick={() => { setRange("30d"); setCity("Todas"); setStatus("Todos"); }}
        >
          ↺ Resetear
        </button>
  
      </div>
    );
  }
  
  const styles = {
    bar: {
      background: "white",
      borderRadius: "14px",
      border: "0.5px solid rgba(0,0,0,0.07)",
      padding: "12px 18px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      flexWrap: "wrap",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    },
    group: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    groupLabel: {
      fontSize: "10px",
      fontWeight: 600,
      color: "#aaa",
      textTransform: "uppercase",
      letterSpacing: "0.8px",
      fontFamily: "'DM Sans', sans-serif",
      whiteSpace: "nowrap",
    },
    pills: {
      display: "flex",
      gap: "4px",
    },
    pill: {
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      padding: "5px 12px",
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
    pillActive: {
      background: "#FF441F",
      borderColor: "#FF441F",
      color: "white",
      boxShadow: "0 2px 6px rgba(255,68,31,0.25)",
    },
    select: {
      padding: "5px 10px",
      borderRadius: "20px",
      border: "0.5px solid rgba(0,0,0,0.1)",
      fontSize: "12px",
      fontFamily: "'DM Sans', sans-serif",
      color: "#444",
      background: "#F5F4F0",
      outline: "none",
      cursor: "pointer",
    },
    sep: {
      width: "0.5px",
      height: "24px",
      background: "rgba(0,0,0,0.08)",
    },
    statusDot: (color) => ({
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      background: color === "green" ? "#16A34A" : "#DC2626",
      flexShrink: 0,
    }),
    resetBtn: {
      marginLeft: "auto",
      padding: "5px 12px",
      borderRadius: "20px",
      border: "0.5px solid rgba(0,0,0,0.1)",
      fontSize: "11px",
      fontFamily: "'DM Sans', sans-serif",
      color: "#999",
      background: "none",
      cursor: "pointer",
      transition: "all 0.15s ease",
    },
  };