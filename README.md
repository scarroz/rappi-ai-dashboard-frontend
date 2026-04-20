# rappi-ai-dashboard-frontend

Interactive dashboard for visualizing store availability data and querying insights using AI. Built with React, this application provides charts, metrics, and a conversational interface that allows users to explore data using natural language.

---

## Vision General

Este proyecto representa el componente de visualizacion para el ecosistema de monitoreo de disponibilidad de tiendas. La aplicacion no solo opera como un tablero de control estatico, sino que integra una interfaz de consulta semantica que permite la exploracion de datos complejos mediante lenguaje natural.

---

## Especificaciones Tecnicas

* **Core:** React.js
* **Bundler:** Vite
* **Visualizacion:** Recharts / Chart.js
* **Estado y Comunicacion:** Axios para consumo de API REST
* **Ambiente de Desarrollo:** Node.js 18+

---

## Funcionalidades del Sistema

### Analitica de Disponibilidad
* Visualizacion de series temporales de uptime y downtime.
* Calculo de metricas globales de salud de tienda.
* Deteccion visual de patrones de falla por franjas horarias.
* Reportes consolidados diarios.

### Capa de Inteligencia Artificial
* Interfaz de chat integrada para analisis de datos.
* Traduccion de lenguaje natural a insights de negocio.
* Consultas sugeridas: "Tendencia general", "Horas de mayor criticidad", "Analisis de dias especificos".

---

## Instalacion y Despliegue Local

### Requisitos
* Node.js instalado localmente.
* Backend operativo en `http://localhost:8081`.

### Instrucciones
1.  Instalar dependencias:
    ```bash
    npm install
    ```
2.  Lanzar el entorno de desarrollo:
    ```bash
    npm run dev
    ```
3.  Acceso local:
    `http://localhost:5173`

---

## Arquitectura de Integracion

El frontend interactua directamente con el backend mediante dos ejes operativos:

1.  **Modulos de Analytics:** Consumo de arrays de datos crudos y procesados para la hidratacion de componentes graficos.
2.  **Agente de IA:** Puente de comunicacion para el envio de prompts y recepcion de respuestas basadas en el contexto de disponibilidad real.

---

## Filosofia de Diseño e Ingenieria

* **Eficiencia Cognitiva:** Interfaz centrada en el dato (Data-First), eliminando ruido visual para priorizar la lectura de metricas.
* **Precision de Datos (Anti-Hallucination):** La IA funciona como una capa semantica sobre datos previamente validados por el backend. El sistema interpreta, no inventa.
* **Arquitectura Desacoplada:** Separacion estricta entre la logica de presentacion y el procesamiento pesado de datos en el servidor.

---

## Extra

Este repositorio forma parte de una prueba tecnica controlada. El diseño y las configuraciones de red estan optimizados para ejecucion en localhost y evaluacion de arquitectura de integraciones.
