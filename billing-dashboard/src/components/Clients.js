import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/clients.css";

const Clients = ({ clients }) => {
const [filteredClients, setFilteredClients] = useState(clients);
const navigate = useNavigate();

const handleSearchInput = (e) => {
const { name, value } = e.target;
const results = clients.filter((client) =>
    client[name]?.toLowerCase().startsWith(value.toLowerCase())
);
setFilteredClients(results);
};

const handleViewClient = (client) => {
navigate(`/client-profile/${client.clientID}`, { state: { client } });
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
        onChange={handleSearchInput}
    />
    <input
        type="text"
        name="phoneNumber"
        placeholder="Phone Number"
        onChange={handleSearchInput}
    />
    <input
        type="email"
        name="email"
        placeholder="Email"
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
                    onClick={() => handleViewClient(client)}
                    className="view-button"
                >
                    View
                </button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    )}
    </div>
</div>
);
};

export default Clients;
