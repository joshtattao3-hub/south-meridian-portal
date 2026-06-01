import COLORS from "../constants/colors";
import Icon from "./Icon";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ role, activePage, setActivePage, setView }) {
  const { logout } = useAuth();

  const residentNav = [
    { id:"dashboard", icon:"home", label:"Dashboard" },
    { id:"announcements-p", icon:"bell", label:"Announcements" },
    { id:"complaints", icon:"chat", label:"My Complaints" },
    { id:"dues", icon:"dollar", label:"HOA Dues" },
    { id:"reservations", icon:"calendar", label:"Reservations" },
    { id:"documents", icon:"file", label:"Documents" },
  ];
  const officerNav = [
    { id:"officer-dashboard", icon:"home", label:"Dashboard" },
    { id:"manage-announcements", icon:"bell", label:"Announcements" },
    { id:"manage-complaints", icon:"chat", label:"Complaints" },
    { id:"manage-reservations", icon:"calendar", label:"Reservations" },
    { id:"residents-list", icon:"users", label:"Residents" },
  ];
  const adminNav = [
    { id:"admin-dashboard", icon:"chart", label:"Dashboard" },
    { id:"user-management", icon:"users", label:"User Management" },
    { id:"admin-complaints", icon:"chat", label:"Complaints" },
    { id:"billing", icon:"dollar", label:"Billing & Dues" },
    { id:"admin-facilities", icon:"building", label:"Facilities" },
    { id:"admin-announcements", icon:"bell", label:"Announcements" },
    { id:"reports", icon:"file", label:"Reports" },
    { id:"admin-settings", icon:"settings", label:"Settings" },
  ];
  const navItems = role === "admin" ? adminNav : role === "officer" ? officerNav : residentNav;

  return (
    <>
      <style>{`
        .sidebar-item { transition: all 0.18s ease !important; }
        .sidebar-item:hover { background: rgba(255,255,255,0.08) !important; color: #fff !important; padding-left: 16px !important; }
        .sidebar-item.active { background: rgba(255,255,255,0.14) !important; box-shadow: inset 3px 0 0 ${COLORS.gold}; }
        .sidebar-logout:hover { background: rgba(255,80,80,0.12) !important; color: #ff8080 !important; }
      `}</style>
      <div style={{ width:220, background: COLORS.primaryDark, minHeight:"100vh", display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"20px 16px 16px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ background:COLORS.gold, borderRadius:6, padding:"3px 6px" }}>
              <Icon name="shield" size={16} color={COLORS.primaryDark} />
            </div>
            <div>
              <div style={{ color:"#fff", fontWeight:700, fontSize:12, lineHeight:1.2 }}>South Meridian</div>
              <div style={{ color:COLORS.gold, fontSize:9, fontWeight:600, letterSpacing:1 }}>PHASE 2 HOA</div>
            </div>
          </div>
        </div>

        <div style={{ padding:"12px 8px", flex:1 }}>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`sidebar-item${activePage === item.id ? " active" : ""}`}
              onClick={() => setActivePage(item.id)}
              style={{
                width:"100%", display:"flex", alignItems:"center", gap:10,
                padding:"9px 12px", borderRadius:8, border:"none",
                background: activePage===item.id ? "rgba(255,255,255,0.12)" : "transparent",
                color: activePage===item.id ? "#fff" : "rgba(255,255,255,0.6)",
                fontFamily:"inherit", fontSize:13,
                fontWeight: activePage===item.id ? 600 : 400,
                cursor:"pointer", marginBottom:2, textAlign:"left",
              }}
            >
              <Icon name={item.icon} size={16} color={activePage===item.id ? "#fff" : "rgba(255,255,255,0.5)"} />
              {item.label}
            </button>
          ))}
        </div>

        <div style={{ padding:"12px 8px", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
          <button
            className="sidebar-item sidebar-logout"
            onClick={() => { logout(); setView("home"); }}
            style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:8, border:"none", background:"transparent", color:"rgba(255,255,255,0.5)", fontFamily:"inherit", fontSize:13, cursor:"pointer" }}
          >
            <Icon name="logout" size={16} color="rgba(255,255,255,0.4)" />
            Log Out
          </button>
        </div>
      </div>
    </>
  );
}