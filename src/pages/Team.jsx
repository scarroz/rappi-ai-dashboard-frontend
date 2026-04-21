// ─────────────────────────────────────────────────────────────────────────────
// Team.jsx — Página sobre el autor y la misión del proyecto
// ─────────────────────────────────────────────────────────────────────────────

import Sidebar from "../components/Sidebar";
import Topbar  from "../components/Topbar";

export default function Team() {
  return (
    <div style={styles.app}>
      <Sidebar />
      <div style={styles.main}>
        <Topbar />
        <div style={styles.content}>

          {/* Card del autor */}
          <div style={styles.authorCard} className="fade-up fade-up-1">
            <div style={styles.authorLeft}>
              <div style={styles.avatar}>SC</div>
              <div>
                <div style={styles.authorName}>Sebastián Carroz</div>
                <div style={styles.authorRole}>Desarrollador Backend · RappiMakers 2026</div>
              </div>
            </div>
            <div style={styles.contactRow}>
              <a href="mailto:sebastian.carroz@email.com" style={styles.contactChip}>
                ✉️ sebastian.carroz@gmail.com
              </a>
              <a href="https://linkedin.com/in/sebastiancarroz" target="_blank" rel="noreferrer" style={styles.contactChip}>
                💼 LinkedIn
              </a>
              <a href="https://github.com/sebastiancarroz" target="_blank" rel="noreferrer" style={styles.contactChip}>
                🐙 GitHub
              </a>
            </div>
          </div>

          {/* Misión de Rappi */}
          <div className="fade-up fade-up-2">
            <div style={styles.sectionTitle}>Misión de Rappi</div>
            <div style={styles.missionCard}>
              <div style={styles.missionQuote}>
                "Hacer la vida de las personas más fácil y conveniente, dándoles tiempo libre para vivir como quieren."
              </div>
              <div style={styles.missionBody}>
                Rappi nació en Colombia en 2015 con la visión de conectar a las personas con todo lo que necesitan, cuando lo necesitan. Hoy opera en más de 9 países de América Latina, con millones de usuarios activos y decenas de miles de tiendas aliadas.
              </div>
            </div>
          </div>

          {/* Valores */}
          <div className="fade-up fade-up-3">
            <div style={styles.sectionTitle}>Valores que guiaron este proyecto</div>
            <div style={styles.valuesGrid}>
              {[
                { icon: "🚀", title: "Velocidad", desc: "Construido en tiempo récord con las mejores herramientas modernas de frontend." },
                { icon: "📊", title: "Datos como centro", desc: "Cada decisión de diseño tiene como objetivo comunicar datos de forma clara y accionable." },
                { icon: "🤝", title: "Colaboración", desc: "Frontend y backend diseñados para integrarse sin fricción, con contratos claros de API." },
                { icon: "✨", title: "Calidad", desc: "Código organizado, documentado y pensado para escalar con nuevas funcionalidades." },
              ].map((v) => (
                <div key={v.title} style={styles.valueCard} className="panel-card">
                  <div style={styles.valueIcon}>{v.icon}</div>
                  <div style={styles.valueTitle}>{v.title}</div>
                  <div style={styles.valueDesc}>{v.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer de la página */}
          <div style={styles.footer} className="fade-up fade-up-4">
            <div style={styles.footerText}>
              RappiMakers · Prueba Técnica 2026 · Frontend React + Vite
            </div>
            <div style={styles.footerSub}>
              Desarrollado por Sebastián Carroz
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const styles = {
  app:         { display: "flex", height: "100vh", width: "100vw", fontFamily: "'DM Sans', sans-serif", background: "#F0EEE9", overflow: "hidden" },
  main:        { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 },
  content:     { flex: 1, padding: "24px 28px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "24px" },

  authorCard:  { background: "white", borderRadius: "16px", border: "0.5px solid rgba(0,0,0,0.07)", padding: "28px 32px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" },
  authorLeft:  { display: "flex", alignItems: "center", gap: "16px" },
  avatar:      { width: "56px", height: "56px", borderRadius: "50%", background: "linear-gradient(135deg, #FF441F, #ff6b47)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 700, color: "white", flexShrink: 0, fontFamily: "'DM Sans', sans-serif" },
  authorName:  { fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 700, color: "#111" },
  authorRole:  { fontSize: "13px", color: "#999", fontFamily: "'DM Sans', sans-serif", marginTop: "3px" },
  contactRow:  { display: "flex", gap: "8px", flexWrap: "wrap" },
  contactChip: { display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 500, border: "0.5px solid rgba(0,0,0,0.1)", color: "#444", background: "#F5F4F0", textDecoration: "none", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s ease" },

  sectionTitle:{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700, color: "#111", letterSpacing: "-0.3px", marginBottom: "14px" },

  missionCard: { background: "white", borderRadius: "16px", border: "0.5px solid rgba(0,0,0,0.07)", padding: "28px 32px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" },
  missionQuote:{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700, color: "#FF441F", lineHeight: 1.5, marginBottom: "16px", borderLeft: "3px solid #FF441F", paddingLeft: "18px" },
  missionBody: { fontSize: "14px", color: "#777", lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif" },

  valuesGrid:  { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" },
  valueCard:   { background: "white", borderRadius: "14px", border: "0.5px solid rgba(0,0,0,0.07)", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" },
  valueIcon:   { fontSize: "24px", marginBottom: "10px" },
  valueTitle:  { fontSize: "13px", fontWeight: 600, color: "#111", marginBottom: "6px", fontFamily: "'DM Sans', sans-serif" },
  valueDesc:   { fontSize: "12px", color: "#888", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" },

  footer:      { background: "white", borderRadius: "14px", border: "0.5px solid rgba(0,0,0,0.07)", padding: "20px 24px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" },
  footerText:  { fontSize: "13px", fontWeight: 500, color: "#111", fontFamily: "'DM Sans', sans-serif" },
  footerSub:   { fontSize: "12px", color: "#aaa", marginTop: "4px", fontFamily: "'DM Sans', sans-serif" },
};