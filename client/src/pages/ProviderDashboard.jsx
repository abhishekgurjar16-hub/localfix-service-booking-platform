import React from "react";
import { useEffect, useState } from "react";
import api from "../api";

const ProviderDashboard = () => {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Cleaning",
    price: "",
    duration_minutes: 60,
    location: "Indore"
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      const [servicesResponse, bookingsResponse] = await Promise.all([
        api.get("/services"),
        api.get("/bookings/provider")
      ]);

      setServices(
        servicesResponse.data.services.filter((service) => {
          return service.provider_id === JSON.parse(localStorage.getItem("servora_user"))?.id;
        })
      );

      setBookings(bookingsResponse.data.bookings);
    } catch (error) {
      setError(error.response?.data?.message || "Could not load dashboard.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      await api.post("/services", form);
      setMessage("Service created.");
      setForm({
        title: "",
        description: "",
        category: "Cleaning",
        price: "",
        duration_minutes: 60,
        location: "Indore"
      });
      load();
    } catch (error) {
      setError(error.response?.data?.message || "Could not create service.");
    }
  };

  const updateBooking = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      load();
    } catch (error) {
      setError(error.response?.data?.message || "Could not update booking.");
    }
  };

  const deactivate = async (id) => {
    try {
      await api.delete(`/services/${id}`);
      load();
    } catch (error) {
      setError(error.response?.data?.message || "Could not deactivate service.");
    }
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="fw-bold">Provider Dashboard</h2>
        <p className="text-muted mb-0">Manage your services and incoming bookings.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Add a service</h5>

              <form onSubmit={submit}>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    className="form-control"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </div>

                <div className="row g-3">
                  <div className="col-6">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                      <option>Cleaning</option>
                      <option>AC Repair</option>
                      <option>Electrical</option>
                      <option>Plumbing</option>
                    </select>
                  </div>

                  <div className="col-6">
                    <label className="form-label">Price (₹)</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-6">
                    <label className="form-label">Duration</label>
                    <input
                      type="number"
                      min="15"
                      className="form-control"
                      value={form.duration_minutes}
                      onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-6">
                    <label className="form-label">Location</label>
                    <input
                      className="form-control"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <button className="btn btn-primary w-100 mt-4">
                  Create Service
                </button>
              </form>
            </div>
          </div>

          <div className="card border-0 shadow-sm mt-4">
            <div className="card-body p-4">
              <h5 className="fw-bold">Your services</h5>

              {services.length === 0 ? (
                <p className="text-muted">No active services yet.</p>
              ) : (
                <div className="vstack gap-2">
                  {services.map((service) => (
                    <div className="border rounded-3 p-3" key={service.id}>
                      <div className="d-flex justify-content-between">
                        <strong>{service.title}</strong>
                        <span>₹{service.price}</span>
                      </div>
                      <div className="small text-muted mt-1">{service.category}</div>
                      <button
                        className="btn btn-outline-danger btn-sm mt-2"
                        onClick={() => deactivate(service.id)}
                      >
                        Deactivate
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold">Incoming bookings</h5>

              {bookings.length === 0 ? (
                <p className="text-muted">No bookings yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Service</th>
                        <th>When</th>
                        <th>Status</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td>
                            <div className="fw-semibold">{booking.customer_name}</div>
                            <div className="small text-muted">{booking.customer_email}</div>
                          </td>
                          <td>{booking.service_title}</td>
                          <td>{new Date(booking.scheduled_at).toLocaleString()}</td>
                          <td><span className="badge text-bg-light">{booking.status}</span></td>
                          <td>
                            <div className="d-flex gap-1">
                              {booking.status === "pending" && (
                                <>
                                  <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => updateBooking(booking.id, "accepted")}
                                  >
                                    Accept
                                  </button>
                                  <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => updateBooking(booking.id, "rejected")}
                                  >
                                    Reject
                                  </button>
                                </>
                              )}

                              {booking.status === "accepted" && (
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => updateBooking(booking.id, "completed")}
                                >
                                  Complete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
