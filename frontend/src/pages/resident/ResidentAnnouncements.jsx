import { useState, useEffect } from "react";
import COLORS from "../../constants/colors";
import { Badge, Btn } from "../../components/UI";
import Icon from "../../components/Icon";
import { api } from "../../api";

// ─── Priority config ──────────────────────────────────────────────────────────
const PRIORITY_CONFIG = {
  "High Priority":   { icon: "alert",    color: "#EF4444", bg: "#FEF2F2" },
  "Medium Priority": { icon: "calendar", color: "#F59E0B", bg: "#FFFBEB" },
  "Low Priority":    { icon: "bell",     color: "#3B82F6", bg: "#EFF6FF" },
};

const PRIORITIES = ["All Priorities", "High Priority", "Medium Priority", "Low Priority"];

// Maps DB enum values → display labels (matches OfficerAnnouncements)
const DB_TO_PRIORITY = {
  "High":   "High Priority",
  "Medium": "Medium Priority",
  "Low":    "Low Priority",
};

// ─── Normalize backend → frontend ────────────────────────────────────────────
function normalize(a) {
  return {
    id:    a.id,
    tag:   DB_TO_PRIORITY[a.tag] ?? DB_TO_PRIORITY[a.priority] ?? a.tag ?? a.priority ?? "Low Priority",
    title: a.title ?? a.name    ?? "",
    body:  a.body  ?? a.message ?? a.content ?? "",
    date:  a.date
      ? new Date(a.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
      : a.created_at
        ? new Date(a.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
        : "—",
  };
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: "20px 24px" }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        .ra-sk { background:linear-gradient(90deg,#f0f0f0 25%,#fafafa 50%,#f0f0f0 75%); background-size:800px 100%; animation:shimmer 1.4s infinite; border-radius:6px; }
      `}</style>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div className="ra-sk" style={{ width: 56, height: 56, borderRadius: 12, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="ra-sk" style={{ width: 80, height: 18, marginBottom: 10 }} />
          <div className="ra-sk" style={{ width: "55%", height: 16, marginBottom: 8 }} />
          <div className="ra-sk" style={{ width: "100%", height: 12, marginBottom: 5 }} />
          <div className="ra-sk" style={{ width: "80%", height: 12 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, flexShrink: 0 }}>
          <div className="ra-sk" style={{ width: 70, height: 14 }} />
          <div className="ra-sk" style={{ width: 90, height: 32, borderRadius: 8 }} />
        </div>
      </div>
    </div>
  );
}

// ─── Detail modal ─────────────────────────────────────────────────────────────
function DetailModal({ item, onClose }) {
  const cfg = PRIORITY_CONFIG[item.tag] ?? PRIORITY_CONFIG["Low Priority"];
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(15,23,42,0.45)", backdropFilter: "blur(3px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 520,
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        display: "flex", flexDirection: "column", maxHeight: "90vh",
      }}>
        {/* Modal header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 0" }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: COLORS.text }}>Announcement</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textMid, fontSize: 20, lineHeight: 1, padding: 4, borderRadius: 6 }}>×</button>
        </div>

        {/* Modal body */}
        <div style={{ padding: "20px 24px 28px", overflowY: "auto" }}>
          {/* Priority + date row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: cfg.bg, color: cfg.color,
              borderRadius: 20, padding: "5px 12px", fontSize: 12, fontWeight: 700,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.color }} />
              {item.tag}
            </span>
            <span style={{ fontSize: 12, color: COLORS.textMid, display: "flex", alignItems: "center", gap: 4 }}>
              <Icon name="calendar" size={12} color={COLORS.textMid} />
              {item.date}
            </span>
          </div>

          {/* Title */}
          <h3 style={{ margin: "0 0 14px", fontSize: 18, fontWeight: 800, color: COLORS.text, lineHeight: 1.3 }}>
            {item.title}
          </h3>

          {/* Body */}
          <p style={{ margin: 0, fontSize: 14, color: COLORS.textMid, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
            {item.body}
          </p>

          {/* Close button */}
          <div style={{ marginTop: 28, display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={onClose}
              style={{
                background: COLORS.primary, color: "#fff", border: "none",
                padding: "10px 24px", borderRadius: 8, fontWeight: 700,
                fontSize: 13, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ResidentAnnouncements({ setView }) {
  const [loading, setLoading]     = useState(true);
  const [items, setItems]         = useState([]);
  const [priorityFilter, setFilter] = useState("All Priorities");
  const [selected, setSelected]   = useState(null);

  useEffect(() => {
    api.getAnnouncements()
      .then(data => setItems(data.map(normalize)))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = priorityFilter === "All Priorities"
    ? items
    : items.filter(a => a.tag === priorityFilter);

  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .ra-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .ra-card-right { display: none !important; }
          .ra-card-date { display: none !important; }
        }
        .ra-read-btn:hover { opacity: 0.88; }
      `}</style>

      <div style={{ padding: "28px 24px" }}>

        {/* ── Header row ── */}
        <div className="ra-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <p style={{ margin: 0, fontSize: 13, color: COLORS.textMid }}>
            Stay updated with the latest news and important updates from your HOA.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Priority filter */}
            <div style={{ position: "relative" }}>
              <select
                value={priorityFilter}
                onChange={e => setFilter(e.target.value)}
                style={{
                  padding: "8px 36px 8px 14px", borderRadius: 8,
                  border: `1.5px solid ${COLORS.border}`, fontSize: 13,
                  fontFamily: "inherit", appearance: "none",
                  background: "#fff", color: COLORS.text,
                  cursor: "pointer", fontWeight: 500,
                }}
              >
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
              <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: COLORS.textMid, fontSize: 11 }}>▾</div>
            </div>

            {/* Total badge */}
            <span style={{ fontSize: 12, color: COLORS.primary, background: COLORS.primaryBg, borderRadius: 20, padding: "6px 14px", fontWeight: 600, whiteSpace: "nowrap" }}>
              {filtered.length} total
            </span>
          </div>
        </div>

        {/* ── List ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {loading ? (
            [1, 2, 3].map(i => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 24px", background: "#fff", borderRadius: 14, border: `1px solid ${COLORS.border}` }}>
              <div style={{ background: COLORS.primaryBg, borderRadius: "50%", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Icon name="bell" size={28} color={COLORS.primary} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.text, marginBottom: 6 }}>No Announcements Yet</div>
              <div style={{ fontSize: 13, color: COLORS.textMid }}>Check back later for HOA updates and notices.</div>
            </div>
          ) : (
            filtered.map(a => {
              const cfg = PRIORITY_CONFIG[a.tag] ?? PRIORITY_CONFIG["Low Priority"];
              return (
                <div key={a.id} style={{
                  background: "#fff", borderRadius: 14,
                  border: `1px solid ${COLORS.border}`,
                  padding: "20px 24px",
                  display: "flex", alignItems: "center", gap: 20,
                }}>
                  {/* Priority icon */}
                  <div style={{
                    background: cfg.bg, borderRadius: 12,
                    width: 56, height: 56,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <Icon name={cfg.icon} size={26} color={cfg.color} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ marginBottom: 6 }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        background: cfg.bg, color: cfg.color,
                        borderRadius: 20, padding: "3px 10px",
                        fontSize: 11, fontWeight: 700,
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: cfg.color }} />
                        {a.tag}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.text, marginBottom: 4 }}>{a.title}</div>
                    <p style={{
                      fontSize: 13, color: COLORS.textMid, margin: 0, lineHeight: 1.6,
                      display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                      {a.body}
                    </p>
                  </div>

                  {/* Right: date + Read More */}
                  <div className="ra-card-right" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12, flexShrink: 0 }}>
                    <div className="ra-card-date" style={{ display: "flex", alignItems: "center", gap: 6, color: COLORS.textMid, fontSize: 12 }}>
                      <Icon name="calendar" size={13} color={COLORS.textMid} />
                      {a.date}
                    </div>
                    <button
                      className="ra-read-btn"
                      onClick={() => setSelected(a)}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        background: COLORS.primary, color: "#fff",
                        border: "none", borderRadius: 8,
                        padding: "8px 16px", fontSize: 13, fontWeight: 700,
                        cursor: "pointer", fontFamily: "inherit",
                        transition: "opacity .15s",
                      }}
                    >
                      Read More
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Detail modal ── */}
      {selected && <DetailModal item={selected} onClose={() => setSelected(null)} />}
    </>
  );
}