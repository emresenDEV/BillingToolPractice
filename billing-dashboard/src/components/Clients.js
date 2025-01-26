import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/clients.css";
import config from "../utils/config";

const Clients = () => {
const [clients, setClients] = useState([]); // Full client list
const [filteredClients, setFilteredClients] = useState([]); // Filtered for search
const [loading, setLoading] = useState(true);
const navigate = useNavigate();

// Fetch clients data from the Flask API
useEffect(() => {
const fetchClients = async () => {
    try {
    const response = await fetch(`${config.baseURL}/api/clients`);
    if (!response.ok) throw new Error("Failed to fetch clients.");
    const data = await response.json();
    setClients(data); // Set full client list
    setFilteredClients(data); // Initialize filtered list
    } catch (error) {
    console.error("Error fetching clients:", error.message);
    } finally {
    setLoading(false);
    }
};

fetchClients();
}, []);

// Handle search input
const handleSearchInput = (e) => {
const { name, value } = e.target;
const results = clients.filter((client) =>
    client[name]?.toLowerCase().startsWith(value.toLowerCase())
);
setFilteredClients(results);
};

// Handle view client action
const handleViewClient = (client) => {
navigate(`/client-profile/${client.clientID}`, { state: { client } });
};

if (loading) return <div>Loading clients...</div>;

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
