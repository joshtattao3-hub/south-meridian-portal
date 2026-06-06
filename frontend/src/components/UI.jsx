import { useEffect } from "react";
import COLORS from "../constants/colors";
import { STAT_COLOR } from "../constants/mockData";
import Icon from "./Icon";

export function Badge({ label }) {
  const color = STAT_COLOR[label] || COLORS.textMid;
  const bg = color + "18";
  return (
    <span style={{ background: bg, color, fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20, whiteSpace: "nowrap", letterSpacing: 0.3 }}>
      {label}
    </span>
  );
}

export function Btn({ children, variant = "primary", small, style = {}, ...rest }) {
  // ↑ `onClick`, `disabled`, `type`, and any future prop all flow through `...rest`

  const base = {
    border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600,
    fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 6,
    transition: "all 0.2s ease", fontSize: small ? 13 : 14,
    padding: small ? "6px 14px" : "10px 22px",
    outline: "none",
  };

  const variantStyles = {
    primary: { background: COLORS.primary, color: "#fff" },
    gold: { background: COLORS.gold, color: COLORS.text },
    ghost: { background: "transparent", color: COLORS.primary, border: `1.5px solid ${COLORS.primary}` },
    danger: { background: COLORS.danger, color: "#fff" },
    light: { background: COLORS.bg, color: COLORS.text, border: `1px solid ${COLORS.border}` },
    "outline-white": { background: "rgba(255,255,255,0.12)", color: "#fff", border: "1.5px solid #ffffff" },
  };

  useEffect(() => {
    if (!document.getElementById("btn-styles")) {
      const tag = document.createElement("style");
      tag.id = "btn-styles";
      tag.innerHTML = `
        .btn-primary:hover { background: ${COLORS.primaryDark || "#1a3a5c"} !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        .btn-gold:hover { filter: brightness(1.08); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .btn-ghost:hover { background: ${COLORS.primary}18 !important; transform: translateY(-1px); }
        .btn-danger:hover { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        .btn-light:hover { background: ${COLORS.border} !important; transform: translateY(-1px); }
        .btn-outline-white:hover { background: rgba(255,255,255,0.25) !important; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(255,255,255,0.15); }
        .btn-primary:active, .btn-gold:active, .btn-ghost:active, .btn-danger:active, .btn-light:active, .btn-outline-white:active { transform: translateY(0px) scale(0.98); }
        button:disabled { opacity: 0.55; cursor: not-allowed; transform: none !important; box-shadow: none !important; filter: none !important; }
      `;
      document.head.appendChild(tag);
    }
  }, []);

  return (
    <button
      type="button"           // safe default — never triggers form submit accidentally
      className={`btn-${variant}`}
      style={{ ...base, ...variantStyles[variant], ...style }}
      {...rest}               // onClick, disabled, type override, aria-*, data-*, etc.
    >
      {children}
    </button>
  );
}

export function Card({ children, style = {}, pad = "1.5rem", hoverable = false }) {
  return (
    <>
      {hoverable && (
        <style>{`.hoverable-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.10) !important; border-color: ${COLORS.primary}44 !important; }`}</style>
      )}
      <div
        className={hoverable ? "hoverable-card" : ""}
        style={{
          background: COLORS.card, borderRadius: 14,
          border: `1px solid ${COLORS.border}`, padding: pad,
          transition: "all 0.2s ease",
          ...style
        }}
      >
        {children}
      </div>
    </>
  );
}

export function StatCard({ icon, label, value, color = COLORS.primary, sub }) {
  return (
    <Card pad="1.25rem" hoverable style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, color: COLORS.textMid, fontWeight: 500 }}>{label}</span>
        <div style={{ background: color + "18", borderRadius: 10, padding: 8, display: "flex", transition: "transform 0.2s" }}>
          <Icon name={icon} size={20} color={color} />
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.text }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: COLORS.textMid }}>{sub}</div>}
    </Card>
  );
}