import { useState, useRef, useEffect } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8081";

const CHAT_ENDPOINT = `${API_BASE_URL}/api/chat`;

const suggestions = [
  { label: "¿Cuál fue el día con más tiendas?", text: "¿Cuál fue el día con más tiendas activas?" },
  { label: "¿A qué hora hay más disponibilidad?", text: "¿A qué hora hay más tiendas disponibles?" },
  { label: "Resumen del 6 de febrero", text: "Dame el resumen del 6 de febrero de 2026" },
  { label: "¿Cuántos datos tiene el dataset?", text: "¿Cuántos datos tiene el dataset?" },
];

function timeStr() {
  const n = new Date();
  return `${n.getHours()}:${String(n.getMinutes()).padStart(2, "0")}`;
}

function normalizeChatResponse(data) {
  if (!data || typeof data !== "object") {
    return {
      response: "El backend respondió en un formato no válido.",
      toolUsed: null,
    };
  }

  return {
    response:
      typeof data.response === "string" && data.response.trim()
        ? data.response.trim()
        : "No se recibió una respuesta válida del backend.",
    toolUsed: typeof data.toolUsed === "string" ? data.toolUsed : null,
  };
}

export default function ChatPanel({ open, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  async function sendMessage(rawText) {
    const text = rawText.trim();
    if (!text || loading) return;

    const userMessage = {
      role: "user",
      text,
      time: timeStr(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ message: text }),
        signal: abortRef.current.signal,
      });

      let data = null;
      let rawBody = "";

      try {
        rawBody = await res.text();
        data = rawBody ? JSON.parse(rawBody) : null;
      } catch {
        data = null;
      }

      if (!res.ok) {
        const backendMessage =
          data?.response ||
          data?.message ||
          `Error ${res.status}: ${res.statusText || "No se pudo procesar la solicitud."}`;

        throw new Error(backendMessage);
      }

      const normalized = normalizeChatResponse(data);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: normalized.response,
          time: timeStr(),
          toolUsed: normalized.toolUsed,
        },
      ]);
    } catch (error) {
      if (error.name === "AbortError") return;

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            error?.message ||
            "No pude conectar con el backend del chat. Verifica que esté corriendo y que CORS esté bien configurado.",
          time: timeStr(),
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  if (!open) return null;

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <div>
          <div style={styles.headerTitle}>Rappi Insight</div>
          <div style={styles.headerSub}>
            {loading ? "Consultando con el agente" : "Conectado al agente"}
          </div>
        </div>

        <button type="button" style={styles.closeBtn} onClick={onClose}>
          Cerrar
        </button>
      </div>

      {messages.length === 0 && (
        <div style={styles.welcome}>
          <div style={styles.welcomeTitle}>Asistente de datos</div>
          <div style={styles.welcomeText}>
            Puedes hacer preguntas sobre disponibilidad de tiendas, tendencias,
            patrones horarios y resúmenes por fecha.
          </div>
        </div>
      )}

      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <div
            key={`${msg.role}-${i}-${msg.time}`}
            style={{
              ...styles.msgRow,
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                ...styles.bubble,
                ...(msg.role === "user" ? styles.userBubble : styles.aiBubble),
                ...(msg.error ? styles.errorBubble : {}),
              }}
            >
              <div>{msg.text}</div>

              {msg.toolUsed && (
                <div style={styles.toolBadge}>Origen: {msg.toolUsed}</div>
              )}

              <div style={styles.time}>{msg.time}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.msgRow, justifyContent: "flex-start" }}>
            <div style={{ ...styles.bubble, ...styles.aiBubble }}>
              Escribiendo...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {messages.length === 0 && (
        <div style={styles.suggestions}>
          {suggestions.map((s) => (
            <button
              key={s.label}
              type="button"
              style={styles.suggestion}
              onClick={() => sendMessage(s.text)}
              disabled={loading}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ ...styles.inputRow, borderColor: focused ? "#FF441F" : "#ddd" }}>
        <input
          ref={inputRef}
          style={styles.input}
          value={input}
          placeholder={loading ? "Esperando respuesta..." : "Escribe tu pregunta..."}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={loading}
        />

        <button type="submit" style={styles.sendBtn} disabled={!input.trim() || loading}>
          Enviar
        </button>
      </form>
    </div>
  );
}

const styles = {
  panel: {
    width: "320px",
    height: "100%",
    background: "#F8F7F4",
    borderLeft: "1px solid #e9e9e9",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "14px 16px",
    borderBottom: "1px solid #ececec",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#1A1A1A",
  },
  headerSub: {
    fontSize: "11px",
    color: "#666",
    marginTop: "4px",
  },
  closeBtn: {
    border: "1px solid #ddd",
    background: "#fff",
    borderRadius: "8px",
    padding: "6px 10px",
    cursor: "pointer",
  },
  welcome: {
    padding: "18px 16px 8px",
  },
  welcomeTitle: {
    fontSize: "15px",
    fontWeight: 700,
    marginBottom: "6px",
    color: "#1A1A1A",
  },
  welcomeText: {
    fontSize: "12px",
    lineHeight: 1.5,
    color: "#666",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  msgRow: {
    display: "flex",
  },
  bubble: {
    maxWidth: "82%",
    padding: "10px 12px",
    borderRadius: "14px",
    fontSize: "12.5px",
    lineHeight: 1.55,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  userBubble: {
    background: "#FF441F",
    color: "#fff",
  },
  aiBubble: {
    background: "#fff",
    color: "#1A1A1A",
    border: "1px solid #eee",
  },
  errorBubble: {
    background: "#FEE2E2",
    color: "#991B1B",
    border: "1px solid #FCA5A5",
  },
  toolBadge: {
    marginTop: "8px",
    fontSize: "10px",
    color: "#9A3412",
    background: "#FFEDD5",
    display: "inline-block",
    padding: "3px 8px",
    borderRadius: "999px",
  },
  time: {
    marginTop: "6px",
    fontSize: "10px",
    color: "rgba(0,0,0,0.45)",
  },
  suggestions: {
    padding: "8px 12px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  suggestion: {
    border: "1px solid #e6e6e6",
    background: "#fff",
    borderRadius: "10px",
    padding: "9px 10px",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "12px",
  },
  inputRow: {
    display: "flex",
    gap: "8px",
    padding: "12px",
    borderTop: "1px solid #ececec",
    background: "#fff",
  },
  input: {
    flex: 1,
    border: "1px solid #ddd",
    borderRadius: "999px",
    padding: "10px 14px",
    outline: "none",
    fontSize: "12px",
  },
  sendBtn: {
    border: "none",
    borderRadius: "999px",
    padding: "0 14px",
    background: "#FF441F",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
};