import COLORS from "../../constants/colors";
import { Badge, Btn, Card, StatCard } from "../../components/UI";
import Icon from "../../components/Icon";
import { COMPLAINTS, USERS_ADMIN } from "../../constants/mockData";

export function AdminDashboardPage() {
  const bar = [65, 80, 55, 90, 70, 85, 92, 78, 60, 88, 95, 75];
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard icon="users" label="Total Residents" value="420" color={COLORS.primary} sub="+8 this month" />
        <StatCard icon="user" label="Active Users" value="387" color={COLORS.info} sub="92% activity rate" />
        <StatCard icon="chat" label="Pending Complaints" value="12" color={COLORS.danger} sub="3 high priority" />
        <StatCard icon="dollar" label="June Collections" value="₱312K" color={COLORS.success} sub="87% collected" />
        <StatCard icon="calendar" label="Reservations" value="8" color={COLORS.goldDark} sub="3 pending review" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h4 style={{ margin: 0, fontWeight: 700, color: COLORS.text }}>Monthly Collections (2026)</h4>
            <span style={{ fontSize: 12, color: COLORS.textLight }}>₱ in thousands</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120 }}>
            {bar.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <div style={{ width: "100%", background: i === 4 ? COLORS.primary : COLORS.primaryBg, borderRadius: "3px 3px 0 0", height: `${v * 1.1}px`, transition: "height 0.3s" }} />
                <span style={{ fontSize: 9, color: COLORS.textLight }}>{months[i]}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h4 style={{ margin: "0 0 16px", fontWeight: 700, color: COLORS.text }}>Dues Collection Rate</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[["Paid", 87, COLORS.success], ["Partial", 7, COLORS.gold], ["Unpaid", 6, COLORS.danger]].map(([l, p, c]) => (
              <div key={l}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: COLORS.textMid }}>{l}</span>
                  <span style={{ fontWeight: 600, color: c }}>{p}%</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: COLORS.bg }}>
                  <div style={{ height: "100%", width: `${p}%`, borderRadius: 4, background: c }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 11, color: COLORS.textMid, marginBottom: 8, fontWeight: 600 }}>Complaint Status</div>
            {[["Pending", 4], ["In Progress", 5], ["Resolved", 3]].map(([s, n]) => (
              <div key={s} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 12 }}>
                <span style={{ color: COLORS.textMid }}>{s}</span>
                <Badge label={s} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h4 style={{ margin: 0, fontWeight: 700, color: COLORS.text }}>Recent Activity</h4>
          <Btn small variant="light">View All</Btn>
        </div>
        {[
          { text: "New complaint submitted by Maria Santos — CMP-005", time: "2h ago", icon: "chat" },
          { text: "Payment received from Jose Reyes — ₱1,500 (June 2026)", time: "4h ago", icon: "dollar" },
          { text: "Reservation request for Main Clubhouse — June 7", time: "6h ago", icon: "calendar" },
          { text: "New resident registered — Pedro Lim, Block 8 Lot 2", time: "1d ago", icon: "user" },
          { text: "New announcement published — Water Service Interruption", time: "2d ago", icon: "bell" },
        ].map((a, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
            <div style={{ background: COLORS.primaryBg, borderRadius: 8, padding: 8, flexShrink: 0 }}>
              <Icon name={a.icon} size={16} color={COLORS.primary} />
            </div>
            <div style={{ flex: 1, fontSize: 13, color: COLORS.text }}>{a.text}</div>
            <span style={{ fontSize: 11, color: COLORS.textLight, flexShrink: 0 }}>{a.time}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

export function UserManagementPage() {
  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: COLORS.text }}>User Management</h3>
        <Btn><Icon name="plus" size={16} color="#fff" /> Add User</Btn>
      </div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}>
              <Icon name="search" size={16} color={COLORS.textLight} />
            </span>
            <input style={{ width: "100%", padding: "9px 12px 9px 36px", borderRadius: 8, border: `1.5px solid ${COLORS.border}`, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" }} placeholder="Search residents..." />
          </div>
          {["All Roles", "All Status"].map((label, i) => (
            <select key={i} style={{ padding: "9px 14px", borderRadius: 8, border: `1.5px solid ${COLORS.border}`, fontSize: 13, fontFamily: "inherit", color: COLORS.textMid }}>
              <option>{label}</option>
              {i === 0
                ? ["Resident", "HOA Officer", "Admin"].map(o => <option key={o}>{o}</option>)
                : ["Active", "Inactive"].map(o => <option key={o}>{o}</option>)}
            </select>
          ))}
        </div>
      </Card>
      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
              {["User", "Block & Lot", "Email", "Role", "Status", "Actions"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: COLORS.textMid, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {USERS_ADMIN.map(u => (
              <tr key={u.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: COLORS.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                      {u.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span style={{ fontWeight: 600, color: COLORS.text }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: "12px", color: COLORS.textMid }}>{u.block}</td>
                <td style={{ padding: "12px", color: COLORS.textMid }}>{u.email}</td>
                <td style={{ padding: "12px" }}><Badge label={u.role} /></td>
                <td style={{ padding: "12px" }}><Badge label={u.status} /></td>
                <td style={{ padding: "12px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn small variant="light"><Icon name="edit" size={13} color={COLORS.info} /></Btn>
                    <Btn small variant="light"><Icon name="trash" size={13} color={COLORS.danger} /></Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: "12px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: COLORS.textMid }}>Showing 5 of 420 users</span>
          <div style={{ display: "flex", gap: 6 }}>
            {[1, 2, 3, "...", "42"].map((p, i) => (
              <button key={i} style={{ width: 30, height: 30, borderRadius: 6, border: `1.5px solid ${p === 1 ? COLORS.primary : COLORS.border}`, background: p === 1 ? COLORS.primary : "#fff", color: p === 1 ? "#fff" : COLORS.textMid, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{p}</button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

export function ReportsPage() {
  return (
    <div style={{ padding: 28 }}>
      <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700, color: COLORS.text }}>Reports & Export</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {[
          { title: "Dues Collection Report", desc: "Monthly and annual collection summaries, payment status breakdown", icon: "dollar", color: COLORS.success },
          { title: "Complaint Summary", desc: "Complaint volume, resolution rate, category breakdown", icon: "chat", color: COLORS.danger },
          { title: "Resident Directory", desc: "Complete list of registered households with contact details", icon: "users", color: COLORS.primary },
          { title: "Facility Usage Report", desc: "Reservation frequency, popular facilities, peak hours", icon: "building", color: COLORS.goldDark },
          { title: "Financial Statement", desc: "Monthly income vs. expenses, fund balance", icon: "chart", color: COLORS.info },
          { title: "Audit Log", desc: "System activity, user actions, and change history", icon: "file", color: "#6A1B9A" },
        ].map(r => (
          <Card key={r.title} style={{ borderTop: `3px solid ${r.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ background: r.color + "15", borderRadius: 8, padding: 8 }}>
                <Icon name={r.icon} size={20} color={r.color} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{r.title}</div>
            </div>
            <p style={{ fontSize: 12, color: COLORS.textMid, margin: "0 0 16px", lineHeight: 1.6 }}>{r.desc}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn small variant="light"><Icon name="eye" size={13} color={COLORS.textMid} /> Preview</Btn>
              <Btn small><Icon name="download" size={13} color="#fff" /> Export</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ManageComplaintsPage() {
  return (
    <div style={{ padding: 28 }}>
      <Card>
        <h4 style={{ margin: "0 0 16px", color: COLORS.text }}>All Complaints</h4>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
              {["ID", "Resident", "Subject", "Priority", "Status", "Action"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: COLORS.textMid, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPLAINTS.map(c => (
              <tr key={c.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: "12px", fontWeight: 600, color: COLORS.primary, fontSize: 12 }}>{c.id}</td>
                <td style={{ padding: "12px", color: COLORS.text }}>Maria Santos</td>
                <td style={{ padding: "12px", color: COLORS.text }}>{c.subject}</td>
                <td style={{ padding: "12px" }}><Badge label={c.priority} /></td>
                <td style={{ padding: "12px" }}><Badge label={c.status} /></td>
                <td style={{ padding: "12px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn small variant="light"><Icon name="eye" size={13} color={COLORS.info} /> View</Btn>
                    <Btn small><Icon name="edit" size={13} color="#fff" /> Update</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export function SystemSettingsPage() {
  return (
    <div style={{ padding: 28 }}>
      <Card>
        <h4 style={{ margin: "0 0 16px", color: COLORS.text }}>System Settings</h4>
        <p style={{ color: COLORS.textMid, fontSize: 14 }}>Configure system-wide settings, email notifications, and HOA parameters.</p>
      </Card>
    </div>
  );
}