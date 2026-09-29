import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "customer"
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(form);
      navigate(form.role === "provider" ? "/provider" : "/services");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-lg-5">
              <h2 className="fw-bold">Create your account</h2>
              <p className="text-muted">Join as a customer or service provider.</p>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={submit}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Full name</label>
                    <input
                      className="form-control"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input
                      className="form-control"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      minLength={6}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Account type</label>
                    <select
                      className="form-select"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    >
                      <option value="customer">Customer</option>
                      <option value="provider">Service Provider</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <button className="btn btn-primary w-100" disabled={loading}>
                      {loading ? "Creating account..." : "Create Account"}
                    </button>
                  </div>
                </div>
              </form>

              <p className="text-muted small mt-4 mb-0">
                Already registered? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
