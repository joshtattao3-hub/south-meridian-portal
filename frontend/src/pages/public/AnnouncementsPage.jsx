import { useState, useEffect } from "react";
import COLORS from "../../constants/colors";
import { Badge, Card, Btn } from "../../components/UI";
import Icon from "../../components/Icon";
import { api } from "../../api";

const PRIORITY_ICONS = {
  "High Priority":   "alert",
  "Medium Priority": "calendar",
  "Low Priority":    "bell",
  "General":         "bell",
};

function SkeletonCard() {
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: "1.5rem" }}>
      <style>{`@keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} } .shimmer{background:linear-gradient(90deg,${COLORS.border} 25%,#f0f0f0 50%,${COLORS.border} 75%);background-size:800px 100%;animation:shimmer 1.4s infinite;border-radius:6px;}`}</style>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div className="shimmer" style={{ width: 80, height: 20 }} />
        <div className="shimmer" style={{ width: 60, height: 20 }} />
      </div>
      <div className="shimmer" style={{ width: "60%", height: 18, marginBottom: 10 }} />
      <div className="shimmer" style={{ width: "100%", height: 13, marginBottom: 6 }} />
      <div className="shimmer" style={{ width: "85%", height: 13 }} />
    </div>
  );
}

export default function AnnouncementsPage({ setView }) {
  const [loading, setLoading]       = useState(true);
  const [items, setItems]           = useState([]);
  const [priorityFilter, setPriority] = useState("All Priorities");

  useEffect(() => {
    api.getAnnouncements()
      .then(data => setItems(data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const priorities = ["All Priorities", "High Priority", "Medium Priority", "Low Priority"];

  const filtered = priorityFilter === "All Priorities"
    ? items
    : items.filter(a => a.tag === priorityFilter);

  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .ann-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
        }
      `}</style>
      <div style={{ padding: "28px 24px" }}>

        {/* Header row */}
        <div className="ann-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <p style={{ margin: 0, fontSize: 13, color: COLORS.textMid }}>
            Stay updated with the latest news and important updates from your HOA.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Priority filter */}
            <div style={{ position: "relative" }}>
              <select
                value={priorityFilter}
                onChange={e => setPriority(e.target.value)}
                style={{
                  padding: "8px 36px 8px 14px", borderRadius: 8,
                  border: `1.5px solid ${COLORS.border}`, fontSize: 13,
                  fontFamily: "inherit", appearance: "none",
                  background: "#fff", color: COLORS.text, cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                {priorities.map(p => <option key={p}>{p}</option>)}
              </select>
              <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: COLORS.textMid, fontSize: 11 }}>▾</div>
            </div>
            {/* Total badge */}
            <span style={{ fontSize: 12, color: COLORS.primary, background: COLORS.primaryBg, borderRadius: 20, padding: "6px 14px", fontWeight: 600, whiteSpace: "nowrap" }}>
              {filtered.length} total
            </span>
          </div>
        </div>

        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {loading ? (
            [1,2,3].map(i => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 24px", background: "#fff", borderRadius: 14, border: `1px solid ${COLORS.border}` }}>
              <div style={{ background: COLORS.primaryBg, borderRadius: "50%", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Icon name="bell" size={28} color={COLORS.primary} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.text, marginBottom: 6 }}>No Announcements Yet</div>
              <div style={{ fontSize: 13, color: COLORS.textMid }}>Check back later for HOA updates and notices.</div>
            </div>
          ) : (
            filtered.map(a => (
              <div key={a.id} style={{ background: "#fff", borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: "20px 24px", display: "flex", alignItems: "center", gap: 20 }}>
                {/* Icon */}
                <div style={{ background: COLORS.primaryBg, borderRadius: 12, width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={PRIORITY_ICONS[a.tag] ?? "bell"} size={26} color={COLORS.primary} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <Badge label={a.tag} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.text, marginBottom: 4 }}>{a.title}</div>
                  <p style={{ fontSize: 13, color: COLORS.textMid, margin: 0, lineHeight: 1.6 }}>{a.body}</p>
                </div>

                {/* Right: date + button */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12, flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: COLORS.textMid, fontSize: 12 }}>
                    <Icon name="calendar" size={13} color={COLORS.textMid} />
                    {a.date}
                  </div>
                  <Btn small onClick={() => setView?.("login")}
                    style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    Read More
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </Btn>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}