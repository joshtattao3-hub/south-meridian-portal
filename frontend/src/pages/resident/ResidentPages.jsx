import { useState, useEffect, useRef } from "react";
import COLORS from "../../constants/colors";
import { Badge, Btn, Card } from "../../components/UI";
import Icon from "../../components/Icon";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api";

function Toast({ message, type = "success", onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  const bg   = type === "success" ? "#166534" : COLORS.danger;
  const icon = type === "success" ? "✓" : "⚠";
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 2000,
      background: bg, color: "#fff", borderRadius: 10, padding: "14px 20px",
      display: "flex", alignItems: "center", gap: 10,
      boxShadow: "0 8px 32px rgba(0,0,0,0.18)", fontSize: 14, fontWeight: 600,
      animation: "slideUp 0.25s ease",
    }}>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
      <span style={{ fontSize: 18 }}>{icon}</span>
      {message}
    </div>
  );
}

function formatDate(raw) {
  if (!raw) return "—";
  return new Date(raw).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function shortId(complaint) {
  if (complaint?.ticket_no) return "CMP-" + String(complaint.ticket_no).padStart(3, "0");
  const id = complaint?.id || "";
  if (!id) return "—";
  return "CMP-" + id.replace(/-/g, "").slice(0, 6).toUpperCase();
}

function ViewModal({ complaint, onClose, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  if (!complaint) return null;

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this complaint? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await onDelete(complaint.id);
      onClose();
    } catch (err) {
      alert("Failed to delete: " + (err.message ?? "Unknown error"));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", borderRadius: 14, padding: 28, width: "100%", maxWidth: 520, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 12, color: COLORS.primary, fontWeight: 700, marginBottom: 4 }}>{shortId(complaint)}</div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: COLORS.text }}>{complaint.subject}</h3>
          </div>
          <button type="button" onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.textLight, fontSize: 20, lineHeight: 1, padding: 4 }}>✕</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          {[
            ["Category",   complaint.category],
            ["Priority",   complaint.priority],
            ["Status",     complaint.status],
            ["Date Filed", formatDate(complaint.created_at || complaint.date)],
          ].map(([label, value]) => (
            <div key={label} style={{ background: COLORS.bg, borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: COLORS.textLight, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{label}</div>
              {label === "Status" || label === "Priority"
                ? <Badge label={value} />
                : <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{value ?? "—"}</div>
              }
            </div>
          ))}
        </div>
        {complaint.description && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textLight, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Description</div>
            <div style={{ fontSize: 13, color: COLORS.textMid, lineHeight: 1.6, background: COLORS.bg, borderRadius: 8, padding: "12px 14px" }}>{complaint.description}</div>
          </div>
        )}
        {complaint.admin_notes && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.textLight, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Admin Notes</div>
            <div style={{ fontSize: 13, color: COLORS.textMid, lineHeight: 1.6, background: COLORS.infoBg, borderRadius: 8, padding: "12px 14px", borderLeft: `3px solid ${COLORS.info}` }}>{complaint.admin_notes}</div>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Btn type="button" variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete Complaint"}
          </Btn>
          <Btn type="button" variant="light" onClick={onClose}>Close</Btn>
        </div>
      </div>
    </div>
  );
}

const EMPTY_FORM = { category: "Infrastructure", priority: "Medium", subject: "", description: "" };

export function ComplaintsPage() {
  const { user } = useAuth();
  const [showForm, setShowForm]          = useState(false);
  const [selectedComplaint, setSelected] = useState(null);
  const [form, setForm]                  = useState(EMPTY_FORM);
  const [files, setFiles]                = useState([]);
  const [submitting, setSubmitting]      = useState(false);
  const [formError, setFormError]        = useState(null);
  const [toast, setToast]                = useState(null);
  const fileInputRef                     = useRef(null);
  const [complaints, setComplaints]      = useState([]);
  const [loading, setLoading]            = useState(true);
  const [listError, setListError]        = useState(null);

  async function loadComplaints() {
    setLoading(true); setListError(null);
    try {
      const data = await api.getComplaints({ resident_id: user?.id });
      setComplaints(data);
    } catch (err) {
      setListError(err.message ?? "Failed to load complaints.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (user?.id) loadComplaints(); }, [user?.id]);

  async function handleDelete(id) {
    await api.deleteComplaint(id);
    setToast({ message: "Complaint deleted.", type: "success" });
    await loadComplaints();
  }

  function handleField(field, value) { setForm((p) => ({ ...p, [field]: value })); setFormError(null); }
  function handleFileChange(e) { setFiles((p) => [...p, ...Array.from(e.target.files ?? [])]); }
  function removeFile(i) { setFiles((p) => p.filter((_, idx) => idx !== i)); }

  function resetForm() {
    setForm(EMPTY_FORM); setFiles([]); setFormError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function validate() {
    if (!form.subject.trim())                return "Subject is required.";
    if (form.subject.trim().length < 5)      return "Subject must be at least 5 characters.";
    if (!form.description.trim())            return "Description is required.";
    if (form.description.trim().length < 10) return "Description must be at least 10 characters.";
    return null;
  }

  async function handleSubmit() {
    const err = validate();
    if (err) { setFormError(err); return; }
    setSubmitting(true); setFormError(null);
    try {
      await api.createComplaint({
        resident_id:  user?.id,
        category:     form.category,
        priority:     form.priority,
        subject:      form.subject.trim(),
        description:  form.description.trim(),
        attachments:  files.map((f) => f.name),
      });
      resetForm();
      setShowForm(false);
      setToast({ message: "Complaint submitted successfully!", type: "success" });
      await loadComplaints();
    } catch (err) {
      setFormError(err.message ?? "Failed to submit complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── form view ─────────────────────────────────────────────────────────────
  if (showForm) return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
      <div style={{ padding: "20px 28px" }}>
        <button type="button" onClick={() => { setShowForm(false); resetForm(); }}
          style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.primary, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, marginBottom: 20, padding: 0, fontFamily: "inherit" }}>
          ← Back to My Complaints
        </button>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
            <div style={{ background: COLORS.primaryBg, borderRadius: 12, width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="chat" size={26} color={COLORS.primary} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.text }}>Submit a Complaint</div>
              <div style={{ fontSize: 13, color: COLORS.textMid, marginTop: 2 }}>
                Help us address the issue by <span style={{ color: COLORS.primary, fontWeight: 600 }}>providing accurate details.</span>
              </div>
            </div>
          </div>

          {formError && (
            <div style={{ background: COLORS.dangerBg, border: `1px solid ${COLORS.danger}`, borderRadius: 8, padding: "10px 14px", marginBottom: 20, color: COLORS.danger, fontSize: 13 }}>
              ⚠ {formError}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
            <div>
              <label htmlFor="cmp-category" style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6 }}>
                Category <span style={{ color: COLORS.danger }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <Icon name="building" size={15} color={COLORS.textMid} />
                </div>
                <select id="cmp-category" value={form.category} onChange={(e) => handleField("category", e.target.value)}
                  style={{ width: "100%", padding: "11px 36px 11px 36px", borderRadius: 8, border: `1.5px solid ${COLORS.border}`, fontSize: 14, fontFamily: "inherit", appearance: "none", background: "#fff", color: COLORS.text, cursor: "pointer" }}>
                  {["Infrastructure", "Noise", "Security", "Utilities", "Other"].map((c) => <option key={c}>{c}</option>)}
                </select>
                <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: COLORS.textMid, fontSize: 11 }}>▾</div>
              </div>
            </div>
            <div>
              <label htmlFor="cmp-priority" style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6 }}>
                Priority <span style={{ color: COLORS.danger }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <Icon name="info" size={15} color={COLORS.textMid} />
                </div>
                <select id="cmp-priority" value={form.priority} onChange={(e) => handleField("priority", e.target.value)}
                  style={{ width: "100%", padding: "11px 36px 11px 36px", borderRadius: 8, border: `1.5px solid ${COLORS.border}`, fontSize: 14, fontFamily: "inherit", appearance: "none", background: "#fff", color: COLORS.text, cursor: "pointer" }}>
                  {["Low", "Medium", "High"].map((p) => <option key={p}>{p}</option>)}
                </select>
                <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: COLORS.textMid, fontSize: 11 }}>▾</div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label htmlFor="cmp-subject" style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6 }}>
              Subject <span style={{ color: COLORS.danger }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input id="cmp-subject" value={form.subject} maxLength={100}
                onChange={(e) => handleField("subject", e.target.value)}
                placeholder="e.g. Broken streetlight near Block 3"
                style={{ width: "100%", padding: "11px 56px 11px 14px", borderRadius: 8, border: `1.5px solid ${COLORS.border}`, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box", color: COLORS.text }} />
              <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: COLORS.textLight, pointerEvents: "none" }}>
                {form.subject.length}/100
              </span>
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label htmlFor="cmp-description" style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6 }}>
              Description <span style={{ color: COLORS.danger }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <textarea id="cmp-description" rows={5} value={form.description} maxLength={1000}
                onChange={(e) => handleField("description", e.target.value)}
                placeholder="Describe the issue in detail…"
                style={{ width: "100%", padding: "11px 14px 28px 14px", borderRadius: 8, border: `1.5px solid ${COLORS.border}`, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box", resize: "vertical", color: COLORS.text }} />
              <span style={{ position: "absolute", right: 12, bottom: 10, fontSize: 11, color: COLORS.textLight, pointerEvents: "none" }}>
                {form.description.length}/1000
              </span>
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6 }}>
              Photos <span style={{ color: COLORS.textMid, fontWeight: 400 }}>(optional)</span>
            </label>
            <input ref={fileInputRef} type="file" multiple accept="image/png,image/jpeg" onChange={handleFileChange} style={{ display: "none" }} id="cmp-file" />
            <label htmlFor="cmp-file"
              style={{ display: "block", border: `2px dashed ${COLORS.border}`, borderRadius: 10, padding: "32px 20px", textAlign: "center", background: COLORS.bg, cursor: "pointer" }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = COLORS.primary}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = COLORS.border}>
              <Icon name="upload" size={28} color={COLORS.textMid} />
              <div style={{ fontSize: 13, color: COLORS.text, fontWeight: 600, marginTop: 10 }}>Drag & drop photos here or click to browse</div>
              <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 4 }}>PNG, JPG up to 10MB (max 5 files)</div>
            </label>
            {files.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                {files.map((f, i) => (
                  <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: COLORS.primaryBg, borderRadius: 20, padding: "4px 10px", fontSize: 12, color: COLORS.primary }}>
                    <Icon name="file" size={12} color={COLORS.primary} />
                    {f.name}
                    <button type="button" onClick={() => removeFile(i)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.primary, padding: 0, lineHeight: 1, fontSize: 14 }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: COLORS.textLight, fontSize: 12 }}>
              🔒 Your complaint will be submitted and a ticket ID will be provided.
            </div>
            <Btn type="button" onClick={handleSubmit} disabled={submitting}
              style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 20, paddingRight: 20 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              {submitting ? "Submitting…" : "Submit Complaint"}
            </Btn>
          </div>
        </Card>
      </div>
    </>
  );

  // ── list view ──────────────────────────────────────────────────────────────
  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
      <ViewModal complaint={selectedComplaint} onClose={() => setSelected(null)} onDelete={handleDelete} />

      <div style={{ padding: "24px 28px" }}>

        {/* Page header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: COLORS.textLight }}>
              View and track the status of your submitted complaints.
            </p>
          </div>
          <Btn type="button" onClick={() => setShowForm(true)} style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <Icon name="plus" size={15} color="#fff" /> New Complaint
          </Btn>
        </div>

        <Card style={{ padding: 0, overflow: "hidden" }}>
          {listError && (
            <div style={{ background: COLORS.dangerBg, border: `1px solid ${COLORS.danger}`, borderRadius: 8, margin: 16, padding: "10px 14px", color: COLORS.danger, fontSize: 13 }}>
              ⚠ {listError}
            </div>
          )}

          {loading ? (
            <div style={{ color: COLORS.textLight, fontSize: 13, padding: "32px 0", textAlign: "center" }}>Loading complaints…</div>
          ) : complaints.length === 0 ? (
            <div style={{ color: COLORS.textLight, fontSize: 13, padding: "32px 0", textAlign: "center" }}>No complaints filed yet.</div>
          ) : (
            <>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    {["Ticket ID", "Subject", "Priority", "Status", "Date", "Actions"].map((h) => (
                      <th key={h} style={{
                        textAlign: "left", padding: "12px 16px",
                        color: COLORS.textLight, fontWeight: 600,
                        fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5,
                        background: "#fff",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c) => (
                    <tr key={c.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}
                      onMouseEnter={(e) => e.currentTarget.style.background = COLORS.bg}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "14px 16px", fontWeight: 700, color: COLORS.primary, fontSize: 12 }}>{shortId(c)}</td>
                      <td style={{ padding: "14px 16px", color: COLORS.text, fontWeight: 500 }}>{c.subject}</td>
                      <td style={{ padding: "14px 16px" }}><Badge label={c.priority} /></td>
                      <td style={{ padding: "14px 16px" }}><Badge label={c.status} /></td>
                      <td style={{ padding: "14px 16px", color: COLORS.textMid }}>{formatDate(c.created_at || c.date)}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <Btn type="button" small variant="light" onClick={() => setSelected(c)}
                          style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                          <Icon name="eye" size={13} color={COLORS.textMid} /> View
                        </Btn>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Table footer */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 16px", borderTop: `1px solid ${COLORS.border}`,
              }}>
                <span style={{ fontSize: 12, color: COLORS.textLight }}>
                  Showing 1 to {complaints.length} of {complaints.length}
                </span>
                <div style={{ display: "flex", gap: 4 }}>
                  <button type="button" style={pagerBtn(false)}>‹</button>
                  <button type="button" style={pagerBtn(true)}>1</button>
                  <button type="button" style={pagerBtn(false)}>›</button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </>
  );
}

function pagerBtn(active) {
  return {
    width: 28, height: 28, borderRadius: 6,
    border: `1px solid ${active ? COLORS.primary : COLORS.border}`,
    background: active ? COLORS.primary : "#fff",
    color: active ? "#fff" : COLORS.textMid,
    fontSize: 12, fontWeight: active ? 700 : 400,
    cursor: "pointer", display: "inline-flex",
    alignItems: "center", justifyContent: "center",
    fontFamily: "inherit",
  };
}

// ---------------------------------------------------------------------------
// DuesPage
// ---------------------------------------------------------------------------
export function DuesPage() {
  const { user } = useAuth();
  const [dues, setDues]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [expanded, setExpanded]   = useState(null);

  useEffect(() => {
    let cancelled = false;
    api.getDues()
      .then(data  => { if (!cancelled) setDues(data.filter(d => d.is_posted === true)); })
      .catch(err  => { if (!cancelled) setError(err.message ?? "Failed to load dues."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const latestDue   = dues.find(d => d.is_posted === true) ?? null;
  const hasReminder = !!latestDue;
  const isPaid       = latestDue?.payment_status === "Paid";

  const timeline = [
    { label: "Reminder Posted",   desc: "HOA Office posts the monthly dues reminder.",        done: hasReminder },
    { label: "Resident Notified", desc: "You receive a notification about the new reminder.", done: hasReminder },
    { label: "Payment Pending",   desc: "Awaiting your payment before the due date.",         done: isPaid },
    { label: "Payment Confirmed", desc: "HOA Office records and confirms your payment.",      done: isPaid },
  ];

  return (
    <div style={{ padding: 28 }}>

      {error && (
        <div style={{ background: COLORS.dangerBg, border: `1px solid ${COLORS.danger}`, borderRadius: 10, padding: "10px 14px", marginBottom: 20, color: COLORS.danger, fontSize: 13 }}>
          ⚠ {error}
        </div>
      )}

      {/* Top Status Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>

        {/* Current Status */}
        <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ background: COLORS.successBg ?? COLORS.success + "18", borderRadius: 8, padding: 7 }}>
              <Icon name="check" size={15} color={COLORS.success} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMid, textTransform: "uppercase", letterSpacing: 0.5 }}>Current Status</span>
          </div>
          {loading ? (
            <div style={{ fontSize: 13, color: COLORS.textLight }}>Loading…</div>
          ) : hasReminder ? (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>{latestDue.label}</div>
              <Badge label={latestDue.payment_status ?? "Unpaid"} />
            </>
          ) : (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>No Active Dues Posted</div>
              <div style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 8 }}>Waiting for HOA Office update</div>
              <span style={{ background: COLORS.success + "18", color: COLORS.success, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>Up to date</span>
            </>
          )}
        </div>

        {/* Latest Reminder */}
        <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ background: COLORS.warningBg ?? COLORS.warning + "18", borderRadius: 8, padding: 7 }}>
              <Icon name="bell" size={15} color={COLORS.warning} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMid, textTransform: "uppercase", letterSpacing: 0.5 }}>Latest Reminder</span>
          </div>
          {loading ? (
            <div style={{ fontSize: 13, color: COLORS.textLight }}>Loading…</div>
          ) : hasReminder ? (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>
                Due {new Date(latestDue.due_date).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
              </div>
              <div style={{ fontSize: 12, color: COLORS.textLight }}>Posted by HOA Office</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>No Reminder Received Yet</div>
              <div style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 8 }}>You'll be notified once posted</div>
              <span style={{ background: COLORS.warning + "18", color: COLORS.warning, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>Pending</span>
            </>
          )}
        </div>

        {/* Next Action */}
        <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ background: COLORS.primaryBg, borderRadius: 8, padding: 7 }}>
              <Icon name="calendar" size={15} color={COLORS.primary} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMid, textTransform: "uppercase", letterSpacing: 0.5 }}>Next Action</span>
          </div>
          {loading ? (
            <div style={{ fontSize: 13, color: COLORS.textLight }}>Loading…</div>
          ) : hasReminder && !isPaid ? (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>Payment Required</div>
              <div style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 10 }}>Coordinate with the HOA Office</div>
              <Btn small>View Details</Btn>
            </>
          ) : (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>Awaiting Officer Announcement</div>
              <div style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 10 }}>Stay tuned for updates</div>
              <Btn small variant="light">View Notifications →</Btn>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Activity Timeline */}
          <Card>
            <h4 style={{ margin: "0 0 20px", fontWeight: 700, fontSize: 14, color: COLORS.text }}>Dues Activity Timeline</h4>
            <div style={{ display: "flex", gap: 24 }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {timeline.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", paddingBottom: i < 3 ? 22 : 0 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: "50%",
                        background: step.done ? COLORS.primary : "#fff",
                        border: `2px solid ${step.done ? COLORS.primary : COLORS.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {step.done && <Icon name="check" size={12} color="#fff" />}
                      </div>
                      {i < 3 && (
                        <div style={{ width: 2, flex: 1, minHeight: 16, background: step.done ? COLORS.primary + "40" : COLORS.border, marginTop: 3 }} />
                      )}
                    </div>
                    <div style={{ paddingTop: 3 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: step.done ? COLORS.text : COLORS.textMid, marginBottom: 2 }}>
                        {step.label}
                        <span style={{ fontWeight: 400, color: COLORS.textLight, marginLeft: 6 }}>—</span>
                      </div>
                      <div style={{ fontSize: 12, color: COLORS.textLight, lineHeight: 1.5 }}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Illustration panel */}
              {!loading && !hasReminder && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px 8px", textAlign: "center", background: COLORS.bg, borderRadius: 10 }}>
                  <div style={{ background: COLORS.primaryBg, borderRadius: "50%", width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                    <Icon name="calendar" size={24} color={COLORS.primary} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>No dues reminder activity yet.</div>
                  <div style={{ fontSize: 12, color: COLORS.textLight, lineHeight: 1.5 }}>Once the HOA Office posts a reminder, you'll see updates here.</div>
                </div>
              )}
            </div>
          </Card>

          {/* Dues History Table */}
          <Card>
            <h4 style={{ margin: "0 0 16px", fontWeight: 700, fontSize: 14, color: COLORS.text }}>Dues History</h4>
            {loading ? (
              <div style={{ color: COLORS.textLight, fontSize: 13, padding: "20px 0", textAlign: "center" }}>Loading…</div>
            ) : dues.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ background: COLORS.primaryBg, borderRadius: "50%", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <Icon name="file" size={22} color={COLORS.primary} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>No dues history yet.</div>
                <div style={{ fontSize: 12, color: COLORS.textLight }}>Past dues reminders and payments will appear here.</div>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    {["Period", "Reminder Date", "Due Date", "Status", "Action"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: COLORS.textMid, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dues.map(d => (
                    <tr key={d.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}
                      onMouseEnter={e => e.currentTarget.style.background = COLORS.bg}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "12px", fontWeight: 600, color: COLORS.text }}>{d.label}</td>
                      <td style={{ padding: "12px", color: COLORS.textMid }}>
                        {d.created_at ? new Date(d.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                      </td>
                      <td style={{ padding: "12px", color: COLORS.textMid }}>
                        {d.due_date ? new Date(d.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                      </td>
                      <td style={{ padding: "12px" }}><Badge label={d.payment_status ?? "Unpaid"} /></td>
                      <td style={{ padding: "12px" }}>
                        <Btn small variant="light" onClick={() => setExpanded(expanded === d.id ? null : d.id)}>
                          <Icon name="eye" size={13} color={COLORS.textMid} /> View
                        </Btn>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>

        {/* Right Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Recent Notifications */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h4 style={{ margin: 0, fontWeight: 700, fontSize: 14, color: COLORS.text }}>Recent Notifications</h4>
              <Btn small variant="ghost">View all</Btn>
            </div>
            {[
              { text: "No dues reminders yet",   sub: "You'll see updates here once posted by the HOA Office." },
              { text: "Stay informed",            sub: "Announcements and reminders will appear here." },
              { text: "Enable notifications",     sub: "Turn on notifications to never miss an important update." },
            ].map((n, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < 2 ? `1px solid ${COLORS.border}` : "none" }}>
                <div style={{ background: COLORS.primaryBg, borderRadius: 8, padding: 7, flexShrink: 0, marginTop: 1 }}>
                  <Icon name="bell" size={14} color={COLORS.primary} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 2 }}>{n.text}</div>
                  <div style={{ fontSize: 11, color: COLORS.textLight, lineHeight: 1.5 }}>{n.sub}</div>
                </div>
                <span style={{ fontSize: 11, color: COLORS.textLight, flexShrink: 0 }}>—</span>
              </div>
            ))}
          </Card>

          {/* Quick Actions */}
          <Card>
            <h4 style={{ margin: "0 0 14px", fontWeight: 700, fontSize: 14, color: COLORS.text }}>Quick Actions</h4>
            {[
              { icon: "file",     label: "View Notifications",  sub: "See all announcements and reminders" },
              { icon: "clock",    label: "View Payment History", sub: "Check your past payments and receipts" },
              { icon: "phone",    label: "Contact HOA Office",   sub: "Reach out for questions or assistance" },
            ].map((a, i) => (
              <button key={i} type="button"
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, border: `1px solid ${COLORS.border}`, background: "#fff", cursor: "pointer", fontFamily: "inherit", marginBottom: i < 2 ? 8 : 0, textAlign: "left" }}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.bg}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}
              >
                <div style={{ background: COLORS.primaryBg, borderRadius: 8, padding: 8, flexShrink: 0 }}>
                  <Icon name={a.icon} size={15} color={COLORS.primary} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: COLORS.textLight }}>{a.sub}</div>
                </div>
                <Icon name="arrow_right" size={14} color={COLORS.textLight} />
              </button>
            ))}
          </Card>
        </div>
      </div>

      <div style={{ marginTop: 28, paddingTop: 16, borderTop: `1px solid ${COLORS.border}`, textAlign: "center", fontSize: 11, color: COLORS.textLight }}>
        © 2026 South Meridian Phase 2 HOA. All rights reserved.
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DocumentsPage
// ---------------------------------------------------------------------------
export function DocumentsPage() {
  const docs = [
    { name: "HOA Rules & Regulations 2026", type: "PDF",  size: "2.4 MB",  date: "Jan 1, 2026" },
    { name: "Clearance Request Form",        type: "DOCX", size: "145 KB",  date: "Mar 10, 2026" },
    { name: "Facility Use Agreement",        type: "PDF",  size: "890 KB",  date: "Feb 1, 2026" },
    { name: "Construction Permit Form",      type: "DOCX", size: "210 KB",  date: "Apr 5, 2026" },
    { name: "Move-In/Move-Out Clearance",    type: "PDF",  size: "670 KB",  date: "Jan 15, 2026" },
    { name: "Vehicle Sticker Application",   type: "PDF",  size: "120 KB",  date: "Jan 1, 2026" },
  ];
  return (
    <div style={{ padding: 28 }}>
      <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700, color: COLORS.text }}>Documents & Forms</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
        {docs.map(d => (
          <Card key={d.name} pad="1rem" style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ background: d.type === "PDF" ? COLORS.dangerBg : COLORS.infoBg, borderRadius: 8, padding: 10, flexShrink: 0 }}>
              <Icon name="file" size={22} color={d.type === "PDF" ? COLORS.danger : COLORS.info} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: COLORS.text, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
              <div style={{ fontSize: 11, color: COLORS.textLight }}>{d.type} · {d.size} · {d.date}</div>
            </div>
            <Btn small variant="light"><Icon name="download" size={13} color={COLORS.textMid} /></Btn>
          </Card>
        ))}
      </div>
    </div>
  );
}