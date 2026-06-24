import { useState } from "react";
import COLORS from "../../constants/colors";
import Icon from "../../components/Icon";
import { useAuth } from "../../context/AuthContext";

// ─── Utility ────────────────────────────────────────────────────────────────
function fmt(n) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)   return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, accent, trend, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1, minWidth: 160,
        background: "#fff",
        border: `1.5px solid ${hovered && onClick ? accent ?? COLORS.primary : COLORS.border}`,
        borderRadius: 16,
        padding: "20px 22px",
        cursor: onClick ? "pointer" : "default",
        transition: "border-color 0.18s, box-shadow 0.18s",
        boxShadow: hovered && onClick ? `0 4px 20px ${(accent ?? COLORS.primary)}18` : "none",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* background tint blob */}
      <div style={{
        position: "absolute", top: -20, right: -20,
        width: 80, height: 80, borderRadius: "50%",
        background: `${accent ?? COLORS.primary}10`,
        pointerEvents: "none",
      }} />
      <div style={{
        width: 38, height: 38, borderRadius: 11,
        background: `${accent ?? COLORS.primary}18`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 14,
      }}>
        <Icon name={icon} size={18} color={accent ?? COLORS.primary} />
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.text, lineHeight: 1 }}>{fmt(value)}</div>
      <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 4, fontWeight: 500 }}>{label}</div>
      {(sub || trend) && (
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
          {trend !== undefined && (
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: trend >= 0 ? "#16a34a" : COLORS.danger,
              background: trend >= 0 ? "#f0fdf4" : COLORS.dangerBg,
              border: `1px solid ${trend >= 0 ? "#86efac" : `${COLORS.danger}30`}`,
              borderRadius: 20, padding: "2px 7px",
            }}>
              {trend >= 0 ? "+" : ""}{trend}%
            </span>
          )}
          {sub && <span style={{ fontSize: 11, color: COLORS.textLight }}>{sub}</span>}
        </div>
      )}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ icon, title, subtitle, action, accent }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: `${accent ?? COLORS.primary}18`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon name={icon} size={15} color={accent ?? COLORS.primary} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 1 }}>{subtitle}</div>}
        </div>
      </div>
      {action}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({ label, color, bg, border }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20,
      color: color, background: bg, border: `1px solid ${border}`,
      whiteSpace: "nowrap", letterSpacing: 0.3,
    }}>{label}</span>
  );
}

const STATUS_MAP = {
  paid:       { label: "Paid",       color: "#166534", bg: "#f0fdf4", border: "#86efac" },
  unpaid:     { label: "Unpaid",     color: COLORS.danger, bg: "#fef2f2", border: `${COLORS.danger}40` },
  overdue:    { label: "Overdue",    color: "#92400e", bg: "#fffbeb", border: "#fcd34d" },
  open:       { label: "Open",       color: "#1d4ed8", bg: "#eff6ff", border: "#93c5fd" },
  inprogress: { label: "In Progress",color: "#6d28d9", bg: "#f5f3ff", border: "#c4b5fd" },
  resolved:   { label: "Resolved",   color: "#166534", bg: "#f0fdf4", border: "#86efac" },
  pending:    { label: "Pending",    color: "#92400e", bg: "#fffbeb", border: "#fcd34d" },
  approved:   { label: "Approved",   color: "#166534", bg: "#f0fdf4", border: "#86efac" },
  cancelled:  { label: "Cancelled",  color: "#6b7280", bg: "#f9fafb", border: "#d1d5db" },
  active:     { label: "Active",     color: "#166534", bg: "#f0fdf4", border: "#86efac" },
  inactive:   { label: "Inactive",   color: "#6b7280", bg: "#f9fafb", border: "#d1d5db" },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] ?? { label: status, color: COLORS.textLight, bg: "#f3f4f6", border: COLORS.border };
  return <Badge label={s.label} color={s.color} bg={s.bg} border={s.border} />;
}

// ─── Panel Card ───────────────────────────────────────────────────────────────
function Panel({ children, style }) {
  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${COLORS.border}`,
      borderRadius: 16, overflow: "hidden",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Quick Action Button ──────────────────────────────────────────────────────
function QuickAction({ icon, label, accent, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        padding: "16px 14px", borderRadius: 14, border: `1.5px solid ${hov ? accent : COLORS.border}`,
        background: hov ? `${accent}08` : "#fff",
        cursor: "pointer", flex: 1, minWidth: 90,
        transition: "all 0.15s", fontFamily: "inherit",
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: hov ? `${accent}20` : `${accent}12`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon name={icon} size={18} color={accent} />
      </div>
      <span style={{ fontSize: 11.5, fontWeight: 600, color: hov ? accent : COLORS.text, textAlign: "center", lineHeight: 1.3 }}>{label}</span>
    </button>
  );
}

// ─── Announcement Compose Modal ───────────────────────────────────────────────
function AnnounceModal({ onClose, onPost }) {
  const [title, setTitle]   = useState("");
  const [body, setBody]     = useState("");
  const [tag, setTag]       = useState("general");
  const [posting, setPost]  = useState(false);

  const TAGS = [
    { value: "general",     label: "General",     color: COLORS.primary },
    { value: "dues",        label: "Dues",        color: "#16a34a"      },
    { value: "complaints",  label: "Complaints",  color: COLORS.danger  },
    { value: "reservations",label: "Reservations",color: "#7c3aed"      },
  ];

  async function handlePost() {
    if (!title.trim() || !body.trim()) return;
    setPost(true);
    await new Promise(r => setTimeout(r, 800)); // simulate API
    onPost({ title, body, tag, date: new Date().toISOString() });
    setPost(false);
    onClose();
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.35)", backdropFilter: "blur(3px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "#fff", borderRadius: 20, width: "100%", maxWidth: 540,
        boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px", borderBottom: `1px solid ${COLORS.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: `${COLORS.primary}06`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: `${COLORS.primary}18`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name="bell" size={15} color={COLORS.primary} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>New Announcement</div>
              <div style={{ fontSize: 12, color: COLORS.textLight }}>Post to all residents</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            width: 32, height: 32, borderRadius: 8, display: "flex",
            alignItems: "center", justifyContent: "center",
            color: COLORS.textLight, fontSize: 18,
          }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: "22px 24px" }}>
          {/* Category tags */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textLight, letterSpacing: 0.4, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Category</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {TAGS.map(t => (
                <button key={t.value} onClick={() => setTag(t.value)} style={{
                  padding: "6px 14px", borderRadius: 20,
                  border: `1.5px solid ${tag === t.value ? t.color : COLORS.border}`,
                  background: tag === t.value ? `${t.color}12` : "#fff",
                  color: tag === t.value ? t.color : COLORS.textLight,
                  fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.15s",
                }}>{t.label}</button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textLight, letterSpacing: 0.4, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. July Dues Reminder"
              style={{
                width: "100%", padding: "10px 13px", borderRadius: 9,
                border: `1.5px solid ${COLORS.border}`,
                fontSize: 13.5, fontFamily: "inherit", boxSizing: "border-box",
                color: COLORS.text, outline: "none",
              }}
              onFocus={e => e.target.style.borderColor = COLORS.primary}
              onBlur={e => e.target.style.borderColor = COLORS.border}
            />
          </div>

          {/* Message */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textLight, letterSpacing: 0.4, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Message</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Write your announcement here…"
              rows={5}
              style={{
                width: "100%", padding: "10px 13px", borderRadius: 9,
                border: `1.5px solid ${COLORS.border}`,
                fontSize: 13, fontFamily: "inherit", boxSizing: "border-box",
                color: COLORS.text, outline: "none", resize: "vertical", lineHeight: 1.6,
              }}
              onFocus={e => e.target.style.borderColor = COLORS.primary}
              onBlur={e => e.target.style.borderColor = COLORS.border}
            />
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={onClose} style={{
              padding: "10px 20px", borderRadius: 9, border: `1.5px solid ${COLORS.border}`,
              background: "#fff", fontSize: 13, fontWeight: 600,
              cursor: "pointer", color: COLORS.text, fontFamily: "inherit",
            }}>Cancel</button>
            <button onClick={handlePost} disabled={posting || !title.trim() || !body.trim()} style={{
              padding: "10px 22px", borderRadius: 9, border: "none",
              background: (!title.trim() || !body.trim()) ? "#e5e7eb" : COLORS.primary,
              color: (!title.trim() || !body.trim()) ? COLORS.textLight : "#fff",
              fontSize: 13, fontWeight: 600, fontFamily: "inherit",
              cursor: (!title.trim() || !body.trim() || posting) ? "not-allowed" : "pointer",
              opacity: posting ? 0.75 : 1, transition: "all 0.15s",
            }}>{posting ? "Posting…" : "Post Announcement"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_DUES = [
  { id: 1, resident: "Maria Santos",   unit: "A-101", amount: 2500, month: "June 2025",   status: "paid",    date: "2025-06-03" },
  { id: 2, resident: "Jose Reyes",     unit: "B-204", amount: 2500, month: "June 2025",   status: "unpaid",  date: null         },
  { id: 3, resident: "Ana Cruz",       unit: "C-312", amount: 2500, month: "June 2025",   status: "overdue", date: null         },
  { id: 4, resident: "Pedro Dela Cruz",unit: "A-108", amount: 2500, month: "June 2025",   status: "paid",    date: "2025-06-07" },
  { id: 5, resident: "Lina Gomez",     unit: "D-401", amount: 2500, month: "June 2025",   status: "unpaid",  date: null         },
];

const MOCK_COMPLAINTS = [
  { id: 1, resident: "Maria Santos",    unit: "A-101", subject: "Noisy neighbor after 10PM",      category: "Noise",       status: "open",       filed: "2025-06-10T09:30:00" },
  { id: 2, resident: "Jose Reyes",      unit: "B-204", subject: "Broken hallway light on 2F",     category: "Facilities",  status: "inprogress", filed: "2025-06-08T14:00:00" },
  { id: 3, resident: "Ana Cruz",        unit: "C-312", subject: "Pest sighting in laundry area",  category: "Sanitation",  status: "resolved",   filed: "2025-06-01T08:00:00" },
  { id: 4, resident: "Pedro Dela Cruz", unit: "A-108", subject: "Parking spot blocked",           category: "Parking",     status: "open",       filed: "2025-06-12T11:20:00" },
];

const MOCK_RESERVATIONS = [
  { id: 1, resident: "Lina Gomez",      unit: "D-401", facility: "Function Hall",  date: "Jun 28, 2025", time: "2:00 PM – 8:00 PM", status: "approved"  },
  { id: 2, resident: "Maria Santos",    unit: "A-101", facility: "Swimming Pool",  date: "Jun 22, 2025", time: "9:00 AM – 11:00 AM", status: "pending"   },
  { id: 3, resident: "Jose Reyes",      unit: "B-204", facility: "Basketball Court",date: "Jun 21, 2025", time: "6:00 PM – 8:00 PM", status: "pending"   },
  { id: 4, resident: "Ana Cruz",        unit: "C-312", facility: "Function Hall",  date: "Jun 15, 2025", time: "10:00 AM – 4:00 PM", status: "cancelled" },
];

const MOCK_RESIDENTS = [
  { id: 1, name: "Maria Santos",    unit: "A-101", email: "maria@email.com",  joined: "Jan 2024", status: "active"   },
  { id: 2, name: "Jose Reyes",      unit: "B-204", email: "jose@email.com",   joined: "Mar 2024", status: "active"   },
  { id: 3, name: "Ana Cruz",        unit: "C-312", email: "ana@email.com",    joined: "Feb 2024", status: "active"   },
  { id: 4, name: "Pedro Dela Cruz", unit: "A-108", email: "pedro@email.com",  joined: "Jun 2024", status: "inactive" },
  { id: 5, name: "Lina Gomez",      unit: "D-401", email: "lina@email.com",   joined: "May 2024", status: "active"   },
];

const INIT_ANNOUNCEMENTS = [
  { id: 1, title: "June Dues Deadline Reminder",       body: "Please settle your monthly dues on or before June 15. Late payments will incur a penalty of ₱200.",      tag: "dues",         date: "2025-06-01T08:00:00" },
  { id: 2, title: "Pool Maintenance this Saturday",    body: "The swimming pool will be closed for cleaning from 8AM–12PM on June 21. We apologize for the inconvenience.", tag: "reservations", date: "2025-06-09T10:00:00" },
  { id: 3, title: "Proper Trash Disposal Reminder",    body: "Please observe proper trash segregation. Violations will be noted in the community logbook.",               tag: "complaints",   date: "2025-06-11T09:00:00" },
];

const TAG_COLORS = {
  general:      COLORS.primary,
  dues:         "#16a34a",
  complaints:   "#dc2626",
  reservations: "#7c3aed",
};

// ─── Tab Button ───────────────────────────────────────────────────────────────
function Tab({ label, active, count, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 16px", borderRadius: 9, border: "none",
      background: active ? COLORS.primary : "transparent",
      color: active ? "#fff" : COLORS.textLight,
      fontSize: 13, fontWeight: 600, cursor: "pointer",
      fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6,
      transition: "all 0.15s",
    }}>
      {label}
      {count != null && (
        <span style={{
          fontSize: 10, fontWeight: 700, minWidth: 18, height: 18, borderRadius: 20,
          background: active ? "rgba(255,255,255,0.25)" : `${COLORS.primary}18`,
          color: active ? "#fff" : COLORS.primary,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          padding: "0 5px",
        }}>{count}</span>
      )}
    </button>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────
function Table({ heads, children }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: `1.5px solid ${COLORS.border}` }}>
            {heads.map(h => (
              <th key={h} style={{
                padding: "10px 16px", textAlign: "left",
                fontSize: 11, fontWeight: 600, color: COLORS.textLight,
                letterSpacing: 0.4, textTransform: "uppercase", whiteSpace: "nowrap",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function TR({ children, accent }) {
  const [hov, setHov] = useState(false);
  return (
    <tr
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderBottom: `1px solid ${COLORS.border}`,
        background: hov ? `${accent ?? COLORS.primary}05` : "transparent",
        transition: "background 0.12s",
      }}
    >{children}</tr>
  );
}

function TD({ children, bold, muted }) {
  return (
    <td style={{
      padding: "12px 16px", color: muted ? COLORS.textLight : COLORS.text,
      fontWeight: bold ? 700 : 400, verticalAlign: "middle",
    }}>{children}</td>
  );
}

// ─── Action Button (table) ────────────────────────────────────────────────────
function ActionBtn({ label, color, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "5px 12px", borderRadius: 7, border: `1.5px solid ${hov ? color : `${color}50`}`,
        background: hov ? `${color}12` : "transparent",
        color, fontSize: 11.5, fontWeight: 600, cursor: "pointer",
        fontFamily: "inherit", transition: "all 0.13s",
      }}
    >{label}</button>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name, size = 32 }) {
  const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const hue = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `hsl(${hue}, 60%, 88%)`,
      color: `hsl(${hue}, 60%, 35%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 700, flexShrink: 0,
    }}>{initials}</div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  OFFICER DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
export default function OfficerDashboard() {
  const { user } = useAuth();

  const [showModal, setShowModal]         = useState(false);
  const [announcements, setAnnouncements] = useState(INIT_ANNOUNCEMENTS);
  const [dues]                            = useState(MOCK_DUES);
  const [complaints]                      = useState(MOCK_COMPLAINTS);
  const [reservations]                    = useState(MOCK_RESERVATIONS);
  const [residents]                       = useState(MOCK_RESIDENTS);

  // Stats
  const totalResidents  = residents.length;
  const activeResidents = residents.filter(r => r.status === "active").length;
  const paidDues        = dues.filter(d => d.status === "paid").length;
  const unpaidDues      = dues.filter(d => d.status !== "paid").length;
  const openComplaints  = complaints.filter(c => c.status === "open").length;
  const pendingRes      = reservations.filter(r => r.status === "pending").length;

  function postAnnouncement(data) {
    setAnnouncements(prev => [{ id: Date.now(), ...data }, ...prev]);
  }

  return (
    <div style={{ padding: "28px 32px", width: "100%", boxSizing: "border-box", minHeight: "100vh", background: "#f8f9fb" }}>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textLight, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>
            Officer Portal
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: COLORS.text }}>
            Good day, {user?.first_name ?? "Officer"} 👋
          </h1>
          <p style={{ margin: "5px 0 0", fontSize: 13.5, color: COLORS.textLight }}>
            Here's what's happening in the community today.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "11px 20px", borderRadius: 11, border: "none",
            background: COLORS.primary, color: "#fff",
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            fontFamily: "inherit", boxShadow: `0 4px 14px ${COLORS.primary}40`,
            transition: "opacity 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          <Icon name="bell" size={14} color="#fff" />
          Post Announcement
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard icon="home"     label="Total Residents"  value={totalResidents}  sub={`${activeResidents} active`} trend={4}  accent={COLORS.primary} />
        <StatCard icon="settings" label="Dues Collected"   value={paidDues}        sub={`${unpaidDues} pending`}     trend={-8} accent="#16a34a"        />
        <StatCard icon="bell"     label="Open Complaints"  value={openComplaints}  sub="needs attention"             trend={12} accent="#dc2626"        />
        <StatCard icon="home"     label="Pending Reservations" value={pendingRes}      sub="awaiting approval"                      accent="#7c3aed"        />
      </div>

      {/* ── Quick Actions ── */}
      <Panel style={{ marginBottom: 24, padding: "20px 24px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 14 }}>Quick Actions</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <QuickAction icon="bell"     label="Post Announcement" accent={COLORS.primary} onClick={() => setShowModal(true)} />
          <QuickAction icon="settings" label="Record Payment"    accent="#16a34a"        onClick={() => {}} />
          <QuickAction icon="home"     label="Review Reservation"   accent="#7c3aed"        onClick={() => {}} />
          <QuickAction icon="bell"     label="Handle Complaint"  accent="#dc2626"        onClick={() => {}} />
          <QuickAction icon="home"     label="Manage Residents"  accent="#0891b2"        onClick={() => {}} />
        </div>
      </Panel>

      {/* ── Recent Activity Row ── */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>

        {/* Recent Complaints */}
        <Panel style={{ flex: 1, minWidth: 280 }}>
          <div style={{ padding: "18px 22px 14px" }}>
            <SectionHeader icon="bell" title="Recent Complaints" subtitle="Latest filed by residents" accent="#dc2626" />
          </div>
          {complaints.slice(0, 3).map((c, i) => (
            <div key={c.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 22px",
              borderTop: i === 0 ? `1px solid ${COLORS.border}` : "none",
              borderBottom: `1px solid ${COLORS.border}`,
            }}>
              <Avatar name={c.resident} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.subject}</div>
                <div style={{ fontSize: 11.5, color: COLORS.textLight }}>{c.resident} · {c.unit}</div>
              </div>
              <StatusBadge status={c.status} />
            </div>
          ))}
        </Panel>

        {/* Upcoming Reservations */}
        <Panel style={{ flex: 1, minWidth: 280 }}>
          <div style={{ padding: "18px 22px 14px" }}>
            <SectionHeader icon="home" title="Upcoming Reservations" subtitle="Approved & pending reservations" accent="#7c3aed" />
          </div>
          {reservations.filter(r => r.status !== "cancelled").slice(0, 3).map((r, i) => (
            <div key={r.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 22px",
              borderTop: i === 0 ? `1px solid ${COLORS.border}` : "none",
              borderBottom: `1px solid ${COLORS.border}`,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: "#7c3aed18",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name="home" size={16} color="#7c3aed" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{r.facility}</div>
                <div style={{ fontSize: 11.5, color: COLORS.textLight }}>{r.resident} · {r.date}</div>
              </div>
              <StatusBadge status={r.status} />
            </div>
          ))}
        </Panel>

        {/* Recent Announcements */}
        <Panel style={{ flex: 1, minWidth: 280 }}>
          <div style={{ padding: "18px 22px 14px" }}>
            <SectionHeader icon="bell" title="Recent Announcements" subtitle="Latest posts" accent={COLORS.primary} />
          </div>
          {announcements.slice(0, 3).map((a, i) => {
            const color = TAG_COLORS[a.tag] ?? COLORS.primary;
            return (
              <div key={a.id} style={{
                padding: "12px 22px",
                borderTop: i === 0 ? `1px solid ${COLORS.border}` : "none",
                borderBottom: `1px solid ${COLORS.border}`,
                display: "flex", gap: 12, alignItems: "flex-start",
              }}>
                <div style={{ width: 3, minHeight: 40, borderRadius: 4, background: color, flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
                  <div style={{ fontSize: 11.5, color: COLORS.textLight }}>{timeAgo(a.date)}</div>
                </div>
                <Badge label={a.tag.charAt(0).toUpperCase() + a.tag.slice(1)} color={color} bg={`${color}12`} border={`${color}40`} />
              </div>
            );
          })}
        </Panel>

      </div>

      {/* ── Announcement Modal ── */}
      {showModal && (
        <AnnounceModal onClose={() => setShowModal(false)} onPost={postAnnouncement} />
      )}
    </div>
  );
}