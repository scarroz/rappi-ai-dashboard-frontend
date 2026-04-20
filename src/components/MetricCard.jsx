// ─────────────────────────────────────────────────────────────────────────────
// MetricCard.jsx — Tarjeta de métrica individual
//
// PROPS:
//   label   {string}  — nombre de la métrica (ej: "Uptime promedio")
//   value   {string}  — valor a mostrar (ej: "94.7%")
//   delta   {string}  — variación respecto al período anterior
//   up      {boolean} — true = tendencia positiva (verde), false = negativa (rojo)
//   loading {boolean} — muestra skeleton animado mientras cargan los datos
//
// INTEGRACIÓN CON BACKEND:
//   <MetricCard
//     label="Uptime promedio"
//     value={data.uptimeAvg}
//     delta={data.uptimeDelta}
//     up={data.uptimeTrend === "up"}
//     loading={isLoading}
//   />
// ─────────────────────────────────────────────────────────────────────────────

import SkeletonCard from "./SkeletonCard";

export default function MetricCard({ label, value, delta, up, loading = false }) {
  if (loading) {
    return (
      <div className="skeleton-metric">
        <SkeletonCard height="10px" borderRadius="6px" />
        <SkeletonCard height="28px" borderRadius="8px" />
        <SkeletonCard height="10px" borderRadius="6px" />
      </div>
    );
  }

  return (
    <div style={styles.card} className="metric-card data-ready">
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{value}</div>
      <div style={{ ...styles.delta, color: up ? "#16A34A" : "#DC2626" }}>
        {delta}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    borderRadius: "14px",
    border: "0.5px solid rgba(0,0,0,0.07)",
    padding: "16px 18px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  },
  label: {
    fontSize: "10px",
    fontWeight: 600,
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginBottom: "8px",
    fontFamily: "'DM Sans', sans-serif",
  },
  value: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "26px",
    fontWeight: 700,
    color: "#111",
    letterSpacing: "-0.3px",
  },
  delta: {
    fontSize: "11px",
    fontWeight: 500,
    marginTop: "5px",
    fontFamily: "'DM Sans', sans-serif",
  },
};