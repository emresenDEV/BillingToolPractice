import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import InvoiceForm from "./components/InvoiceForm";
import Search from "./components/Search";
import Clients from "./components/Clients";
// import ChartPage from "./components/ChartPage";
import ClientProfile from "./components/ClientProfile";
import NewClient from "./components/NewClient";
import EditInvoice from "./components/EditInvoice"; 
import config from "./utils/config";
import "./styles/App.css";

const App = () => {
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for records used in EditInvoice
  const [records, setRecords] = useState([]);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsResponse, invoicesResponse, recordsResponse] = await Promise.all([
          fetch(`${config.baseURL}/api/clients`),
          fetch(`${config.baseURL}/api/data`),
          fetch(`${config.baseURL}/api/data`),
        ]);

        if (
          !clientsResponse.ok ||
          !invoicesResponse.ok ||
          !recordsResponse.ok
        ) {
          throw new Error("Failed to fetch data");
        }

        const [clientsData, invoicesData, recordsData] = await Promise.all([
          clientsResponse.json(),
          invoicesResponse.json(),
          recordsResponse.json(),
        ]);

        setClients(clientsData);
        setInvoices(invoicesData);
        setRecords(recordsData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update data utility
  const updateData = (data, setData, idField, updatedItem) => {
    setData(
      data.map((item) =>
        item[idField] === updatedItem[idField] ? updatedItem : item
      )
    );
  };

  // Add a new client
  const onAddClient = (newClient) => {
    setClients((prevClients) => [...prevClients, newClient]);
    console.log("New client added:", newClient);
  };

  // Update an invoice
  const onUpdateInvoice = (updatedInvoice) => {
    setInvoices((prevInvoices) =>
      prevInvoices.map((invoice) =>
        invoice.invoiceID === updatedInvoice.invoiceID ? updatedInvoice : invoice
      )
    );

    // Update records if needed
    setRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.invoiceID === updatedInvoice.invoiceID ? updatedInvoice : record
      )
    );

    console.log("Invoice updated:", updatedInvoice);
  };

  // Create a new invoice
  const onCreateInvoice = async (newInvoice) => {
    try {
      const response = await fetch(`${config.baseURL}/api/create-invoice`, {
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

      console.log("Created invoice:", createdInvoice);
      alert("Invoice created successfully!");
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("An error occurred while creating the invoice. Please try again.");
    }
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
            <li>
              <Link to="/new-client">New Client</Link>
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
              element={
                <EditInvoice
                  records={records}
                  onUpdateInvoice={onUpdateInvoice}
                />
              }
            />
            <Route
              path="/search"
              element={<Search clients={clients} invoices={invoices} />}
            />
            <Route
              path="/new-client"
              element={
                <NewClient
                  onClientAdded={(client) =>
                    setClients((prev) => [...prev, client])
                  }
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
                  onUpdateInvoice={(updatedInvoice) =>
                    updateData(invoices, setInvoices, "invoiceID", updatedInvoice)
                  }
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
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
