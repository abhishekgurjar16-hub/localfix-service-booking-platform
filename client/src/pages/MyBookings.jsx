import React from "react";
import { useEffect, useState } from "react";
import api from "../api";

const badgeClass = (status) => {
  const map = {
    pending: "text-bg-warning",
    accepted: "text-bg-primary",
    rejected: "text-bg-danger",
    completed: "text-bg-success",
    cancelled: "text-bg-secondary"
  };
  return map[status] || "text-bg-light";
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [review, setReview] = useState({});

  const load = async () => {
    try {
      const response = await api.get("/bookings/my");
      setBookings(response.data.bookings);
    } catch (error) {
      setError(error.response?.data?.message || "Could not load bookings.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status: "cancelled" });
      load();
    } catch (error) {
      setError(error.response?.data?.message || "Could not cancel booking.");
    }
  };

  const submitReview = async (bookingId) => {
    try {
      await api.post(`/bookings/${bookingId}/review`, review[bookingId]);
      setReview((current) => ({ ...current, [bookingId]: undefined }));
      load();
    } catch (error) {
      setError(error.response?.data?.message || "Could not submit review.");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold">My Bookings</h2>
      <p className="text-muted">Track and manage your service requests.</p>

      {error && <div className="alert alert-danger">{error}</div>}

      {bookings.length === 0 ? (
        <div className="border rounded-4 p-5 text-center bg-light">
          <h5>No bookings yet</h5>
          <p className="text-muted mb-0">Book a service to see it here.</p>
        </div>
      ) : (
        <div className="vstack gap-3">
          {bookings.map((booking) => (
            <div className="card border-0 shadow-sm" key={booking.id}>
              <div className="card-body">
                <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                  <div>
                    <h5 className="fw-bold mb-1">{booking.service_title}</h5>
                    <div className="text-muted small">
                      {booking.provider_name} • {booking.location}
                    </div>
                    <div className="mt-2">
                      {new Date(booking.scheduled_at).toLocaleString()}
                    </div>
                  </div>

                  <div className="text-md-end">
                    <div className="fw-bold">₹{booking.price}</div>
                    <span className={`badge ${badgeClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>

                {booking.notes && (
                  <p className="text-muted mt-3 mb-2">
                    <strong>Notes:</strong> {booking.notes}
                  </p>
                )}

                <div className="d-flex flex-wrap gap-2 mt-3">
                  {booking.status === "pending" && (
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => cancel(booking.id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {booking.status === "completed" && (
                  <div className="border-top mt-3 pt-3">
                    <h6 className="fw-bold">Leave a review</h6>
                    <div className="row g-2">
                      <div className="col-md-3">
                        <select
                          className="form-select"
                          value={review[booking.id]?.rating || ""}
                          onChange={(e) =>
                            setReview((current) => ({
                              ...current,
                              [booking.id]: {
                                ...current[booking.id],
                                rating: Number(e.target.value)
                              }
                            }))
                          }
                        >
                          <option value="">Rating</option>
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <option key={rating} value={rating}>{rating}/5</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <input
                          className="form-control"
                          placeholder="Comment"
                          value={review[booking.id]?.comment || ""}
                          onChange={(e) =>
                            setReview((current) => ({
                              ...current,
                              [booking.id]: {
                                ...current[booking.id],
                                comment: e.target.value
                              }
                            }))
                          }
                        />
                      </div>
                      <div className="col-md-3">
                        <button
                          className="btn btn-dark w-100"
                          onClick={() => submitReview(booking.id)}
                          disabled={!review[booking.id]?.rating}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
