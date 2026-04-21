import rappiLogo from "../assets/logorappi.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const navItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: (
      <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="7" height="7" rx="1.5" fill="currentColor" />
        <rect x="10" y="1" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.5" />
        <rect x="1" y="10" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.5" />
        <rect x="10" y="10" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  {
    label: "Sobre el proyecto",
    path: "/about",
    icon: (
      <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M9 7v5M9 5.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Equipo",
    path: "/team",
    icon: (
      <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
        <circle cx="7" cy="6" r="3" stroke="currentColor" strokeWidth="1.2" />
        <path d="M1 15c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M13 8c1.7 0 3 1.2 3 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Sidebar({ onOpenChat }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <div
        className={`sidebar-overlay ${mobileOpen ? "active" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      <button
        className="hamburger-btn"
        style={styles.hamburger}
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menú"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M2 5h16M2 10h16M2 15h16"
            stroke="#FF441F"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <aside
        style={styles.sidebar}
        className={`sidebar-mobile ${mobileOpen ? "open" : ""}`}
      >
        <button
          className="sidebar-close-btn"
          style={styles.closeBtn}
          onClick={() => setMobileOpen(false)}
          aria-label="Cerrar menú"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path
              d="M1 1l11 11M12 1L1 12"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div style={styles.logo}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src={rappiLogo} alt="Rappi" style={styles.logoImg} />
            <span style={styles.logoText}>Makers</span>
          </div>
          <small style={styles.logoSub}>Análisis de tiendas</small>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionLabel}>Menu</div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <div
                key={item.label}
                className="nav-item"
                style={{
                  ...styles.navItem,
                  ...(isActive ? styles.navItemActive : {}),
                }}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
              >
                <span style={styles.navIcon}>{item.icon}</span>
                {item.label}
                {isActive && <div style={styles.activeDot} />}
              </div>
            );
          })}
        </div>

        <div style={styles.divider} />

        <div style={styles.section}>
          <div style={styles.sectionLabel}>AI</div>
          <div
            className="nav-item"
            style={styles.navItem}
            onClick={() => {
              onOpenChat();
              setMobileOpen(false);
            }}
          >
            <span style={styles.navIcon}>
              <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
                <path
                  d="M2 13L9 3l7 10H2z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            Chat Asistente
            <span style={styles.aiBadge}>AI</span>
          </div>
        </div>

        <div style={{ flex: 1 }} />

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
    </>
  );
}

const styles = {
  hamburger: {
    display: "none",
    position: "fixed",
    top: "12px",
    left: "12px",
    zIndex: 30,
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    background: "white",
    border: "0.5px solid rgba(0,0,0,0.08)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  closeBtn: {
    display: "none",
    position: "absolute",
    top: "14px",
    right: "14px",
    width: "28px",
    height: "28px",
    borderRadius: "7px",
    background: "rgba(255,255,255,0.12)",
    border: "none",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  sidebar: {
    width: "230px",
    background: "#FF441F",
    borderRight: "none",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    height: "100%",
    position: "relative",
    overflowY: "auto",
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
  section: { padding: "16px 12px 6px" },
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