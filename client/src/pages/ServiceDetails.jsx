import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const ServiceDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [form, setForm] = useState({ scheduled_at: "", notes: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const response = await api.get(`/services/${id}`);
      setData(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Could not load service.");
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const book = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "customer") {
      setError("Only customer accounts can create bookings.");
      return;
    }

    try {
      await api.post("/bookings", {
        service_id: id,
        scheduled_at: form.scheduled_at,
        notes: form.notes
      });

      setMessage("Booking created successfully.");
      setForm({ scheduled_at: "", notes: "" });
    } catch (error) {
      setError(error.response?.data?.message || "Booking failed.");
    }
  };

  if (error && !data) {
    return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>;
  }

  if (!data) {
    return <div className="container py-5 text-center">Loading...</div>;
  }

  const { service, reviews } = data;

  return (
    <div className="container py-5">
      <div className="row g-5">
        <div className="col-lg-7">
          <Link to="/services" className="text-decoration-none">← Back to services</Link>

          <div className="service-detail-banner mt-3 mb-4">
            <span className="badge text-bg-dark">{service.category}</span>
          </div>

          <div className="d-flex justify-content-between gap-3">
            <div>
              <h1 className="fw-bold">{service.title}</h1>
              <p className="text-muted mb-1">Provided by {service.provider_name}</p>
            </div>
            <div className="text-end">
              <div className="fs-3 fw-bold text-primary">₹{service.price}</div>
              <div className="text-muted small">per booking</div>
            </div>
          </div>

          <p className="lead text-secondary mt-3">{service.description}</p>

          <div className="row g-3 my-3">
            <div className="col-sm-4">
              <div className="p-3 rounded-3 bg-light">⏱ {service.duration_minutes} min</div>
            </div>
            <div className="col-sm-4">
              <div className="p-3 rounded-3 bg-light">📍 {service.location}</div>
            </div>
            <div className="col-sm-4">
              <div className="p-3 rounded-3 bg-light">⭐ {service.average_rating} ({service.review_count})</div>
            </div>
          </div>

          <h5 className="fw-bold mt-5">Customer reviews</h5>

          {reviews.length === 0 ? (
            <p className="text-muted">No reviews yet.</p>
          ) : (
            <div className="vstack gap-3">
              {reviews.map((review) => (
                <div className="border rounded-3 p-3" key={review.id}>
                  <div className="d-flex justify-content-between">
                    <strong>{review.customer_name}</strong>
                    <span>⭐ {review.rating}/5</span>
                  </div>
                  <p className="mb-0 mt-2 text-secondary">{review.comment || "No comment."}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm sticky-lg-top booking-card">
            <div className="card-body p-4">
              <h4 className="fw-bold">Book this service</h4>
              <p className="text-muted">Choose a date and time in the future.</p>

              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={book}>
                <div className="mb-3">
                  <label className="form-label">Date & time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={form.scheduled_at}
                    onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Any special instructions?"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </div>

                <button className="btn btn-primary w-100">
                  Confirm Booking
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
