import { useState, useEffect } from "react";
import COLORS from "../../constants/colors";
import { Badge, Btn, Card, StatCard } from "../../components/UI";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getComplaintStats(complaints = []) {
  const open = complaints.filter(
    (c) => c.status !== "Resolved" && c.status !== "Closed"
  ).length;
  const inProgress = complaints.filter(
    (c) => c.status === "In Progress"
  ).length;
  return { open, inProgress };
}

function getReservationStats(reservations = []) {
  const pending = reservations.filter((r) => r.status === "Pending").length;
  return { total: reservations.length, pending };
}

function getNoticeStats(announcements = []) {
  const now = new Date();
  const thisMonth = announcements.filter((a) => {
    const d = new Date(a.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;
  return { thisMonth };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

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
      setLoading(true);
      setError(null);
      try {
        const [complaintsData, announcementsData, reservationsData] =
          await Promise.all([
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
  const duePeriod = user?.due_period ?? "—";

  const { open: openComplaints, inProgress }  = getComplaintStats(complaints);
  const { pending: pendingReservations }       = getReservationStats(reservations);
  const { thisMonth: newNotices }              = getNoticeStats(announcements);

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
      `}</style>

      <div style={{ padding: 28 }}>

        {error && (
          <div style={{
            background: COLORS.dangerBg,
            border: `1px solid ${COLORS.danger}`,
            borderRadius: 10,
            padding: "12px 16px",
            marginBottom: 20,
            color: COLORS.danger,
            fontSize: 13,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <span>⚠ {error}</span>
            <Btn small variant="ghost" onClick={() => setError(null)}>Dismiss</Btn>
          </div>
        )}

        {/* Welcome banner */}
        <div
          className="dash-banner"
          style={{
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
            borderRadius: 14,
            padding: "24px 28px",
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>
              Hello, {user?.first_name ?? "Resident"}!
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 }}>
              {user?.block_lot ?? ""} ·{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long", day: "numeric", year: "numeric",
              })}
            </div>
          </div>

          <div className="dash-banner-balance" style={{ textAlign: "right" }}>
            <div style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: 10,
              padding: "12px 20px",
            }}>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginBottom: 2 }}>
                CURRENT BALANCE
              </div>
              <div style={{ color: COLORS.gold, fontSize: 28, fontWeight: 800 }}>
                {loading
                  ? <span style={{ opacity: 0.4 }}>—</span>
                  : `₱${balance.toLocaleString()}`
                }
              </div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 2 }}>
                {duePeriod} Due
              </div>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div
          className="dash-stats"
          style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}
        >
          <StatCard
            icon="dollar"
            label="Unpaid Dues"
            value={loading ? "…" : `₱${balance.toLocaleString()}`}
            color={COLORS.warning}
            sub={duePeriod}
          />
          <StatCard
            icon="chat"
            label="Open Complaints"
            value={loading ? "…" : String(openComplaints)}
            color={COLORS.danger}
            sub={loading ? "" : `${inProgress} in progress`}
          />
          <StatCard
            icon="calendar"
            label="Reservations"
            value={loading ? "…" : String(reservations.length)}
            color={COLORS.primary}
            sub={loading ? "" : `${pendingReservations} pending approval`}
          />
          <StatCard
            icon="bell"
            label="New Notices"
            value={loading ? "…" : String(newNotices)}
            color={COLORS.info}
            sub="This month"
          />
        </div>

        {/* Recent activity */}
        <div
          className="dash-activity"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
        >
          {/* Recent Complaints */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: COLORS.text }}>
                Recent Complaints
              </h3>
              <Btn small variant="ghost" onClick={() => setView("complaints")}>
                View All
              </Btn>
            </div>

            {loading && (
              <div style={{ color: COLORS.textLight, fontSize: 13, padding: "12px 0" }}>Loading…</div>
            )}

            {!loading && complaints.length === 0 && (
              <div style={{ color: COLORS.textLight, fontSize: 13, padding: "12px 0" }}>No complaints filed yet.</div>
            )}

            {!loading && complaints.slice(0, 3).map((c) => (
              <div
                key={c.id}
                style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", padding: "10px 0",
                  borderBottom: `1px solid ${COLORS.border}`,
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{c.subject}</div>
                  <div style={{ fontSize: 11, color: COLORS.textLight, marginTop: 2 }}>{c.id} · {c.date}</div>
                </div>
                <Badge label={c.status} />
              </div>
            ))}
          </Card>

          {/* Announcements */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: COLORS.text }}>
                Announcements
              </h3>
              <Btn small variant="ghost" onClick={() => setView("announcements")}>
                View All
              </Btn>
            </div>

            {loading && (
              <div style={{ color: COLORS.textLight, fontSize: 13, padding: "12px 0" }}>Loading…</div>
            )}

            {!loading && announcements.length === 0 && (
              <div style={{ color: COLORS.textLight, fontSize: 13, padding: "12px 0" }}>No announcements yet.</div>
            )}

            {!loading && announcements.slice(0, 3).map((a) => (
              <div
                key={a.id}
                style={{ padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 3 }}>
                  <Badge label={a.tag} />
                  <span style={{ fontSize: 11, color: COLORS.textLight }}>{a.date}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{a.title}</div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
}