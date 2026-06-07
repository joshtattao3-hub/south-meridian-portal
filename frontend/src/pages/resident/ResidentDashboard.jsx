import { useState, useEffect } from "react";
import COLORS from "../../constants/colors";
import { Badge, Btn, Card, StatCard } from "../../components/UI";
import Icon from "../../components/Icon";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api";

function getComplaintStats(complaints = []) {
  const open = complaints.filter(c => c.status !== "Resolved" && c.status !== "Closed").length;
  const inProgress = complaints.filter(c => c.status === "In Progress").length;
  return { open, inProgress };
}

function getReservationStats(reservations = []) {
  const pending = reservations.filter(r => r.status === "Pending").length;
  return { total: reservations.length, pending };
}

function getNoticeStats(announcements = []) {
  const now = new Date();
  const thisMonth = announcements.filter(a => {
    const d = new Date(a.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;
  return { thisMonth };
}

export default function ResidentDashboard({ setView }) {
  const { user } = useAuth();

  const [complaints, setComplaints]       = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [reservations, setReservations]   = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    async function fetchDashboardData() {
      setLoading(true); setError(null);
      try {
        const [complaintsData, announcementsData, reservationsData] = await Promise.all([
          api.getComplaints({ resident_id: user.id }),
          api.getAnnouncements(),
          api.getReservations({ resident_id: user.id }),
        ]);
        if (!cancelled) {
          setComplaints(complaintsData);
          setAnnouncements(announcementsData);
          setReservations(reservationsData);
        }
      } catch (err) {
        if (!cancelled) setError(err.message ?? "Failed to load dashboard data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchDashboardData();
    return () => { cancelled = true; };
  }, [user?.id]);

  const balance   = user?.balance   ?? 0;
  const duePeriod = user?.due_period ?? null;

  const { open: openComplaints, inProgress }  = getComplaintStats(complaints);
  const { total: totalReservations, pending: pendingReservations } = getReservationStats(reservations);
  const { thisMonth: newNotices }             = getNoticeStats(announcements);

  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <>
      <style>{`
        @media (max-width: 900px) {
          .dash-stats    { grid-template-columns: repeat(2,1fr) !important; }
          .dash-activity { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .dash-stats        { grid-template-columns: 1fr 1fr !important; }
          .dash-banner       { flex-direction: column !important; gap: 16px !important; }
          .dash-banner-balance { text-align: left !important; }
        }
        .complaint-row:hover { background: ${COLORS.bg} !important; }
        .view-link:hover { text-decoration: underline !important; }
      `}</style>

      <div style={{ padding: 28 }}>

        {error && (
          <div style={{ background: COLORS.dangerBg, border: `1px solid ${COLORS.danger}`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: COLORS.danger, fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>⚠ {error}</span>
            <Btn small variant="ghost" onClick={() => setError(null)}>Dismiss</Btn>
          </div>
        )}

        {/* ── Welcome Banner ── */}
        <div
          className="dash-banner"
          style={{
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight ?? "#2d6a2d"} 100%)`,
            borderRadius: 14, padding: "28px 32px", marginBottom: 20,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            position: "relative", overflow: "hidden",
          }}
        >
          {/* Subtle background pattern circles */}
          <div style={{ position: "absolute", right: 180, top: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
          <div style={{ position: "absolute", right: 120, bottom: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

          <div style={{ position: "relative" }}>
            <div style={{ color: "#fff", fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
              Hello, {user?.first_name ?? "Resident"}! 👋
            </div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>
              {user?.block_lot ?? ""} · {today}
            </div>
          </div>

          <div className="dash-banner-balance" style={{ textAlign: "right", position: "relative" }}>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4 }}>
              CURRENT BALANCE
            </div>
            <div style={{ color: COLORS.gold ?? "#F5A623", fontSize: 32, fontWeight: 800, lineHeight: 1 }}>
              {loading ? <span style={{ opacity: 0.4 }}>—</span> : `₱${balance.toLocaleString()}`}
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 6 }}>
              {duePeriod ? `${duePeriod} Due` : "— No due"}
            </div>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div
          className="dash-stats"
          style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}
        >
          {[
            {
              icon: "dollar", label: "Unpaid Dues",
              value: loading ? "…" : `₱${balance.toLocaleString()}`,
              color: COLORS.warning ?? "#F59E0B",
              sub: balance === 0 ? "No outstanding balance" : duePeriod ?? "",
            },
            {
              icon: "chat", label: "Open Complaints",
              value: loading ? "…" : String(openComplaints),
              color: COLORS.danger ?? "#EF4444",
              sub: loading ? "" : `${inProgress} in progress`,
            },
            {
              icon: "calendar", label: "Reservations",
              value: loading ? "…" : String(totalReservations),
              color: COLORS.primary,
              sub: loading ? "" : `${pendingReservations} pending approval`,
            },
            {
              icon: "bell", label: "New Notices",
              value: loading ? "…" : String(newNotices),
              color: COLORS.info ?? "#3B82F6",
              sub: "This month",
            },
          ].map(s => (
            <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} color={s.color} sub={s.sub} />
          ))}
        </div>

        {/* ── Recent Activity ── */}
        <div className="dash-activity" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

          {/* Recent Complaints */}
          <Card style={{ padding: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px 14px" }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: COLORS.text }}>Recent Complaints</h3>
              <Btn small variant="ghost" onClick={() => setView("complaints")}>View All</Btn>
            </div>

            <div style={{ padding: "0 4px" }}>
              {loading && (
                <div style={{ color: COLORS.textLight, fontSize: 13, padding: "12px 16px" }}>Loading…</div>
              )}
              {!loading && complaints.length === 0 && (
                <div style={{ color: COLORS.textLight, fontSize: 13, padding: "12px 16px" }}>No complaints filed yet.</div>
              )}
              {!loading && complaints.slice(0, 3).map((c, i) => (
                <div
                  key={c.id}
                  className="complaint-row"
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "12px 16px", borderRadius: 10, cursor: "pointer",
                    borderBottom: i < Math.min(complaints.length, 3) - 1 ? `1px solid ${COLORS.border}` : "none",
                    transition: "background 0.15s",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, marginRight: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 2 }}>{c.subject}</div>
                    <div style={{ fontSize: 11, color: COLORS.textLight, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.id}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <Badge label={c.status} />
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.textLight} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {!loading && complaints.length > 0 && (
              <div style={{ padding: "12px 20px", borderTop: `1px solid ${COLORS.border}` }}>
                <button
                  className="view-link"
                  onClick={() => setView("complaints")}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: COLORS.primary, fontWeight: 600, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6, padding: 0 }}
                >
                  View all complaints
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </div>
            )}
          </Card>

          {/* Announcements */}
          <Card style={{ padding: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px 14px" }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: COLORS.text }}>Announcements</h3>
              <Btn small variant="ghost" onClick={() => setView("announcements-p")}>View All</Btn>
            </div>

            <div style={{ padding: "0 4px" }}>
              {loading && (
                <div style={{ color: COLORS.textLight, fontSize: 13, padding: "12px 16px" }}>Loading…</div>
              )}
              {!loading && announcements.length === 0 && (
                <div style={{ textAlign: "center", padding: "32px 16px" }}>
                  <div style={{ background: COLORS.primaryBg, borderRadius: "50%", width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    <Icon name="bell" size={24} color={COLORS.primary} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>No announcements yet.</div>
                  <div style={{ fontSize: 12, color: COLORS.textLight }}>Check back later for updates and important notices.</div>
                </div>
              )}
              {!loading && announcements.slice(0, 3).map((a, i) => (
                <div
                  key={a.id}
                  style={{
                    padding: "12px 16px", borderRadius: 10,
                    borderBottom: i < Math.min(announcements.length, 3) - 1 ? `1px solid ${COLORS.border}` : "none",
                  }}
                >
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                    <Badge label={a.tag} />
                    <span style={{ fontSize: 11, color: COLORS.textLight }}>{a.date}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{a.title}</div>
                </div>
              ))}
            </div>

            {!loading && announcements.length > 0 && (
              <div style={{ padding: "12px 20px", borderTop: `1px solid ${COLORS.border}` }}>
                <button
                  className="view-link"
                  onClick={() => setView("announcements-p")}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: COLORS.primary, fontWeight: 600, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6, padding: 0 }}
                >
                  View all announcements
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </div>
            )}
          </Card>
        </div>

        {/* ── Community Banner ── */}
        <div style={{
          background: "#fff", borderRadius: 14, border: `1px solid ${COLORS.border}`,
          padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ background: COLORS.primaryBg, borderRadius: 10, padding: 10, flexShrink: 0 }}>
              <Icon name="shield" size={22} color={COLORS.primary} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 2 }}>
                Thank you for being part of South Meridian Homes Phase 2.
              </div>
              <div style={{ fontSize: 12, color: COLORS.textLight }}>
                Together, let's build a safe, clean, and vibrant community.
              </div>
            </div>
          </div>
          {/* Simple house illustration using SVG */}
          <svg width="90" height="54" viewBox="0 0 90 54" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, opacity: 0.18 }}>
            <rect x="10" y="26" width="30" height="24" rx="2" fill={COLORS.primary}/>
            <polygon points="25,6 0,28 50,28" fill={COLORS.primary}/>
            <rect x="20" y="36" width="10" height="14" rx="1" fill="#fff"/>
            <rect x="50" y="30" width="22" height="20" rx="2" fill={COLORS.primary}/>
            <polygon points="61,16 44,32 78,32" fill={COLORS.primary}/>
            <rect x="56" y="38" width="8" height="12" rx="1" fill="#fff"/>
            <rect x="0" y="50" width="90" height="4" rx="2" fill={COLORS.primary}/>
          </svg>
        </div>

      </div>
    </>
  );
}