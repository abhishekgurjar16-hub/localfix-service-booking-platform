import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="container py-5 text-center">
    <h1 className="display-3 fw-bold">404</h1>
    <p className="text-muted">The page you're looking for does not exist.</p>
    <Link className="btn btn-dark" to="/">Go home</Link>
  </div>
);

export default NotFound;
