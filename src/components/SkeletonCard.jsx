// ─────────────────────────────────────────────────────────────────────────────
// SkeletonCard.jsx — Placeholder animado para estados de carga
//
// PROPS:
//   height       {string} — altura del skeleton (ej: "80px")
//   borderRadius {string} — radio de bordes (ej: "14px")
//
// USO:
//   Se muestra mientras loading === true en Dashboard.jsx
//   Reemplaza visualmente el contenido hasta que lleguen los datos del backend
// ─────────────────────────────────────────────────────────────────────────────

export default function SkeletonCard({ height = "80px", borderRadius = "14px" }) {
    return (
      <div style={{ ...styles.skeleton, height, borderRadius }}>
        <div style={styles.shimmer} />
      </div>
    );
  }
  
  const styles = {
    skeleton: {
      background: "#E8E6E1",
      overflow: "hidden",
      position: "relative",
      width: "100%",
    },
    shimmer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
      animation: "shimmer 1.6s infinite",
      backgroundSize: "200% 100%",
    },
  };