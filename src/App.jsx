// ─────────────────────────────────────────────────────────────────────────────
// App.jsx — Punto de entrada principal de la aplicación
// Renderiza la página principal del dashboard
// ─────────────────────────────────────────────────────────────────────────────

import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import About from "./pages/About.jsx";
import Team from "./pages/Team.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/team" element={<Team />} />
      </Routes>
    </BrowserRouter>
  );
}