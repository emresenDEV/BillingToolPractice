import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import InvoiceForm from "./components/InvoiceForm";
import Search from "./components/Search";
import Clients from "./components/Clients";
import ChartPage from "./components/ChartPage";
import ClientProfile from "./components/ClientProfile";
import NewClient from "./components/NewClient";
import EditInvoice from "./components/EditInvoice";
import APITester from "./components/APITester";
import config from "./utils/config";
import "./styles/App.css";

const DEFAULT_TAX_RATE = 8.0;

const App = () => {
const [clients, setClients] = useState([]);
const [invoices, setInvoices] = useState([]);
const [records, setRecords] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// Fetch data on mount
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [clientsResponse, recordsResponse, taxRatesResponse] = await Promise.all([
        fetch(`${config.baseURL}${config.endpoints.clients}`),
        fetch(`${config.baseURL}${config.endpoints.billingRecords}`),
        fetch(`${config.baseURL}${config.endpoints.taxRates}`),
      ]);

      if (!clientsResponse.ok || !recordsResponse.ok || !taxRatesResponse.ok) {
        throw new Error("Failed to fetch data from one or more endpoints");
      }

      const [clientsData, recordsData, taxRatesData] = await Promise.all([
        clientsResponse.json(),
        recordsResponse.json(),
        taxRatesResponse.json(),
      ]);

      setClients(clientsData);
      setInvoices(recordsData); // Assuming invoices and records are the same
      setRecords(recordsData);
      console.log("Fetched Tax Rates:", taxRatesData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setError("An error occurred while loading data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

const fetchTaxRate = async (state) => {
  if (!state) return DEFAULT_TAX_RATE;

  try {
    const response = await fetch(`${config.baseURL}${config.endpoints.taxRates}?state=${state}`);
    if (!response.ok) throw new Error("Failed to fetch tax rate");

    const { rate } = await response.json();
    return rate;
  } catch (error) {
    console.error("Error fetching tax rate:", error);
    return DEFAULT_TAX_RATE;
  }
};

const updateData = (data, setData, idField, updatedItem) => {
  setData(
    data.map((item) => (item[idField] === updatedItem[idField] ? updatedItem : item))
  );
};

const onAddClient = (newClient) => {
  setClients((prevClients) => [...prevClients, newClient]);
  console.log("New client added:", newClient);
};

const onUpdateInvoice = (updatedInvoice) => {
  setInvoices((prevInvoices) =>
    prevInvoices.map((invoice) =>
      invoice.invoiceID === updatedInvoice.invoiceID ? updatedInvoice : invoice
    )
  );

  setRecords((prevRecords) =>
    prevRecords.map((record) =>
      record.invoiceID === updatedInvoice.invoiceID ? updatedInvoice : record
    )
  );

  console.log("Invoice updated:", updatedInvoice);
};

const onCreateInvoice = async (newInvoice) => {
  try {
    const taxRate = await fetchTaxRate(newInvoice.state);
    newInvoice.taxRate = taxRate;

    const response = await fetch(`${config.baseURL}${config.endpoints.createInvoice}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newInvoice),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to create invoice:", errorData);
      alert("Failed to create invoice. Please try again.");
      return;
    }

    const createdInvoice = await response.json();
    setInvoices((prevInvoices) => [...prevInvoices, createdInvoice]);
    setRecords((prevRecords) => [...prevRecords, createdInvoice]);

    alert("Invoice created successfully!");
  } catch (error) {
    console.error("Error creating invoice:", error);
    alert("An error occurred while creating the invoice. Please try again.");
  }
};

return (
  <Router>
    <div className="app">
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
          <li>
            <Link to="/new-client">New Client</Link>
          </li>
        </ul>
      </nav>

      <div className="content">
        {error && <div className="error">{error}</div>}
        <Routes>
          <Route path="/" element={<Dashboard records={invoices} loading={loading} />} />
          <Route path="/test-api" element={<APITester />} />
          <Route
            path="/create-invoice"
            element={
              <InvoiceForm
                clients={clients}
                onAddClient={onAddClient}
                onCreateInvoice={onCreateInvoice}
              />
            }
          />
          <Route
            path="/edit-invoice/:invoiceID"
            element={<EditInvoice records={records} onUpdateInvoice={onUpdateInvoice} />}
          />
          <Route path="/search" element={<Search clients={clients} invoices={invoices} />} />
          <Route
            path="/new-client"
            element={
              <NewClient
                onClientAdded={(client) => setClients((prev) => [...prev, client])}
              />
            }
          />
          <Route
            path="/client-profile/:id"
            element={
              <ClientProfile
                clients={clients}
                onUpdateClient={(updatedClient) =>
                  updateData(clients, setClients, "clientID", updatedClient)
                }
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
                onUpdateClient={(updatedClient) =>
                  updateData(clients, setClients, "clientID", updatedClient)
                }
              />
            }
          />
          <Route path="*" element={<div>404: Page Not Found</div>} />
        </Routes>
      </div>
    </div>
  </Router>
);
};

export default App;
