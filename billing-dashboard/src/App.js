import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import InvoiceForm from "./components/InvoiceForm";
import Search from "./components/Search";
import Clients from "./components/Clients";
import ChartPage from "./components/ChartPage";
import ClientProfile from "./components/ClientProfile";
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/App.css";

const App = () => {
const [isAuthenticated, setIsAuthenticated] = useState(
  () => localStorage.getItem("isAuthenticated") === "true"
);

useEffect(() => {
  const handleInactivity = () => {
    const lastActivityTime = localStorage.getItem("lastActivityTime");
    const now = new Date().getTime();

    if (lastActivityTime && now - lastActivityTime > 30 * 60 * 1000) {
      // Log out user after 30 minutes of inactivity
      logout();
    } else {
      // Update the last activity timestamp
      localStorage.setItem("lastActivityTime", now.toString());
    }
  };

  // Check activity every minute
  const interval = setInterval(handleInactivity, 60 * 1000);

  return () => clearInterval(interval);
}, []);

const handleLogin = () => {
  setIsAuthenticated(true);
  localStorage.setItem("isAuthenticated", "true");
  localStorage.setItem("lastActivityTime", new Date().getTime().toString());
};

const logout = () => {
  setIsAuthenticated(false);
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("lastActivityTime");
};

return (
  <Router>
    <div className="app">
      <Routes>
        {/* Login Page */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <div className="app">
                <nav className="sidebar">
                  <h2>SampleCo LLC</h2>
                  <ul>
                    <li>
                      <Link to="/">Dashboard</Link>
                    </li>
                    <li>
                      <Link to="/invoice">Create Invoice</Link>
                    </li>
                    <li>
                      <Link to="/search">Search</Link>
                    </li>
                    <li>
                      <Link to="/clients">Clients</Link>
                    </li>
                    <li>
                      <button onClick={logout} className="logout-button">
                        Logout
                      </button>
                    </li>
                  </ul>
                </nav>
                <div className="content">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/invoice" element={<InvoiceForm />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/client-profile/:id" element={<ClientProfile />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/chart" element={<ChartPage />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Redirect to Login for Unknown Routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  </Router>
);
};

export default App;
