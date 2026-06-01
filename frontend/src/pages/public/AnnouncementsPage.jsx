import { useState } from "react";
import COLORS from "../../constants/colors";
import { Badge, Card, Btn } from "../../components/UI";
import Icon from "../../components/Icon";
import { ANNOUNCEMENTS } from "../../constants/mockData";

function SkeletonCard() {
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: "1.5rem" }}>
      <style>{`@keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} } .shimmer{background:linear-gradient(90deg,${COLORS.border} 25%,#f0f0f0 50%,${COLORS.border} 75%);background-size:800px 100%;animation:shimmer 1.4s infinite;border-radius:6px;}`}</style>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div className="shimmer" style={{ width: 80, height: 20 }} />
        <div className="shimmer" style={{ width: 60, height: 20 }} />
      </div>
      <div className="shimmer" style={{ width: "60%", height: 18, marginBottom: 10 }} />
      <div className="shimmer" style={{ width: "100%", height: 13, marginBottom: 6 }} />
      <div className="shimmer" style={{ width: "85%", height: 13 }} />
    </div>
  );
}

export default function AnnouncementsPage() {
  const [loading] = useState(false); // set to true to preview skeleton
  const items = ANNOUNCEMENTS;

  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .ann-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
        }
      `}</style>
      <div style={{ padding: "28px 24px" }}>
        <div className="ann-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: COLORS.text }}>Announcements</h3>
          <span style={{ fontSize: 12, color: COLORS.textMid, background: COLORS.primaryBg, borderRadius: 20, padding: "3px 10px" }}>
            {items.length} total
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {loading ? (
            [1,2,3].map(i => <SkeletonCard key={i} />)
          ) : items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 24px", background: "#fff", borderRadius: 14, border: `1px solid ${COLORS.border}` }}>
              <div style={{ background: COLORS.primaryBg, borderRadius: "50%", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Icon name="bell" size={28} color={COLORS.primary} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.text, marginBottom: 6 }}>No Announcements Yet</div>
              <div style={{ fontSize: 13, color: COLORS.textMid }}>Check back later for HOA updates and notices.</div>
            </div>
          ) : (
            items.map(a => (
              <Card key={a.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <Badge label={a.tag} />
                    <span style={{ fontSize: 11, color: COLORS.textLight }}>{a.date}</span>
                  </div>
                  <Btn small variant="light">Read More</Btn>
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.text, marginBottom: 6 }}>{a.title}</div>
                <p style={{ fontSize: 13, color: COLORS.textMid, margin: 0, lineHeight: 1.6 }}>{a.body}</p>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}