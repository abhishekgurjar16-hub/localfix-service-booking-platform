import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <section className="hero-section">
        <div className="container py-5">
          <div className="row align-items-center g-5 py-lg-5">
            <div className="col-lg-7">
              <span className="badge rounded-pill text-bg-primary mb-3 px-3 py-2">
                Trusted local professionals
              </span>

              <h1 className="display-4 fw-bold lh-sm">
                Book reliable home services in a few clicks.
              </h1>

              <p className="lead text-secondary mt-4 mb-4">
                Discover verified local providers, choose a convenient time,
                and manage your bookings from one dashboard.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Link className="btn btn-primary btn-lg px-4" to="/services">
                  Browse Services
                </Link>
                <Link className="btn btn-outline-dark btn-lg px-4" to="/register">
                  Join servora
                </Link>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="hero-card shadow-sm">
                <div className="small text-muted mb-2">Example booking</div>
                <h5 className="fw-bold">AC Service & Repair</h5>
                <p className="text-muted mb-3">Rahul Sharma • Indore</p>
                <div className="d-flex justify-content-between border-top pt-3">
                  <span>Tomorrow, 10:00 AM</span>
                  <strong>₹599</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4">
          {[
            ["01", "Discover", "Search services by category and location."],
            ["02", "Book", "Pick a future date and request a service slot."],
            ["03", "Manage", "Track status and complete the service workflow."]
          ].map(([number, title, description]) => (
            <div className="col-md-4" key={number}>
              <div className="p-4 border rounded-4 h-100 bg-white">
                <div className="display-6 fw-bold text-primary mb-3">{number}</div>
                <h5 className="fw-bold">{title}</h5>
                <p className="text-muted mb-0">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
