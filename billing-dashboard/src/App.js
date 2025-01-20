import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Papa from "papaparse"; 
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
    const fetchCSVData = async () => {
      try {
        // Fetch the CSV file from the public folder
        const response = await fetch("/billing_records.csv");
        const csvText = await response.text();

        // Parse CSV using PapaParse
        Papa.parse(csvText, {
          header: true, // Use the first row as headers
          skipEmptyLines: true,
          complete: (result) => {
            setRecords(result.data); // Set parsed CSV data
          },
        });
      } catch (error) {
        console.error("Error fetching CSV:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCSVData();
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
