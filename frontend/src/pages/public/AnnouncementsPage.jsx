import COLORS from "../../constants/colors";
import { Badge, Card, Btn } from "../../components/UI";
import { ANNOUNCEMENTS } from "../../constants/mockData";

export default function AnnouncementsPage() {
  return (
    <div style={{ padding: 28 }}>
      <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700, color: COLORS.text }}>Announcements</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {ANNOUNCEMENTS.map(a => (
          <Card key={a.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Badge label={a.tag} />
                <span style={{ fontSize: 11, color: COLORS.textLight }}>{a.date}</span>
              </div>
              <Btn small variant="light">Read More</Btn>
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.text, marginBottom: 6 }}>{a.title}</div>
            <p style={{ fontSize: 13, color: COLORS.textMid, margin: 0, lineHeight: 1.6 }}>{a.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}