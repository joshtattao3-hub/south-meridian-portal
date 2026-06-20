import COLORS from "../constants/colors";
import Icon from "./Icon";
import { Btn } from "./UI";


const NAV_LINKS = ["Home", "Announcements", "Events", "About", "Contact"];

export default function PublicNav({ setView, currentView, mobileOpen, setMobileOpen }) {
  return (
    <>
      <style>{`
        .nav-link { position: relative; transition: color 0.2s ease !important; }
        .nav-link::after { content: ''; position: absolute; bottom: -2px; left: 50%; transform: translateX(-50%); width: 0; height: 2px; background: ${COLORS.gold}; border-radius: 2px; transition: width 0.25s ease; }
        .nav-link:hover { color: #fff !important; }
        .nav-link:hover::after { width: 70%; }
        .nav-link.active { color: #fff !important; }
        .nav-link.active::after { width: 70%; }
        .nav-logo:hover { opacity: 0.9; }
      `}</style>
      <nav style={{ background: COLORS.primary, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.18)" }}>
          <div style={{ width: "100%", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box" }}>
          <div className="nav-logo" style={{ display:"flex", alignItems:"center", gap: 10, cursor:"pointer", transition: "opacity 0.2s" }} onClick={() => setView("home")}>
            <div style={{ background: COLORS.gold, borderRadius: 8, padding: "4px 8px" }}>
              <Icon name="shield" size={20} color={COLORS.primaryDark} />
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>South Meridian Homes</div>
              <div style={{ color: COLORS.gold, fontSize: 10, fontWeight: 500, letterSpacing: 1.2 }}>PHASE 2 HOA</div>
            </div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap: 4 }}>
            {NAV_LINKS.map(l => (
              <button
                key={l}
                className={`nav-link${currentView === l.toLowerCase() ? " active" : ""}`}
                onClick={() => setView(l.toLowerCase())}
                style={{ background:"none", border:"none", color:"rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 500, cursor:"pointer", padding: "8px 12px", borderRadius: 6, fontFamily:"inherit" }}
              >
                {l}
              </button>
            ))}
            <div style={{ width: 1, height: 24, background:"rgba(255,255,255,0.2)", margin:"0 8px" }} />
            <Btn small onClick={() => setView("login")} variant="outline-white">Log In</Btn>
            <Btn small onClick={() => setView("register")} variant="gold">Register</Btn>
          </div>
        </div>
      </nav>
    </>
  );
}