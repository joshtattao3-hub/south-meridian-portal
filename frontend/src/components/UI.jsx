import COLORS from "../constants/colors";
import { STAT_COLOR } from "../constants/mockData";
import Icon from "./Icon";

export function Badge({ label }) {
  const color = STAT_COLOR[label] || COLORS.textMid;
  const bg = color + "18";
  return (
    <span style={{ background: bg, color, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20, whiteSpace:"nowrap", letterSpacing: 0.3 }}>
      {label}
    </span>
  );
}

export function Btn({ children, variant = "primary", small, onClick, style = {} }) {
  const base = {
    border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600,
    fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 6,
    transition: "all 0.15s", fontSize: small ? 13 : 14,
    padding: small ? "6px 14px" : "10px 22px",
    ...style,
  };
  if (variant === "primary") return <button style={{ ...base, background: COLORS.primary, color: "#fff" }} onClick={onClick}>{children}</button>;
  if (variant === "gold") return <button style={{ ...base, background: COLORS.gold, color: COLORS.text }} onClick={onClick}>{children}</button>;
  if (variant === "ghost") return <button style={{ ...base, background: "transparent", color: COLORS.primary, border: `1.5px solid ${COLORS.primary}` }} onClick={onClick}>{children}</button>;
  if (variant === "danger") return <button style={{ ...base, background: COLORS.danger, color: "#fff" }} onClick={onClick}>{children}</button>;
  if (variant === "light") return <button style={{ ...base, background: COLORS.bg, color: COLORS.text, border: `1px solid ${COLORS.border}` }} onClick={onClick}>{children}</button>;
  if (variant === "outline-white") return ( <button style={{ ...base, background: "rgba(255,255,255,0.12)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.6)" }} onClick={onClick}>{children}</button>
);
  return <button style={base} onClick={onClick}>{children}</button>;
}

export function Card({ children, style = {}, pad = "1.5rem" }) {
  return <div style={{ background: COLORS.card, borderRadius: 14, border: `1px solid ${COLORS.border}`, padding: pad, ...style }}>{children}</div>;
}

export function StatCard({ icon, label, value, color = COLORS.primary, sub }) {
  return (
    <Card pad="1.25rem" style={{ display:"flex", flexDirection:"column", gap: 8 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize: 13, color: COLORS.textMid, fontWeight: 500 }}>{label}</span>
        <div style={{ background: color + "18", borderRadius: 10, padding: 8, display:"flex" }}>
          <Icon name={icon} size={20} color={color} />
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.text }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: COLORS.textMid }}>{sub}</div>}
    </Card>
  );
}