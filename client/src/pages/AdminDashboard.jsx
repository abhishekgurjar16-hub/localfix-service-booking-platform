import React from "react";
import { useEffect, useState } from "react";
import api from "../api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [statsResponse, bookingsResponse, usersResponse] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/bookings"),
          api.get("/admin/users")
        ]);

        setStats(statsResponse.data.stats);
        setBookings(bookingsResponse.data.bookings);
        setUsers(usersResponse.data.users);
      } catch (error) {
        setError(error.response?.data?.message || "Could not load admin dashboard.");
      }
    };

    load();
  }, []);

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="fw-bold">Admin Dashboard</h2>
        <p className="text-muted mb-0">Platform-level overview.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {stats && (
        <div className="row g-3 mb-4">
          {[
            ["Users", stats.users],
            ["Active Services", stats.active_services],
            ["Bookings", stats.bookings],
            ["Booked Value", `₹${stats.booked_value}`]
          ].map(([label, value]) => (
            <div className="col-sm-6 col-xl-3" key={label}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="text-muted small">{label}</div>
                  <div className="display-6 fw-bold mt-2">{value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold">Recent bookings</h5>

              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Provider</th>
                      <th>Service</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.customer_name}</td>
                        <td>{booking.provider_name}</td>
                        <td>{booking.service_title}</td>
                        <td><span className="badge text-bg-light">{booking.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold">Users</h5>

              <div className="vstack gap-2">
                {users.slice(0, 8).map((user) => (
                  <div className="border-bottom pb-2" key={user.id}>
                    <div className="fw-semibold">{user.name}</div>
                    <div className="small text-muted">{user.email}</div>
                    <span className="badge text-bg-light mt-1">{user.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
