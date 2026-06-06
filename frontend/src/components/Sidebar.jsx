import { useState } from "react";  
import COLORS from "../constants/colors";
import Icon from "./Icon";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ role, activePage, setActivePage, setView }) {
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const residentNav = [
    { id:"dashboard",       icon:"home",     label:"Dashboard" },
    { id:"announcements-p", icon:"bell",     label:"Announcements" },
    { id:"complaints",      icon:"chat",     label:"My Complaints" },
    { id:"dues",            icon:"dollar",   label:"HOA Dues" },
    { id:"reservations",    icon:"calendar", label:"Reservations" },
    { id:"documents",       icon:"file",     label:"Documents" },
  ];
  const officerNav = [
    { id:"officer-dashboard",    icon:"home",     label:"Dashboard" },
    { id:"manage-announcements", icon:"bell",     label:"Announcements" },
    { id:"manage-complaints",    icon:"chat",     label:"Complaints" },
    { id:"manage-reservations",  icon:"calendar", label:"Reservations" },
    { id:"residents-list",       icon:"users",    label:"Residents" },
  ];
  const adminNav = [
    { id:"admin-dashboard",    icon:"chart",    label:"Dashboard" },
    { id:"user-management",    icon:"users",    label:"User Management" },
    { id:"admin-complaints",   icon:"chat",     label:"Complaints" },
    { id:"billing",            icon:"dollar",   label:"Billing & Dues" },
    { id:"admin-facilities",   icon:"building", label:"Facilities" },
    { id:"admin-announcements",icon:"bell",     label:"Announcements" },
    { id:"reports",            icon:"file",     label:"Reports" },
    { id:"admin-settings",     icon:"settings", label:"Settings" },
  ];
  const navItems = role === "admin" ? adminNav : role === "officer" ? officerNav : residentNav;

  return (
    <>
      <style>{`
        .sidebar-item { transition: all 0.18s ease !important; }
        .sidebar-item:hover { background: rgba(255,255,255,0.08) !important; color: #fff !important; }
        .sidebar-item.active { background: rgba(255,255,255,0.14) !important; box-shadow: inset 3px 0 0 ${COLORS.gold}; }
        .sidebar-logout:hover { background: rgba(255,80,80,0.12) !important; color: #ff8080 !important; }
        .sidebar-toggle:hover { background: rgba(255,255,255,0.1) !important; }
        @media (max-width: 768px) {
          .sidebar-label { display: none !important; }
          .sidebar-root { width: 60px !important; }
          .sidebar-brand-text { display: none !important; }
        }
      `}</style>

      {/* FIX: height:100vh (not minHeight) so sidebar never grows beyond viewport */}
      <div className="sidebar-root" style={{
        width: collapsed ? 60 : 240,
        background: COLORS.primaryDark,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        transition: "width 0.2s ease",
        position: "sticky",
        top: 0,
      }}>

        {/* Brand / collapse toggle */}
        <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ background: COLORS.gold, borderRadius: 6, padding: "3px 6px", flexShrink: 0 }}>
                <Icon name="shield" size={20} color={COLORS.primaryDark} />
              </div>
              <div className="sidebar-brand-text">
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>South Meridian</div>
                <div style={{ color: COLORS.gold, fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>PHASE 2 HOA</div>
              </div>
            </div>
          )}
          {collapsed && (
            <div onClick={() => setCollapsed(false)}
              style={{ background: COLORS.gold, borderRadius: 6, padding: "3px 6px", margin: "0 auto", cursor: "pointer" }}>
              <Icon name="shield" size={16} color={COLORS.primaryDark} />
            </div>
          )}
          {!collapsed && (
            <button
              className="sidebar-toggle"
              onClick={() => setCollapsed(c => !c)}
              style={{ background: "transparent", border: "none", cursor: "pointer", borderRadius: 6, padding: 4, display: "flex", alignItems: "center" }}
            >
              <Icon name="menu" size={20} color="rgba(255,255,255,0.5)" />
            </button>
          )}
        </div>

        {/* Nav items — scrollable if many */}
        <div style={{ padding: "12px 8px", flex: 1, overflowY: "auto" }}>
          {navItems.map(item => (
            <button
              key={item.id}
              className={`sidebar-item${activePage === item.id ? " active" : ""}`}
              onClick={() => setActivePage(item.id)}
              title={collapsed ? item.label : ""}
              style={{
                width: "100%", display: "flex", alignItems: "center",
                gap: collapsed ? 0 : 10,
                justifyContent: collapsed ? "center" : "flex-start",
                padding: "9px 12px", borderRadius: 8, border: "none",
                background: activePage === item.id ? "rgba(255,255,255,0.12)" : "transparent",
                color: activePage === item.id ? "#fff" : "rgba(255,255,255,0.6)",
                fontFamily: "inherit", fontSize: 16,
                fontWeight: activePage === item.id ? 500 : 400,
                cursor: "pointer", marginBottom: 2, textAlign: "left"
              }}
            >
              <Icon name={item.icon} size={16} color={activePage === item.id ? "#fff" : "rgba(255,255,255,0.5)"} />
              {!collapsed && <span className="sidebar-label">{item.label}</span>}
            </button>
          ))}
        </div>

        {/* Need Help? — only shown when expanded */}
        {!collapsed && (
          <div style={{
            margin: "0 8px 8px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: 10,
            padding: "12px 14px",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ background: COLORS.gold, borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: COLORS.primaryDark, fontSize: 12, fontWeight: 800 }}>?</span>
              </div>
              <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>Need help?</span>
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginBottom: 8, lineHeight: 1.4 }}>
              Contact the HOA Office
            </div>
            <button
              onClick={() => setActivePage("contact")}
              style={{
                display: "block", width: "100%",
                padding: "6px 10px", borderRadius: 6, border: "none",
                background: COLORS.gold, color: COLORS.primaryDark,
                fontSize: 11, fontWeight: 700, cursor: "pointer",
                fontFamily: "inherit", textAlign: "center",
              }}
            >
              Contact Us
            </button>
          </div>
        )}

        {/* Logout */}
        <div style={{ padding: "8px 8px 12px", borderTop: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
          <button
            className="sidebar-item sidebar-logout"
            onClick={() => { logout(); setView("home"); }}
            title={collapsed ? "Log Out" : ""}
            style={{
              width: "100%", display: "flex", alignItems: "center",
              gap: collapsed ? 0 : 10,
              justifyContent: collapsed ? "center" : "flex-start",
              padding: "9px 12px", borderRadius: 8, border: "none",
              background: "transparent", color: "rgba(255,255,255,0.5)",
              fontFamily: "inherit", fontSize: 13, cursor: "pointer",
            }}
          >
            <Icon name="logout" size={16} color="rgba(255,255,255,0.4)" />
            {!collapsed && <span className="sidebar-label">Log Out</span>}
          </button>
        </div>

      </div>
    </>
  );
}