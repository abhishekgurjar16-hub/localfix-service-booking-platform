import React from "react";
import { useEffect, useState } from "react";
import ServiceCard from "../components/ServiceCard";
import api from "../api";

const Services = () => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const loadServices = async () => {
    setLoading(true);

    try {
      const response = await api.get("/services", {
        params: { search, category }
      });
      setServices(response.data.services);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const submit = (event) => {
    event.preventDefault();
    loadServices();
  };

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Browse services</h2>
          <p className="text-muted mb-0">Find a local professional for your next task.</p>
        </div>

        <form className="d-flex gap-2" onSubmit={submit}>
          <input
            className="form-control"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            <option value="Cleaning">Cleaning</option>
            <option value="AC Repair">AC Repair</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
          </select>
          <button className="btn btn-dark">Search</button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-5">Loading services...</div>
      ) : services.length === 0 ? (
        <div className="alert alert-light border">No services matched your search.</div>
      ) : (
        <div className="row g-4">
          {services.map((service) => (
            <div className="col-md-6 col-xl-4" key={service.id}>
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;
