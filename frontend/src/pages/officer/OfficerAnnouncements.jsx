import { useState, useEffect } from "react";
import COLORS from "../../constants/colors";
import { Badge, Card, Btn } from "../../components/UI";
import Icon from "../../components/Icon";
import { api } from "../../api";

// ─── Priority config ────────────────────────────────────────────────────────
const PRIORITY_CONFIG = {
  "High Priority":   { icon: "alert",    color: "#EF4444", bg: "#FEF2F2" },
  "Medium Priority": { icon: "calendar", color: "#F59E0B", bg: "#FFFBEB" },
  "Low Priority":    { icon: "bell",     color: "#3B82F6", bg: "#EFF6FF" },
  
};

const PRIORITIES = ["High Priority", "Medium Priority", "Low Priority"];

// Maps display labels → exact DB enum values for priority_lvl
const PRIORITY_TO_DB = {
  "High Priority":   "High",
  "Medium Priority": "Medium",
  "Low Priority":    "Low",
};

// Maps DB enum values → display labels
const DB_TO_PRIORITY = {
  "High":   "High Priority",
  "Medium": "Medium Priority",
  "Low":    "Low Priority",
};

const EMPTY_FORM = {
  tag: "High Priority",
  title: "",
  body: "",
  date: new Date().toISOString().slice(0, 10),
};

// ─── Normalize backend → frontend field names ────────────────────────────────
// Handles whatever field names your backend returns (priority/tag, message/body/content, etc.)
function normalize(a) {
  return {
    id:    a.id,
    tag:   DB_TO_PRIORITY[a.tag] ?? DB_TO_PRIORITY[a.priority] ?? a.tag ?? a.priority ?? "Low Priority",
    title: a.title ?? a.name     ?? "",
    body:  a.body  ?? a.message  ?? a.content ?? "",
    date:  a.date
      ? new Date(a.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
      : a.created_at
        ? new Date(a.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
        : "—",
  };
}

// ─── Map form → backend payload ──────────────────────────────────────────────
// Sends both field name variants so either backend schema works
function toPayload(form) {
  return {
    tag:      PRIORITY_TO_DB[form.tag] ?? form.tag,
    priority: PRIORITY_TO_DB[form.tag] ?? form.tag,
    title:    form.title,
    body:     form.body,
    message:  form.body,
    date:     form.date,
  };
}


// ─── Skeleton ────────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -600px 0 }
          100% { background-position:  600px 0 }
        }
        .sk {
          background: linear-gradient(90deg,#f0f0f0 25%,#fafafa 50%,#f0f0f0 75%);
          background-size: 1200px 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 6px;
          display: inline-block;
        }
      `}</style>
      {[120, 200, 300, 90, 80].map((w, i) => (
        <td key={i} style={{ padding: "14px 16px" }}>
          <span className="sk" style={{ width: w, height: 14, display: "block" }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(15,23,42,0.45)", backdropFilter: "blur(3px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 540,
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        display: "flex", flexDirection: "column", maxHeight: "90vh",
      }}>
        {/* Modal header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px 0",
        }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: COLORS.text }}>{title}</span>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: COLORS.textMid, fontSize: 20, lineHeight: 1, padding: 4,
              borderRadius: 6,
            }}
          >×</button>
        </div>
        <div style={{ padding: "20px 24px 24px", overflowY: "auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Field ───────────────────────────────────────────────────────────────────
function Field({ label, children, required }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: COLORS.text, marginBottom: 6 }}>
        {label}{required && <span style={{ color: "#EF4444", marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", boxSizing: "border-box",
  padding: "9px 12px", borderRadius: 8,
  border: `1.5px solid ${COLORS.border}`,
  fontSize: 13, fontFamily: "inherit",
  color: COLORS.text, background: "#fff",
  outline: "none", transition: "border-color .15s",
};

// ─── Main component ──────────────────────────────────────────────────────────
export default function OfficerAnnouncements() {
  const [loading, setLoading]       = useState(true);
  const [items, setItems]           = useState([]);
  const [priorityFilter, setFilter] = useState("All");
  const [search, setSearch]         = useState("");
  const [modal, setModal]           = useState(null); // null | "create" | "edit" | "delete" | "view"
  const [selected, setSelected]     = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [toast, setToast]           = useState(null);

  // ── Load ──
  useEffect(() => {
    api.getAnnouncements()
      .then(data => setItems(data.map(normalize)))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  // ── Toast ──
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Filtered list ──
  const filtered = items.filter(a => {
    const matchPriority = priorityFilter === "All" || a.tag === priorityFilter;
    const matchSearch   = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.body.toLowerCase().includes(search.toLowerCase());
    return matchPriority && matchSearch;
  });

  // ── Open modals ──
  const openCreate = () => { setForm(EMPTY_FORM); setSelected(null); setModal("create"); };
  const openEdit   = a  => { setForm({ tag: a.tag, title: a.title, body: a.body, date: a.date ?? "" }); setSelected(a); setModal("edit"); };
  const openDelete = a  => { setSelected(a); setModal("delete"); };
  const openView   = a  => { setSelected(a); setModal("view"); };
  const closeModal = () => { setModal(null); setSelected(null); };

  // ── Save (create / edit) ──
  const handleSave = async () => {
    if (!form.title.trim() || !form.body.trim()) return;
    setSaving(true);
    try {
      if (modal === "create") {
        const raw = await api.createAnnouncement(toPayload(form));
        setItems(prev => [normalize(raw), ...prev]);
        showToast("Announcement posted successfully.");
      } else {
        const raw = await api.updateAnnouncement(selected.id, toPayload(form));
        setItems(prev => prev.map(a => a.id === selected.id ? normalize(raw) : a));
        showToast("Announcement updated.");
      }
      closeModal();
    } catch (err) {
      console.error("Announcement save error:", err);
      showToast(err?.message ?? "Something went wrong. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──
  const handleDelete = async () => {
    setSaving(true);
    try {
      await api.deleteAnnouncement(selected.id);
      setItems(prev => prev.filter(a => a.id !== selected.id));
      showToast("Announcement deleted.");
      closeModal();
    } catch (err) {
      console.error("Announcement delete error:", err);
      showToast(err?.message ?? "Could not delete. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Form field helper ──
  const setField = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        .oa-th { font-size:11px; font-weight:700; color:${COLORS.textMid}; text-transform:uppercase; letter-spacing:.06em; padding:10px 16px; text-align:left; border-bottom:1px solid ${COLORS.border}; white-space:nowrap; }
        .oa-tr:hover { background:#f8faff; }
        .oa-td { padding:14px 16px; font-size:13px; color:${COLORS.text}; border-bottom:1px solid ${COLORS.border}; vertical-align:middle; }
        .oa-action { background:none; border:none; cursor:pointer; padding:6px 8px; border-radius:7px; font-size:12px; font-weight:600; transition:background .15s; }
        .oa-action:hover { background:${COLORS.primaryBg}; }
        .oa-input:focus { border-color:${COLORS.primary} !important; }
        .oa-btn-ghost { background:none; border:1.5px solid ${COLORS.border}; padding:8px 16px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; color:${COLORS.text}; font-family:inherit; transition:border-color .15s,background .15s; }
        .oa-btn-ghost:hover { border-color:${COLORS.primary}; background:${COLORS.primaryBg}; }
        @media(max-width:700px){ .oa-desktop{ display:none!important; } }
      `}</style>

      <div style={{ padding: "28px 24px" }}>

        {/* ── Page header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800, color: COLORS.text }}>Announcements</h2>
            <p style={{ margin: 0, fontSize: 13, color: COLORS.textMid }}>
              Post notices and updates that residents will see in their portal.
            </p>
          </div>
          <Btn onClick={openCreate} style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Announcement
          </Btn>
        </div>

        {/* ── Filters ── */}
        <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 200px", maxWidth: 280 }}>
            <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.textMid} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="oa-input"
              placeholder="Search announcements…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, paddingLeft: 32 }}
            />
          </div>

          {/* Priority filter chips */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["All", ...PRIORITIES].map(p => {
              const active = priorityFilter === p;
              const cfg    = PRIORITY_CONFIG[p];
              return (
                <button key={p} onClick={() => setFilter(p)} style={{
                  padding: "6px 14px", borderRadius: 20, border: "1.5px solid",
                  borderColor: active ? (cfg?.color ?? COLORS.primary) : COLORS.border,
                  background: active ? (cfg?.bg ?? COLORS.primaryBg) : "#fff",
                  color: active ? (cfg?.color ?? COLORS.primary) : COLORS.textMid,
                  fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                  transition: "all .15s",
                }}>
                  {p}
                </button>
              );
            })}
          </div>

          {/* Count */}
          <span style={{ marginLeft: "auto", fontSize: 12, color: COLORS.primary, background: COLORS.primaryBg, borderRadius: 20, padding: "6px 14px", fontWeight: 600, whiteSpace: "nowrap" }}>
            {filtered.length} {filtered.length === 1 ? "result" : "results"}
          </span>
        </div>

        {/* ── Table ── */}
        <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#fafbfc" }}>
                <tr>
                  <th className="oa-th">Priority</th>
                  <th className="oa-th">Title</th>
                  <th className="oa-th oa-desktop">Message</th>
                  <th className="oa-th oa-desktop">Date</th>
                  <th className="oa-th" style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1,2,3].map(i => <SkeletonRow key={i} />)
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: "60px 24px" }}>
                      <div style={{ background: COLORS.primaryBg, borderRadius: "50%", width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                        <Icon name="bell" size={24} color={COLORS.primary} />
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text, marginBottom: 4 }}>No announcements found</div>
                      <div style={{ fontSize: 13, color: COLORS.textMid }}>
                        {search ? "Try a different search term." : "Post a new announcement to notify residents."}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map(a => {
                    const cfg = PRIORITY_CONFIG[a.tag] ?? PRIORITY_CONFIG["High Priority"];
                    return (
                      <tr key={a.id} className="oa-tr">
                        {/* Priority badge */}
                        <td className="oa-td">
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            background: cfg.bg, color: cfg.color,
                            borderRadius: 20, padding: "4px 10px",
                            fontSize: 11, fontWeight: 700,
                          }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, display: "inline-block" }} />
                            {a.tag}
                          </span>
                        </td>

                        {/* Title */}
                        <td className="oa-td">
                          <span style={{ fontWeight: 600 }}>{a.title}</span>
                        </td>

                        {/* Body preview */}
                        <td className="oa-td oa-desktop" style={{ maxWidth: 300 }}>
                          <span style={{ color: COLORS.textMid, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {a.body}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="oa-td oa-desktop" style={{ color: COLORS.textMid, whiteSpace: "nowrap" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <Icon name="calendar" size={12} color={COLORS.textMid} />
                            {a.date}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="oa-td" style={{ textAlign: "right" }}>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: 4 }}>
                            <button className="oa-action" onClick={() => openView(a)} title="View" style={{ color: COLORS.primary }}>
                              View
                            </button>
                            <button className="oa-action" onClick={() => openEdit(a)} title="Edit" style={{ color: COLORS.text }}>
                              Edit
                            </button>
                            <button className="oa-action" onClick={() => openDelete(a)} title="Delete" style={{ color: "#EF4444" }}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          MODAL — Create / Edit
      ══════════════════════════════════════════════════ */}
      {(modal === "create" || modal === "edit") && (
        <Modal title={modal === "create" ? "New Announcement" : "Edit Announcement"} onClose={closeModal}>

          <Field label="Priority" required>
            <div style={{ position: "relative" }}>
              <select
                className="oa-input"
                value={form.tag}
                onChange={setField("tag")}
                style={{ ...inputStyle, paddingRight: 32, appearance: "none" }}
              >
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
              <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: COLORS.textMid, fontSize: 11 }}>▾</div>
            </div>
          </Field>

          <Field label="Title" required>
            <input
              className="oa-input"
              placeholder="e.g. Water Interruption Notice"
              value={form.title}
              onChange={setField("title")}
              style={inputStyle}
              maxLength={120}
            />
          </Field>

          <Field label="Message" required>
            <textarea
              className="oa-input"
              placeholder="Write the full announcement here…"
              value={form.body}
              onChange={setField("body")}
              rows={5}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
            />
          </Field>

          <Field label="Date">
            <input
              type="date"
              className="oa-input"
              value={form.date}
              onChange={setField("date")}
              style={inputStyle}
            />
          </Field>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
            <button className="oa-btn-ghost" onClick={closeModal} disabled={saving}>Cancel</button>
            <Btn onClick={handleSave} disabled={saving || !form.title.trim() || !form.body.trim()}>
              {saving ? "Saving…" : modal === "create" ? "Post Announcement" : "Save Changes"}
            </Btn>
          </div>
        </Modal>
      )}

      {/* ══════════════════════════════════════════════════
          MODAL — View
      ══════════════════════════════════════════════════ */}
      {modal === "view" && selected && (() => {
        const cfg = PRIORITY_CONFIG[selected.tag] ?? PRIORITY_CONFIG["High Priority"];
        return (
          <Modal title="Announcement Detail" onClose={closeModal}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: cfg.bg, color: cfg.color,
                borderRadius: 20, padding: "5px 12px",
                fontSize: 12, fontWeight: 700,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.color }} />
                {selected.tag}
              </span>
              <span style={{ fontSize: 12, color: COLORS.textMid, display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name="calendar" size={12} color={COLORS.textMid} />
                {selected.date}
              </span>
            </div>
            <h3 style={{ margin: "0 0 12px", fontSize: 17, fontWeight: 800, color: COLORS.text }}>{selected.title}</h3>
            <p style={{ margin: 0, fontSize: 14, color: COLORS.textMid, lineHeight: 1.7 }}>{selected.body}</p>
            <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button className="oa-btn-ghost" onClick={closeModal}>Close</button>
              <Btn onClick={() => { closeModal(); setTimeout(() => openEdit(selected), 50); }}>Edit</Btn>
            </div>
          </Modal>
        );
      })()}

      {/* ══════════════════════════════════════════════════
          MODAL — Delete
      ══════════════════════════════════════════════════ */}
      {modal === "delete" && selected && (
        <Modal title="Delete Announcement" onClose={closeModal}>
          <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
            <div style={{ background: "#FEF2F2", borderRadius: "50%", width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </div>
            <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 15, color: COLORS.text }}>
              Delete "{selected.title}"?
            </p>
            <p style={{ margin: 0, fontSize: 13, color: COLORS.textMid }}>
              This announcement will be permanently removed and residents will no longer see it.
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 8 }}>
            <button className="oa-btn-ghost" onClick={closeModal} disabled={saving}>Cancel</button>
            <button
              onClick={handleDelete}
              disabled={saving}
              style={{
                background: "#EF4444", color: "#fff", border: "none",
                padding: "9px 20px", borderRadius: 8, fontWeight: 700,
                fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Deleting…" : "Yes, Delete"}
            </button>
          </div>
        </Modal>
      )}

      {/* ══════════════════════════════════════════════════
          Toast notification
      ══════════════════════════════════════════════════ */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          background: toast.type === "error" ? "#EF4444" : "#10B981",
          color: "#fff", borderRadius: 10, padding: "12px 22px",
          fontSize: 13, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
          zIndex: 1100, display: "flex", alignItems: "center", gap: 8,
          whiteSpace: "nowrap",
        }}>
          {toast.type === "error"
            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          }
          {toast.msg}
        </div>
      )}
    </>
  );
}