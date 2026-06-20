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
        background: checked ? COLORS.primary : "#d1d5db",
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
              background: accent ? `${accent}18` : COLORS.primaryBg,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            <Icon name={icon} size={16} color={accent ?? COLORS.primary} />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: accent ?? COLORS.text, display: "flex", alignItems: "center", gap: 8 }}>
            {title}
            {badge && (
              <span
                style={{
                  fontSize: 10, fontWeight: 700,
                  background: `${accent ?? COLORS.primary}18`,
                  color: accent ?? COLORS.primary,
                  padding: "2px 7px", borderRadius: 20,
                  border: `1px solid ${accent ?? COLORS.primary}30`,
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
        border: `2px solid ${selected ? COLORS.primary : COLORS.border}`,
        background: selected ? COLORS.primaryBg : "#fff",
        cursor: "pointer", transition: "all 0.15s",
        display: "flex", flexDirection: "column", gap: 6,
      }}
      onMouseEnter={e => { if (!selected) { e.currentTarget.style.borderColor = `${COLORS.primary}60`; e.currentTarget.style.background = `${COLORS.primaryBg}80`; } }}
      onMouseLeave={e => { if (!selected) { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.background = "#fff"; } }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 32, height: 32, borderRadius: 8,
            background: selected ? `${COLORS.primary}20` : "#f3f4f6",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
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

// ── AdminSettings ─────────────────────────────────────────────────────────
export default function AdminSettings() {
  const { user, logout } = useAuth();

  // Password
  const [pwForm, setPwForm]       = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [pwSaving, setPwSaving]   = useState(false);
  const [pwError, setPwError]     = useState(null);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [showPw, setShowPw]       = useState({ current: false, new: false, confirm: false });

  // Notifications
  const [notifs, setNotifs] = useState({
    new_registrations:     true,
    dues_overdue:          true,
    new_complaints:        true,
    maintenance_escalated: true,
    reservation_approvals: true,
    system_errors:         true,
    officer_activity:      false,
    audit_alerts:          true,
    weekly_report:         true,
  });

  // Appearance
  const [theme, setTheme]     = useState("system");
  const [density, setDensity] = useState("comfortable");

  // Danger zone
  const [deleteConfirm, setDeleteConfirm] = useState("");

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
    if (score <= 1) return { level: 1, label: "Weak",       color: COLORS.danger  };
    if (score <= 3) return { level: 2, label: "Fair",       color: "#f59e0b"      };
    if (score <= 4) return { level: 3, label: "Strong",     color: COLORS.primary };
    return                { level: 4, label: "Very Strong", color: "#0f766e"      };
  }

  const strength    = pwStrength(pwForm.new_password);
  const activeCount = Object.values(notifs).filter(Boolean).length;

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

  return (
    <div style={{ padding: "28px 32px", maxWidth: 760, margin: "0 auto" }}>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textLight, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>
          Admin Account
        </div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: COLORS.text }}>Settings</h1>
        <p style={{ margin: "6px 0 0", fontSize: 13.5, color: COLORS.textLight }}>
          Manage your account security, notification preferences, and portal appearance.
        </p>
      </div>

      {/* ── Password ── */}
      <SectionCard icon="settings" title="Change Password" subtitle="Keep your administrator account secure with a strong password">
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
              background: COLORS.primary, color: "#fff", fontSize: 13,
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
        subtitle="Choose which system-level alerts you want to receive"
        badge={`${activeCount} active`}
      >
        <NotifRow
          label="New Resident Registrations"
          description="Alerts when a new resident account is created and awaiting review"
          checked={notifs.new_registrations}
          onChange={() => toggleNotif("new_registrations")}
        />
        <NotifRow
          label="Overdue HOA Dues"
          description="Notifications when resident dues pass their payment deadline"
          checked={notifs.dues_overdue}
          onChange={() => toggleNotif("dues_overdue")}
        />
        <NotifRow
          label="New Complaints"
          description="Alerts for every complaint submitted by residents"
          checked={notifs.new_complaints}
          onChange={() => toggleNotif("new_complaints")}
        />
        <NotifRow
          label="Escalated Maintenance Requests"
          description="High-priority or long-unresolved maintenance items"
          checked={notifs.maintenance_escalated}
          onChange={() => toggleNotif("maintenance_escalated")}
        />
        <NotifRow
          label="Reservation Approvals"
          description="Facility reservation requests pending your approval"
          checked={notifs.reservation_approvals}
          onChange={() => toggleNotif("reservation_approvals")}
        />
        <NotifRow
          label="System Errors & Warnings"
          description="Critical errors, failed jobs, or system health warnings"
          checked={notifs.system_errors}
          onChange={() => toggleNotif("system_errors")}
        />
        <NotifRow
          label="Officer Activity Log"
          description="Summary of actions performed by HOA officers"
          checked={notifs.officer_activity}
          onChange={() => toggleNotif("officer_activity")}
        />
        <NotifRow
          label="Audit Alerts"
          description="Unusual account activity or permission changes"
          checked={notifs.audit_alerts}
          onChange={() => toggleNotif("audit_alerts")}
        />
        <div style={{ paddingTop: 13, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ flex: 1, marginRight: 20 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: COLORS.text, marginBottom: 2 }}>Weekly Admin Report</div>
            <div style={{ fontSize: 12, color: COLORS.textLight }}>Receive a weekly digest covering dues, complaints, reservations, and resident activity</div>
          </div>
          <Toggle checked={notifs.weekly_report} onChange={() => toggleNotif("weekly_report")} />
        </div>

        <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
          <button
            style={{
              padding: "10px 22px", borderRadius: 9, border: "none",
              background: COLORS.primary, color: "#fff", fontSize: 13,
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
      <SectionCard icon="home" title="Appearance" subtitle="Customize how the admin portal looks and feels">
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.textLight, letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 12 }}>Theme</div>
          <div style={{ display: "flex", gap: 10 }}>
            <AppearanceOption
              icon="sun"      label="Light"  description="Clean white background"
              selected={theme === "light"}   onClick={() => setTheme("light")}
            />
            <AppearanceOption
              icon="moon"     label="Dark"   description="Easy on the eyes at night"
              selected={theme === "dark"}    onClick={() => setTheme("dark")}
            />
            <AppearanceOption
              icon="settings" label="System" description="Follows your device setting"
              selected={theme === "system"}  onClick={() => setTheme("system")}
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

        <div style={{ marginTop: 16, padding: "12px 14px", background: COLORS.primaryBg, borderRadius: 10, border: `1px solid ${COLORS.primary}22`, fontSize: 12, color: COLORS.textLight }}>
          <span style={{ color: COLORS.primary, fontWeight: 600 }}>ℹ Note:</span> Dark mode and density settings are saved to this browser. You may need to reload for full effect.
        </div>
      </SectionCard>

      {/* ── Danger Zone ── */}
      <SectionCard
        icon="logout"
        title="Danger Zone"
        subtitle="Irreversible actions — proceed with extreme caution"
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
              Temporarily disables your admin account. Another administrator must reactivate it — ensure a backup admin exists before proceeding.
            </div>
          </div>
          <button
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
            Permanently deletes your administrator account and all associated data. System access will be revoked immediately. This action <strong>cannot be undone</strong>. Type <strong>DELETE</strong> below to confirm.
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