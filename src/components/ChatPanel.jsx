import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8081";

const CHAT_ENDPOINT = `${API_BASE_URL}/api/chat`;

const suggestions = [
  { label: "¿Cuál fue el día con más tiendas?", text: "¿Cuál fue el día con más tiendas activas?" },
  { label: "¿A qué hora hay más disponibilidad?", text: "¿A qué hora hay más tiendas disponibles?" },
  { label: "Resumen del 6 de febrero", text: "Dame el resumen del 6 de febrero de 2026" },
  { label: "¿Cuántos datos tiene el dataset?", text: "¿Cuántos datos tiene el dataset?" },
];

export const PANEL_W = 368;

function timeStr() {
  const n = new Date();
  return `${n.getHours()}:${String(n.getMinutes()).padStart(2, "0")}`;
}

function normalizeChatResponse(data) {
  if (!data || typeof data !== "object") {
    return { response: "El backend respondió en un formato no válido.", toolUsed: null };
  }
  return {
    response:
      typeof data.response === "string" && data.response.trim()
        ? data.response.trim()
        : "No se recibió una respuesta válida del backend.",
    toolUsed: typeof data.toolUsed === "string" ? data.toolUsed : null,
  };
}

function TypingDots() {
  return (
    <div style={styles.typingWrap}>
      <span style={{ ...styles.dot, animationDelay: "0s" }} />
      <span style={{ ...styles.dot, animationDelay: "0.18s" }} />
      <span style={{ ...styles.dot, animationDelay: "0.36s" }} />
    </div>
  );
}

function BotAvatar() {
  return (
    <div style={styles.avatar}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" fill="#FF441F" />
        <path
          d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
          stroke="#FF441F"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function ChatPanelLayout({ open, onClose, isMobile, children }) {
  return (
    <>
      <style>{globalStyles}</style>
      <div
        style={{
          marginRight: !isMobile && open ? `${PANEL_W}px` : "0",
          transition: "margin-right 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {children}
      </div>
      <ChatPanel open={open} onClose={onClose} isMobile={isMobile} />
      {isMobile && open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(3px)",
            zIndex: 998,
          }}
        />
      )}
    </>
  );
}

export default function ChatPanel({ open, onClose, isMobile }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 350);
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

    setMessages((prev) => [...prev, { role: "user", text, time: timeStr() }]);
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

  const panelStyle = isMobile
    ? {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "90vh",
        background: "#FAFAF8",
        borderRadius: "20px 20px 0 0",
        borderTop: "1px solid rgba(0,0,0,0.07)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 -12px 48px rgba(0,0,0,0.12)",
        zIndex: 999,
        transform: open ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: open ? "auto" : "none",
      }
    : {
        position: "fixed",
        top: "0px",
        right: "0px",
        bottom: "0px",
        width: `${PANEL_W}px`,
        background: "#F7F6F3",
        borderLeft: "1px solid rgba(0,0,0,0.07)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 9999,
        boxShadow: "-8px 0 40px rgba(0,0,0,0.08)",
        transform: open ? "translateX(0)" : `translateX(${PANEL_W + 10}px)`,
        transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: open ? "auto" : "none",
      };

  return (
    <div style={panelStyle} className={!isMobile ? "chat-panel-fixed" : ""}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logoMark}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" fill="#FF441F" />
              <path
                d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                stroke="#FF441F"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <div style={styles.headerTitle}>Rappi Insight</div>
            <div style={styles.headerSub}>
              <span style={styles.statusDot} />
              {loading ? "Consultando datos…" : "Agente conectado"}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="chat-close-btn"
          style={styles.closeBtn}
          onClick={onClose}
          aria-label="Cerrar chat"
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path
              d="M1 1l10 10M11 1L1 11"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div style={styles.accentLine}>
        <div style={styles.accentShimmer} />
      </div>

      {messages.length === 0 && (
        <div style={styles.welcome}>
          <div className="chat-welcome-icon" style={styles.welcomeIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4.5" fill="#FF441F" />
              <path
                d="M3.5 21c0-4.7 3.8-8 8.5-8s8.5 3.3 8.5 8"
                stroke="#FF441F"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div style={styles.welcomeTitle}>Asistente de datos</div>
          <div style={styles.welcomeText}>
            Pregúntame sobre disponibilidad de tiendas, tendencias,
            patrones horarios y resúmenes por fecha.
          </div>
        </div>
      )}

      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <div
            key={`${msg.role}-${i}-${msg.time}`}
            className="chat-msg-in"
            style={{
              ...styles.msgRow,
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            {msg.role === "ai" && <BotAvatar />}
            <div
              style={{
                ...styles.bubble,
                ...(msg.role === "user" ? styles.userBubble : styles.aiBubble),
                ...(msg.error ? styles.errorBubble : {}),
              }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p style={{ margin: "3px 0" }}>{children}</p>,
                  strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
                  ul: ({ children }) => <ul style={{ paddingLeft: "16px", margin: "6px 0" }}>{children}</ul>,
                  li: ({ children }) => <li style={{ marginBottom: "3px" }}>{children}</li>,
                  code: ({ children }) => (
                    <code
                      style={{
                        background: "rgba(0,0,0,0.06)",
                        padding: "2px 5px",
                        borderRadius: "4px",
                        fontSize: "11px",
                      }}
                    >
                      {children}
                    </code>
                  ),
                }}
              >
                {msg.text}
              </ReactMarkdown>

              {msg.toolUsed && (
                <div style={styles.toolBadge}>
                  <span style={styles.toolDot} />
                  {msg.toolUsed}
                </div>
              )}

              <div
                style={{
                  ...styles.time,
                  color:
                    msg.role === "user"
                      ? "rgba(255,255,255,0.5)"
                      : "rgba(0,0,0,0.28)",
                }}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div
            style={{ ...styles.msgRow, justifyContent: "flex-start" }}
            className="chat-msg-in"
          >
            <BotAvatar />
            <div style={{ ...styles.bubble, ...styles.aiBubble, padding: "13px 16px" }}>
              <TypingDots />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {messages.length === 0 && (
        <div style={styles.suggestions}>
          <div style={styles.suggestLabel}>Prueba preguntar</div>
          <div style={styles.suggestGrid}>
            {suggestions.map((s) => (
              <button
                key={s.label}
                type="button"
                className="chat-suggestion-btn"
                style={styles.suggestion}
                onClick={() => sendMessage(s.text)}
                disabled={loading}
              >
                <span style={styles.suggArrow}>›</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.inputWrap}>
        <div className="chat-input-inner" style={styles.inputInner}>
          <input
            ref={inputRef}
            style={styles.input}
            value={input}
            placeholder={loading ? "Esperando respuesta…" : "Escribe tu pregunta…"}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="chat-send-btn"
            style={styles.sendBtn}
            disabled={!input.trim() || loading}
            aria-label="Enviar"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <path
                d="M22 2L15 22L11 13L2 9L22 2Z"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div style={styles.inputHint}>
          Presiona <kbd style={styles.kbd}>Enter</kbd> para enviar
        </div>
      </form>
    </div>
  );
}

const globalStyles = `
  .chat-panel-fixed {
    position: fixed !important;
    top: 0 !important; right: 0 !important; bottom: 0 !important;
    margin: 0 !important; padding-top: 0 !important;
    border-top: none !important;
  }

  @keyframes dotBounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
    40% { transform: translateY(-5px); opacity: 1; }
  }
  @keyframes statusPulse {
    0% { opacity: 1; }
    50% { opacity: 0.4; }
    100% { opacity: 1; }
  }
  @keyframes msgIn {
    from { opacity: 0; transform: translateY(8px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes shimmerBar {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(500%); }
  }
  @keyframes welcomePop {
    from { opacity: 0; transform: scale(0.85) translateY(6px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  .chat-msg-in { animation: msgIn 0.22s cubic-bezier(0.34,1.2,0.64,1) both; }
  .chat-welcome-icon { animation: welcomePop 0.4s cubic-bezier(0.34,1.5,0.64,1) 0.1s both; }

  .chat-suggestion-btn {
    transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.15s !important;
  }
  .chat-suggestion-btn:hover:not(:disabled) {
    background: #FFF1EE !important;
    border-color: rgba(255,68,31,0.35) !important;
    color: #FF441F !important;
    transform: translateX(3px);
  }
  .chat-suggestion-btn:disabled { opacity: 0.45; cursor: not-allowed; }

  .chat-send-btn { transition: background 0.18s, transform 0.18s, box-shadow 0.18s; }
  .chat-send-btn:hover:not(:disabled) {
    background: #E63A18 !important;
    transform: scale(1.06);
    box-shadow: 0 6px 18px rgba(255,68,31,0.45) !important;
  }
  .chat-send-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .chat-close-btn { transition: background 0.18s, border-color 0.18s, color 0.18s, transform 0.18s; }
  .chat-close-btn:hover {
    background: #FFF1EE !important;
    border-color: rgba(255,68,31,0.3) !important;
    color: #FF441F !important;
    transform: rotate(90deg);
  }

  .chat-input-inner:focus-within {
    border-color: rgba(255,68,31,0.5) !important;
    box-shadow: 0 0 0 3px rgba(255,68,31,0.08) !important;
    background: #FFFFFF !important;
  }

  .chat-panel-fixed ::-webkit-scrollbar { width: 4px; }
  .chat-panel-fixed ::-webkit-scrollbar-track { background: transparent; }
  .chat-panel-fixed ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 2px; }
`;

const styles = {
  header: {
    padding: "0 16px",
    height: "64px",
    minHeight: "64px",
    background: "#FFFFFF",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0,
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoMark: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #FFF0EC 0%, #FFE4DC 100%)",
    border: "1px solid rgba(255,68,31,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: "13.5px",
    fontWeight: 700,
    color: "#111",
    letterSpacing: "-0.3px",
    lineHeight: "1.2",
  },
  headerSub: {
    fontSize: "11px",
    color: "#AAA",
    marginTop: "2px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  statusDot: {
    display: "inline-block",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#22C55E",
    animation: "statusPulse 2.4s ease-in-out infinite",
    flexShrink: 0,
  },
  closeBtn: {
    border: "1px solid rgba(0,0,0,0.09)",
    background: "transparent",
    borderRadius: "8px",
    width: "30px",
    height: "30px",
    cursor: "pointer",
    color: "#999",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    padding: 0,
  },
  accentLine: {
    height: "2px",
    background: "rgba(0,0,0,0.04)",
    overflow: "hidden",
    position: "relative",
    flexShrink: 0,
  },
  accentShimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "25%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255,68,31,0.6), transparent)",
    animation: "shimmerBar 2.8s ease-in-out infinite",
  },
  welcome: {
    padding: "28px 24px 16px",
    textAlign: "center",
    flexShrink: 0,
  },
  welcomeIcon: {
    width: "60px",
    height: "60px",
    background: "linear-gradient(135deg, #FFF0EC 0%, #FFE4DC 100%)",
    borderRadius: "18px",
    border: "1px solid rgba(255,68,31,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 14px",
    boxShadow: "0 4px 16px rgba(255,68,31,0.1)",
  },
  welcomeTitle: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#111",
    marginBottom: "8px",
    letterSpacing: "-0.3px",
  },
  welcomeText: {
    fontSize: "12.5px",
    lineHeight: 1.7,
    color: "#AAA",
    maxWidth: "240px",
    margin: "0 auto",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "16px 14px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  msgRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: "8px",
  },
  avatar: {
    width: "28px",
    height: "28px",
    borderRadius: "9px",
    background: "linear-gradient(135deg, #FFF0EC, #FFE4DC)",
    border: "1px solid rgba(255,68,31,0.12)",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: {
    maxWidth: "78%",
    padding: "10px 14px",
    fontSize: "12.5px",
    lineHeight: 1.65,
    wordBreak: "break-word",
    borderRadius: "16px",
  },
  userBubble: {
    background: "linear-gradient(135deg, #FF441F 0%, #FF6040 100%)",
    color: "#fff",
    borderBottomRightRadius: "5px",
    boxShadow: "0 4px 14px rgba(255,68,31,0.28)",
  },
  aiBubble: {
    background: "#FFFFFF",
    color: "#1A1A1A",
    border: "1px solid rgba(0,0,0,0.06)",
    borderBottomLeftRadius: "5px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  errorBubble: {
    background: "#FEF2F2",
    color: "#991B1B",
    border: "1px solid rgba(239,68,68,0.2)",
    boxShadow: "none",
  },
  toolBadge: {
    marginTop: "9px",
    fontSize: "10px",
    color: "#C2410C",
    background: "#FFF0EC",
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "3px 9px",
    borderRadius: "999px",
    fontWeight: 600,
    letterSpacing: "0.2px",
  },
  toolDot: {
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    background: "#FF441F",
    flexShrink: 0,
  },
  time: {
    marginTop: "6px",
    fontSize: "10px",
    letterSpacing: "0.1px",
  },
  typingWrap: {
    display: "flex",
    gap: "4px",
    alignItems: "center",
    height: "16px",
  },
  dot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#FF441F",
    display: "inline-block",
    animation: "dotBounce 1.2s ease-in-out infinite",
  },
  suggestions: {
    padding: "4px 14px 12px",
    flexShrink: 0,
  },
  suggestLabel: {
    fontSize: "10px",
    fontWeight: 700,
    color: "#CCC",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "8px",
    paddingLeft: "2px",
  },
  suggestGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  suggestion: {
    border: "1px solid rgba(0,0,0,0.07)",
    background: "#FFFFFF",
    borderRadius: "10px",
    padding: "9px 13px",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "12px",
    color: "#555",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: 500,
    width: "100%",
    boxSizing: "border-box",
  },
  suggArrow: {
    color: "#FF441F",
    fontWeight: 800,
    fontSize: "15px",
    lineHeight: 1,
    flexShrink: 0,
  },
  inputWrap: {
    padding: "10px 14px 12px",
    background: "#FFFFFF",
    borderTop: "1px solid rgba(0,0,0,0.05)",
    flexShrink: 0,
  },
  inputInner: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    background: "#F4F3F0",
    borderRadius: "12px",
    padding: "5px 5px 5px 14px",
    border: "1.5px solid transparent",
    transition: "all 0.2s ease",
  },
  input: {
    flex: 1,
    border: "none",
    background: "transparent",
    outline: "none",
    fontSize: "12.5px",
    color: "#1A1A1A",
    fontFamily: "inherit",
    padding: "6px 0",
    minWidth: 0,
  },
  sendBtn: {
    border: "none",
    borderRadius: "9px",
    width: "36px",
    height: "36px",
    background: "#FF441F",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 2px 10px rgba(255,68,31,0.3)",
  },
  inputHint: {
    marginTop: "7px",
    fontSize: "10px",
    color: "#CCC",
    textAlign: "center",
    letterSpacing: "0.1px",
  },
  kbd: {
    display: "inline-block",
    padding: "1px 5px",
    fontSize: "9px",
    background: "#F0EDE8",
    borderRadius: "4px",
    border: "1px solid rgba(0,0,0,0.1)",
    color: "#888",
    fontFamily: "inherit",
  },
};