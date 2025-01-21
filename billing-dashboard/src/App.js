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
const [clients, setClients] = useState([]);
const [invoices, setInvoices] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const clientResponse = await fetch("http://localhost:5001/api/clients");
      const invoiceResponse = await fetch("http://localhost:5001/api/data");
      if (!clientResponse.ok || !invoiceResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const clientData = await clientResponse.json();
      const invoiceData = await invoiceResponse.json();

      setClients(clientData);
      setInvoices(invoiceData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

const onUpdateClient = (updatedClient) => {
  const updatedClients = clients.map((client) =>
    client.clientID === updatedClient.clientID ? updatedClient : client
  );
  setClients(updatedClients);
  console.log("Updated client:", updatedClient);
};

const onUpdateInvoice = (updatedInvoice) => {
  const updatedInvoices = invoices.map((invoice) =>
    invoice.invoiceID === updatedInvoice.invoiceID ? updatedInvoice : invoice
  );
  setInvoices(updatedInvoices);
  console.log("Updated invoice:", updatedInvoice);
};

const onCreateInvoice = (newInvoice) => {
  const generatedInvoice = {
    ...newInvoice,
    invoiceID: `INV-${Date.now()}`, // Generate unique invoice ID
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
          <Route
            path="/"
            element={<Dashboard records={invoices} loading={loading} />}
          />
          <Route path="/invoice" element={<InvoiceForm clients={clients} />} />
          <Route path="/search" element={<Search records={invoices} />} />
          <Route
            path="/client-profile/:id"
            element={
              <ClientProfile
                clients={clients}
                onUpdateClient={onUpdateClient}
                onUpdateInvoice={onUpdateInvoice}
                onCreateInvoice={onCreateInvoice}
              />
            }
          />
          <Route
            path="/clients"
            element={
              <Clients
                clients={clients}
                onUpdateClient={onUpdateClient}
                onUpdateInvoice={onUpdateInvoice}
              />
            }
          />
          <Route path="/chart" element={<ChartPage />} />
        </Routes>
      </div>
    </div>
  </Router>
);
};

export default App;
