import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import COLORS from "../../constants/colors";
import Sidebar from "../../components/Sidebar";
import PortalHeader from "../../components/PortalHeader";
import ResidentDashboard from "../resident/ResidentDashboard";
import { ComplaintsPage, DuesPage, ReservationsPage, DocumentsPage } from "../resident/ResidentPages";
import { AdminDashboardPage, UserManagementPage, ReportsPage, ManageComplaintsPage, SystemSettingsPage } from "../admin/AdminPages";
import AnnouncementsPage from "../public/AnnouncementsPage";
import { ContactPage } from "../public/PublicPages";

export function ResidentPortal({ setView }) {
  const [page, setPage] = useState("dashboard");
  const { user } = useAuth();

  const pageMap = {
    "dashboard":      { title: "Dashboard",            comp: <ResidentDashboard setView={setPage} /> },
    "complaints":     { title: "My Complaints",         comp: <ComplaintsPage /> },
    "dues":           { title: "HOA Dues & Payments",   comp: <DuesPage /> },
    "reservations":   { title: "Facility Reservations", comp: <ReservationsPage /> },
    "documents":      { title: "Documents & Forms",     comp: <DocumentsPage /> },
    "announcements-p":{ title: "Announcements",         comp: <div style={{ padding: 28 }}><AnnouncementsPage /></div> },
    "contact":         { title: "Contact Us",             comp: <div style={{ padding: 28 }}><ContactPage /></div> },
  };

  const current = pageMap[page] || pageMap["dashboard"];

  return (
    // FIX: overflow:hidden on the outer shell keeps the sidebar full height;
    // only the main content column scrolls independently.
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar role="resident" activePage={page} setActivePage={setPage} setView={setView} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: COLORS.bg, overflowY: "auto" }}>
        <PortalHeader
          title={current.title}
          user={{
            initials: `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`.toUpperCase(),
            name: `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim(),
            role: `Resident · ${user?.block_lot ?? ""}`,
          }}
        />
        {current.comp}
      </div>
    </div>
  );
}

export function OfficerPortal({ setView }) {
  const [page, setPage] = useState("officer-dashboard");
  const { user } = useAuth();

  const pageMap = {
    "officer-dashboard":    { title: "Officer Dashboard",   comp: <AdminDashboardPage /> },
    "manage-announcements": { title: "Announcements",        comp: <div style={{ padding: 28 }}><AnnouncementsPage /></div> },
    "manage-complaints":    { title: "Manage Complaints",    comp: <ManageComplaintsPage /> },
    "manage-reservations":  { title: "Reservations",         comp: <ReservationsPage /> },
    "residents-list":       { title: "Resident Directory",   comp: <UserManagementPage /> },
  };

  const current = pageMap[page] || pageMap["officer-dashboard"];

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar role="officer" activePage={page} setActivePage={setPage} setView={setView} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: COLORS.bg, overflowY: "auto" }}>
        <PortalHeader
          title={current.title}
          user={{
            initials: `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`.toUpperCase(),
            name: `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim(),
            role: "HOA Officer",
          }}
        />
        {current.comp}
      </div>
    </div>
  );
}

export function AdminPortal({ setView }) {
  const [page, setPage] = useState("admin-dashboard");
  const { user } = useAuth();

  const pageMap = {
    "admin-dashboard":   { title: "Admin Dashboard",         comp: <AdminDashboardPage /> },
    "user-management":   { title: "User Management",          comp: <UserManagementPage /> },
    "admin-complaints":  { title: "Complaints Management",    comp: <ManageComplaintsPage /> },
    "billing":           { title: "Billing & HOA Dues",       comp: <DuesPage /> },
    "admin-facilities":  { title: "Facility Management",      comp: <ReservationsPage /> },
    "reports":           { title: "Reports & Export",         comp: <ReportsPage /> },
    "admin-announcements":{ title: "Announcements",           comp: <AnnouncementsPage /> },
    "admin-settings":    { title: "System Settings",          comp: <SystemSettingsPage /> },
  };

  const current = pageMap[page] || pageMap["admin-dashboard"];

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar role="admin" activePage={page} setActivePage={setPage} setView={setView} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: COLORS.bg, overflowY: "auto" }}>
        <PortalHeader title={current.title} />
        {current.comp}
      </div>
    </div>
  );
}