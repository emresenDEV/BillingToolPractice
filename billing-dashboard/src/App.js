import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import InvoiceForm from "./components/InvoiceForm";
import Search from "./components/Search";
import Clients from "./components/Clients";
import ChartPage from "./components/ChartPage";
import ClientProfile from "./components/ClientProfile";
import "./styles/App.css";

const App = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/data");
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const jsonData = await response.json();
        console.log("Fetched Records:", jsonData);
        setRecords(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Router>
      <div className="app">
        {/* Sidebar Navigation */}
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
          </ul>
        </nav>

        {/* Main Content Area */}
        <div className="content">
          <Routes>
            {/* Dashboard Route */}
            <Route
              path="/"
              element={<Dashboard records={records} loading={loading} />}
            />

            {/* Invoice Form Route */}
            <Route path="/invoice" element={<InvoiceForm />} />

            {/* Search Route */}
            <Route path="/search" element={<Search records={records} />} />
            <Route path="/client-profile/:id" element={<ClientProfile />} />
            {/* Clients Management Route */}
            <Route path="/clients" element={<Clients />} />
            
            {/* Chart Route */}
            <Route path="/chart" element={<ChartPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
