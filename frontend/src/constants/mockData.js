import COLORS from "./colors";

export const ANNOUNCEMENTS = [
  { id:1, title:"Water Service Interruption – June 5", tag:"High", date:"May 28, 2026", body:"Scheduled maintenance will affect water supply from 8AM–2PM. Please store water in advance." },
  { id:2, title:"Monthly HOA Dues Reminder", tag:"Medium", date:"May 25, 2026", body:"June dues are due on the 15th. Please settle via the resident portal or on-site cashier." },
  { id:3, title:"Community Clean-Up Drive – June 8", tag:"Low", date:"May 20, 2026", body:"Join us for our quarterly clean-up! Volunteers get priority access to the clubhouse." },
  { id:4, title:"New Visitor Policy Effective June 1", tag:"High", date:"May 18, 2026", body:"All visitors must register at the guardhouse and present valid ID. Pre-registration via the portal is encouraged." },
];

export const EVENTS = [
  { id:1, title:"June HOA General Assembly", date:"Jun 15, 2026", time:"6:00 PM", venue:"Main Clubhouse", icon:"calendar" },
  { id:2, title:"Community Sports Fest", date:"Jun 22, 2026", time:"8:00 AM", venue:"Basketball Court", icon:"trophy" },
  { id:3, title:"Clean-Up Drive", date:"Jun 8, 2026", time:"7:00 AM", venue:"Phase 2 Entrance", icon:"heart" },
];

export const COMPLAINTS = [
  { id:"CMP-001", subject:"Street light malfunction – Block 5", status:"In Progress", date:"May 27", priority:"High" },
  { id:"CMP-002", subject:"Noise complaint – Unit 3B", status:"Under Review", date:"May 24", priority:"Medium" },
  { id:"CMP-003", subject:"Clogged drainage – Block 2", status:"Resolved", date:"May 18", priority:"High" },
  { id:"CMP-004", subject:"Broken playground equipment", status:"Pending", date:"May 15", priority:"Low" },
];

export const DUES = [
  { month:"May 2026", amount:1500, status:"Paid", date:"May 10" },
  { month:"Apr 2026", amount:1500, status:"Paid", date:"Apr 9" },
  { month:"Mar 2026", amount:1500, status:"Paid", date:"Mar 11" },
  { month:"Feb 2026", amount:1500, status:"Unpaid", date:"—" },
];

export const FACILITIES = [
  { id:1, name:"Main Clubhouse", capacity:"100 pax", icon:"building", slots:["8AM–12PM","1PM–5PM","6PM–10PM"] },
  { id:2, name:"Basketball Court", capacity:"20 pax", icon:"ball-basketball", slots:["6AM–9AM","9AM–12PM","3PM–6PM"] },
  { id:3, name:"Swimming Pool", capacity:"30 pax", icon:"waves", slots:["7AM–10AM","10AM–1PM","2PM–5PM"] },
  { id:4, name:"Function Hall", capacity:"60 pax", icon:"door", slots:["8AM–12PM","1PM–5PM","6PM–10PM"] },
];

export const USERS_ADMIN = [
  { id:1, name:"Maria Santos", block:"Blk 5 Lot 12", email:"maria@email.com", role:"Resident", status:"Active" },
  { id:2, name:"Jose Reyes", block:"Blk 3 Lot 4", email:"jose@email.com", role:"Resident", status:"Active" },
  { id:3, name:"Ana Cruz", block:"Blk 1 Lot 7", email:"ana@email.com", role:"HOA Officer", status:"Active" },
  { id:4, name:"Pedro Lim", block:"Blk 8 Lot 2", email:"pedro@email.com", role:"Resident", status:"Inactive" },
  { id:5, name:"Joshua Tattao", block:"Blk 16 Lot 4", email:"joshtattao3@email.com", role:"Admin", status:"Active" },
];

export const STAT_COLOR = {
  "Resolved": COLORS.success,
  "Paid": COLORS.success,
  "In Progress": COLORS.info,
  "Under Review": COLORS.warning,
  "Pending": COLORS.textMid,
  "Unpaid": COLORS.danger,
  "High": COLORS.danger,
  "Medium": COLORS.warning,
  "Low": COLORS.info,
  "Active": COLORS.success,
  "Inactive": COLORS.textMid,
  "Resident": COLORS.info,
  "HOA Officer": COLORS.primary,
  "Admin": COLORS.goldDark,
};