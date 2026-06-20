import { useState } from "react";
import COLORS from "../../constants/colors";
import Icon from "../../components/Icon";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api";

// ── Toggle Switch ──────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 42, height: 24, borderRadius: 12,
        background: checked ? "#1e3a5f" : "#d1d5db",
        position: "relative", cursor: "pointer",
        transition: "background 0.2s", flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute", top: 3,
          left: checked ? 21 : 3,
          width: 18, height: 18, borderRadius: "50%",
          background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          transition: "left 0.2s",
        }}
      />
    </div>
  );
}

// ── Section Card ──────────────────────────────────────────────────────────
function SectionCard({ icon, title, subtitle, badge, children, accent }) {
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${accent ? `${accent}40` : COLORS.border}`,
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 20,
      }}
    >
      <div
        style={{
          padding: "18px 24px",
          borderBottom: `1px solid ${accent ? `${accent}20` : COLORS.border}`,
          display: "flex", alignItems: "center", gap: 12,
          background: accent ? `${accent}08` : "transparent",
        }}
      >
        {icon && (
          <div
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: accent ? `${accent}18` : "#eff6ff",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            <Icon name={icon} size={16} color={accent ?? "#1e3a5f"} />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: accent ?? COLORS.text, display: "flex", alignItems: "center", gap: 8 }}>
            {title}
            {badge && (
              <span
                style={{
                  fontSize: 10, fontWeight: 700,
                  background: `${accent ?? "#1e3a5f"}18`,
                  color: accent ?? "#1e3a5f",
                  padding: "2px 7px", borderRadius: 20,
                  border: `1px solid ${accent ?? "#1e3a5f"}30`,
                }}
              >
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
    <div
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "13px 0",
        borderBottom: last ? "none" : `1px solid ${COLORS.border}`,
      }}
    >
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
    <div
      onClick={onClick}
      style={{
        flex: 1, padding: "16px 18px", borderRadius: 12,
        border: `2px solid ${selected ? "#1e3a5f" : COLORS.border}`,
        background: selected ? "#eff6ff" : "#fff",
        cursor: "pointer", transition: "all 0.15s",
        display: "flex", flexDirection: "column", gap: 6,
      }}
      onMouseEnter={e => { if (!selected) { e.currentTarget.style.borderColor = "#93c5fd"; e.currentTarget.style.background = "#f8faff"; } }}
      onMouseLeave={e => { if (!selected) { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.background = "#fff"; } }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 32, height: 32, borderRadius: 8,
            background: selected ? "#bfdbfe" : "#f3f4f6",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Icon name={icon} size={15} color={selected ? "#1e3a5f" : COLORS.textMid} />
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: selected ? "#1e3a5f" : COLORS.text }}>{label}</div>
        {selected && (
          <div style={{ marginLeft: "auto", width: 18, height: 18, borderRadius: "50%", background: "#1e3a5f", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={10} height={10} viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
          </div>
        )}
      </div>
      <div style={{ fontSize: 11.5, color: COLORS.textLight }}>{description}</div>
    </div>
  );
}

// ── OfficerSettings ───────────────────────────────────────────────────────
export default function OfficerSettings() {
  const { user, logout } = useAuth();

  // Password
  const [pwForm, setPwForm]       = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [pwSaving, setPwSaving]   = useState(false);
  const [pwError, setPwError]     = useState(null);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [showPw, setShowPw]       = useState({ current: false, new: false, confirm: false });

  // Notifications
  const [notifs, setNotifs] = useState({
    new_complaints:        true,
    maintenance_requests:  true,
    dues_overdue:          true,
    announcements:         true,
    resident_registrations: false,
    event_updates:         true,
    system_alerts:         true,
    weekly_digest:         false,
  });

  // Appearance
  const [theme, setTheme]     = useState("system");
  const [density, setDensity] = useState("comfortable");

  // Danger zone
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deactivating, setDeactivating]   = useState(false);

  function handlePwField(k, v) { setPwForm(p => ({ ...p, [k]: v })); setPwError(null); setPwSuccess(false); }
  function toggleNotif(k) { setNotifs(p => ({ ...p, [k]: !p[k] })); }

  function pwStrength(pw) {
    if (!pw) return { level: 0, label: "", color: "" };
    let score = 0;
    if (pw.length >= 8)           score++;
    if (pw.length >= 12)          score++;
    if (/[A-Z]/.test(pw))         score++;
    if (/[0-9]/.test(pw))         score++;
    if (/[^A-Za-z0-9]/.test(pw))  score++;
    if (score <= 1) return { level: 1, label: "Weak",        color: COLORS.danger  };
    if (score <= 3) return { level: 2, label: "Fair",        color: "#f59e0b"      };
    if (score <= 4) return { level: 3, label: "Strong",      color: "#1e3a5f"      };
    return                { level: 4, label: "Very Strong",  color: "#0f766e"      };
  }

  const strength = pwStrength(pwForm.new_password);

  async function handlePasswordSave() {
    if (!pwForm.current_password)                        { setPwError("Current password is required."); return; }
    if (pwForm.new_password.length < 8)                  { setPwError("New password must be at least 8 characters."); return; }
    if (pwForm.new_password !== pwForm.confirm_password) { setPwError("Passwords do not match."); return; }
    setPwSaving(true); setPwError(null);
    try {
      await api.updateProfile(user.id, { current_password: pwForm.current_password, new_password: pwForm.new_password });
      setPwSuccess(true);
      setPwForm({ current_password: "", new_password: "", confirm_password: "" });
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err) {
      setPwError(err.message ?? "Failed to update password.");
    } finally {
      setPwSaving(false);
    }
  }

  const activeCount = Object.values(notifs).filter(Boolean).length;

  return (
    <div style={{ padding: "28px 32px", maxWidth: 760, margin: "0 auto" }}>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textLight, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>
          Officer Account
        </div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: COLORS.text }}>Settings</h1>
        <p style={{ margin: "6px 0 0", fontSize: 13.5, color: COLORS.textLight }}>
          Manage your account security, notification preferences, and portal appearance.
        </p>
      </div>

      {/* ── Password ── */}
      <SectionCard icon="settings" title="Change Password" subtitle="Keep your officer account secure with a strong password">
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
                onFocus={e => e.target.style.borderColor = "#1e3a5f"}
                onBlur={e => e.target.style.borderColor = COLORS.border}
              />
              <button
                onClick={() => setShowPw(p => ({ ...p, [showKey]: !p[showKey] }))}
                style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", padding: 0,
                  color: COLORS.textLight, fontSize: 12, fontWeight: 600, fontFamily: "inherit",
                }}
              >
                {showPw[showKey] ? "Hide" : "Show"}
              </button>
            </div>
            {/* Strength bar */}
            {key === "new_password" && pwForm.new_password && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      style={{
                        flex: 1, height: 4, borderRadius: 4,
                        background: i <= strength.level ? strength.color : "#e5e7eb",
                        transition: "background 0.2s",
                      }}
                    />
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
          <button
            onClick={handlePasswordSave}
            disabled={pwSaving}
            style={{
              padding: "10px 22px", borderRadius: 9, border: "none",
              background: "#1e3a5f", color: "#fff", fontSize: 13,
              fontWeight: 600, cursor: pwSaving ? "not-allowed" : "pointer",
              fontFamily: "inherit", opacity: pwSaving ? 0.7 : 1,
              transition: "opacity 0.15s",
            }}
          >
            {pwSaving ? "Updating…" : "Update Password"}
          </button>
        </div>
      </SectionCard>

      {/* ── Notifications ── */}
      <SectionCard
        icon="bell"
        title="Notification Preferences"
        subtitle="Choose which officer alerts you want to receive"
        badge={`${activeCount} active`}
      >
        <NotifRow
          label="New Complaints"
          description="Alerts when residents submit new complaints or reports"
          checked={notifs.new_complaints}
          onChange={() => toggleNotif("new_complaints")}
        />
        <NotifRow
          label="Maintenance Requests"
          description="Notifications for incoming and updated maintenance requests"
          checked={notifs.maintenance_requests}
          onChange={() => toggleNotif("maintenance_requests")}
        />
        <NotifRow
          label="Overdue Dues"
          description="Reminders when residents have outstanding HOA dues"
          checked={notifs.dues_overdue}
          onChange={() => toggleNotif("dues_overdue")}
        />
        <NotifRow
          label="HOA Announcements"
          description="General HOA news and community-wide announcements"
          checked={notifs.announcements}
          onChange={() => toggleNotif("announcements")}
        />
        <NotifRow
          label="Resident Registrations"
          description="Alerts for new resident sign-ups awaiting approval"
          checked={notifs.resident_registrations}
          onChange={() => toggleNotif("resident_registrations")}
        />
        <NotifRow
          label="Event Updates"
          description="Changes or reminders for scheduled HOA events"
          checked={notifs.event_updates}
          onChange={() => toggleNotif("event_updates")}
        />
        <NotifRow
          label="System Alerts"
          description="Critical system notifications and security alerts"
          checked={notifs.system_alerts}
          onChange={() => toggleNotif("system_alerts")}
        />
        <div style={{ paddingTop: 13, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ flex: 1, marginRight: 20 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: COLORS.text, marginBottom: 2 }}>Weekly Summary Digest</div>
            <div style={{ fontSize: 12, color: COLORS.textLight }}>Receive a weekly officer summary covering complaints, dues, and maintenance activity</div>
          </div>
          <Toggle checked={notifs.weekly_digest} onChange={() => toggleNotif("weekly_digest")} />
        </div>

        <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
          <button
            style={{
              padding: "10px 22px", borderRadius: 9, border: "none",
              background: "#1e3a5f", color: "#fff", fontSize: 13,
              fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Save Preferences
          </button>
        </div>
      </SectionCard>

      {/* ── Appearance ── */}
      <SectionCard icon="home" title="Appearance" subtitle="Customize how the officer portal looks and feels">
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textLight, letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 12 }}>Theme</div>
          <div style={{ display: "flex", gap: 10 }}>
            <AppearanceOption
              icon="sun"      label="Light"   description="Clean white background"
              selected={theme === "light"}    onClick={() => setTheme("light")}
            />
            <AppearanceOption
              icon="moon"     label="Dark"    description="Easy on the eyes at night"
              selected={theme === "dark"}     onClick={() => setTheme("dark")}
            />
            <AppearanceOption
              icon="settings" label="System"  description="Follows your device setting"
              selected={theme === "system"}   onClick={() => setTheme("system")}
            />
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textLight, letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 12 }}>Display Density</div>
          <div style={{ display: "flex", gap: 10 }}>
            <AppearanceOption
              icon="home" label="Compact"     description="More content, less spacing"
              selected={density === "compact"}     onClick={() => setDensity("compact")}
            />
            <AppearanceOption
              icon="home" label="Comfortable" description="Balanced spacing (default)"
              selected={density === "comfortable"} onClick={() => setDensity("comfortable")}
            />
          </div>
        </div>

        <div style={{ marginTop: 16, padding: "12px 14px", background: "#eff6ff", borderRadius: 10, border: "1px solid #bfdbfe", fontSize: 12, color: COLORS.textLight }}>
          <span style={{ color: "#1e3a5f", fontWeight: 600 }}>ℹ Note:</span> Dark mode and density settings are saved to this browser. You may need to reload for full effect.
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
        {/* Deactivate */}
        <div
          style={{
            border: `1px solid ${COLORS.border}`, borderRadius: 11,
            padding: "16px 18px", marginBottom: 14,
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.text, marginBottom: 3 }}>Deactivate Account</div>
            <div style={{ fontSize: 12, color: COLORS.textLight, maxWidth: 420 }}>
              Temporarily disables your officer account. An administrator will need to reactivate it.
            </div>
          </div>
          <button
            onClick={() => setDeactivating(true)}
            style={{
              padding: "9px 16px", borderRadius: 9,
              border: `1.5px solid ${COLORS.danger}`,
              background: "#fff", fontSize: 12.5, fontWeight: 600,
              cursor: "pointer", color: COLORS.danger,
              fontFamily: "inherit", whiteSpace: "nowrap",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = COLORS.dangerBg}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}
          >
            Deactivate
          </button>
        </div>

        {/* Delete */}
        <div
          style={{
            border: `1.5px solid ${COLORS.danger}30`,
            borderRadius: 11, padding: "16px 18px",
            background: `${COLORS.danger}04`,
          }}
        >
          <div style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.danger, marginBottom: 4 }}>Delete Account</div>
          <div style={{ fontSize: 12, color: COLORS.textLight, marginBottom: 14 }}>
            Permanently deletes your officer account and all associated data. This action <strong>cannot be undone</strong>. Type <strong>DELETE</strong> below to confirm.
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              placeholder="Type DELETE to confirm"
              style={{
                flex: 1, padding: "9px 13px", borderRadius: 9,
                border: `1.5px solid ${deleteConfirm === "DELETE" ? COLORS.danger : COLORS.border}`,
                fontSize: 13, fontFamily: "inherit", boxSizing: "border-box",
                color: COLORS.text, outline: "none", transition: "border-color 0.15s",
              }}
            />
            <button
              disabled={deleteConfirm !== "DELETE"}
              style={{
                padding: "10px 18px", borderRadius: 9, border: "none",
                background: deleteConfirm === "DELETE" ? COLORS.danger : "#e5e7eb",
                color: deleteConfirm === "DELETE" ? "#fff" : COLORS.textLight,
                fontSize: 12.5, fontWeight: 700,
                cursor: deleteConfirm === "DELETE" ? "pointer" : "not-allowed",
                fontFamily: "inherit", whiteSpace: "nowrap",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </SectionCard>

    </div>
  );
}