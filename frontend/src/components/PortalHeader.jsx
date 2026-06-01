import { useState, useRef, useEffect } from "react";
import COLORS from "../constants/colors";
import Icon from "./Icon";
import { useAuth } from "../context/AuthContext";

export default function PortalHeader({ title }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target))   setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Derive initials from user object
  const initials = user?.initials
    || (user?.name ? user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "?");

  const displayName = user?.name || "User";
  const displayRole = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "";

  // Mock notifications — replace with real data from your API
  const notifications = [
    { id: 1, text: "New complaint submitted by Block 3", time: "5m ago",  unread: true  },
    { id: 2, text: "June dues collection updated",       time: "1h ago",  unread: true  },
    { id: 3, text: "Reservation #12 approved",           time: "3h ago",  unread: false },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div style={{
      background: "#fff",
      borderBottom: `1px solid ${COLORS.border}`,
      padding: "0 28px",
      height: 60,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
      flexShrink: 0,
    }}>
      {/* Page Title */}
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: COLORS.text }}>
        {title}
      </h2>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>

        {/* ── Notification Bell ── */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            onClick={() => { setNotifOpen(o => !o); setMenuOpen(false); }}
            style={{
              position: "relative", cursor: "pointer",
              background: "none", border: "none", padding: 6,
              borderRadius: 8, display: "flex", alignItems: "center",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = COLORS.bg}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
            title="Notifications"
          >
            <Icon name="bell" size={20} color={COLORS.textMid} />
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: 3, right: 3,
                width: 16, height: 16, borderRadius: "50%",
                background: COLORS.danger, color: "#fff",
                fontSize: 9, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid #fff",
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div style={{
              position: "absolute", right: 0, top: 46,
              background: "#fff", border: `1px solid ${COLORS.border}`,
              borderRadius: 12, boxShadow: "0 8px 28px rgba(0,0,0,0.12)",
              zIndex: 999, width: 300, overflow: "hidden",
            }}>
              <div style={{
                padding: "12px 16px 10px",
                borderBottom: `1px solid ${COLORS.border}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, background: COLORS.dangerBg,
                    color: COLORS.danger, padding: "2px 7px", borderRadius: 20,
                  }}>
                    {unreadCount} new
                  </span>
                )}
              </div>
              {notifications.map(n => (
                <div key={n.id} style={{
                  padding: "11px 16px",
                  borderBottom: `1px solid ${COLORS.border}`,
                  background: n.unread ? COLORS.primaryBg : "#fff",
                  cursor: "pointer", transition: "background 0.12s",
                  display: "flex", gap: 10, alignItems: "flex-start",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = n.unread ? "#dcedc8" : COLORS.bg}
                  onMouseLeave={e => e.currentTarget.style.background = n.unread ? COLORS.primaryBg : "#fff"}
                >
                  {n.unread && (
                    <div style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: COLORS.primary, flexShrink: 0, marginTop: 5,
                    }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.45 }}>{n.text}</div>
                    <div style={{ fontSize: 11, color: COLORS.textLight, marginTop: 3 }}>{n.time}</div>
                  </div>
                </div>
              ))}
              <div style={{ padding: "10px 16px", textAlign: "center" }}>
                <button style={{
                  fontSize: 12, color: COLORS.primary, background: "none",
                  border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "inherit",
                }}>
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: COLORS.border }} />

        {/* ── User Avatar + Dropdown ── */}
        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            onClick={() => { setMenuOpen(o => !o); setNotifOpen(false); }}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              cursor: "pointer", background: "none", border: "none",
              padding: "4px 6px", borderRadius: 10,
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = COLORS.bg}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            {/* Avatar circle */}
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: COLORS.primary,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0,
            }}>
              {initials}
            </div>
            {/* Name + role */}
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, lineHeight: 1.3 }}>
                {displayName}
              </div>
              <div style={{ fontSize: 11, color: COLORS.textLight }}>
                {displayRole}
              </div>
            </div>
            {/* Chevron */}
            <svg
              width={14} height={14} viewBox="0 0 24 24" fill="none"
              stroke={COLORS.textLight} strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* User Dropdown Menu */}
          {menuOpen && (
            <div style={{
              position: "absolute", right: 0, top: 50,
              background: "#fff", border: `1px solid ${COLORS.border}`,
              borderRadius: 12, boxShadow: "0 8px 28px rgba(0,0,0,0.12)",
              zIndex: 999, minWidth: 200, overflow: "hidden",
            }}>
              {/* User info header */}
              <div style={{
                padding: "14px 16px 12px",
                borderBottom: `1px solid ${COLORS.border}`,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: COLORS.primary,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0,
                }}>
                  {initials}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{displayName}</div>
                  <div style={{ fontSize: 11, color: COLORS.textLight }}>{user?.email || displayRole}</div>
                </div>
              </div>

              {/* Menu items */}
              {[
                { icon: "user",     label: "My Profile" },
                { icon: "settings", label: "Settings"   },
              ].map(item => (
                <button key={item.label} style={{
                  width: "100%", padding: "10px 16px",
                  display: "flex", alignItems: "center", gap: 10,
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "inherit", fontSize: 13, color: COLORS.text,
                  textAlign: "left", transition: "background 0.12s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = COLORS.bg}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  <Icon name={item.icon} size={15} color={COLORS.textMid} />
                  {item.label}
                </button>
              ))}

              {/* Divider */}
              <div style={{ height: 1, background: COLORS.border }} />

              {/* Logout */}
              <button
                onClick={() => { setMenuOpen(false); logout(); }}
                style={{
                  width: "100%", padding: "10px 16px",
                  display: "flex", alignItems: "center", gap: 10,
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "inherit", fontSize: 13,
                  color: COLORS.danger, textAlign: "left",
                  transition: "background 0.12s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.dangerBg}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >
                <Icon name="logout" size={15} color={COLORS.danger} />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}