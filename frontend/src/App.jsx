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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: COLORS.bg }}>
        <div style={{ color: COLORS.textMid, fontSize: 14 }}>Loading...</div>
      </div>
    );
  }

  // If logged in, show correct portal based on role
  if (user) {
    if (user.role === "admin")   return <AdminPortal setView={setView} />;
    if (user.role === "officer") return <OfficerPortal setView={setView} />;
    return <ResidentPortal setView={setView} />;
  }

  // Auth pages
  if (view === "login")    return <><PublicNav setView={setView} /><LoginPage setView={setView} /></>;
  if (view === "register") return <><PublicNav setView={setView} /><RegisterPage setView={setView} /></>;

  // Public pages
  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", color: COLORS.text, background: COLORS.bg }}>
      <PublicNav setView={setView} />
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