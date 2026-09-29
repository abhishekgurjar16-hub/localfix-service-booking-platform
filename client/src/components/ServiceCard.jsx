import React from "react";
import { Link } from "react-router-dom";

const ServiceCard = ({ service }) => {
  return (
    <div className="card h-100 border-0 shadow-sm service-card">
      <div className="service-image">
        <span>{service.category}</span>
      </div>

      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between gap-3">
          <h5 className="card-title fw-bold mb-1">{service.title}</h5>
          <span className="fw-bold text-primary">₹{service.price}</span>
        </div>

        <p className="text-muted small mb-2">by {service.provider_name}</p>

        <p className="card-text text-secondary flex-grow-1">
          {service.description}
        </p>

        <div className="d-flex flex-wrap gap-2 small text-muted mb-3">
          <span>⏱ {service.duration_minutes} min</span>
          <span>📍 {service.location}</span>
        </div>

        <Link to={`/services/${service.id}`} className="btn btn-dark w-100">
          View & Book
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
