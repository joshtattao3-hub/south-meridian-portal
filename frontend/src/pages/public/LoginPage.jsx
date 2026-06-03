import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import COLORS from "../../constants/colors";
import Icon from "../../components/Icon";

export default function LoginPage({ setView }) {
  const { login } = useAuth();
  const [form, setForm]         = useState({ email: "", password: "" });
  const [errors, setErrors]     = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading]   = useState(false);
  const [touched, setTouched]   = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = (f) => {
    const e = {};
    if (!f.email)                            e.email    = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(f.email)) e.email    = "Enter a valid email address.";
    if (!f.password)                         e.password = "Password is required.";
    else if (f.password.length < 6)          e.password = "Password must be at least 6 characters.";
    return e;
  };

  const touch = (k) => setTouched(t => ({ ...t, [k]: true }));

  const fieldStyle = (k) => ({
    width: "100%", padding: "10px 14px", borderRadius: 8,
    border: `1.5px solid ${touched[k] && errors[k] ? COLORS.danger : touched[k] && !errors[k] ? COLORS.success : COLORS.border}`,
    fontSize: 14, fontFamily: "inherit", boxSizing: "border-box",
    outline: "none", transition: "border-color 0.2s",
    background: touched[k] && errors[k] ? COLORS.dangerBg : "#fff",
  });

  const handleChange = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (touched[k]) setErrors(e => ({ ...e, [k]: validate({ ...form, [k]: v })[k] }));
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    setTouched({ email: true, password: true });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setServerError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      setServerError(err.message ?? "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <>
      <style>{`
        @media (max-width: 480px) {
          .login-wrapper { padding: 16px !important; }
          .login-card { padding: 20px !important; }
        }
      `}</style>
      <div className="login-wrapper" style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", background: COLORS.bg, padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: COLORS.primaryBg, borderRadius: 12, padding: "10px 18px", marginBottom: 12 }}>
              <Icon name="shield" size={22} color={COLORS.primary} />
              <span style={{ fontWeight: 800, fontSize: 16, color: COLORS.primary }}>South Meridian HOA</span>
            </div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: COLORS.text }}>Welcome back</h2>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: COLORS.textMid }}>Sign in to your resident portal</p>
          </div>

          <div className="login-card" style={{ background: "#fff", borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 28, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            {serverError && (
              <div style={{ background: COLORS.dangerBg, border: `1px solid ${COLORS.danger}33`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: COLORS.danger, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="x" size={14} color={COLORS.danger} /> {serverError}
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMid, display: "block", marginBottom: 6 }}>Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => handleChange("email", e.target.value)}
                onBlur={() => { touch("email"); setErrors(e => ({ ...e, email: validate(form).email })); }}
                onKeyDown={handleKeyDown}
                placeholder="email@gmail.com"
                style={fieldStyle("email")}
              />
              {touched.email && errors.email && (
                <div style={{ fontSize: 11, color: COLORS.danger, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                  <Icon name="info" size={11} color={COLORS.danger} /> {errors.email}
                </div>
              )}
              {touched.email && !errors.email && (
                <div style={{ fontSize: 11, color: COLORS.success, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                  <Icon name="check" size={11} color={COLORS.success} /> Looks good!
                </div>
              )}
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMid, display: "block", marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={e => handleChange("password", e.target.value)}
                  onBlur={() => { touch("password"); setErrors(e => ({ ...e, password: validate(form).password })); }}
                  onKeyDown={handleKeyDown}
                  placeholder="••••••••"
                  style={{ ...fieldStyle("password"), paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
                >
                  <Icon name={showPassword ? "eye-off" : "eye"} size={16} color={COLORS.textMid} />
                </button>
              </div>
              {touched.password && errors.password && (
                <div style={{ fontSize: 11, color: COLORS.danger, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                  <Icon name="info" size={11} color={COLORS.danger} /> {errors.password}
                </div>
              )}
            </div>
                <div style={{ textAlign: "left", marginBottom: 20, marginTop: -12 }}>
                  <button style={{ background: "none", border: "none", color: COLORS.primary, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                    Forgot password?
                </button>
                </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              style={{ width: "100%", padding: "11px", borderRadius: 8, border: "none", background: loading ? COLORS.textLight : COLORS.primary, color: "#fff", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s" }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/></path></svg>
                  Signing in...
                </>
              ) : "Sign In"}
            </button>

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <span style={{ fontSize: 13, color: COLORS.textMid }}>Don't have an account? </span>
              <button onClick={() => setView("register")} style={{ background: "none", border: "none", color: COLORS.primary, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}