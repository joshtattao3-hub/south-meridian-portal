import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import COLORS from "../../constants/colors";
import Sidebar from "../../components/Sidebar";
import PortalHeader from "../../components/PortalHeader";
import ResidentDashboard from "../resident/ResidentDashboard";
import ResidentProfile  from "../resident/ResidentProfile";
import ResidentSettings from "../resident/ResidentSettings";
import ResidentAnnouncements from "../resident/ResidentAnnouncements";
import { ComplaintsPage, DuesPage, DocumentsPage } from "../resident/ResidentPages";
import ReservationsPage from "../resident/ReservationsPage";
import { AdminDashboardPage, UserManagementPage, ReportsPage, ManageComplaintsPage, SystemSettingsPage } from "../admin/AdminPages";
import AnnouncementsPage from "../public/AnnouncementsPage";
import { ContactPage } from "../public/PublicPages";
import OfficerProfile   from "../officer/OfficerProfile";
import OfficerSettings  from "../officer/OfficerSettings";
import OfficerDashboard from "../officer/OfficerDashboard";
import OfficerAnnouncements from "../officer/OfficerAnnouncements";
import AdminProfile     from "../admin/AdminProfile";
import AdminSettings    from "../admin/AdminSettings";


export function ResidentPortal({ setView }) {
  const [page, setPage] = useState("dashboard");
  const { user } = useAuth();

  const pageMap = {
    "dashboard":       { title: "Dashboard",             comp: <ResidentDashboard setView={setPage} /> },
    "complaints":      { title: "My Complaints",         comp: <ComplaintsPage /> },
    "dues":            { title: "HOA Dues & Payments",   subtitle: "View dues reminders, payment status, and important updates from the HOA Office.", comp: <DuesPage /> },
    "reservations":    { title: "Facility Reservations", comp: <ReservationsPage /> },
    "documents":       { title: "Documents & Forms",     comp: <DocumentsPage /> },
    "announcements-p": { title: "Announcements",         comp: <ResidentAnnouncements setView={setPage} /> },
    "contact":         { title: "Contact Us",            comp: <div style={{ padding: 28 }}><ContactPage /></div> },
    "profile":         { title: "My Profile",            comp: <ResidentProfile /> },
    "settings":        { title: "Settings",              comp: <ResidentSettings /> },
  };

  const current = pageMap[page] || pageMap["dashboard"];

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar role="resident" activePage={page} setActivePage={setPage} setView={setView} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: COLORS.bg, overflowY: "auto" }}>
        <PortalHeader
          title={current.title}
          subtitle={current.subtitle}
          setPage={setPage}
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
    "officer-dashboard":    { title: "Officer Dashboard",  comp: <OfficerDashboard /> },
    "manage-announcements": { title: "Officer Announcements",      comp: <OfficerAnnouncements /> },
    "manage-complaints":    { title: "Manage Complaints",  comp: <ManageComplaintsPage /> },
    "manage-reservations":  { title: "Reservations",       comp: <ReservationsPage /> },
    "manage-dues":          { title: "Dues & Payments",     comp: <DuesPage /> },
    "residents-list":       { title: "Resident Directory", comp: <UserManagementPage /> },
    "profile":              { title: "My Profile",         comp: <OfficerProfile /> },
    "settings":             { title: "Settings",           comp: <OfficerSettings /> },
  };

  const current = pageMap[page] || pageMap["officer-dashboard"];

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar role="officer" activePage={page} setActivePage={setPage} setView={setView} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: COLORS.bg, overflowY: "auto" }}>
        <PortalHeader
          title={current.title}
          setPage={setPage}
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
    "admin-dashboard":    { title: "Admin Dashboard",       comp: <AdminDashboardPage /> },
    "user-management":    { title: "User Management",       comp: <UserManagementPage /> },
    "admin-complaints":   { title: "Complaints Management", comp: <ManageComplaintsPage /> },
    "billing":            { title: "Billing & HOA Dues",    comp: <DuesPage /> },
    "admin-facilities":   { title: "Facility Management",   comp: <ReservationsPage /> },
    "reports":            { title: "Reports & Export",      comp: <ReportsPage /> },
    "admin-announcements":{ title: "Announcements",         comp: <AnnouncementsPage /> },
    "admin-settings":     { title: "System Settings",       comp: <SystemSettingsPage /> },
    "profile":            { title: "My Profile",            comp: <AdminProfile /> },
    "settings":           { title: "Settings",              comp: <AdminSettings /> },
  };

  const current = pageMap[page] || pageMap["admin-dashboard"];

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar role="admin" activePage={page} setActivePage={setPage} setView={setView} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: COLORS.bg, overflowY: "auto" }}>
        <PortalHeader title={current.title} setPage={setPage} />
        {current.comp}
      </div>
    </div>
  );
}