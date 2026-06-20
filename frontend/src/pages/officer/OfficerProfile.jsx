import { useState, useRef } from "react";
import COLORS from "../../constants/colors";
import Icon from "../../components/Icon";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api";

// ── Stat Card ─────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, accent }) {
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        flex: 1,
        minWidth: 0,
        transition: "box-shadow 0.2s, transform 0.2s",
        cursor: "default",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.08)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          width: 42, height: 42, borderRadius: 11,
          background: accent ?? COLORS.primaryBg,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}
      >
        <Icon name={icon} size={18} color={COLORS.primary} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, color: COLORS.textLight, fontWeight: 500, marginBottom: 2, letterSpacing: 0.3 }}>{label}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value || "—"}</div>
      </div>
    </div>
  );
}

// ── Field Row ─────────────────────────────────────────────────────────────
function FieldRow({ label, value, editable, inputKey, form, onField, type = "text", disabled }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 600, color: COLORS.textLight, display: "block", marginBottom: 5, letterSpacing: 0.4, textTransform: "uppercase" }}>
        {label}
      </label>
      {editable ? (
        <input
          type={type}
          value={form[inputKey] ?? ""}
          onChange={e => onField(inputKey, e.target.value)}
          disabled={disabled}
          style={{
            width: "100%", padding: "10px 13px", borderRadius: 9,
            border: `1.5px solid ${COLORS.border}`,
            fontSize: 13.5, fontFamily: "inherit", boxSizing: "border-box",
            color: disabled ? COLORS.textLight : COLORS.text,
            background: disabled ? COLORS.bg : "#fff",
            outline: "none", transition: "border-color 0.15s",
          }}
          onFocus={e => { if (!disabled) e.target.style.borderColor = COLORS.primary; }}
          onBlur={e => e.target.style.borderColor = COLORS.border}
        />
      ) : (
        <div
          style={{
            padding: "10px 13px", borderRadius: 9,
            border: `1.5px solid ${COLORS.border}`,
            fontSize: 13.5, color: COLORS.textLight,
            background: COLORS.bg, boxSizing: "border-box",
          }}
        >
          {value || "—"}
        </div>
      )}
    </div>
  );
}

// ── Section Card ──────────────────────────────────────────────────────────
function SectionCard({ title, subtitle, children, action }) {
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 20,
      }}
    >
      <div
        style={{
          padding: "18px 24px",
          borderBottom: `1px solid ${COLORS.border}`,
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 2 }}>{subtitle}</div>}
        </div>
        {action}
      </div>
      <div style={{ padding: "22px 24px" }}>{children}</div>
    </div>
  );
}

// ── OfficerProfile ────────────────────────────────────────────────────────
export default function OfficerProfile() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    first_name:              user?.first_name              ?? "",
    last_name:               user?.last_name               ?? "",
    email:                   user?.email                   ?? "",
    phone:                   user?.phone                   ?? "",
    emergency_contact_name:  user?.emergency_contact_name  ?? "",
    emergency_contact_phone: user?.emergency_contact_phone ?? "",
    emergency_contact_rel:   user?.emergency_contact_rel   ?? "",
  });

  const [editing, setEditing]             = useState(false);
  const [saving, setSaving]               = useState(false);
  const [error, setError]                 = useState(null);
  const [success, setSuccess]             = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar_url ? `http://localhost:5000${user.avatar_url}` : null
  );
  const [avatarFile, setAvatarFile] = useState(null);
  const fileRef = useRef(null);

  const initials    = `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`.toUpperCase() || "?";
  const displayName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || "Officer";
  const memberSince = user?.created_at ? new Date(user.created_at).getFullYear() : "—";

  function handleField(k, v) { setForm(p => ({ ...p, [k]: v })); setError(null); setSuccess(false); }

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  function handleCancel() {
    setForm({
      first_name:              user?.first_name              ?? "",
      last_name:               user?.last_name               ?? "",
      email:                   user?.email                   ?? "",
      phone:                   user?.phone                   ?? "",
      emergency_contact_name:  user?.emergency_contact_name  ?? "",
      emergency_contact_phone: user?.emergency_contact_phone ?? "",
      emergency_contact_rel:   user?.emergency_contact_rel   ?? "",
    });
    setEditing(false);
    setError(null);
  }

  async function handleSave() {
    if (!form.first_name.trim() || !form.last_name.trim()) { setError("First and last name are required."); return; }
    setSaving(true); setError(null);
    try {
      if (avatarFile) {
        const res = await api.uploadAvatar(user.id, avatarFile);
        updateUser({ avatar_url: res.avatar_url });
      }
      const updated = await api.updateProfile(user.id, {
        first_name:              form.first_name.trim(),
        last_name:               form.last_name.trim(),
        phone:                   form.phone,
        emergency_contact_name:  form.emergency_contact_name,
        emergency_contact_phone: form.emergency_contact_phone,
        emergency_contact_rel:   form.emergency_contact_rel,
      });
      updateUser(updated);
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message ?? "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ padding: "28px 32px", width: "100%", boxSizing: "border-box" }}>

      {/* ── Hero Banner ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #2d5282 60%, #1a2f4a 100%)",
          borderRadius: 18,
          padding: "32px 32px 90px",
          position: "relative",
          overflow: "hidden",
          marginBottom: 56,
        }}
      >
        {/* decorative circles */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", top: 20, right: 60, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", bottom: -20, left: "40%", width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.65)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>
            Officer Portal
          </div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
            My Profile
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
            Manage your officer information and contact details
          </p>
        </div>
      </div>

      {/* ── Avatar Card (overlapping banner) ── */}
      <div
        style={{
          background: "#fff",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 18,
          padding: "24px 28px",
          display: "flex",
          alignItems: "center",
          gap: 22,
          marginTop: -72,
          marginBottom: 20,
          position: "relative",
          zIndex: 10,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
      >
        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div
            style={{
              width: 84, height: 84, borderRadius: "50%",
              background: "linear-gradient(135deg, #1e3a5f, #2d5282)",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", border: "4px solid #fff",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
            }}
          >
            {avatarPreview
              ? <img src={avatarPreview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ color: "#fff", fontWeight: 800, fontSize: 30 }}>{initials}</span>
            }
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              position: "absolute", bottom: 2, right: 2,
              width: 26, height: 26, borderRadius: "50%",
              background: "#1e3a5f", border: "2.5px solid #fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              transition: "transform 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <Icon name="upload" size={11} color="#fff" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
        </div>

        {/* Name + meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.text, marginBottom: 3 }}>{displayName}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {user?.role && (
              <span style={{ fontSize: 11, fontWeight: 600, background: "#eff6ff", color: "#1e3a5f", padding: "3px 9px", borderRadius: 20, border: "1px solid #bfdbfe" }}>
                {user.role}
              </span>
            )}
            {user?.department && (
              <span style={{ fontSize: 11, fontWeight: 600, background: "#f0fdf4", color: "#166534", padding: "3px 9px", borderRadius: 20, border: "1px solid #bbf7d0" }}>
                {user.department}
              </span>
            )}
            {memberSince !== "—" && (
              <span style={{ fontSize: 11, color: COLORS.textLight, padding: "3px 0" }}>
                Officer since {memberSince}
              </span>
            )}
          </div>
        </div>

        {/* Edit / Save buttons */}
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          {editing ? (
            <>
              <button
                onClick={handleCancel}
                style={{
                  padding: "9px 16px", borderRadius: 9, border: `1.5px solid ${COLORS.border}`,
                  background: "#fff", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                  fontFamily: "inherit", color: COLORS.text, transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.bg}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: "9px 18px", borderRadius: 9, border: "none",
                  background: "#1e3a5f", color: "#fff", fontSize: 12.5,
                  fontWeight: 600, cursor: saving ? "not-allowed" : "pointer",
                  fontFamily: "inherit", opacity: saving ? 0.7 : 1,
                  display: "flex", alignItems: "center", gap: 6,
                  transition: "opacity 0.15s",
                }}
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              style={{
                padding: "9px 18px", borderRadius: 9,
                border: `1.5px solid ${COLORS.border}`,
                background: "#fff", fontSize: 12.5, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit", color: COLORS.text,
                display: "flex", alignItems: "center", gap: 6,
                transition: "background 0.15s, border-color 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.borderColor = "#1e3a5f"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = COLORS.border; }}
            >
              <Icon name="settings" size={13} color={COLORS.textMid} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* ── Status banners ── */}
      {error && (
        <div style={{ background: COLORS.dangerBg, border: `1px solid ${COLORS.danger}`, borderRadius: 10, padding: "10px 16px", fontSize: 13, color: COLORS.danger, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <span>⚠</span> {error}
        </div>
      )}
      {success && (
        <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: "10px 16px", fontSize: 13, color: "#166534", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <span>✓</span> Profile saved successfully!
        </div>
      )}

      {/* ── Stats Row ── */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <StatCard icon="user"     label="Role"         value={user?.role}       />
        <StatCard icon="home"     label="Department"   value={user?.department} />
        <StatCard icon="calendar" label="Term Start"   value={user?.term_start} />
        <StatCard icon="bell"     label="Account Status" value="Active"         />
      </div>

      {/* ── Personal Information ── */}
      <SectionCard
        title="Personal Information"
        subtitle="Your basic account details"
        action={
          !editing && (
            <span style={{ fontSize: 11, color: COLORS.textLight, marginTop: 2 }}>
              Click "Edit Profile" to modify
            </span>
          )
        }
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <FieldRow label="First Name"    inputKey="first_name" form={form} onField={handleField} editable={editing} />
          <FieldRow label="Last Name"     inputKey="last_name"  form={form} onField={handleField} editable={editing} />
          <FieldRow label="Email Address" value={user?.email}   editable={false} />
          <FieldRow label="Phone Number"  inputKey="phone"      form={form} onField={handleField} editable={editing} />
        </div>
      </SectionCard>

      {/* ── Officer Details ── */}
      <SectionCard
        title="Officer Details"
        subtitle="Your HOA position and assignment information"
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <FieldRow label="Role / Position" value={user?.role}        editable={false} />
          <FieldRow label="Department"      value={user?.department}  editable={false} />
          <FieldRow label="Term Start"      value={user?.term_start}  editable={false} />
          <FieldRow label="Term End"        value={user?.term_end}    editable={false} />
          <FieldRow label="Badge / ID No."  value={user?.badge_number} editable={false} />
          <FieldRow label="Officer Since"   value={memberSince !== "—" ? `${memberSince}` : "—"} editable={false} />
        </div>
        <div style={{ marginTop: 14, padding: "12px 14px", background: "#eff6ff", borderRadius: 10, border: "1px solid #bfdbfe" }}>
          <div style={{ fontSize: 12, color: "#1e3a5f", fontWeight: 600, marginBottom: 2 }}>ℹ Officer details are managed by the HOA administrator.</div>
          <div style={{ fontSize: 11.5, color: COLORS.textLight }}>To update your role, department, or term dates, please contact the HOA head office.</div>
        </div>
      </SectionCard>

      {/* ── Emergency Contact ── */}
      <SectionCard
        title="Emergency Contact"
        subtitle="Person to contact in case of emergency"
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <FieldRow label="Full Name"    inputKey="emergency_contact_name"  form={form} onField={handleField} editable={editing} />
          <FieldRow label="Phone Number" inputKey="emergency_contact_phone" form={form} onField={handleField} editable={editing} />
          <FieldRow label="Relationship" inputKey="emergency_contact_rel"   form={form} onField={handleField} editable={editing} />
        </div>
      </SectionCard>

    </div>
  );
}