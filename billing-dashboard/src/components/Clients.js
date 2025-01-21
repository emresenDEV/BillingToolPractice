import React, { useState, useEffect } from "react";
import "../styles/clients.css";

const Clients = ({ onUpdateClient, onUpdateInvoice }) => {
const [clients, setClients] = useState([]);
const [invoices, setInvoices] = useState([]);
const [searchQuery, setSearchQuery] = useState({
businessName: "",
phoneNumber: "",
email: "",
});
const [filteredClients, setFilteredClients] = useState([]);
const [filteredInvoices, setFilteredInvoices] = useState([]);
const [selectedClient, setSelectedClient] = useState(null);
const [selectedInvoice, setSelectedInvoice] = useState(null);

// Fetch clients and invoices from AWS API Gateway
useEffect(() => {
const fetchClientsAndInvoices = async () => {
    try {
    const clientsResponse = await fetch(
        "https://6chdvkf5aa.execute-api.us-east-2.amazonaws.com/clients"
    );
    const invoicesResponse = await fetch(
        "https://6chdvkf5aa.execute-api.us-east-2.amazonaws.com/billing-records"
    );

    if (!clientsResponse.ok || !invoicesResponse.ok) {
        throw new Error("Failed to fetch data");
    }

    const clientsData = await clientsResponse.json();
    const invoicesData = await invoicesResponse.json();

    setClients(clientsData);
    setInvoices(invoicesData);
    setFilteredClients(clientsData);
    } catch (error) {
    console.error("Error fetching data:", error);
    }
};

fetchClientsAndInvoices();
}, []);

const handleSearchInput = (e) => {
const { name, value } = e.target;
setSearchQuery({ ...searchQuery, [name]: value });

const results = clients.filter((client) =>
    client[name]?.toString().toLowerCase().startsWith(value.toLowerCase())
);

setFilteredClients(results);
};

const handleEditClient = (client) => {
setSelectedClient(client);
setSelectedInvoice(null);

const associatedInvoices = invoices.filter(
    (invoice) => invoice.clientID === client.clientID
);
setFilteredInvoices(associatedInvoices);
};

const handleEditInvoice = (invoice) => {
setSelectedInvoice(invoice);
setSelectedClient(null);
};

const handleClientSubmit = async (e) => {
e.preventDefault();
if (selectedClient) {
    try {
    const response = await fetch(
        "https://6chdvkf5aa.execute-api.us-east-2.amazonaws.com/clients",
        {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([selectedClient]),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update client");
    }

    alert("Client updated successfully!");
    onUpdateClient(selectedClient);
    setSelectedClient(null);
    } catch (error) {
    console.error("Error updating client:", error);
    alert("Failed to update client.");
    }
}
};

const handleInvoiceSubmit = async (e) => {
e.preventDefault();
if (selectedInvoice) {
    try {
    const response = await fetch(
        "https://6chdvkf5aa.execute-api.us-east-2.amazonaws.com/billing-records",
        {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([selectedInvoice]),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update invoice");
    }

    alert("Invoice updated successfully!");
    onUpdateInvoice(selectedInvoice);
    setSelectedInvoice(null);
    } catch (error) {
    console.error("Error updating invoice:", error);
    alert("Failed to update invoice.");
    }
}
};

const closeModal = () => {
setSelectedClient(null);
setSelectedInvoice(null);
};

return (
<div className="clients-container">
    <h1>Clients Management</h1>

    {/* Search Section */}
    <div className="search-section">
    <h3>Search Clients</h3>
    <input
        type="text"
        name="businessName"
        placeholder="Business Name"
        value={searchQuery.businessName}
        onChange={handleSearchInput}
    />
    <input
        type="text"
        name="phoneNumber"
        placeholder="Phone Number"
        value={searchQuery.phoneNumber}
        onChange={handleSearchInput}
    />
    <input
        type="email"
        name="email"
        placeholder="Email"
        value={searchQuery.email}
        onChange={handleSearchInput}
    />
    </div>

    {/* Clients Table */}
    <div className="clients-table-container">
    <h3>All Clients</h3>
    {filteredClients.length === 0 ? (
        <p>No clients found. Try refining your search.</p>
    ) : (
        <table>
        <thead>
            <tr>
            <th>Client ID</th>
            <th>Business Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {filteredClients.map((client) => (
            <tr key={client.clientID}>
                <td>{client.clientID}</td>
                <td>{client.businessName}</td>
                <td>{client.phoneNumber}</td>
                <td>{client.email}</td>
                <td>
                <button
                    onClick={() => handleEditClient(client)}
                    className="edit-button"
                >
                    Edit
                </button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    )}
    </div>

    {/* Modal for Edit Client or Invoice */}
    {(selectedClient || selectedInvoice) && (
    <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {selectedClient && (
            <>
            <h3>Edit Client</h3>
            <form onSubmit={handleClientSubmit}>
                <label>Business Name</label>
                <input
                type="text"
                name="businessName"
                value={selectedClient.businessName}
                onChange={(e) =>
                    setSelectedClient({
                    ...selectedClient,
                    businessName: e.target.value,
                    })
                }
                />
                <label>Phone Number</label>
                <input
                type="text"
                name="phoneNumber"
                value={selectedClient.phoneNumber}
                onChange={(e) =>
                    setSelectedClient({
                    ...selectedClient,
                    phoneNumber: e.target.value,
                    })
                }
                />
                <label>Email</label>
                <input
                type="email"
                name="email"
                value={selectedClient.email}
                onChange={(e) =>
                    setSelectedClient({
                    ...selectedClient,
                    email: e.target.value,
                    })
                }
                />
                <button type="submit" className="save-button">
                Save Changes
                </button>
            </form>
            </>
        )}
        {selectedInvoice && (
            <>
            <h3>Edit Invoice</h3>
            <form onSubmit={handleInvoiceSubmit}>
                <label>Service</label>
                <input
                type="text"
                name="service"
                value={selectedInvoice.service}
                onChange={(e) =>
                    setSelectedInvoice({
                    ...selectedInvoice,
                    service: e.target.value,
                    })
                }
                />
                <label>Amount</label>
                <input
                type="number"
                name="amountUSD"
                value={selectedInvoice.amountUSD}
                onChange={(e) =>
                    setSelectedInvoice({
                    ...selectedInvoice,
                    amountUSD: parseFloat(e.target.value),
                    })
                }
                />
                <label>Status</label>
                <input
                type="text"
                name="status"
                value={selectedInvoice.status}
                onChange={(e) =>
                    setSelectedInvoice({
                    ...selectedInvoice,
                    status: e.target.value,
                    })
                }
                />
                <button type="submit" className="save-button">
                Save Changes
                </button>
            </form>
            </>
        )}
        </div>
    </div>
    )}
</div>
);
};

export default Clients;
