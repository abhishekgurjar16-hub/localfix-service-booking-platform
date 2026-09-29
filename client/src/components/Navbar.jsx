import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
      <div className="container py-2">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          Local<span className="text-primary">Fix</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <NavLink className="nav-link" to="/services">Services</NavLink>

            {user?.role === "customer" && (
              <NavLink className="nav-link" to="/my-bookings">My Bookings</NavLink>
            )}

            {user?.role === "provider" && (
              <NavLink className="nav-link" to="/provider">Provider Dashboard</NavLink>
            )}

            {user?.role === "admin" && (
              <NavLink className="nav-link" to="/admin">Admin Dashboard</NavLink>
            )}

            {user ? (
              <>
                <span className="nav-link text-muted">{user.name}</span>
                <button className="btn btn-outline-dark btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="nav-link" to="/login">Login</Link>
                <Link className="btn btn-primary btn-sm px-3" to="/register">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
