import { useState } from "react";
import COLORS from "../../constants/colors";
import { Badge, Btn, Card, StatCard } from "../../components/UI";
import Icon from "../../components/Icon";
import { COMPLAINTS, DUES, FACILITIES } from "../../constants/mockData";

export function ComplaintsPage() {
  const [showForm, setShowForm] = useState(false);
  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: COLORS.text }}>My Complaints</h3>
        <Btn onClick={() => setShowForm(!showForm)}><Icon name="plus" size={16} color="#fff" /> New Complaint</Btn>
      </div>

      {showForm && (
        <Card style={{ marginBottom: 20, borderTop: `3px solid ${COLORS.primary}` }}>
          <h4 style={{ margin: "0 0 16px", color: COLORS.text }}>Submit a Complaint</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMid, display: "block", marginBottom: 4 }}>Category</label>
              <select style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${COLORS.border}`, fontSize: 14, fontFamily: "inherit" }}>
                {["Infrastructure", "Noise", "Security", "Utilities", "Others"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMid, display: "block", marginBottom: 4 }}>Priority</label>
              <select style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${COLORS.border}`, fontSize: 14, fontFamily: "inherit" }}>
                {["Low", "Medium", "High"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMid, display: "block", marginBottom: 4 }}>Subject</label>
            <input style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${COLORS.border}`, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMid, display: "block", marginBottom: 4 }}>Description</label>
            <textarea rows={3} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${COLORS.border}`, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box", resize: "vertical" }} />
          </div>
          <div style={{ border: `2px dashed ${COLORS.border}`, borderRadius: 8, padding: "20px", textAlign: "center", marginBottom: 14, background: COLORS.bg, cursor: "pointer" }}>
            <Icon name="upload" size={24} color={COLORS.textLight} />
            <div style={{ fontSize: 13, color: COLORS.textMid, marginTop: 8 }}>Click to upload photos (optional)</div>
            <div style={{ fontSize: 11, color: COLORS.textLight, marginTop: 2 }}>PNG, JPG up to 10MB</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={() => setShowForm(false)}>Submit Complaint</Btn>
            <Btn variant="light" onClick={() => setShowForm(false)}>Cancel</Btn>
          </div>
        </Card>
      )}

      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
              {["Ticket ID", "Subject", "Priority", "Status", "Date", "Action"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: COLORS.textMid, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPLAINTS.map(c => (
              <tr key={c.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: "12px", fontWeight: 600, color: COLORS.primary, fontSize: 12 }}>{c.id}</td>
                <td style={{ padding: "12px", color: COLORS.text }}>{c.subject}</td>
                <td style={{ padding: "12px" }}><Badge label={c.priority} /></td>
                <td style={{ padding: "12px" }}><Badge label={c.status} /></td>
                <td style={{ padding: "12px", color: COLORS.textMid }}>{c.date}</td>
                <td style={{ padding: "12px" }}><Btn small variant="light"><Icon name="eye" size={13} color={COLORS.textMid} /> View</Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export function DuesPage() {
  return (
    <div style={{ padding: 28 }}>
      <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700, color: COLORS.text }}>HOA Dues & Payments</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard icon="dollar" label="Current Balance" value="₱1,500" color={COLORS.warning} sub="June 2026" />
        <StatCard icon="check" label="Total Paid (2026)" value="₱6,000" color={COLORS.success} sub="4 months" />
        <StatCard icon="calendar" label="Next Due Date" value="Jun 15" color={COLORS.primary} sub="₱1,500" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <Card>
          <h4 style={{ margin: "0 0 16px", fontWeight: 700, color: COLORS.text }}>Payment History</h4>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
                {["Month", "Amount", "Status", "Date Paid", "Receipt"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: COLORS.textMid, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DUES.map(d => (
                <tr key={d.month} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: "12px 10px", fontWeight: 600, color: COLORS.text }}>{d.month}</td>
                  <td style={{ padding: "12px 10px", color: COLORS.text }}>₱{d.amount.toLocaleString()}</td>
                  <td style={{ padding: "12px 10px" }}><Badge label={d.status} /></td>
                  <td style={{ padding: "12px 10px", color: COLORS.textMid }}>{d.date}</td>
                  <td style={{ padding: "12px 10px" }}>
                    {d.status === "Paid"
                      ? <Btn small variant="light"><Icon name="download" size={13} color={COLORS.textMid} /> PDF</Btn>
                      : <Btn small variant="gold">Pay Now</Btn>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card>
          <h4 style={{ margin: "0 0 16px", fontWeight: 700, color: COLORS.text }}>Pay Now</h4>
          <div style={{ background: COLORS.warningBg, borderRadius: 10, padding: 16, marginBottom: 16, textAlign: "center" }}>
            <div style={{ fontSize: 12, color: COLORS.warning, fontWeight: 600 }}>AMOUNT DUE</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: COLORS.warning, margin: "6px 0" }}>₱1,500</div>
            <div style={{ fontSize: 12, color: COLORS.warning }}>June 2026 · Due Jun 15</div>
          </div>
          {["GCash", "Maya", "Bank Transfer", "Cash (On-site)"].map(m => (
            <button key={m} style={{ width: "100%", textAlign: "left", padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${COLORS.border}`, background: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", marginBottom: 8, fontFamily: "inherit", color: COLORS.text }}>{m}</button>
          ))}
          <Btn style={{ width: "100%", justifyContent: "center", marginTop: 4 }}>Proceed to Payment</Btn>
        </Card>
      </div>
    </div>
  );
}

export function ReservationsPage() {
  const [selectedFacility, setSelectedFacility] = useState(null);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dates = [2, 3, 4, 5, 6, 7, 8];
  const occupied = { "3-1": true, "5-2": true, "6-0": true, "7-1": true };

  return (
    <div style={{ padding: 28 }}>
      <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700, color: COLORS.text }}>Facility Reservations</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {FACILITIES.map(f => (
          <Card key={f.id} style={{ cursor: "pointer", border: `2px solid ${selectedFacility === f.id ? COLORS.primary : COLORS.border}`, transition: "all 0.15s" }} onClick={() => setSelectedFacility(selectedFacility === f.id ? null : f.id)}>
            <div style={{ background: selectedFacility === f.id ? COLORS.primaryBg : COLORS.bg, borderRadius: 10, padding: 12, textAlign: "center", marginBottom: 10 }}>
              <Icon name={f.icon} size={28} color={selectedFacility === f.id ? COLORS.primary : COLORS.textMid} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.text }}>{f.name}</div>
            <div style={{ fontSize: 11, color: COLORS.textLight, marginTop: 2 }}>{f.capacity}</div>
          </Card>
        ))}
      </div>

      {selectedFacility && (
        <Card style={{ marginBottom: 20 }}>
          <h4 style={{ margin: "0 0 16px", color: COLORS.text }}>
            Select Date & Time — {FACILITIES.find(f => f.id === selectedFacility)?.name}
          </h4>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMid, marginBottom: 10 }}>June 2026</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, textAlign: "center" }}>
              {days.map(d => <div key={d} style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMid, padding: "4px 0" }}>{d}</div>)}
              {dates.map((d, i) => {
                const key = `${d}-${i % 3}`;
                const isOccupied = occupied[key];
                return (
                  <div key={d} style={{ padding: "8px 4px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: isOccupied ? "default" : "pointer", background: isOccupied ? COLORS.dangerBg : d === 5 ? COLORS.primary : "#fff", color: isOccupied ? COLORS.danger : d === 5 ? "#fff" : COLORS.text, border: `1px solid ${isOccupied ? COLORS.danger + "33" : COLORS.border}` }}>{d}</div>
                );
              })}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMid, marginBottom: 8 }}>Available Time Slots</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {FACILITIES.find(f => f.id === selectedFacility)?.slots.map(s => (
                <button key={s} style={{ padding: "6px 14px", borderRadius: 8, border: `1.5px solid ${COLORS.primary}`, background: COLORS.primaryBg, color: COLORS.primary, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{s}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMid, display: "block", marginBottom: 4 }}>Purpose / Notes</label>
            <textarea rows={2} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${COLORS.border}`, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box", resize: "vertical" }} placeholder="Birthday party, family reunion, etc." />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn>Submit Reservation</Btn>
            <Btn variant="light" onClick={() => setSelectedFacility(null)}>Cancel</Btn>
          </div>
        </Card>
      )}

      <Card>
        <h4 style={{ margin: "0 0 16px", fontWeight: 700, color: COLORS.text }}>My Reservations</h4>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
              {["Facility", "Date", "Time Slot", "Purpose", "Status"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: COLORS.textMid, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { facility: "Main Clubhouse", date: "Jun 7, 2026", slot: "1PM–5PM", purpose: "Birthday Party", status: "Pending" },
              { facility: "Basketball Court", date: "May 20, 2026", slot: "6AM–9AM", purpose: "Sports Practice", status: "Resolved" },
            ].map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <td style={{ padding: "12px", fontWeight: 600, color: COLORS.text }}>{r.facility}</td>
                <td style={{ padding: "12px", color: COLORS.textMid }}>{r.date}</td>
                <td style={{ padding: "12px", color: COLORS.textMid }}>{r.slot}</td>
                <td style={{ padding: "12px", color: COLORS.textMid }}>{r.purpose}</td>
                <td style={{ padding: "12px" }}><Badge label={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export function DocumentsPage() {
  const docs = [
    { name: "HOA Rules & Regulations 2026", type: "PDF", size: "2.4 MB", date: "Jan 1, 2026" },
    { name: "Clearance Request Form", type: "DOCX", size: "145 KB", date: "Mar 10, 2026" },
    { name: "Facility Use Agreement", type: "PDF", size: "890 KB", date: "Feb 1, 2026" },
    { name: "Construction Permit Form", type: "DOCX", size: "210 KB", date: "Apr 5, 2026" },
    { name: "Move-In/Move-Out Clearance", type: "PDF", size: "670 KB", date: "Jan 15, 2026" },
    { name: "Vehicle Sticker Application", type: "PDF", size: "120 KB", date: "Jan 1, 2026" },
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