// ─────────────────────────────────────────────────────────────────────────────
// About.jsx — Página sobre la prueba técnica y el autor
// Responsive: desktop (3 cols cards, 4 cols stack) → mobile (2 cols, 1 col)
// ─────────────────────────────────────────────────────────────────────────────

import Sidebar from "../components/Sidebar";
import Topbar  from "../components/Topbar";

export default function About() {
  return (
    <div style={styles.app}>

      {/* ── Media queries para mobile ── */}
      <style>{`
        @media (max-width: 768px) {
          .about-content {
            padding: 16px !important;
            gap: 20px !important;
          }
          .about-hero {
            padding: 24px 20px !important;
          }
          .about-hero-title {
            font-size: 22px !important;
            line-height: 1.25 !important;
          }
          .about-hero-sub {
            font-size: 13px !important;
          }
          .about-section-title {
            font-size: 17px !important;
          }
          .about-card-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
          }
          .about-card {
            padding: 14px 16px !important;
          }
          .about-card-desc {
            font-size: 11px !important;
          }
          .about-stack-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 8px !important;
          }
          .about-criteria-peso {
            width: 40px !important;
            height: 40px !important;
            font-size: 11px !important;
          }
          .about-criteria-label {
            font-size: 12px !important;
          }
          .about-criteria-desc {
            font-size: 11px !important;
          }
        }

        @media (max-width: 400px) {
          .about-card-grid {
            grid-template-columns: 1fr !important;
          }
        }

        .panel-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
        }
      `}</style>

      <Sidebar />
      <div style={styles.main}>
        <Topbar />
        <div style={styles.content} className="about-content">

          {/* ── Hero ── */}
          <div style={styles.hero} className="fade-up fade-up-1 about-hero">
            <div style={styles.heroBadge}>Prueba Técnica 2026</div>
            <h1 style={styles.heroTitle} className="about-hero-title">
              Disponibilidad en Tiendas - Dashboard
            </h1>
            <p style={styles.heroSub} className="about-hero-sub">
              Aplicación web construida para visualizar y analizar datos históricos
              de disponibilidad de tiendas Rappi, con agente conversacional AI integrado.
            </p>
          </div>

          {/* ── Qué se construyó ── */}
          <div style={styles.section} className="fade-up fade-up-2">
            <div style={styles.sectionTitle} className="about-section-title">
              ¿Qué se construyó?
            </div>
            <div style={styles.cardGrid} className="about-card-grid">
              {[
                { icon: "📊", title: "Dashboard interactivo",   desc: "4 gráficas dinámicas conectadas al backend: serie de tiempo, patrón horario, tendencia diaria y resumen por día." },
                { icon: "🤖", title: "Agente AI conversacional", desc: "Chatbot integrado con Gemma via Ollama y Spring AI. El agente decide qué tool invocar según la pregunta del usuario." },
                { icon: "⚡", title: "Carga progresiva",         desc: "Skeletons animados con efecto shimmer durante la carga. La UI nunca queda en blanco, siempre muestra estados claros." },
                { icon: "📱", title: "Diseño responsive",        desc: "Adaptado para desktop, tablet y móvil. Sidebar deslizable con overlay en pantallas pequeñas." },
                { icon: "🔗", title: "Integración con backend",  desc: "5 endpoints consumidos via Fetch API nativa. Manejo de errores con banner visual cuando el servidor no está disponible." },
                { icon: "🎨", title: "Identidad visual Rappi",   desc: "Diseño con el naranja #FF441F de Rappi. Fuentes Playfair Display + DM Sans. Animaciones y micro-interacciones." },
              ].map((item) => (
                <div key={item.title} style={styles.card} className="panel-card about-card">
                  <div style={styles.cardIcon}>{item.icon}</div>
                  <div style={styles.cardTitle}>{item.title}</div>
                  <div style={styles.cardDesc} className="about-card-desc">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Stack técnico ── */}
          <div style={styles.section} className="fade-up fade-up-3">
            <div style={styles.sectionTitle} className="about-section-title">
              Stack técnico
            </div>
            <div style={styles.stackGrid} className="about-stack-grid">
              {[
                { name: "React 18",       color: "#61DAFB", bg: "#E8F9FD", desc: "Framework principal" },
                { name: "Vite",           color: "#646CFF", bg: "#EEEEFF", desc: "Bundler y dev server" },
                { name: "Chart.js",       color: "#FF6384", bg: "#FFF0F3", desc: "Gráficas interactivas" },
                { name: "React Router",   color: "#CA4245", bg: "#FDECEA", desc: "Navegación entre páginas" },
                { name: "Spring Boot",    color: "#6DB33F", bg: "#EEF7E8", desc: "Backend REST API" },
                { name: "Gemma + Ollama", color: "#FF441F", bg: "#FFF0EC", desc: "Modelo AI local" },
                { name: "Spring AI",      color: "#6DB33F", bg: "#EEF7E8", desc: "Orquestación del agente" },
                { name: "PostgreSQL",     color: "#336791", bg: "#E8EEF5", desc: "Base de datos" },
              ].map((t) => (
                <div key={t.name} style={{ ...styles.stackChip, background: t.bg }}>
                  <div style={{ ...styles.stackDot, background: t.color }} />
                  <div>
                    <div style={{ ...styles.stackName, color: t.color }}>{t.name}</div>
                    <div style={styles.stackDesc}>{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Criterios cubiertos ── */}
          <div style={styles.section} className="fade-up fade-up-4">
            <div style={styles.sectionTitle} className="about-section-title">
              Criterios de evaluación cubiertos
            </div>
            <div style={styles.criteriaList}>
              {[
                { label: "Uso efectivo de AI", peso: "30%", desc: "Chatbot con Gemma AI real via backend. El agente invoca tools de datos y muestra qué tool usó en cada respuesta.", color: "#FF441F" },
                { label: "Funcionalidad",       peso: "25%", desc: "4 gráficas conectadas al backend, selector de fecha, filtros interactivos, manejo de errores y estados de carga.", color: "#16A34A" },
                { label: "Creatividad y UX",    peso: "20%", desc: "Diseño con identidad Rappi, animaciones fadeUp y shimmer, sidebar responsive, chatbot con pantalla de bienvenida.", color: "#2563EB" },
                { label: "Calidad del código",  peso: "10%", desc: "Componentes con responsabilidad única, comentarios en todos los archivos, constantes separadas, props documentadas.", color: "#D97706" },
                { label: "Presentación",        peso: "15%", desc: "Esta página documenta qué se hizo y por qué. El código es explicable componente por componente.", color: "#7C3AED" },
              ].map((c) => (
                <div key={c.label} style={styles.criteriaRow}>
                  <div style={{ ...styles.criteriaPeso, background: c.color }} className="about-criteria-peso">
                    {c.peso}
                  </div>
                  <div style={styles.criteriaContent}>
                    <div style={styles.criteriaLabel} className="about-criteria-label">{c.label}</div>
                    <div style={styles.criteriaDesc}  className="about-criteria-desc">{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles (base — desktop). Mobile overrides están en el <style> tag de arriba.
// ─────────────────────────────────────────────────────────────────────────────
const styles = {
  app:          { display: "flex", height: "100vh", width: "100vw", fontFamily: "'DM Sans', sans-serif", background: "#F0EEE9", overflow: "hidden" },
  main:         { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 },
  content:      { flex: 1, padding: "24px 28px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "24px" },

  hero:         { background: "white", borderRadius: "16px", border: "0.5px solid rgba(0,0,0,0.07)", padding: "32px 36px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", textAlign: "center" },
  heroBadge:    { display: "inline-block", background: "#FFEDD5", color: "#9A3412", fontSize: "11px", fontWeight: 600, padding: "4px 12px", borderRadius: "20px", marginBottom: "12px", fontFamily: "'DM Sans', sans-serif" },
  heroTitle:    { fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: 900, color: "#111", letterSpacing: "-0.8px", marginBottom: "10px" },
  heroSub:      { fontSize: "14px", color: "#777", lineHeight: 1.7, maxWidth: "600px", fontFamily: "'DM Sans', sans-serif", margin: "0 auto" },

  section:      { display: "flex", flexDirection: "column", gap: "14px" },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700, color: "#111", letterSpacing: "-0.3px" },

  cardGrid:     { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" },
  card:         { background: "white", borderRadius: "14px", border: "0.5px solid rgba(0,0,0,0.07)", padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", transition: "transform 0.18s ease, box-shadow 0.18s ease" },
  cardIcon:     { fontSize: "22px", marginBottom: "10px" },
  cardTitle:    { fontSize: "13px", fontWeight: 600, color: "#111", marginBottom: "6px", fontFamily: "'DM Sans', sans-serif" },
  cardDesc:     { fontSize: "12px", color: "#888", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" },

  stackGrid:    { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" },
  stackChip:    { borderRadius: "12px", padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: "10px", border: "0.5px solid rgba(0,0,0,0.06)" },
  stackDot:     { width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0, marginTop: "4px" },
  stackName:    { fontSize: "12px", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" },
  stackDesc:    { fontSize: "11px", color: "#999", fontFamily: "'DM Sans', sans-serif", marginTop: "2px" },

  criteriaList:    { display: "flex", flexDirection: "column", gap: "10px" },
  criteriaRow:     { background: "white", borderRadius: "12px", border: "0.5px solid rgba(0,0,0,0.07)", padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: "14px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" },
  criteriaPeso:    { flexShrink: 0, width: "44px", height: "44px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "white", fontFamily: "'DM Sans', sans-serif" },
  criteriaContent: { flex: 1 },
  criteriaLabel:   { fontSize: "13px", fontWeight: 600, color: "#111", marginBottom: "4px", fontFamily: "'DM Sans', sans-serif" },
  criteriaDesc:    { fontSize: "12px", color: "#888", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" },
};