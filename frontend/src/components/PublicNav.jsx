import COLORS from "../constants/colors";
import Icon from "./Icon";
import { Btn } from "./UI";

const NAV_LINKS = ["Home", "Announcements", "Events", "About", "Contact"];

export default function PublicNav({ setView, mobileOpen, setMobileOpen }) {
  return (
    <nav style={{ background: COLORS.primary, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap: 10, cursor:"pointer" }} onClick={() => setView("home")}>
          <div style={{ background: COLORS.gold, borderRadius: 8, padding: "4px 8px" }}>
            <Icon name="shield" size={20} color={COLORS.primaryDark} />
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>South Meridian Homes</div>
            <div style={{ color: COLORS.gold, fontSize: 10, fontWeight: 500, letterSpacing: 1.2 }}>PHASE 2 HOA</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap: 8 }}>
          {NAV_LINKS.map(l => (
            <button key={l} onClick={() => setView(l.toLowerCase())} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 500, cursor:"pointer", padding: "8px 12px", borderRadius: 6, fontFamily:"inherit" }}>{l}</button>
          ))}
          <div style={{ width: 1, height: 24, background:"rgba(255,255,255,0.2)", margin:"0 8px" }} />
          <Btn small onClick={() => setView("login")} variant="ghost" style={{ color:"#fff", borderColor:"rgba(255,255,255,0.5)" }}>Log In</Btn>
          <Btn small onClick={() => setView("register")} variant="gold">Register</Btn>
        </div>
      </div>
    </nav>
  );
}