import { useState } from "react";
import { api } from "../../api";
import COLORS from "../../constants/colors";
import Icon from "../../components/Icon";

export default function RegisterPage({ setView }) {
  const [form, setForm]       = useState({ first_name: "", last_name: "", email: "", block_lot: "", contact: "", password: "", confirm: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      return setError("Passwords do not match.");
    }
    setLoading(true);
    try {
      await api.register({
        first_name: form.first_name,
        last_name:  form.last_name,
        email:      form.email,
        password:   form.password,
        block_lot:  form.block_lot,
        contact:    form.contact,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", background: COLORS.bg, padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 380 }}>
          <div style={{ background: COLORS.successBg, borderRadius: "50%", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Icon name="check" size={32} color={COLORS.success} />
          </div>
          <h2 style={{ color: COLORS.text, margin: "0 0 8px" }}>Registration Submitted</h2>
          <p style={{ color: COLORS.textMid, fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
            Your application is pending approval by the HOA officer. You'll receive confirmation once activated.
          </p>
          <button onClick={() => setView("login")} style={{ background: COLORS.primary, color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", background: COLORS.bg, padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: COLORS.text }}>Create Account</h2>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: COLORS.textMid }}>Register as a South Meridian resident</p>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 28, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          {error && (
            <div style={{ background: COLORS.dangerBg, border: `1px solid ${COLORS.danger}33`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: COLORS.danger }}>
              {error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            {[["first_name", "First Name", "Maria"], ["last_name", "Last Name", "Santos"]].map(([k, label, ph]) => (
              <div key={k}>
                <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMid, display: "block", marginBottom: 5 }}>{label}</label>
                <input value={form[k]} onChange={e => set(k, e.target.value)} placeholder={ph} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${COLORS.border}`, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
            ))}
          </div>

          {[["email", "Email Address", "email", "you@email.com"], ["block_lot", "Block & Lot", "text", "e.g. Blk 5 Lot 12"], ["contact", "Contact Number", "text", "e.g. 09xx-xxx-xxxx"]].map(([k, label, type, ph]) => (
            <div key={k} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMid, display: "block", marginBottom: 5 }}>{label}</label>
              <input type={type} value={form[k]} onChange={e => set(k, e.target.value)} placeholder={ph} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${COLORS.border}`, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
            </div>
          ))}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[["password", "Password"], ["confirm", "Confirm Password"]].map(([k, label]) => (
              <div key={k}>
                <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMid, display: "block", marginBottom: 5 }}>{label}</label>
                <input type="password" value={form[k]} onChange={e => set(k, e.target.value)} placeholder="••••••••" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${COLORS.border}`, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
            ))}
          </div>

          <button onClick={handleRegister} disabled={loading} style={{ width: "100%", padding: "11px", borderRadius: 8, border: "none", background: loading ? COLORS.textLight : COLORS.primary, color: "#fff", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
            {loading ? "Submitting..." : "Submit Registration"}
          </button>

          <div style={{ textAlign: "center", marginTop: 14 }}>
            <span style={{ fontSize: 13, color: COLORS.textMid }}>Already have an account? </span>
            <button onClick={() => setView("login")} style={{ background: "none", border: "none", color: COLORS.primary, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}