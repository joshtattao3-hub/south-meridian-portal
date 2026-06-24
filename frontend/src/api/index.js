const BASE_URL = "http://localhost:5000/api";

// Attach JWT token to every request
function getHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { ...getHeaders(), ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const api = {
  // Auth
  login:    (data) => request("/auth/login",    { method: "POST", body: JSON.stringify(data) }),
  register: (data) => request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  getMe:    ()     => request("/auth/me"),
  

  // Notifications (derived from announcements + dues)
  getNotifications: () => Promise.all([
    request("/announcements"),
    request("/dues"),
  ]).then(([announcements, dues]) => {
    const annNotifs = announcements.map(a => ({
      id: "ann-" + a.id,
      text: a.title,
      sub: "New announcement posted",
      time: a.date ? new Date(a.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—",
      unread: true,
      type: "announcement",
    }));
    const duesNotifs = dues
      .filter(d => d.is_posted)
      .map(d => ({
        id: "due-" + d.id,
        text: `${d.label} dues reminder posted`,
        sub: `Due on ${new Date(d.due_date).toLocaleDateString("en-US", { month: "long", day: "numeric" })}`,
        time: d.created_at ? new Date(d.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—",
        unread: d.payment_status !== "Paid",
        type: "dues",
      }));
    return [...duesNotifs, ...annNotifs].slice(0, 10);
  }),

  // Profile
  updateProfile: (id, data) => request(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  uploadAvatar:  (id, file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    const token = localStorage.getItem("token");
    return fetch(`${BASE_URL}/users/${id}/avatar`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }).then(r => r.json());
  },

  // Users
  getUsers:   (params = {}) => request("/users?" + new URLSearchParams(params)),
  getUser:    (id)          => request(`/users/${id}`),
  createUser: (data)        => request("/users",    { method: "POST", body: JSON.stringify(data) }),
  updateUser: (id, data)    => request(`/users/${id}`, { method: "PUT",  body: JSON.stringify(data) }),
  deleteUser: (id)          => request(`/users/${id}`, { method: "DELETE" }),

  // Complaints
  getComplaints:   (params = {}) => request("/complaints?" + new URLSearchParams(params)),
  getComplaint:    (id)          => request(`/complaints/${id}`),
  createComplaint: (data)        => request("/complaints",    { method: "POST", body: JSON.stringify(data) }),
  updateComplaint: (id, data)    => request(`/complaints/${id}`, { method: "PUT",  body: JSON.stringify(data) }),
  deleteComplaint: (id)          => request(`/complaints/${id}`, { method: "DELETE" }),

  // Dues
  getDues:       ()            => request("/dues"),
  getPayments:   ()            => request("/dues/payments"),
  createPeriod:  (data)        => request("/dues/periods", { method: "POST", body: JSON.stringify(data) }),
  submitPayment: (body)        => request("/dues/pay", { method: "POST", body: JSON.stringify(body) }),
  updatePayment: (id, data)    => request(`/dues/payments/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  // Reservations
  getReservations:  (params = {}) => request("/reservations?" + new URLSearchParams(params)),
  getSlots:         (facilityId)  => request(`/reservations/slots/${facilityId}`),
  createReservation:(data)        => request("/reservations",    { method: "POST", body: JSON.stringify(data) }),
  updateReservation:(id, data)    => request(`/reservations/${id}`, { method: "PUT",  body: JSON.stringify(data) }),
  cancelReservation:(id)          => request(`/reservations/${id}`, { method: "DELETE" }),

  // Announcements
  getAnnouncements:    (params = {}) => request("/announcements?" + new URLSearchParams(params)),
  getAllAnnouncements:  ()            => request("/announcements/all"),
  createAnnouncement:  (data)        => request("/announcements",    { method: "POST", body: JSON.stringify(data) }),
  updateAnnouncement:  (id, data)    => request(`/announcements/${id}`, { method: "PUT",  body: JSON.stringify(data) }),
  deleteAnnouncement:  (id)          => request(`/announcements/${id}`, { method: "DELETE" }),

  // Facilities
  getFacilities:   ()        => request("/facilities"),
  createFacility:  (data)    => request("/facilities",    { method: "POST", body: JSON.stringify(data) }),
  updateFacility:  (id, data)=> request(`/facilities/${id}`, { method: "PUT",  body: JSON.stringify(data) }),
  deleteFacility:  (id)      => request(`/facilities/${id}`, { method: "DELETE" }),

  // Events
  getEvents:    ()        => request("/events"),
  createEvent:  (data)    => request("/events",    { method: "POST", body: JSON.stringify(data) }),
  updateEvent:  (id, data)=> request(`/events/${id}`, { method: "PUT",  body: JSON.stringify(data) }),
  deleteEvent:  (id)      => request(`/events/${id}`, { method: "DELETE" }),
};