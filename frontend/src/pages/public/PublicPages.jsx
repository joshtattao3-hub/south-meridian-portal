import { useState } from "react";
import COLORS from "../../constants/colors";
import { Btn, Card } from "../../components/UI";
import Icon from "../../components/Icon";
import { ANNOUNCEMENTS, EVENTS } from "../../constants/mockData";

export function HomePage({ setView }) {
  return (
    <>
      <style>{`
        @media (max-width: 700px) {
          .home-features-grid { grid-template-columns: 1fr 1fr !important; }
          .home-ann-grid { grid-template-columns: 1fr !important; }
          .hero-h1 { font-size: 28px !important; }
          .hero-btns { flex-direction: column !important; align-items: center !important; }
          .about-stats { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 440px) {
          .home-features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div style={{ background: COLORS.bg, minHeight: "100vh" }}>
        <div style={{ background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`, padding: "80px 24px 60px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "6px 14px", marginBottom: 20 }}>
              <Icon name="shield" size={14} color={COLORS.gold} />
              <span style={{ color: COLORS.gold, fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>SOUTH MERIDIAN HOMES · PHASE 2</span>
            </div>
            <h1 className="hero-h1" style={{ color: "#fff", fontSize: 42, fontWeight: 800, margin: "0 0 16px", lineHeight: 1.2 }}>
              Your Community,<br />Better Connected
            </h1>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, margin: "0 0 32px", lineHeight: 1.7 }}>
              Manage dues, file complaints, reserve facilities, and stay updated with HOA announcements — all in one place.
            </p>
            <div className="hero-btns" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Btn onClick={() => setView("login")} style={{ padding: "12px 28px", fontSize: 15 }}>
                <Icon name="home" size={16} color="#fff" /> Resident Login
              </Btn>
              <Btn variant="ghost" onClick={() => setView("register")} style={{ padding: "12px 28px", fontSize: 15, color: "#fff", borderColor: "rgba(255,255,255,0.5)" }}>
                Register Now
              </Btn>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
          <h2 style={{ textAlign: "center", color: COLORS.text, fontSize: 24, fontWeight: 700, marginBottom: 32 }}>Everything You Need</h2>
          <div className="home-features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {[
              { icon: "dollar",    title: "HOA Dues",       desc: "View payment history, pay online via GCash, Maya, or bank transfer.",         color: COLORS.success },
              { icon: "chat",      title: "File Complaints", desc: "Submit and track complaints with real-time status updates.",                   color: COLORS.danger },
              { icon: "calendar",  title: "Reservations",   desc: "Book clubhouse, courts, and other facilities with ease.",                      color: COLORS.primary },
              { icon: "bell",      title: "Announcements",  desc: "Stay informed with the latest HOA news and community updates.",                 color: COLORS.info },
              { icon: "file",      title: "Documents",      desc: "Download forms, permits, and official HOA documents.",                          color: COLORS.goldDark },
              { icon: "shield",    title: "Secure Portal",  desc: "Role-based access for residents, officers, and admins.",                        color: "#6A1B9A" },
            ].map(f => (
              <Card key={f.title} style={{ borderTop: `3px solid ${f.color}` }}>
                <div style={{ background: f.color + "15", borderRadius: 8, padding: 10, display: "inline-block", marginBottom: 12 }}>
                  <Icon name={f.icon} size={22} color={f.color} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text, marginBottom: 6 }}>{f.title}</div>
                <p style={{ fontSize: 12, color: COLORS.textMid, margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        <div style={{ background: COLORS.primaryBg, padding: "40px 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <h2 style={{ color: COLORS.text, fontSize: 20, fontWeight: 700, margin: 0 }}>Latest Announcements</h2>
              <Btn small variant="light" onClick={() => setView("announcements")}>View All</Btn>
            </div>
            <div className="home-ann-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
              {ANNOUNCEMENTS.slice(0, 3).map(a => (
                <Card key={a.id}>
                  <div style={{ fontSize: 11, color: COLORS.textLight, marginBottom: 6 }}>{a.date}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text, marginBottom: 4 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: COLORS.textMid, lineHeight: 1.5 }}>{a.body?.slice(0, 80)}...</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function ContactPage() {
  const [form, setForm]   = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [sent, setSent]   = useState(false);
  const [sending, setSending] = useState(false);

  const validate = (f) => {
    const e = {};
    if (!f.name.trim())    e.name    = "Name is required.";
    if (!f.email)          e.email   = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(f.email)) e.email = "Enter a valid email.";
    if (!f.subject.trim()) e.subject = "Subject is required.";
    if (!f.message.trim()) e.message = "Message cannot be empty.";
    return e;
  };

  const touch = (k) => setTouched(t => ({ ...t, [k]: true }));
  const set   = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (touched[k]) setErrors(e => ({ ...e, [k]: validate({ ...form, [k]: v })[k] }));
  };

  const fieldStyle = (k) => ({
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: `1.5px solid ${touched[k] && errors[k] ? COLORS.danger : touched[k] && !errors[k] ? COLORS.success : COLORS.border}`,
    fontSize: 14, fontFamily: "inherit", boxSizing: "border-box", outline: "none", transition: "border-color 0.2s",
    background: touched[k] && errors[k] ? COLORS.dangerBg : "#fff",
  });

  const FieldMsg = ({ k }) => {
    if (!touched[k]) return null;
    if (errors[k]) return <div style={{ fontSize: 11, color: COLORS.danger, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><Icon name="info" size={11} color={COLORS.danger} />{errors[k]}</div>;
    return <div style={{ fontSize: 11, color: COLORS.success, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><Icon name="check" size={11} color={COLORS.success} />Looks good!</div>;
  };

  const handleSend = async () => {
    const allTouched = Object.fromEntries(Object.keys(form).map(k => [k, true]));
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1200)); // simulate send
    setSending(false);
    setSent(true);
  };

  return (
    <>
      <style>{`
        @media (max-width: 700px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div style={{ background: COLORS.bg, minHeight: "100vh" }}>
        <div style={{ background: COLORS.primary, padding: "40px 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 800, margin: 0 }}>Contact Us</h1>
          </div>
        </div>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <Card>
              <h3 style={{ color: COLORS.text, margin: "0 0 20px" }}>Send a Message</h3>
              {sent ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ background: COLORS.successBg, borderRadius: "50%", width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    <Icon name="check" size={28} color={COLORS.success} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.text, marginBottom: 6 }}>Message Sent!</div>
                  <div style={{ fontSize: 13, color: COLORS.textMid }}>We'll get back to you within 1–2 business days.</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[["name","Name","text","Your full name"],["email","Email","email","your@email.com"],["subject","Subject","text","How can we help?"]].map(([k,label,type,ph]) => (
                    <div key={k}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMid, display: "block", marginBottom: 4 }}>{label}</label>
                      <input type={type} value={form[k]} onChange={e => set(k, e.target.value)} onBlur={() => { touch(k); setErrors(er => ({ ...er, [k]: validate(form)[k] })); }} placeholder={ph} style={fieldStyle(k)} />
                      <FieldMsg k={k} />
                    </div>
                  ))}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMid, display: "block", marginBottom: 4 }}>Message</label>
                    <textarea rows={4} value={form.message} onChange={e => set("message", e.target.value)} onBlur={() => { touch("message"); setErrors(er => ({ ...er, message: validate(form).message })); }} style={{ ...fieldStyle("message"), resize: "vertical" }} />
                    <FieldMsg k="message" />
                  </div>
                  <button onClick={handleSend} disabled={sending} style={{ padding: "10px", borderRadius: 8, border: "none", background: sending ? COLORS.textLight : COLORS.primary, color: "#fff", fontSize: 14, fontWeight: 700, cursor: sending ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    {sending ? "Sending..." : <><Icon name="mail" size={15} color="#fff" /> Send Message</>}
                  </button>
                </div>
              )}
            </Card>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { icon: "map",      label: "Address",      value: "South Meridian Homes Phase 2, Dasmariñas, Cavite" },
                { icon: "phone",    label: "Phone",        value: "(046) 123-4567" },
                { icon: "mail",     label: "Email",        value: "hoa@southmeridian.com" },
                { icon: "calendar", label: "Office Hours", value: "Mon–Fri, 8:00 AM – 5:00 PM" },
              ].map(c => (
                <Card key={c.label} pad="1rem" style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ background: COLORS.primaryBg, borderRadius: 8, padding: 8, flexShrink: 0 }}>
                    <Icon name={c.icon} size={18} color={COLORS.primary} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMid, marginBottom: 2 }}>{c.label}</div>
                    <div style={{ fontSize: 13, color: COLORS.text }}>{c.value}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function EventsPage({ setView }) {
  const items = EVENTS;
  return (
    <>
      <style>{`@media(max-width:600px){.events-item{flex-direction:column !important; align-items:flex-start !important;}}`}</style>
      <div style={{ background: COLORS.bg, minHeight: "100vh" }}>
        <div style={{ background: COLORS.primary, padding: "40px 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 800, margin: 0 }}>Events</h1>
          </div>
        </div>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 24px", background: "#fff", borderRadius: 14, border: `1px solid ${COLORS.border}` }}>
              <div style={{ background: COLORS.primaryBg, borderRadius: "50%", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Icon name="calendar" size={28} color={COLORS.primary} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.text, marginBottom: 6 }}>No Upcoming Events</div>
              <div style={{ fontSize: 13, color: COLORS.textMid }}>Community events will appear here when scheduled.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {items.map(e => (
                <Card key={e.id} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div className="events-item" style={{ display: "flex", alignItems: "center", gap: 16, width: "100%", flexWrap: "wrap" }}>
                    <div style={{ background: COLORS.primaryBg, borderRadius: 10, padding: 14, textAlign: "center", flexShrink: 0 }}>
                      <Icon name={e.icon} size={24} color={COLORS.primary} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.text }}>{e.title}</div>
                      <div style={{ fontSize: 13, color: COLORS.textMid, marginTop: 4 }}>{e.date} · {e.time} · {e.venue}</div>
                    </div>
                    <Btn small variant="ghost" onClick={() => setView("login")}>Details</Btn>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <style>{`@media(max-width:600px){.about-stats{grid-template-columns:1fr !important;}}`}</style>
      <div style={{ background: COLORS.bg, minHeight: "100vh" }}>
        <div style={{ background: COLORS.primary, padding: "40px 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h1 style={{ color: "#fff", fontSize: 32, fontWeight: 800, margin: 0 }}>About</h1>
          </div>
        </div>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
          <Card>
            <h3 style={{ color: COLORS.text }}>About South Meridian Homes Phase 2</h3>
            <p style={{ color: COLORS.textMid, lineHeight: 1.8 }}>
              South Meridian Homes Phase 2 is a premier residential subdivision located in Dasmariñas, Cavite. Our HOA is committed to maintaining a safe, clean, and harmonious community for all our residents.
            </p>
            <div className="about-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 24 }}>
              {[["420+", "Households"], ["15+", "Years Established"], ["4", "Community Facilities"]].map(([v, l]) => (
                <div key={l} style={{ textAlign: "center", padding: 20, background: COLORS.primaryBg, borderRadius: 10 }}>
                  <div style={{ color: COLORS.primary, fontSize: 28, fontWeight: 800 }}>{v}</div>
                  <div style={{ color: COLORS.textMid, fontSize: 13, marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}