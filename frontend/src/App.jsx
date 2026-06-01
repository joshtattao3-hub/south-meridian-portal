import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PublicNav from "./components/PublicNav";
import { ResidentPortal, OfficerPortal, AdminPortal } from "./pages/portals/Portals";
import { HomePage, ContactPage, EventsPage, AboutPage } from "./pages/public/PublicPages";
import AnnouncementsPage from "./pages/public/AnnouncementsPage";
import LoginPage from "./pages/public/LoginPage";
import RegisterPage from "./pages/public/RegisterPage";
import COLORS from "./constants/colors";

function AppContent() {
  const { user, loading } = useAuth();
  const [view, setView] = useState("home");

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: COLORS.bg, gap: 16 }}>
        <div style={{ background: COLORS.primaryBg, borderRadius: 16, padding: 20 }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
              <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
            </path>
          </svg>
        </div>
        <div style={{ color: COLORS.textMid, fontSize: 14, fontWeight: 500 }}>Loading your portal...</div>
      </div>
    );
  }

  if (user) {
    if (user.role === "admin")   return <AdminPortal setView={setView} />;
    if (user.role === "officer") return <OfficerPortal setView={setView} />;
    return <ResidentPortal setView={setView} />;
  }

  if (view === "login")    return <><PublicNav setView={setView} currentView={view} /><LoginPage setView={setView} /></>;
  if (view === "register") return <><PublicNav setView={setView} currentView={view} /><RegisterPage setView={setView} /></>;

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", color: COLORS.text, background: COLORS.bg }}>
      <PublicNav setView={setView} currentView={view} />
      {view === "home"          && <HomePage setView={setView} />}
      {view === "announcements" && <AnnouncementsPage />}
      {view === "contact"       && <ContactPage />}
      {view === "events"        && <EventsPage />}
      {view === "about"         && <AboutPage />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}