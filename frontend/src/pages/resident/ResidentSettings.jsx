import { useState, useEffect } from "react";
import COLORS from "../../constants/colors";
import Icon from "../../components/Icon";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api";

// ── Toggle Switch ──────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <div onClick={() => onChange(!checked)} style={{
      width: 42, height: 24, borderRadius: 12,
      background: checked ? COLORS.primary : "#d1d5db",
      position: "relative", cursor: "pointer",
      transition: "background 0.2s", flexShrink: 0,
    }}>
      <div style={{
        position: "absolute", top: 3,
        left: checked ? 21 : 3,
        width: 18, height: 18, borderRadius: "50%",
        background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        transition: "left 0.2s",
      }} />
    </div>
  );
}

// ── Section Card ──────────────────────────────────────────────────────────
function SectionCard({ icon, title, subtitle, badge, children, accent }) {
  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${accent ? `${accent}40` : COLORS.border}`,
      borderRadius: 16,
      overflow: "hidden",
      marginBottom: 20,
    }}>
      <div style={{
        padding: "18px 24px",
        borderBottom: `1px solid ${accent ? `${accent}20` : COLORS.border}`,
        display: "flex", alignItems: "center", gap: 12,
        background: accent ? `${accent}08` : "transparent",
      }}>
        {icon && (
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: accent ? `${accent}18` : COLORS.primaryBg,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Icon name={icon} size={16} color={accent ?? COLORS.primary} />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: accent ?? COLORS.text, display: "flex", alignItems: "center", gap: 8 }}>
            {title}
            {badge && (
              <span style={{ fontSize: 10, fontWeight: 700, background: `${accent ?? COLORS.primary}18`, color: accent ?? COLORS.primary, padding: "2px 7px", borderRadius: 20, border: `1px solid ${accent ?? COLORS.primary}30` }}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 2 }}>{subtitle}</div>}
        </div>
      </div>
      <div style={{ padding: "22px 24px" }}>{children}</div>
    </div>
  );
}

// ── Notification Row ──────────────────────────────────────────────────────
function NotifRow({ label, description, checked, onChange, last }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "13px 0",
      borderBottom: last ? "none" : `1px solid ${COLORS.border}`,
    }}>
      <div style={{ flex: 1, marginRight: 20 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: COLORS.text, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 12, color: COLORS.textLight }}>{description}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

// ── Appearance Option ─────────────────────────────────────────────────────
function AppearanceOption({ icon, label, description, selected, onClick }) {
  return (
    <div onClick={onClick} style={{
      flex: 1, padding: "16px 18px", borderRadius: 12,
      border: `2px solid ${selected ? COLORS.primary : COLORS.border}`,
      background: selected ? COLORS.primaryBg : "#fff",
      cursor: "pointer", transition: "all 0.15s",
      display: "flex", flexDirection: "column", gap: 6,
    }}
      onMouseEnter={e => { if (!selected) { e.currentTarget.style.borderColor = `${COLORS.primary}60`; e.currentTarget.style.background = `${COLORS.primaryBg}80`; } }}
      onMouseLeave={e => { if (!selected) { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.background = "#fff"; } }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: selected ? `${COLORS.primary}20` : "#f3f4f6",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name={icon} size={15} color={selected ? COLORS.primary : COLORS.textMid} />
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: selected ? COLORS.primary : COLORS.text }}>{label}</div>
        {selected && (
          <div style={{ marginLeft: "auto", width: 18, height: 18, borderRadius: "50%", background: COLORS.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={10} height={10} viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
          </div>
        )}
      </div>
      <div style={{ fontSize: 11.5, color: COLORS.textLight }}>{description}</div>
    </div>
  );
}

// ── ResidentSettings ──────────────────────────────────────────────────────
export default function ResidentSettings() {
  const { user, logout } = useAuth();

  // ── Password ──
  const [pwForm, setPwForm]       = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [pwSaving, setPwSaving]   = useState(false);
  const [pwError, setPwError]     = useState(null);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [showPw, setShowPw]       = useState({ current: false, new: false, confirm: false });

  // ── Notifications ──
  const [notifs, setNotifs] = useState({
    announcements:       true,
    dues_reminders:      true,
    maintenance_updates: true,
    event_invites:       true,
    complaint_status:    true,
    email_digest:        false,
  });
  const [notifSaving, setNotifSaving]   = useState(false);
  const [notifSuccess, setNotifSuccess] = useState(false);
  const [notifError, setNotifError]     = useState(null);

  // ── Appearance ──
  const [localTheme, setLocalTheme]     = useState(() => localStorage.getItem("smh_theme") ?? "system");
  const [density, setDensityState]      = useState(() => localStorage.getItem("smh_density") ?? "comfortable");
  const [appearanceSaved, setAppearanceSaved] = useState(false);

  // ── Danger zone ──
  const [deleteConfirm, setDeleteConfirm]         = useState("");
  const [deactivating, setDeactivating]           = useState(false);
  const [deactivateLoading, setDeactivateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading]         = useState(false);
  const [dangerError, setDangerError]             = useState(null);

  // ── Derived ──
  const activeNotifCount = Object.values(notifs).filter(Boolean).length;

  // Apply theme on mount
  useEffect(() => {
    applyTheme(localStorage.getItem("smh_theme") ?? "system");
  }, []);

  function applyTheme(t) {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = t === "dark" || (t === "system" && prefersDark);
    const root = document.getElementById("root") ?? document.body;
    root.style.filter     = isDark ? "invert(1) hue-rotate(180deg)" : "";
    root.style.background = isDark ? "#000" : "";
    const STYLE_ID = "smh-theme-media";
    let styleEl = document.getElementById(STYLE_ID);
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = STYLE_ID;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = isDark
      ? `#root img, #root video, #root canvas { filter: invert(1) hue-rotate(180deg); }`
      : "";
  }

  function handlePwField(k, v) { setPwForm(p => ({ ...p, [k]: v })); setPwError(null); setPwSuccess(false); }
  function toggleNotif(k)      { setNotifs(p => ({ ...p, [k]: !p[k] })); setNotifSuccess(false); setNotifError(null); }
  function setDensity(v)       { setDensityState(v); setAppearanceSaved(false); }

  function pwStrength(pw) {
    if (!pw) return { level: 0, label: "", color: "" };
    let score = 0;
    if (pw.length >= 8)          score++;
    if (pw.length >= 12)         score++;
    if (/[A-Z]/.test(pw))        score++;
    if (/[0-9]/.test(pw))        score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { level: 1, label: "Weak",        color: COLORS.danger  };
    if (score <= 3) return { level: 2, label: "Fair",        color: "#f59e0b"      };
    if (score <= 4) return { level: 3, label: "Strong",      color: COLORS.primary };
    return                { level: 4, label: "Very Strong",  color: "#0f766e"      };
  }

  const strength = pwStrength(pwForm.new_password);

  // ── Password save ──
  async function handlePasswordSave() {
    if (!pwForm.current_password)                        { setPwError("Current password is required."); return; }
    if (pwForm.new_password.length < 8)                  { setPwError("New password must be at least 8 characters."); return; }
    if (pwForm.new_password !== pwForm.confirm_password) { setPwError("Passwords do not match."); return; }
    setPwSaving(true); setPwError(null);
    try {
      await api.updateProfile(user.id, {
        current_password: pwForm.current_password,
        new_password:     pwForm.new_password,
      });
      setPwSuccess(true);
      setPwForm({ current_password: "", new_password: "", confirm_password: "" });
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err) {
      setPwError(err.message ?? "Failed to update password.");
    } finally {
      setPwSaving(false);
    }
  }

  // ── Notification preferences save ──
  async function handleNotifSave() {
    setNotifSaving(true); setNotifError(null);
    try {
      await api.updateProfile(user.id, { notification_preferences: notifs });
      setNotifSuccess(true);
      setTimeout(() => setNotifSuccess(false), 3000);
    } catch (err) {
      setNotifError(err.message ?? "Failed to save preferences.");
    } finally {
      setNotifSaving(false);
    }
  }

  // ── Appearance save ──
  function handleAppearanceSave() {
    localStorage.setItem("smh_theme", localTheme);
    localStorage.setItem("smh_density", density);
    applyTheme(localTheme);
    setAppearanceSaved(true);
    setTimeout(() => setAppearanceSaved(false), 3000);
  }

  // ── Deactivate account ──
  async function handleDeactivate() {
    setDeactivateLoading(true); setDangerError(null);
    try {
      await api.updateProfile(user.id, { status: "inactive" });
      logout();
    } catch (err) {
      setDangerError(err.message ?? "Failed to deactivate account.");
      setDeactivateLoading(false);
    }
  }

  // ── Delete account ──
  async function handleDelete() {
    if (deleteConfirm !== "DELETE") return;
    setDeleteLoading(true); setDangerError(null);
    try {
      await api.deleteAccount(user.id);
      logout();
    } catch (err) {
      setDangerError(err.message ?? "Failed to delete account.");
      setDeleteLoading(false);
    }
  }

  return (
    <div style={{ padding: "28px 32px", width: "100%", boxSizing: "border-box" }}>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textLight, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>
          Account
        </div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: COLORS.text }}>Settings</h1>
        <p style={{ margin: "6px 0 0", fontSize: 13.5, color: COLORS.textLight }}>
          Manage your account security, notifications, and preferences.
        </p>
      </div>

      {/* ── Password ── */}
      <SectionCard icon="settings" title="Change Password" subtitle="Keep your account secure with a strong password">
        {[
          { key: "current_password", label: "Current Password",     showKey: "current" },
          { key: "new_password",     label: "New Password",         showKey: "new"     },
          { key: "confirm_password", label: "Confirm New Password", showKey: "confirm" },
        ].map(({ key, label, showKey }) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textLight, display: "block", marginBottom: 5, letterSpacing: 0.4, textTransform: "uppercase" }}>
              {label}
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPw[showKey] ? "text" : "password"}
                value={pwForm[key]}
                onChange={e => handlePwField(key, e.target.value)}
                style={{
                  width: "100%", padding: "10px 40px 10px 13px",
                  borderRadius: 9, border: `1.5px solid ${COLORS.border}`,
                  fontSize: 13.5, fontFamily: "inherit", boxSizing: "border-box",
                  color: COLORS.text, outline: "none", transition: "border-color 0.15s",
                }}
                onFocus={e => e.target.style.borderColor = COLORS.primary}
                onBlur={e => e.target.style.borderColor = COLORS.border}
              />
              <button onClick={() => setShowPw(p => ({ ...p, [showKey]: !p[showKey] }))} style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", padding: 0,
                color: COLORS.textLight, fontSize: 12, fontWeight: 600, fontFamily: "inherit",
              }}>
                {showPw[showKey] ? "Hide" : "Show"}
              </button>
            </div>
            {key === "new_password" && pwForm.new_password && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 4, borderRadius: 4,
                      background: i <= strength.level ? strength.color : "#e5e7eb",
                      transition: "background 0.2s",
                    }} />
                  ))}
                </div>
                <div style={{ fontSize: 11, color: strength.color, fontWeight: 600 }}>{strength.label}</div>
              </div>
            )}
          </div>
        ))}

        {pwError   && <div style={{ background: COLORS.dangerBg, border: `1px solid ${COLORS.danger}`, borderRadius: 9, padding: "9px 13px", fontSize: 12.5, color: COLORS.danger, marginBottom: 14, display: "flex", gap: 7 }}><span>⚠</span>{pwError}</div>}
        {pwSuccess && <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 9, padding: "9px 13px", fontSize: 12.5, color: "#166534", marginBottom: 14, display: "flex", gap: 7 }}><span>✓</span> Password updated successfully!</div>}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
          <button onClick={handlePasswordSave} disabled={pwSaving} style={{
            padding: "10px 22px", borderRadius: 9, border: "none",
            background: COLORS.primary, color: "#fff", fontSize: 13,
            fontWeight: 600, cursor: pwSaving ? "not-allowed" : "pointer",
            fontFamily: "inherit", opacity: pwSaving ? 0.7 : 1,
            transition: "opacity 0.15s",
          }}>
            {pwSaving ? "Updating…" : "Update Password"}
          </button>
        </div>
      </SectionCard>

      {/* ── Notifications ── */}
      <SectionCard
        icon="bell"
        title="Notification Preferences"
        subtitle="Choose what updates you want to receive"
        badge={`${activeNotifCount} active`}
      >
        <NotifRow label="Announcements"      description="HOA news, reminders, and community updates"         checked={notifs.announcements}       onChange={() => toggleNotif("announcements")}       />
        <NotifRow label="Dues & Payments"    description="Monthly dues reminders and payment confirmations"   checked={notifs.dues_reminders}       onChange={() => toggleNotif("dues_reminders")}       />
        <NotifRow label="Maintenance Updates" description="Status changes on your maintenance requests"       checked={notifs.maintenance_updates}  onChange={() => toggleNotif("maintenance_updates")}  />
        <NotifRow label="Event Invitations"  description="Upcoming HOA events and community gatherings"       checked={notifs.event_invites}        onChange={() => toggleNotif("event_invites")}        />
        <NotifRow label="Complaint Status"   description="Updates on complaints you've submitted"             checked={notifs.complaint_status}     onChange={() => toggleNotif("complaint_status")}     />
        <div style={{ paddingTop: 13, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ flex: 1, marginRight: 20 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: COLORS.text, marginBottom: 2 }}>Weekly Email Digest</div>
            <div style={{ fontSize: 12, color: COLORS.textLight }}>Receive a weekly summary of all activity in your community</div>
          </div>
          <Toggle checked={notifs.email_digest} onChange={() => toggleNotif("email_digest")} />
        </div>

        {notifError   && <div style={{ background: COLORS.dangerBg, border: `1px solid ${COLORS.danger}`, borderRadius: 9, padding: "9px 13px", fontSize: 12.5, color: COLORS.danger, marginTop: 14, display: "flex", gap: 7 }}><span>⚠</span>{notifError}</div>}
        {notifSuccess && <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 9, padding: "9px 13px", fontSize: 12.5, color: "#166534", marginTop: 14, display: "flex", gap: 7 }}><span>✓</span> Preferences saved!</div>}

        <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
          <button onClick={handleNotifSave} disabled={notifSaving} style={{
            padding: "10px 22px", borderRadius: 9, border: "none",
            background: COLORS.primary, color: "#fff", fontSize: 13,
            fontWeight: 600, cursor: notifSaving ? "not-allowed" : "pointer",
            fontFamily: "inherit", opacity: notifSaving ? 0.7 : 1,
            transition: "opacity 0.15s",
          }}>
            {notifSaving ? "Saving…" : "Save Preferences"}
          </button>
        </div>
      </SectionCard>

      {/* ── Appearance ── */}
      <SectionCard icon="home" title="Appearance" subtitle="Customize how the portal looks and feels">
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textLight, letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 12 }}>Theme</div>
          <div style={{ display: "flex", gap: 10 }}>
            <AppearanceOption icon="sun"      label="Light"  description="Clean white background"      selected={localTheme === "light"}  onClick={() => { setLocalTheme("light");  setAppearanceSaved(false); }} />
            <AppearanceOption icon="moon"     label="Dark"   description="Easy on the eyes at night"   selected={localTheme === "dark"}   onClick={() => { setLocalTheme("dark");   setAppearanceSaved(false); }} />
            <AppearanceOption icon="settings" label="System" description="Follows your device setting" selected={localTheme === "system"} onClick={() => { setLocalTheme("system"); setAppearanceSaved(false); }} />
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textLight, letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 12 }}>Display Density</div>
          <div style={{ display: "flex", gap: 10 }}>
            <AppearanceOption icon="home" label="Compact"     description="More content, less spacing"  selected={density === "compact"}     onClick={() => setDensity("compact")}     />
            <AppearanceOption icon="home" label="Comfortable" description="Balanced spacing (default)"  selected={density === "comfortable"} onClick={() => setDensity("comfortable")} />
          </div>
        </div>

        <div style={{ marginTop: 14, padding: "12px 14px", background: COLORS.primaryBg, borderRadius: 10, border: `1px solid ${COLORS.primary}22`, fontSize: 12, color: COLORS.textLight }}>
          <span style={{ color: COLORS.primary, fontWeight: 600 }}>ℹ Note:</span> Dark mode and density settings are saved to this browser. You may need to reload for full effect.
        </div>

        {appearanceSaved && <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 9, padding: "9px 13px", fontSize: 12.5, color: "#166534", marginTop: 14, display: "flex", gap: 7 }}><span>✓</span> Appearance saved!</div>}

        <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
          <button onClick={handleAppearanceSave} style={{
            padding: "10px 22px", borderRadius: 9, border: "none",
            background: COLORS.primary, color: "#fff", fontSize: 13,
            fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            transition: "opacity 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            Save Appearance
          </button>
        </div>
      </SectionCard>

      {/* ── Danger Zone ── */}
      <SectionCard
        icon="logout"
        title="Danger Zone"
        subtitle="Irreversible actions — proceed with caution"
        accent={COLORS.danger}
        badge="Irreversible"
      >
        {dangerError && (
          <div style={{ background: COLORS.dangerBg, border: `1px solid ${COLORS.danger}`, borderRadius: 9, padding: "9px 13px", fontSize: 12.5, color: COLORS.danger, marginBottom: 14, display: "flex", gap: 7 }}>
            <span>⚠</span>{dangerError}
          </div>
        )}

        {/* Deactivate */}
        <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 11, padding: "16px 18px", marginBottom: 14 }}>
          {!deactivating ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.text, marginBottom: 3 }}>Deactivate Account</div>
                <div style={{ fontSize: 12, color: COLORS.textLight, maxWidth: 420 }}>
                  Temporarily disables your account. You can reactivate by contacting the HOA admin.
                </div>
              </div>
              <button onClick={() => { setDeactivating(true); setDangerError(null); }} style={{
                padding: "9px 16px", borderRadius: 9, border: `1.5px solid ${COLORS.danger}`,
                background: "#fff", fontSize: 12.5, fontWeight: 600,
                cursor: "pointer", color: COLORS.danger, fontFamily: "inherit",
                whiteSpace: "nowrap", transition: "background 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.dangerBg}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                Deactivate
              </button>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.danger, marginBottom: 6 }}>Are you sure?</div>
              <div style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 14 }}>
                Your account will be disabled immediately and you'll be logged out. Contact the HOA admin to reactivate.
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setDeactivating(false)} disabled={deactivateLoading} style={{
                  padding: "9px 16px", borderRadius: 9, border: `1.5px solid ${COLORS.border}`,
                  background: "#fff", fontSize: 12.5, fontWeight: 600,
                  cursor: "pointer", color: COLORS.text, fontFamily: "inherit",
                }}>
                  Cancel
                </button>
                <button onClick={handleDeactivate} disabled={deactivateLoading} style={{
                  padding: "9px 16px", borderRadius: 9, border: "none",
                  background: COLORS.danger, color: "#fff", fontSize: 12.5,
                  fontWeight: 600, cursor: deactivateLoading ? "not-allowed" : "pointer",
                  fontFamily: "inherit", opacity: deactivateLoading ? 0.7 : 1,
                }}>
                  {deactivateLoading ? "Deactivating…" : "Yes, Deactivate"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delete */}
        <div style={{ border: `1.5px solid ${COLORS.danger}30`, borderRadius: 11, padding: "16px 18px", background: `${COLORS.danger}04` }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.danger, marginBottom: 4 }}>Delete Account</div>
          <div style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 14 }}>
            Permanently deletes your account and all associated data. This action <strong>cannot be undone</strong>. Type <strong>DELETE</strong> below to confirm.
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              value={deleteConfirm}
              onChange={e => { setDeleteConfirm(e.target.value); setDangerError(null); }}
              placeholder="Type DELETE to confirm"
              style={{
                flex: 1, padding: "9px 13px", borderRadius: 9,
                border: `1.5px solid ${deleteConfirm === "DELETE" ? COLORS.danger : COLORS.border}`,
                fontSize: 13, fontFamily: "inherit", boxSizing: "border-box",
                color: COLORS.text, outline: "none", transition: "border-color 0.15s",
              }}
            />
            <button
              onClick={handleDelete}
              disabled={deleteConfirm !== "DELETE" || deleteLoading}
              style={{
                padding: "10px 18px", borderRadius: 9, border: "none",
                background: deleteConfirm === "DELETE" ? COLORS.danger : "#e5e7eb",
                color: deleteConfirm === "DELETE" ? "#fff" : COLORS.textLight,
                fontSize: 12.5, fontWeight: 700,
                cursor: deleteConfirm === "DELETE" && !deleteLoading ? "pointer" : "not-allowed",
                fontFamily: "inherit", whiteSpace: "nowrap",
                opacity: deleteLoading ? 0.7 : 1,
                transition: "background 0.15s, color 0.15s",
              }}>
              {deleteLoading ? "Deleting…" : "Delete Account"}
            </button>
          </div>
        </div>
      </SectionCard>

    </div>
  );
}