import { useState, useRef, useEffect } from "react";
import COLORS from "../constants/colors";
import Icon from "./Icon";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

// ── My Profile Modal ──────────────────────────────────────────────────────
function ProfileModal({ user, onClose, onSaved }) {
  const [form, setForm]       = useState({ first_name: user?.first_name ?? "", last_name: user?.last_name ?? "", email: user?.email ?? "" });
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url ? `http://localhost:5000${user.avatar_url}` : null);
  const [avatarFile, setAvatarFile]       = useState(null);
  const fileRef = useRef(null);

  function handleField(k, v) { setForm(p => ({ ...p, [k]: v })); setError(null); setSuccess(false); }

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    if (!form.first_name.trim() || !form.last_name.trim()) { setError("First and last name are required."); return; }
    setSaving(true); setError(null);
    try {
      if (avatarFile) {
        const res = await api.uploadAvatar(user.id, avatarFile);
        onSaved({ avatar_url: res.avatar_url });
      }
      const updated = await api.updateProfile(user.id, { first_name: form.first_name.trim(), last_name: form.last_name.trim() });
      onSaved(updated);
      setSuccess(true);
      setTimeout(onClose, 1200);
    } catch (err) {
      setError(err.message ?? "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: COLORS.text }}>My Profile</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: COLORS.textLight, lineHeight: 1 }}>✕</button>
        </div>

        {/* Avatar upload */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
          <div style={{ position: "relative", marginBottom: 10 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: COLORS.primary, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: `3px solid ${COLORS.border}` }}>
              {avatarPreview
                ? <img src={avatarPreview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ color: "#fff", fontWeight: 700, fontSize: 28 }}>
                    {`${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`.toUpperCase()}
                  </span>
              }
            </div>
            <button onClick={() => fileRef.current?.click()}
              style={{ position: "absolute", bottom: 0, right: 0, background: COLORS.primary, border: "2px solid #fff", borderRadius: "50%", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon name="upload" size={12} color="#fff" />
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
          <span style={{ fontSize: 11, color: COLORS.textLight }}>Click the camera icon to change photo</span>
        </div>

        {/* Fields */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          {[["first_name", "First Name"], ["last_name", "Last Name"]].map(([k, label]) => (
            <div key={k}>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 5 }}>{label}</label>
              <input value={form[k]} onChange={e => handleField(k, e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${COLORS.border}`, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", color: COLORS.text }} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 5 }}>Email</label>
          <input value={form.email} disabled
            style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${COLORS.border}`, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", color: COLORS.textLight, background: COLORS.bg }} />
          <div style={{ fontSize: 11, color: COLORS.textLight, marginTop: 4 }}>Email cannot be changed here.</div>
        </div>

        {error   && <div style={{ background: COLORS.dangerBg,  border: `1px solid ${COLORS.danger}`,  borderRadius: 8, padding: "8px 12px", fontSize: 12, color: COLORS.danger,  marginBottom: 14 }}>⚠ {error}</div>}
        {success && <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#166534", marginBottom: 14 }}>✓ Profile saved!</div>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onClose} style={{ padding: "9px 18px", borderRadius: 8, border: `1px solid ${COLORS.border}`, background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: COLORS.text }}>Cancel</button>
          <button onClick={handleSave} disabled={saving}
            style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: COLORS.primary, color: "#fff", fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Settings Modal ────────────────────────────────────────────────────────
function SettingsModal({ user, onClose, onSaved }) {
  const [form, setForm]       = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  function handleField(k, v) { setForm(p => ({ ...p, [k]: v })); setError(null); setSuccess(false); }

  async function handleSave() {
    if (!form.current_password)                            { setError("Current password is required."); return; }
    if (form.new_password.length < 8)                      { setError("New password must be at least 8 characters."); return; }
    if (form.new_password !== form.confirm_password)       { setError("Passwords do not match."); return; }
    setSaving(true); setError(null);
    try {
      await api.updateProfile(user.id, { current_password: form.current_password, new_password: form.new_password });
      setSuccess(true);
      setForm({ current_password: "", new_password: "", confirm_password: "" });
      setTimeout(onClose, 1400);
    } catch (err) {
      setError(err.message ?? "Failed to update password.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
        onClick={e => e.stopPropagation()}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: COLORS.text }}>Settings</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: COLORS.textLight, lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 14 }}>Change Password</div>

        {[["current_password", "Current Password"], ["new_password", "New Password"], ["confirm_password", "Confirm New Password"]].map(([k, label]) => (
          <div key={k} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 5 }}>{label}</label>
            <input type="password" value={form[k]} onChange={e => handleField(k, e.target.value)}
              style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${COLORS.border}`, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box", color: COLORS.text }} />
          </div>
        ))}

        {error   && <div style={{ background: COLORS.dangerBg, border: `1px solid ${COLORS.danger}`, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: COLORS.danger, marginBottom: 14 }}>⚠ {error}</div>}
        {success && <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#166534", marginBottom: 14 }}>✓ Password updated!</div>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
          <button onClick={onClose} style={{ padding: "9px 18px", borderRadius: 8, border: `1px solid ${COLORS.border}`, background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: COLORS.text }}>Cancel</button>
          <button onClick={handleSave} disabled={saving}
            style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: COLORS.primary, color: "#fff", fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving…" : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PortalHeader ──────────────────────────────────────────────────────────
export default function PortalHeader({ title, subtitle }) {
  const { user, logout, updateUser } = useAuth();
  const [menuOpen, setMenuOpen]     = useState(false);
  const [notifOpen, setNotifOpen]   = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const menuRef  = useRef(null);
  const notifRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    api.getNotifications()
      .then(setNotifications)
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current  && !menuRef.current.contains(e.target))  setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials    = `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`.toUpperCase() || "?";
  const displayName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || "User";
  const displayRole = user?.role
    ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}${user.role === "resident" && user?.block_lot ? ` · ${user.block_lot}` : ""}`
    : "";
  const avatarUrl = user?.avatar_url ? `http://localhost:5000${user.avatar_url}` : null;

  function handleSaved(data) { updateUser(data); }

  return (
    <>
      {showProfile && <ProfileModal user={user} onClose={() => setShowProfile(false)} onSaved={handleSaved} />}
      {showSettings && <SettingsModal user={user} onClose={() => setShowSettings(false)} onSaved={handleSaved} />}

      <div style={{ background: "#fff", borderBottom: `1px solid ${COLORS.border}`, padding: "0 28px", minHeight: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, flexShrink: 0 }}>

        {/* Page Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: COLORS.text, lineHeight: 1.2 }}>{title}</h2>
          {subtitle && <p style={{ margin: 0, fontSize: 11, color: COLORS.textLight, lineHeight: 1.4 }}>{subtitle}</p>}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>

          {/* Notification Bell */}
          <div ref={notifRef} style={{ position: "relative" }}>
            <button onClick={() => { setNotifOpen(o => !o); setMenuOpen(false); }}
              style={{ position: "relative", cursor: "pointer", background: "none", border: "none", padding: 6, borderRadius: 8, display: "flex", alignItems: "center", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = COLORS.bg}
              onMouseLeave={e => e.currentTarget.style.background = "none"}>
              <Icon name="bell" size={20} color={COLORS.textMid} />
              {unreadCount > 0 && (
                <span style={{ position: "absolute", top: 3, right: 3, width: 16, height: 16, borderRadius: "50%", background: COLORS.danger, color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div style={{ position: "absolute", right: 0, top: 46, background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 12, boxShadow: "0 8px 28px rgba(0,0,0,0.12)", zIndex: 999, width: 300, overflow: "hidden" }}>
                <div style={{ padding: "12px 16px 10px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>Notifications</span>
                  {unreadCount > 0 && <span style={{ fontSize: 10, fontWeight: 700, background: COLORS.dangerBg, color: COLORS.danger, padding: "2px 7px", borderRadius: 20 }}>{unreadCount} new</span>}
                </div>
                {notifications.length === 0
                  ? <div style={{ padding: "20px 16px", textAlign: "center", fontSize: 13, color: COLORS.textLight }}>No notifications yet.</div>
                  : notifications.map(n => (
                    <div key={n.id} style={{ padding: "11px 16px", borderBottom: `1px solid ${COLORS.border}`, background: n.unread ? COLORS.primaryBg : "#fff", cursor: "pointer", transition: "background 0.12s", display: "flex", gap: 10, alignItems: "flex-start" }}
                      onMouseEnter={e => e.currentTarget.style.background = n.unread ? "#dcedc8" : COLORS.bg}
                      onMouseLeave={e => e.currentTarget.style.background = n.unread ? COLORS.primaryBg : "#fff"}>
                      {n.unread && <div style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.primary, flexShrink: 0, marginTop: 5 }} />}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.45, fontWeight: n.unread ? 600 : 400 }}>{n.text}</div>
                        <div style={{ fontSize: 11, color: COLORS.textLight, marginTop: 2 }}>{n.sub}</div>
                        <div style={{ fontSize: 11, color: COLORS.textLight, marginTop: 1 }}>{n.time}</div>
                      </div>
                    </div>
                  ))
                }
                <div style={{ padding: "10px 16px", textAlign: "center" }}>
                  <button style={{ fontSize: 12, color: COLORS.primary, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>View all notifications</button>
                </div>
              </div>
            )}
          </div>

          <div style={{ width: 1, height: 24, background: COLORS.border }} />

          {/* User Avatar + Dropdown */}
          <div ref={menuRef} style={{ position: "relative" }}>
            <button onClick={() => { setMenuOpen(o => !o); setNotifOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", background: "none", border: "none", padding: "4px 6px", borderRadius: 10, transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = COLORS.bg}
              onMouseLeave={e => e.currentTarget.style.background = "none"}>
              {/* Avatar */}
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: COLORS.primary, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                {avatarUrl
                  ? <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{initials}</span>
                }
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, lineHeight: 1.3 }}>{displayName}</div>
                <div style={{ fontSize: 11, color: COLORS.textLight }}>{displayRole}</div>
              </div>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={COLORS.textLight} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {menuOpen && (
              <div style={{ position: "absolute", right: 0, top: 50, background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 12, boxShadow: "0 8px 28px rgba(0,0,0,0.12)", zIndex: 999, minWidth: 200, overflow: "hidden" }}>
                {/* User info header */}
                <div style={{ padding: "14px 16px 12px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: COLORS.primary, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                    {avatarUrl
                      ? <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{initials}</span>
                    }
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{displayName}</div>
                    <div style={{ fontSize: 11, color: COLORS.textLight }}>{user?.email || displayRole}</div>
                  </div>
                </div>

                {/* Menu items */}
                {[
                  { icon: "user",     label: "My Profile", action: () => { setMenuOpen(false); setShowProfile(true);  } },
                  { icon: "settings", label: "Settings",   action: () => { setMenuOpen(false); setShowSettings(true); } },
                ].map(item => (
                  <button key={item.label} onClick={item.action}
                    style={{ width: "100%", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, color: COLORS.text, textAlign: "left", transition: "background 0.12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = COLORS.bg}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}>
                    <Icon name={item.icon} size={15} color={COLORS.textMid} />
                    {item.label}
                  </button>
                ))}

                <div style={{ height: 1, background: COLORS.border }} />

                <button onClick={() => { setMenuOpen(false); logout(); }}
                  style={{ width: "100%", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, color: COLORS.danger, textAlign: "left", transition: "background 0.12s" }}
                  onMouseEnter={e => e.currentTarget.style.background = COLORS.dangerBg}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}>
                  <Icon name="logout" size={15} color={COLORS.danger} />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}