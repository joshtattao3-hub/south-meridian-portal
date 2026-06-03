import { useState } from "react";
import COLORS from "../../constants/colors";
import { Badge, Btn, Card, StatCard } from "../../components/UI";
import { COMPLAINTS, ANNOUNCEMENTS } from "../../constants/mockData";
import { useAuth } from "../../context/AuthContext";

export default function ResidentDashboard() {
  const { user } = useAuth();
  const balance = user?.balance ?? 1500;
  const duePeriod = user?.due_period ?? "June 2026";
  return (
    <>
      <style>{`
        @media (max-width: 900px) {
          .dash-stats { grid-template-columns: repeat(2,1fr) !important; }
          .dash-activity { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .dash-stats { grid-template-columns: 1fr 1fr !important; }
          .dash-banner { flex-direction: column !important; gap: 16px !important; }
          .dash-banner-balance { text-align: left !important; }
        }
      `}</style>

      <div style={{ padding: 28 }}>

        {/* Welcome banner */}
        <div className="dash-banner" style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`, borderRadius: 14, padding: "24px 28px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>
              Hello, {user?.first_name ?? "Resident"}!  
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 }}>
              {user?.block_lot ?? ""} · {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </div>
          </div>
          <div className="dash-banner-balance" style={{ textAlign: "right" }}>
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "12px 20px" }}>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginBottom: 2 }}>CURRENT BALANCE</div>
              <div style={{ color: COLORS.gold, fontSize: 28, fontWeight: 800 }}>₱{balance.toLocaleString()}</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 2 }}>{duePeriod} Due</div>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="dash-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
          <StatCard icon="dollar" label="Unpaid Dues" value={`₱${balance.toLocaleString()}`} color={COLORS.warning} sub={duePeriod} />
          <StatCard icon="chat"   label="Open Complaints" value="2"      color={COLORS.danger}  sub="1 in progress" />
          <StatCard icon="calendar" label="Reservations"  value="1"      color={COLORS.primary} sub="Pending approval" />
          <StatCard icon="bell"   label="New Notices"     value="4"      color={COLORS.info}    sub="This month" />
        </div>

        {/* Recent activity */}
        <div className="dash-activity" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: COLORS.text }}>Recent Complaints</h3>
              <Btn small variant="ghost">View All</Btn>
            </div>
            {COMPLAINTS.slice(0, 3).map(c => (
              <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{c.subject}</div>
                  <div style={{ fontSize: 11, color: COLORS.textLight, marginTop: 2 }}>{c.id} · {c.date}</div>
                </div>
                <Badge label={c.status} />
              </div>
            ))}
          </Card>

          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: COLORS.text }}>Announcements</h3>
              <Btn small variant="ghost">View All</Btn>
            </div>
            {ANNOUNCEMENTS.slice(0, 3).map(a => (
              <div key={a.id} style={{ padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
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