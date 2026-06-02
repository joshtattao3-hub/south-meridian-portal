import { useState } from "react";
import { api } from "../../api";
import COLORS from "../../constants/colors";
import Icon from "../../components/Icon";

export default function RegisterPage({ setView }) {
  const [form, setForm]       = useState({ first_name: "", last_name: "", email: "", block_lot: "", contact: "", password: "", confirm: "" });
  const [errors, setErrors]   = useState({});
  const [serverError, setServerError] = useState("");
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = (f) => {
    const e = {};
    if (!f.first_name.trim())               e.first_name = "First name is required.";
    if (!f.last_name.trim())                e.last_name  = "Last name is required.";
    if (!f.email)                           e.email      = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(f.email)) e.email      = "Enter a valid email address.";
    if (!f.block_lot.trim())                e.block_lot  = "Block & Lot is required.";
    if (!f.contact.trim())                  e.contact    = "Contact number is required.";
    else if (!/^[0-9\-\+\s]{7,15}$/.test(f.contact)) e.contact = "Enter a valid contact number.";
    if (!f.password)                        e.password   = "Password is required.";
    else if (f.password.length < 8)         e.password   = "Password must be at least 8 characters.";
    if (!f.confirm)                         e.confirm    = "Please confirm your password.";
    else if (f.confirm !== f.password)      e.confirm    = "Passwords do not match.";
    return e;
  };

  const touch   = (k) => setTouched(t => ({ ...t, [k]: true }));
  const set     = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (touched[k]) setErrors(e => ({ ...e, [k]: validate({ ...form, [k]: v })[k] }));
  };

  const fieldStyle = (k) => ({
    width: "100%", padding: "10px 14px", borderRadius: 8,
    border: `1.5px solid ${touched[k] && errors[k] ? COLORS.danger : touched[k] && !errors[k] ? COLORS.success : COLORS.border}`,
    fontSize: 14, fontFamily: "inherit", boxSizing: "border-box",
    outline: "none", transition: "border-color 0.2s",
    background: touched[k] && errors[k] ? COLORS.dangerBg : "#fff",
  });

  const FieldMsg = ({ k }) => {
    if (!touched[k]) return null;
    if (errors[k]) return <div style={{ fontSize: 11, color: COLORS.danger, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><Icon name="info" size={11} color={COLORS.danger} />{errors[k]}</div>;
    return <div style={{ fontSize: 11, color: COLORS.success, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><Icon name="check" size={11} color={COLORS.success} />Looks good!</div>;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(form).map(k => [k, true]));
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setServerError("");
    setLoading(true);
    try {
      await api.register({ first_name: form.first_name, last_name: form.last_name, email: form.email, password: form.password, block_lot: form.block_lot, contact: form.contact });
      setSuccess(true);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleRegister(e); };

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
    <>
      <style>{`
        @media (max-width: 480px) {
          .reg-wrapper { padding: 16px !important; }
          .reg-card { padding: 20px !important; }
          .reg-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div className="reg-wrapper" style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", background: COLORS.bg, padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: COLORS.text }}>Create Account</h2>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: COLORS.textMid }}>Register as a South Meridian resident</p>
          </div>

          <div className="reg-card" style={{ background: "#fff", borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 28, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            {serverError && (
              <div style={{ background: COLORS.dangerBg, border: `1px solid ${COLORS.danger}33`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: COLORS.danger, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="x" size={14} color={COLORS.danger} /> {serverError}
              </div>
            )}

            <div className="reg-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              {[["first_name", "First Name", "Maria"], ["last_name", "Last Name", "Santos"]].map(([k, label, ph]) => (
                <div key={k}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMid, display: "block", marginBottom: 5 }}>{label}</label>
                  <input value={form[k]} onChange={e => set(k, e.target.value)} onBlur={() => { touch(k); setErrors(er => ({ ...er, [k]: validate(form)[k] })); }} placeholder={ph} style={fieldStyle(k)} />
                  <FieldMsg k={k} />
                </div>
              ))}
            </div>

            {[["email", "Email Address", "email", "you@email.com"], ["block_lot", "Block & Lot", "text", "e.g. Blk 5 Lot 12"], ["contact", "Contact Number", "text", "e.g. 09xx-xxx-xxxx"]].map(([k, label, type, ph]) => (
              <div key={k} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMid, display: "block", marginBottom: 5 }}>{label}</label>
                <input type={type} value={form[k]} onChange={e => set(k, e.target.value)} onBlur={() => { touch(k); setErrors(er => ({ ...er, [k]: validate(form)[k] })); }} placeholder={ph} style={fieldStyle(k)} />
                <FieldMsg k={k} />
              </div>
            ))}

            <div className="reg-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[
                ["password", "Password",         showPass,    setShowPass],
                ["confirm",  "Confirm Password", showConfirm, setShowConfirm],
              ].map(([k, label, show, setShow]) => (
                <div key={k}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMid, display: "block", marginBottom: 5 }}>{label}</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={show ? "text" : "password"}
                      value={form[k]}
                      onChange={e => set(k, e.target.value)}
                      onBlur={() => { touch(k); setErrors(er => ({ ...er, [k]: validate(form)[k] })); }}
                      onKeyDown={handleKeyDown}
                      placeholder="••••••••"
                      style={{ ...fieldStyle(k), paddingRight: 40 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShow(s => !s)}
                      style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
                    >
                      <Icon name={show ? "eye-off" : "eye"} size={16} color={COLORS.textMid} />
                    </button>
                  </div>
                  <FieldMsg k={k} />
                </div>
              ))}
            </div>

            <button onClick={handleRegister} disabled={loading} style={{ width: "100%", padding: "11px", borderRadius: 8, border: "none", background: loading ? COLORS.textLight : COLORS.primary, color: "#fff", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s" }}>
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/></path></svg>
                  Submitting...
                </>
              ) : "Submit Registration"}
            </button>

            <div style={{ textAlign: "center", marginTop: 14 }}>
              <span style={{ fontSize: 13, color: COLORS.textMid }}>Already have an account? </span>
              <button onClick={() => setView("login")} style={{ background: "none", border: "none", color: COLORS.primary, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Sign In</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}