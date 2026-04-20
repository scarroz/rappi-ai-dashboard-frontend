// ─────────────────────────────────────────────────────────────────────────────
// Sidebar.jsx — Navegación lateral de la aplicación
//
// PROPS:
//   onOpenChat {function} — callback para abrir el panel del chatbot
//
// NOTAS:
//   - El item activo está hardcodeado en navItems (active: true)
//   - En una app con múltiples rutas, usar React Router y detectar
//     la ruta activa con useLocation()
//   - Las stats rápidas (uptime, tiendas) deben recibirse como props
//     desde Dashboard cuando el backend esté conectado
// ─────────────────────────────────────────────────────────────────────────────
import rappiLogo from "../assets/logorappi.png";

const navItems = [
  {
    label: "Dashboard", active: true,
    icon: (<svg width="15" height="15" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="7" height="7" rx="1.5" fill="currentColor"/><rect x="10" y="1" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.5"/><rect x="1" y="10" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.5"/><rect x="10" y="10" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.5"/></svg>),
  },
  {
    label: "Historial", active: false,
    icon: (<svg width="15" height="15" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.2"/><path d="M9 5v4l2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>),
  },
  {
    label: "Tiendas", active: false,
    icon: (<svg width="15" height="15" viewBox="0 0 18 18" fill="none"><path d="M2 9h14M2 4.5h14M2 13.5h14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>),
  },
];

export default function Sidebar({ onOpenChat }) {
  return (
    <aside style={styles.sidebar}>

      {/* Logo */}
<div style={styles.logo}>
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <img
      src={rappiLogo}
      alt="Rappi"
      style={styles.logoImg}
    />
    <span style={styles.logoText}>Makers</span>
  </div>
  <small style={styles.logoSub}>Análisis de tiendas</small>
</div>

      {/* Nav principal */}
      <div style={styles.section}>
        <div style={styles.sectionLabel}>Menu</div>
        {navItems.map((item) => (
          <div
            key={item.label}
            className="nav-item"
            style={{
              ...styles.navItem,
              ...(item.active ? styles.navItemActive : {}),
            }}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            {item.label}
            {item.active && <div style={styles.activeDot} />}
          </div>
        ))}
      </div>

      {/* Divisor */}
      <div style={styles.divider} />

      {/* Nav AI */}
      <div style={styles.section}>
        <div style={styles.sectionLabel}>AI</div>
        <div className="nav-item" style={styles.navItem} onClick={onOpenChat}>
          <span style={styles.navIcon}>
            <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
              <path d="M2 13L9 3l7 10H2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
          </span>
          Chat Asistente
          <span style={styles.aiBadge}>AI</span>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Stats rápidas */}
      <div style={styles.quickStats}>
        <div style={styles.statItem}>
          <div style={styles.statValue}>--%</div>
          <div style={styles.statLabel}>Tiempo</div>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <div style={styles.statValue}>--</div>
          <div style={styles.statLabel}>Tiendas</div>
        </div>
      </div>

      {/* Usuario */}
      <div style={styles.bottom}>
        <div style={styles.userPill}>
          <div style={styles.avatar}>--</div>
          <div style={{ flex: 1 }}>
            <div style={styles.userName}>Usuario</div>
            <div style={styles.userRole}>Sin sesión</div>
          </div>
          <div style={styles.onlineIndicator} />
        </div>
      </div>

    </aside>
  );
}

const styles = {
  sidebar: {
    width: "230px",
    background: "#FF441F",
    borderRight: "none",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    height: "100%",
  },
  logo: {
    padding: "20px 20px 14px",
    borderBottom: "0.5px solid rgba(255,255,255,0.15)",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  logoImg: {
    height: "24px",
    objectFit: "contain",
    filter: "brightness(0) invert(1)",
  },
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "16px",
    fontWeight: 700,
    color: "white",
    letterSpacing: "-0.3px",
  },
  logoSub: {
    fontSize: "10px",
    color: "rgba(255,255,255,0.45)",
    display: "block",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.3px",
    marginTop: "2px",
  },
  section: {
    padding: "16px 12px 6px",
  },
  sectionLabel: {
    fontSize: "9px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.4)",
    letterSpacing: "1.8px",
    textTransform: "uppercase",
    padding: "0 8px",
    marginBottom: "6px",
    fontFamily: "'DM Sans', sans-serif",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "9px 10px",
    borderRadius: "9px",
    cursor: "pointer",
    color: "rgba(255,255,255,0.55)",
    fontSize: "13px",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 400,
    marginBottom: "2px",
    position: "relative",
    transition: "all 0.15s ease",
  },
  navItemActive: {
    background: "rgba(255,255,255,0.2)",
    color: "white",
    fontWeight: 500,
  },
  navIcon: {
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
  },
  activeDot: {
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    background: "white",
    marginLeft: "auto",
  },
  divider: {
    margin: "4px 20px",
    height: "0.5px",
    background: "rgba(255,255,255,0.15)",
  },
  aiBadge: {
    marginLeft: "auto",
    fontSize: "9px",
    fontWeight: 600,
    padding: "2px 6px",
    borderRadius: "4px",
    background: "rgba(255,255,255,0.2)",
    color: "white",
    letterSpacing: "0.5px",
    fontFamily: "'DM Sans', sans-serif",
  },
  quickStats: {
    margin: "0 14px 14px",
    background: "rgba(255,255,255,0.15)",
    borderRadius: "10px",
    border: "0.5px solid rgba(255,255,255,0.2)",
    padding: "12px 14px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  statItem: {
    flex: 1,
    textAlign: "center",
  },
  statValue: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "15px",
    fontWeight: 700,
    color: "white",
  },
  statLabel: {
    fontSize: "9px",
    color: "rgba(255,255,255,0.4)",
    marginTop: "2px",
    fontFamily: "'DM Sans', sans-serif",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
  statDivider: {
    width: "0.5px",
    height: "28px",
    background: "rgba(255,255,255,0.2)",
  },
  bottom: {
    padding: "12px",
    borderTop: "0.5px solid rgba(255,255,255,0.15)",
  },
  userPill: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 10px",
    borderRadius: "9px",
    background: "rgba(255,255,255,0.12)",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 600,
    color: "white",
    flexShrink: 0,
    fontFamily: "'DM Sans', sans-serif",
  },
  userName: {
    fontSize: "12.5px",
    fontWeight: 500,
    color: "white",
    fontFamily: "'DM Sans', sans-serif",
  },
  userRole: {
    fontSize: "10px",
    color: "rgba(255,255,255,0.4)",
    fontFamily: "'DM Sans', sans-serif",
  },
  onlineIndicator: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#22C55E",
    flexShrink: 0,
  },
};