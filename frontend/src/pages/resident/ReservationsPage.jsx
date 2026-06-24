import { useState, useEffect } from "react";
import COLORS from "../../constants/colors";
import { Badge, Btn, Card } from "../../components/UI";
import Icon from "../../components/Icon";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api";

// ── Helpers ───────────────────────────────────────────────────────────────
function formatDate(raw) {
  if (!raw) return "—";
  return new Date(raw).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function Toast({ message, type = "success", onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  const bg = type === "success" ? "#166534" : COLORS.danger;
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 2000,
      background: bg, color: "#fff", borderRadius: 10, padding: "14px 20px",
      display: "flex", alignItems: "center", gap: 10,
      boxShadow: "0 8px 32px rgba(0,0,0,0.18)", fontSize: 14, fontWeight: 600,
      animation: "slideUp 0.25s ease",
    }}>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
      <span style={{ fontSize: 18 }}>{type === "success" ? "✓" : "⚠"}</span>
      {message}
    </div>
  );
}

// ── Status badge colours ──────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    Pending:  { bg: "#fef9c3", color: "#854d0e", border: "#fde047" },
    Approved: { bg: "#dcfce7", color: "#166534", border: "#86efac" },
    Rejected: { bg: "#fee2e2", color: "#991b1b", border: "#fca5a5" },
    Cancelled:{ bg: "#f3f4f6", color: "#6b7280", border: "#d1d5db" },
  };
  const s = map[status] ?? map.Pending;
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>{status ?? "Pending"}</span>
  );
}

// ── Cancel confirmation modal ─────────────────────────────────────────────
function CancelModal({ reservation, onClose, onConfirm, loading }) {
  if (!reservation) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 14, padding: 28, width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}>
        <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 800, color: COLORS.text }}>Cancel Reservation?</h3>
        <p style={{ margin: "0 0 20px", fontSize: 13, color: COLORS.textMid, lineHeight: 1.6 }}>
          This will cancel your reservation for <strong>{reservation.facility_name}</strong> on <strong>{formatDate(reservation.date)}</strong> ({reservation.time_slot}). This cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn type="button" variant="light" onClick={onClose} disabled={loading}>Keep It</Btn>
          <Btn type="button" variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Cancelling…" : "Yes, Cancel"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────
export default function ReservationsPage() {
  const { user } = useAuth();

  // ── Data ──
  const [facilities, setFacilities]   = useState([]);
  const [reservations, setReservations] = useState([]);
  const [slots, setSlots]             = useState([]);
  const [loadingFac, setLoadingFac]   = useState(true);
  const [loadingRes, setLoadingRes]   = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [facError, setFacError]       = useState(null);
  const [resError, setResError]       = useState(null);

  // ── Selection / form ──
  const [selectedFacility, setSelectedFacility] = useState(null);   // facility object
  const [selectedSlot, setSelectedSlot]         = useState(null);   // slot string
  const [selectedDate, setSelectedDate]         = useState("");
  const [purpose, setPurpose]                   = useState("");
  const [formError, setFormError]               = useState(null);
  const [submitting, setSubmitting]             = useState(false);

  // ── Cancel ──
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling]     = useState(false);

  // ── Toast ──
  const [toast, setToast] = useState(null);

  // ── Load facilities ──
  useEffect(() => {
    api.getFacilities()
      .then(data => setFacilities(data))
      .catch(err  => setFacError(err.message ?? "Failed to load facilities."))
      .finally(() => setLoadingFac(false));
  }, []);

  // ── Load user's reservations ──
  async function loadReservations() {
    setLoadingRes(true); setResError(null);
    try {
      const data = await api.getReservations({ resident_id: user?.id });
      setReservations(data);
    } catch (err) {
      setResError(err.message ?? "Failed to load reservations.");
    } finally {
      setLoadingRes(false);
    }
  }
  useEffect(() => { if (user?.id) loadReservations(); }, [user?.id]);

  // ── Load slots when facility selected ──
  useEffect(() => {
    if (!selectedFacility) { setSlots([]); setSelectedSlot(null); return; }
    setLoadingSlots(true);
    api.getSlots(selectedFacility.id)
      .then(data  => setSlots(Array.isArray(data) ? data : data.slots ?? []))
      .catch(()   => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedFacility]);

  // ── Pick facility ──
  function handlePickFacility(fac) {
    if (selectedFacility?.id === fac.id) {
      setSelectedFacility(null); setSelectedSlot(null); setSelectedDate(""); setPurpose(""); setFormError(null);
    } else {
      setSelectedFacility(fac); setSelectedSlot(null); setSelectedDate(""); setPurpose(""); setFormError(null);
    }
  }

  // ── Submit reservation ──
  async function handleSubmit() {
    if (!selectedDate)  { setFormError("Please pick a date."); return; }
    if (!selectedSlot)  { setFormError("Please select a time slot."); return; }
    if (!purpose.trim()){ setFormError("Please enter a purpose or notes."); return; }

    setSubmitting(true); setFormError(null);
    try {
      await api.createReservation({
        resident_id:  user?.id,
        facility_id:  selectedFacility.id,
        date:         selectedDate,
        time_slot:    selectedSlot,
        purpose:      purpose.trim(),
      });
      setToast({ message: "Reservation submitted! Awaiting officer approval.", type: "success" });
      setSelectedFacility(null); setSelectedSlot(null); setSelectedDate(""); setPurpose(""); setFormError(null);
      await loadReservations();
    } catch (err) {
      setFormError(err.message ?? "Failed to submit reservation.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Cancel reservation ──
  async function handleCancel() {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await api.cancelReservation(cancelTarget.id);
      setToast({ message: "Reservation cancelled.", type: "success" });
      setCancelTarget(null);
      await loadReservations();
    } catch (err) {
      setToast({ message: err.message ?? "Failed to cancel.", type: "error" });
      setCancelTarget(null);
    } finally {
      setCancelling(false);
    }
  }

  // ── Min date = today ──
  const today = new Date().toISOString().split("T")[0];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
      <CancelModal
        reservation={cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        loading={cancelling}
      />

      <div style={{ padding: "24px 28px" }}>

        {/* ── Page header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: COLORS.textLight }}>
              Book a facility and wait for officer approval.
            </p>
          </div>
        </div>

        {/* ── Facility error ── */}
        {facError && (
          <div style={{ background: COLORS.dangerBg, border: `1px solid ${COLORS.danger}`, borderRadius: 8, padding: "10px 14px", marginBottom: 20, color: COLORS.danger, fontSize: 13 }}>
            ⚠ {facError}
          </div>
        )}

        {/* ── Facility picker ── */}
        {loadingFac ? (
          <div style={{ color: COLORS.textLight, fontSize: 13, padding: "24px 0", textAlign: "center" }}>Loading facilities…</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
            {facilities.map(f => {
              const active = selectedFacility?.id === f.id;
              return (
                <div key={f.id} onClick={() => handlePickFacility(f)} style={{
                  background: "#fff", borderRadius: 14, padding: "18px 16px",
                  border: `2px solid ${active ? COLORS.primary : COLORS.border}`,
                  cursor: "pointer", transition: "all 0.15s", textAlign: "center",
                  boxShadow: active ? `0 0 0 3px ${COLORS.primary}22` : "none",
                }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = `${COLORS.primary}60`; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = COLORS.border; }}>
                  <div style={{
                    background: active ? COLORS.primaryBg : COLORS.bg,
                    borderRadius: 10, padding: 12, marginBottom: 10,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon name={f.icon ?? "building"} size={28} color={active ? COLORS.primary : COLORS.textMid} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: active ? COLORS.primary : COLORS.text, marginBottom: 3 }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: COLORS.textLight }}>{f.capacity ?? ""}</div>
                  {f.available === false && (
                    <div style={{ marginTop: 6, fontSize: 10, fontWeight: 700, color: COLORS.danger, background: COLORS.dangerBg, borderRadius: 20, padding: "2px 8px", display: "inline-block" }}>Unavailable</div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Booking form ── */}
        {selectedFacility && (
          <Card style={{ marginBottom: 24 }}>
            {/* Card header */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
              <div style={{ background: COLORS.primaryBg, borderRadius: 10, width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={selectedFacility.icon ?? "building"} size={22} color={COLORS.primary} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.text }}>{selectedFacility.name}</div>
                <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 2 }}>
                  {selectedFacility.capacity && <span>{selectedFacility.capacity} · </span>}
                  Fill in the details below to request a booking.
                </div>
              </div>
              <button type="button" onClick={() => handlePickFacility(selectedFacility)}
                style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: COLORS.textLight, fontSize: 20, padding: 4, lineHeight: 1 }}>✕</button>
            </div>

            {formError && (
              <div style={{ background: COLORS.dangerBg, border: `1px solid ${COLORS.danger}`, borderRadius: 8, padding: "10px 14px", marginBottom: 18, color: COLORS.danger, fontSize: 13 }}>
                ⚠ {formError}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
              {/* Date */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>
                  Date <span style={{ color: COLORS.danger }}>*</span>
                </label>
                <input
                  type="date"
                  min={today}
                  value={selectedDate}
                  onChange={e => { setSelectedDate(e.target.value); setFormError(null); }}
                  style={{
                    width: "100%", padding: "10px 13px", borderRadius: 8,
                    border: `1.5px solid ${COLORS.border}`, fontSize: 13.5,
                    fontFamily: "inherit", boxSizing: "border-box", color: COLORS.text,
                    outline: "none",
                  }}
                  onFocus={e => e.target.style.borderColor = COLORS.primary}
                  onBlur={e => e.target.style.borderColor = COLORS.border}
                />
              </div>

              {/* Time slot */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>
                  Time Slot <span style={{ color: COLORS.danger }}>*</span>
                </label>
                {loadingSlots ? (
                  <div style={{ fontSize: 13, color: COLORS.textLight, padding: "10px 0" }}>Loading slots…</div>
                ) : slots.length > 0 ? (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {slots.map(s => {
                      const slotLabel = typeof s === "string" ? s : s.label ?? s.time_slot ?? String(s);
                      const active = selectedSlot === slotLabel;
                      return (
                        <button key={slotLabel} type="button"
                          onClick={() => { setSelectedSlot(slotLabel); setFormError(null); }}
                          style={{
                            padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                            fontFamily: "inherit", cursor: "pointer", transition: "all 0.15s",
                            border: `1.5px solid ${active ? COLORS.primary : COLORS.border}`,
                            background: active ? COLORS.primary : "#fff",
                            color: active ? "#fff" : COLORS.text,
                          }}>
                          {slotLabel}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: COLORS.textLight, padding: "10px 0" }}>
                    No slots configured for this facility.
                  </div>
                )}
              </div>
            </div>

            {/* Purpose */}
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>
                Purpose / Notes <span style={{ color: COLORS.danger }}>*</span>
              </label>
              <textarea
                rows={3}
                value={purpose}
                onChange={e => { setPurpose(e.target.value); setFormError(null); }}
                placeholder="e.g. Birthday party, sports practice, family reunion…"
                style={{
                  width: "100%", padding: "10px 13px", borderRadius: 8,
                  border: `1.5px solid ${COLORS.border}`, fontSize: 13.5,
                  fontFamily: "inherit", boxSizing: "border-box", resize: "vertical",
                  color: COLORS.text, outline: "none",
                }}
                onFocus={e => e.target.style.borderColor = COLORS.primary}
                onBlur={e => e.target.style.borderColor = COLORS.border}
              />
            </div>

            {/* Info note */}
            <div style={{ background: COLORS.primaryBg, borderRadius: 9, padding: "10px 14px", marginBottom: 18, fontSize: 12, color: COLORS.textLight, display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ color: COLORS.primary, fontWeight: 700, flexShrink: 0 }}>ℹ</span>
              Your request will be reviewed by an HOA officer. You'll see the status update in "My Reservations" below.
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <Btn type="button" onClick={handleSubmit} disabled={submitting}
                style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="calendar" size={14} color="#fff" />
                {submitting ? "Submitting…" : "Submit Reservation"}
              </Btn>
              <Btn type="button" variant="light" onClick={() => handlePickFacility(selectedFacility)}>Cancel</Btn>
            </div>
          </Card>
        )}

        {/* ── My Reservations ── */}
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>My Reservations</div>
            <button type="button" onClick={loadReservations} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.primary, fontSize: 12, fontWeight: 600, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>
              <Icon name="refresh" size={13} color={COLORS.primary} /> Refresh
            </button>
          </div>

          {resError && (
            <div style={{ background: COLORS.dangerBg, border: `1px solid ${COLORS.danger}`, borderRadius: 8, margin: 16, padding: "10px 14px", color: COLORS.danger, fontSize: 13 }}>
              ⚠ {resError}
            </div>
          )}

          {loadingRes ? (
            <div style={{ color: COLORS.textLight, fontSize: 13, padding: "32px 0", textAlign: "center" }}>Loading reservations…</div>
          ) : reservations.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 24px" }}>
              <div style={{ background: COLORS.primaryBg, borderRadius: "50%", width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <Icon name="calendar" size={24} color={COLORS.primary} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>No reservations yet</div>
              <div style={{ fontSize: 13, color: COLORS.textLight }}>Pick a facility above to make your first booking.</div>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  {["Facility", "Date", "Time Slot", "Purpose", "Status", "Actions"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: COLORS.textLight, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, background: "#fff" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reservations.map(r => (
                  <tr key={r.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}
                    onMouseEnter={e => e.currentTarget.style.background = COLORS.bg}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "14px 16px", fontWeight: 600, color: COLORS.text }}>
                      {r.facility_name ?? r.facility ?? "—"}
                    </td>
                    <td style={{ padding: "14px 16px", color: COLORS.textMid }}>{formatDate(r.date)}</td>
                    <td style={{ padding: "14px 16px", color: COLORS.textMid }}>{r.time_slot ?? "—"}</td>
                    <td style={{ padding: "14px 16px", color: COLORS.textMid, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.purpose ?? "—"}</td>
                    <td style={{ padding: "14px 16px" }}><StatusBadge status={r.status} /></td>
                    <td style={{ padding: "14px 16px" }}>
                      {(r.status === "Pending" || r.status === "Approved") && (
                        <Btn type="button" small variant="danger"
                          onClick={() => setCancelTarget(r)}
                          style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                          Cancel
                        </Btn>
                      )}
                      {(r.status === "Cancelled" || r.status === "Rejected") && (
                        <span style={{ fontSize: 11, color: COLORS.textLight }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

      </div>
    </>
  );
}