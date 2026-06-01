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
  getDues:       (params = {}) => request("/dues?" + new URLSearchParams(params)),
  getPayments:   ()            => request("/dues/payments"),
  createPeriod:  (data)        => request("/dues/periods", { method: "POST", body: JSON.stringify(data) }),
  submitPayment: (data)        => request("/dues/pay",     { method: "POST", body: JSON.stringify(data) }),
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