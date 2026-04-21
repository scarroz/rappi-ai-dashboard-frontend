# rappi-ai-dashboard-frontend

Interactive dashboard for visualizing store availability data and querying insights using AI. Built with React, this application provides charts, metrics, and a conversational interface that allows users to explore data using natural language.

---

**Descripción**

Interface web que visualiza datos históricos de disponibilidad de tiendas Rappi y permite conversar con un agente de inteligencia artificial que analiza esos mismos datos en lenguaje natural.

---

## Vista general

El dashboard tiene tres secciones principales:

**Dashboard principal** — métricas en tiempo real, tres gráficas interactivas y una tabla resumen. Todo carga al arrancar consultando la API del backend.

**Chat con el agente** — panel lateral que se desliza desde la derecha. El agente se llama *Rappi Insight* y está potenciado por Gemma 4 E2B, un modelo de lenguaje de Google corriendo localmente. El usuario escribe en español y el agente responde con datos reales de la base de datos, no con información inventada.

**Páginas de contexto** — una página "Sobre el proyecto" que explica la arquitectura y las decisiones técnicas, y una página "Equipo" con información del autor.

---

## Stack tecnológico

| Tecnología | Versión | Para qué se usa |
|---|---|---|
| React | 19 | Framework de UI |
| Vite | 8 | Bundler y servidor de desarrollo |
| React Router DOM | 7 | Navegación entre páginas |
| Chart.js | 4 | Motor de gráficas |
| react-chartjs-2 | 5 | Wrapper de Chart.js para React |
| react-markdown + remark-gfm | latest | Renderiza el Markdown que devuelve el agente |

Sin librerías de estilos externas. Todo el CSS está escrito a mano con `style` objects de React y clases específicas — sin Tailwind, sin Bootstrap.

---

## Estructura del proyecto

```
rappi-dashboard/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   └── logorappi.png
│   ├── components/
│   │   ├── ChatPanel.jsx      — panel lateral del agente conversacional
│   │   ├── FilterBar.jsx      — barra de filtros del dashboard
│   │   ├── MetricCard.jsx     — tarjeta de KPI individual
│   │   ├── Sidebar.jsx        — navegación lateral con logo y links
│   │   ├── SkeletonCard.jsx   — placeholder animado para estados de carga
│   │   ├── StoreStatusList.jsx
│   │   └── Topbar.jsx         — barra superior
│   ├── pages/
│   │   ├── Dashboard.jsx      — página principal con todas las gráficas
│   │   ├── About.jsx          — descripción del proyecto y arquitectura
│   │   └── Team.jsx           — información del autor
│   ├── App.jsx                — router principal
│   ├── App.css                — estilos globales y animaciones
│   ├── index.css              — reset y variables base
│   └── main.jsx               — punto de entrada
├── .env                       — URL base de la API (VITE_API_BASE_URL)
├── index.html
├── package.json
└── vite.config.js
```

---

## Prerrequisitos

```bash
node --version   # Node 18+
npm --version    # npm 9+
```

El backend debe estar corriendo antes de levantar el frontend. Sin él, las gráficas muestran el estado de error y el chat no funciona.

---

## Instalación y arranque

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar la URL del backend

El archivo `.env` ya viene configurado. Si tu backend corre en un puerto distinto al 8081, edítalo:

```env
VITE_API_BASE_URL=http://localhost:8081
```

> Si el backend corre en el puerto 8080, cambia el valor a `http://localhost:8080`.

### 3. Levantar el servidor de desarrollo

```bash
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

### Para producción (opcional)

```bash
npm run build      # genera la carpeta dist/
npm run preview    # sirve el build localmente
```

---

## Qué muestra el dashboard

### Métricas KPI (fila superior)

Cuatro tarjetas que se llenan al cargar consultando `/api/analytics/stats`:

| Métrica | Descripción |
|---|---|
| Máx. tiendas visibles | El pico más alto registrado en los 11 días |
| Promedio tiendas visibles | Promedio global de todo el período |
| Mín. tiendas visibles | El valor más bajo registrado |
| Total mediciones | ~67,141 puntos (uno cada 10 segundos) |

Mientras cargan los datos, cada tarjeta muestra un skeleton animado en lugar de números en blanco.

### Gráficas (zona central)

**Serie de tiempo** — gráfica de área que muestra la evolución de tiendas visibles durante un día específico. Tiene un selector de fecha con los 11 días del dataset. Al cambiar la fecha, hace una nueva consulta a `/api/analytics/timeseries?date=YYYY-MM-DD`.

**Patrón horario** — gráfica de línea que muestra el promedio de tiendas visibles por hora del día (de 00:00 a 23:00), calculado sobre todos los 11 días. Muestra en un badge la hora pico con su valor. Datos de `/api/analytics/hourly-pattern`.

**Promedio diario** — gráfica de barras con el promedio por día del período completo. Permite ver de un vistazo qué días tuvieron más o menos actividad. Datos de `/api/analytics/trend`.

**Resumen por día** — tabla con los 11 días mostrando avg, máx, mín y cantidad de puntos. Compacta y scrolleable.

### Chat con el agente

Se abre desde el botón flotante naranja (esquina inferior derecha) o desde "Chat Asistente" en la sidebar.

El panel tiene:
- **Sugerencias de preguntas** al abrirlo por primera vez — el usuario puede hacer clic en ellas directamente
- **Indicador de escritura** (tres puntos animados) mientras el agente procesa
- **Badge de tool usada** debajo de cada respuesta cuando el agente consultó la base de datos
- **Renderizado Markdown** — el agente puede responder con tablas, negritas y listas que se muestran correctamente
- **Soporte móvil** — en pantallas pequeñas el panel se desliza desde abajo como un sheet

---

## Cómo funciona el chat internamente

El `ChatPanel.jsx` hace un `POST` al endpoint `/api/chat` del backend con el mensaje del usuario:

```json
{ "message": "¿Cuál fue el día con más tiendas activas?" }
```

El backend procesa la pregunta con Gemma 4 E2B, que decide qué herramienta de datos invocar, consulta PostgreSQL, y devuelve la respuesta:

```json
{
  "response": "El día con mayor actividad fue el jueves 5 de febrero...",
  "toolUsed": "get_daily_trend"
}
```

El frontend normaliza la respuesta, la renderiza como Markdown y muestra el nombre de la tool usada como un badge pequeño debajo del mensaje. Si el backend no responde, muestra un mensaje de error claro en lugar de quedar colgado.

---

## Diseño y decisiones de UI

**Paleta de colores** — naranja Rappi (`#FF441F`) como color primario para la sidebar, el botón de chat y los elementos de acción. Fondo crema (`#F0EEE9`) para el dashboard, blanco para los paneles.

**Tipografía** — `Playfair Display` (serif) para los números grandes y títulos principales. `DM Sans` (sans-serif) para todo el texto de interfaz. La combinación da un tono analítico pero accesible.

**Responsive** — la sidebar colapsa en móvil con un botón hamburguesa. El chat se convierte en un bottom sheet. Las gráficas mantienen su proporción con `maintainAspectRatio: false`.

**Skeleton loading** — en lugar de spinners, cada sección muestra un placeholder con animación shimmer mientras espera datos del backend. Esto evita que la interfaz "salte" cuando llegan los datos.

**Animaciones de entrada** — cada sección del dashboard aparece con un `fade-up` escalonado (`fade-up-1` a `fade-up-4`) definido en `App.css`. Hace que la carga se sienta fluida en lugar de todo apareciendo de golpe.

---

## Variables de entorno

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8081` | URL base del backend Spring Boot |

---

## Preguntas de prueba para el chat

```
¿Cuál fue el día con más tiendas activas?
¿A qué hora hay más tiendas disponibles?
Dame el resumen del 6 de febrero de 2026
¿Cuántos datos tiene el dataset?
Analiza los datos y dame insights
¿Hay alguna anomalía en el período?
¿Cómo se comparan los fines de semana con los días de semana?
```

---

## Autor

**Sebastián Carroz** — Ingeniería de Sistemas, Universidad El Bosque  
RappiMakers 2026
