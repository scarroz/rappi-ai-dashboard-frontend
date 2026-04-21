import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import MetricCard from "../components/MetricCard";
import ChatPanel from "../components/ChatPanel";
import SkeletonCard from "../components/SkeletonCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8081";

const AVAILABLE_DATES = [
  "2026-02-01",
  "2026-02-02",
  "2026-02-03",
  "2026-02-04",
  "2026-02-05",
  "2026-02-06",
  "2026-02-07",
  "2026-02-08",
  "2026-02-09",
  "2026-02-10",
  "2026-02-11",
];

const font = { family: "DM Sans, sans-serif", size: 11 };
const gridColor = "rgba(0,0,0,0.05)";

export default function Dashboard() {
  const [chatOpen, setChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [globalStats, setGlobalStats] = useState(null);
  const [dailyTrend, setDailyTrend] = useState([]);
  const [hourlyPattern, setHourlyPattern] = useState({
    hours: [],
    peakHour: null,
    peakAvgValue: null,
  });
  const [timeSeries, setTimeSeries] = useState([]);
  const [selectedDate, setSelectedDate] = useState("2026-02-06");

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError(null);

      try {
        const [statsRes, trendRes, hourlyRes] = await Promise.all([
          fetch(`${BASE_URL}/api/analytics/stats`),
          fetch(`${BASE_URL}/api/analytics/trend`),
          fetch(`${BASE_URL}/api/analytics/hourly-pattern`),
        ]);

        if (!statsRes.ok || !trendRes.ok || !hourlyRes.ok) {
          throw new Error("Error en la respuesta del servidor");
        }

        const stats = await statsRes.json();
        const trend = await trendRes.json();
        const hourly = await hourlyRes.json();

        setGlobalStats(stats);
        setDailyTrend(trend.days || []);
        setHourlyPattern(hourly);
      } catch (e) {
        setError(
          "No se pudo conectar con el backend. Verifica que esté corriendo en localhost:8081"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  useEffect(() => {
    async function fetchTimeSeries() {
      try {
        const res = await fetch(
          `${BASE_URL}/api/analytics/timeseries?date=${selectedDate}`
        );

        if (!res.ok) {
          setTimeSeries([]);
          return;
        }

        const data = await res.json();
        setTimeSeries(data.points || []);
      } catch {
        setTimeSeries([]);
      }
    }

    fetchTimeSeries();
  }, [selectedDate]);

  const METRICS = [
    {
      label: "Máx. tiendas visibles",
      value: globalStats ? globalStats.maxVisibleStores.toLocaleString() : "--",
      delta: globalStats
        ? `Período: ${globalStats.dataRangeStart?.slice(0, 10)} → ${globalStats.dataRangeEnd?.slice(0, 10)}`
        : "Sin datos aún",
      up: true,
    },
    {
      label: "Promedio tiendas visibles",
      value: globalStats ? globalStats.avgVisibleStores.toLocaleString() : "--",
      delta: globalStats
        ? `${globalStats.totalDays} días monitoreados`
        : "Sin datos aún",
      up: true,
    },
    {
      label: "Mín. tiendas visibles",
      value: globalStats ? globalStats.minVisibleStores.toLocaleString() : "--",
      delta: "Valor mínimo registrado",
      up: false,
    },
    {
      label: "Total mediciones",
      value: globalStats ? globalStats.totalDataPoints.toLocaleString() : "--",
      delta: "Cada 10 segundos",
      up: true,
    },
  ];

  const lineData = {
    labels: timeSeries.map((p) => {
      const d = new Date(p.timestamp);
      return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
    }),
    datasets: [
      {
        label: "Tiendas visibles",
        data: timeSeries.map((p) => p.value),
        borderColor: "#FF441F",
        backgroundColor: "rgba(255,68,31,0.07)",
        borderWidth: 1.5,
        tension: 0.4,
        pointRadius: 0,
        fill: true,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (ctx) => `${ctx.parsed.y.toLocaleString()} tiendas`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { maxTicksLimit: 10, font },
      },
      y: {
        grid: { color: gridColor },
        ticks: { font },
      },
    },
  };

  const barData = {
    labels: dailyTrend.map((d) => {
      const parts = String(d.date).split("-");
      return `${parts[2]}/${parts[1]}`;
    }),
    datasets: [
      {
        label: "Promedio tiendas visibles",
        data: dailyTrend.map((d) => d.avgValue),
        backgroundColor: "#FF441F",
        borderRadius: 5,
        barThickness: 22,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y.toLocaleString()} tiendas promedio`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font },
      },
      y: {
        grid: { color: gridColor },
        ticks: { font },
      },
    },
  };

  const hourlyData = {
    labels: hourlyPattern.hours.map((h) => `${h.hour}:00`),
    datasets: [
      {
        label: "Promedio tiendas visibles",
        data: hourlyPattern.hours.map((h) => h.avgValue),
        borderColor: "#1A1A1A",
        backgroundColor: "rgba(26,26,26,0.05)",
        borderWidth: 1.5,
        tension: 0.4,
        pointRadius: 0,
        fill: true,
      },
    ],
  };

  const hourlyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (ctx) => `${ctx.parsed.y.toLocaleString()} tiendas`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { maxTicksLimit: 8, font },
      },
      y: {
        grid: { color: gridColor },
        ticks: { font },
      },
    },
  };

  return (
    <div style={styles.app}>
      <Sidebar onOpenChat={() => setChatOpen(true)} />

      <div style={styles.main}>
        <Topbar />

        <div style={styles.workspace}>
          <div style={styles.content}>
            <div className="fade-up fade-up-1">
              <div className="page-title-accent" style={styles.pageTitle}>
                Disponibilidad de Tiendas
              </div>
              <div style={styles.pageSub}>
                {globalStats
                  ? `${globalStats.dataRangeStart?.slice(0, 10)} → ${globalStats.dataRangeEnd?.slice(0, 10)} · ${globalStats.totalDataPoints?.toLocaleString()} mediciones · granularidad 10s`
                  : "Monitoreo histórico de disponibilidad de tiendas Rappi"}
              </div>
            </div>

            {error && <div style={styles.errorBanner}>⚠️ {error}</div>}

            <div
              style={styles.metricsGrid}
              className="fade-up fade-up-2 metrics-grid-responsive"
            >
              {METRICS.map((m) => (
                <MetricCard
                  key={m.label}
                  label={m.label}
                  value={m.value}
                  delta={m.delta}
                  up={m.up}
                  loading={loading}
                />
              ))}
            </div>

            <div
              style={styles.chartRow}
              className="fade-up fade-up-3 chart-row-responsive"
            >
              <div style={styles.panel} className="panel-card">
                <div style={styles.panelHeader}>
                  <span style={styles.panelTitle}>
                    Tiendas visibles — serie de tiempo
                  </span>
                  <select
                    style={styles.dateSelect}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  >
                    {AVAILABLE_DATES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {loading ? (
                  <SkeletonCard height="150px" borderRadius="10px" />
                ) : timeSeries.length > 0 ? (
                  <div style={{ flex: 1, minHeight: "160px" }}>
                    <Line data={lineData} options={lineOptions} />
                  </div>
                ) : (
                  <EmptyChart icon="line" text="Sin datos para esta fecha" />
                )}
              </div>

              <div style={styles.panel} className="panel-card">
                <div style={styles.panelHeader}>
                  <span style={styles.panelTitle}>
                    Patrón horario promedio (0–23h)
                  </span>
                  {hourlyPattern.peakHour !== null && (
                    <span style={styles.badgeOrange}>
                      Pico: {hourlyPattern.peakHour}:00h ·{" "}
                      {hourlyPattern.peakAvgValue?.toLocaleString()}
                    </span>
                  )}
                </div>

                {loading ? (
                  <SkeletonCard height="150px" borderRadius="10px" />
                ) : hourlyPattern.hours.length > 0 ? (
                  <div style={{ flex: 1, minHeight: "160px" }}>
                    <Line data={hourlyData} options={hourlyOptions} />
                  </div>
                ) : (
                  <EmptyChart icon="line" text="Esperando datos del servidor" />
                )}
              </div>
            </div>

            <div
              style={styles.bottomRow}
              className="fade-up fade-up-4 bottom-row-responsive"
            >
              <div style={styles.panel} className="panel-card">
                <div style={styles.panelHeader}>
                  <span style={styles.panelTitle}>
                    Promedio diario de tiendas visibles
                  </span>
                  {dailyTrend.length > 0 && (
                    <span style={styles.badgeOrange}>
                      {dailyTrend.length} días
                    </span>
                  )}
                </div>

                {loading ? (
                  <SkeletonCard height="120px" borderRadius="10px" />
                ) : dailyTrend.length > 0 ? (
                  <div style={{ flex: 1, minHeight: "160px" }}>
                    <Bar data={barData} options={barOptions} />
                  </div>
                ) : (
                  <EmptyChart icon="bar" text="Esperando datos del servidor" />
                )}
              </div>

              <div style={styles.panel} className="panel-card">
                <div style={styles.panelHeader}>
                  <span style={styles.panelTitle}>Resumen por día</span>
                </div>

                {loading ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <SkeletonCard
                        key={i}
                        height="20px"
                        borderRadius="6px"
                      />
                    ))}
                  </div>
                ) : dailyTrend.length > 0 ? (
                  <div style={styles.dayList}>
                    {dailyTrend.map((d) => (
                      <div key={String(d.date)} style={styles.dayRow}>
                        <div>
                          <div style={styles.dayDate}>{String(d.date)}</div>
                          <div style={styles.dayName}>{d.dayName}</div>
                        </div>
                        <div style={styles.dayStats}>
                          <span style={styles.dayStat}>
                            <span style={styles.dayStatLabel}>avg</span>
                            {d.avgValue.toLocaleString()}
                          </span>
                          <span style={styles.dayStat}>
                            <span style={styles.dayStatLabel}>máx</span>
                            {d.maxValue.toLocaleString()}
                          </span>
                          <span style={styles.dayStat}>
                            <span style={styles.dayStatLabel}>min</span>
                            {d.minValue.toLocaleString()}
                          </span>
                          <span style={styles.dayStat}>
                            <span style={styles.dayStatLabel}>pts</span>
                            {d.dataPoints.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyChart icon="store" text="Esperando datos del servidor" />
                )}
              </div>
            </div>
          </div>

          <ChatPanel
            open={chatOpen}
            onClose={() => setChatOpen(false)}
            isMobile={typeof window !== "undefined" && window.innerWidth <= 768}
          />
        </div>
      </div>

      {!chatOpen && (
        <button
          className="fab-pulse"
          style={styles.fab}
          onClick={() => setChatOpen(true)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M3 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H7l-4 3V4z"
              fill="white"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

function EmptyChart({ icon, text }) {
  const paths = {
    line: (
      <>
        <path
          d="M3 3v18h18"
          stroke="#bbb"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M7 16l4-4 4 4 4-8"
          stroke="#bbb"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
    bar: (
      <path
        d="M3 20h18M5 20V10m4 10V4m4 16v-7m4 7v-3"
        stroke="#bbb"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    ),
    store: (
      <path
        d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
        stroke="#bbb"
        strokeWidth="1.5"
      />
    ),
  };

  return (
    <div
      style={{
        height: "120px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#FAFAFA",
        borderRadius: "10px",
        border: "1px dashed rgba(0,0,0,0.08)",
        gap: "6px",
      }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        style={{ opacity: 0.25 }}
      >
        {paths[icon]}
      </svg>
      <span
        style={{
          fontSize: "11px",
          color: "#bbb",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {text}
      </span>
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    fontFamily: "'DM Sans', sans-serif",
    background: "#F0EEE9",
    position: "relative",
    overflow: "hidden",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    minWidth: 0,
  },
  workspace: {
    flex: 1,
    display: "flex",
    overflow: "hidden",
  },
  content: {
    flex: 1,
    padding: "24px 28px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  pageTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "26px",
    fontWeight: 900,
    color: "#111111",
    letterSpacing: "-0.5px",
  },
  pageSub: {
    fontSize: "12px",
    color: "#999",
    marginTop: "4px",
    fontFamily: "'DM Sans', sans-serif",
  },
  errorBanner: {
    background: "#FEE2E2",
    border: "0.5px solid #FCA5A5",
    borderRadius: "10px",
    padding: "10px 16px",
    fontSize: "12.5px",
    color: "#991B1B",
    fontFamily: "'DM Sans', sans-serif",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
  },
  chartRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },
  bottomRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },
  panel: {
    background: "white",
    borderRadius: "14px",
    border: "0.5px solid rgba(0,0,0,0.07)",
    padding: "18px 20px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    position: "relative",
    minHeight: "240px",
    display: "flex",
    flexDirection: "column",
  },
  panelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "14px",
  },
  panelTitle: {
    fontSize: "12.5px",
    fontWeight: 500,
    color: "#111",
    fontFamily: "'DM Sans', sans-serif",
  },
  badgeOrange: {
    fontSize: "10px",
    padding: "2px 8px",
    borderRadius: "20px",
    fontWeight: 600,
    background: "#FFEDD5",
    color: "#9A3412",
    fontFamily: "'DM Sans', sans-serif",
  },
  dateSelect: {
    padding: "4px 10px",
    borderRadius: "20px",
    border: "0.5px solid rgba(0,0,0,0.1)",
    fontSize: "11px",
    fontFamily: "'DM Sans', sans-serif",
    color: "#444",
    background: "#F5F4F0",
    outline: "none",
    cursor: "pointer",
  },
  dayList: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    maxHeight: "220px",
    overflowY: "auto",
  },
  dayRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "7px 10px",
    borderRadius: "8px",
    background: "#FAFAFA",
    border: "0.5px solid rgba(0,0,0,0.05)",
  },
  dayDate: {
    fontSize: "11.5px",
    fontWeight: 500,
    color: "#1A1A1A",
    fontFamily: "'DM Sans', sans-serif",
  },
  dayName: {
    fontSize: "10px",
    color: "#bbb",
    fontFamily: "'DM Sans', sans-serif",
    textTransform: "capitalize",
  },
  dayStats: {
    display: "flex",
    gap: "10px",
  },
  dayStat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: "11px",
    fontWeight: 500,
    color: "#1A1A1A",
    fontFamily: "'DM Sans', sans-serif",
  },
  dayStatLabel: {
    fontSize: "9px",
    color: "#bbb",
    fontWeight: 400,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  fab: {
    position: "absolute",
    bottom: "24px",
    right: "24px",
    width: "48px",
    height: "48px",
    background: "#FF441F",
    border: "none",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 10,
    boxShadow: "0 4px 14px rgba(255,68,31,0.4)",
  },
};