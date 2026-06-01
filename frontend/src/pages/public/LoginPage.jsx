import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import COLORS from "../../constants/colors";
import Icon from "../../components/Icon";

export default function LoginPage({ setView }) {
  const { login } = useAuth();
  const [form, setForm]     = useState({ email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      // AuthContext will update user, App.jsx will auto-redirect to portal
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", background: COLORS.bg, padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: COLORS.primaryBg, borderRadius: 12, padding: "10px 18px", marginBottom: 12 }}>
            <Icon name="shield" size={22} color={COLORS.primary} />
            <span style={{ fontWeight: 800, fontSize: 16, color: COLORS.primary }}>South Meridian HOA</span>
          </div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: COLORS.text }}>Welcome back</h2>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: COLORS.textMid }}>Sign in to your resident portal</p>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 28, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          {error && (
            <div style={{ background: COLORS.dangerBg, border: `1px solid ${COLORS.danger}33`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: COLORS.danger }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMid, display: "block", marginBottom: 6 }}>Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@email.com"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${COLORS.border}`, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMid, display: "block", marginBottom: 6 }}>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${COLORS.border}`, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ width: "100%", padding: "11px", borderRadius: 8, border: "none", background: loading ? COLORS.textLight : COLORS.primary, color: "#fff", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}
          >
            {loading ? "Signing in..." : "Sign In"}
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
  );
}