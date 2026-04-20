// ─────────────────────────────────────────────────────────────────────────────
// StoreStatusList.jsx — Lista de tiendas con indicador de estado
//
// PROPS:
//   stores {Array} — lista de tiendas con forma:
//     [{ name: string, online: boolean }]
//
// INTEGRACIÓN CON BACKEND:
//   Los datos vienen del endpoint GET /api/stores
//   y se filtran en Dashboard.jsx según los filtros activos
//   antes de pasarlos a este componente como prop
// ─────────────────────────────────────────────────────────────────────────────

export default function StoreStatusList({ stores }) {
    return (
      <div style={styles.list}>
        {stores.map((store) => (
          <div key={store.name} style={styles.row}>
            <span style={styles.name}>{store.name}</span>
            <span
              style={{
                ...styles.badge,
                background: store.online ? "#DCFCE7" : "#FEE2E2",
                color: store.online ? "#166534" : "#991B1B",
              }}
            >
              {store.online ? "Online" : "Offline"}
            </span>
          </div>
        ))}
      </div>
    );
  }
  
  const styles = {
    list: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    row: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: "12px",
    },
    name: {
      color: "#666",
    },
    badge: {
      fontSize: "10px",
      fontWeight: 500,
      padding: "2px 10px",
      borderRadius: "20px",
    },
  };