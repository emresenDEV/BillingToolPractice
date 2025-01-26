import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import InvoiceForm from "./components/InvoiceForm";
import Search from "./components/Search";
import Clients from "./components/Clients";
import ChartPage from "./components/ChartPage";
import ClientProfile from "./components/ClientProfile";
import config from "./utils/config";
import "./styles/App.css";

const App = () => {
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsResponse, invoicesResponse] = await Promise.all([
          fetch(`${config.baseURL}/api/clients`),
          fetch(`${config.baseURL}/api/data`),
        ]);

        if (!clientsResponse.ok || !invoicesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [clientsData, invoicesData] = await Promise.all([
          clientsResponse.json(),
          invoicesResponse.json(),
        ]);

        setClients(clientsData);
        setInvoices(invoicesData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateData = (data, setData, idField, updatedItem) => {
    setData(data.map((item) => (item[idField] === updatedItem[idField] ? updatedItem : item)));
  };

  const onCreateInvoice = (newInvoice) => {
    const generatedInvoice = {
      ...newInvoice,
      id: `INV-${Date.now()}`, // Generate unique invoice ID
    };
    setInvoices((prevInvoices) => [...prevInvoices, generatedInvoice]);
    console.log("Created invoice:", generatedInvoice);
  };

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
              <Link to="/create-invoice">Create Invoice</Link>
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
            <Route
              path="/"
              element={<Dashboard records={invoices} loading={loading} />}
            />
            <Route
              path="/create-invoice"
              element={<InvoiceForm clients={clients} onCreateInvoice={onCreateInvoice} />}
            />
            <Route
              path="/search"
              element={<Search records={invoices} />}
            />
            <Route
              path="/client-profile/:id"
              element={
                <ClientProfile
                  clients={clients}
                  onUpdateClient={(updatedClient) => updateData(clients, setClients, "clientID", updatedClient)}
                  onUpdateInvoice={(updatedInvoice) => updateData(invoices, setInvoices, "invoiceID", updatedInvoice)}
                  onCreateInvoice={onCreateInvoice}
                />
              }
            />
            <Route
              path="/clients"
              element={
                <Clients
                  clients={clients}
                  onUpdateClient={(updatedClient) => updateData(clients, setClients, "clientID", updatedClient)}
                />
              }
            />
            <Route
              path="/chart"
              element={<ChartPage />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
