import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../utils/config";
import "../styles/clients.css";

const Clients = () => {
const [clients, setClients] = useState([]); 
const [filteredClients, setFilteredClients] = useState([]); 
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null); 
const navigate = useNavigate();

// Fetch clients data from the Flask API
useEffect(() => {
const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
    const response = await fetch(`${config.baseURL}${config.endpoints.clients}`);
    if (!response.ok) throw new Error(`Failed to fetch clients: ${response.statusText}`);
    const data = await response.json();
    setClients(data); 
    setFilteredClients(data); 
    } catch (error) {
    console.error("Error fetching clients:", error.message);
    setError("Failed to load clients. Please try again later.");
    } finally {
    setLoading(false);
    }
};

fetchClients();
}, []);

// Handle search input
const handleSearchInput = (e) => {
const { value } = e.target;
if (!value) {
    setFilteredClients(clients); 
    return;
}

const lowercasedValue = value.toLowerCase();
const results = clients.filter(
    (client) =>
    client.businessName?.toLowerCase().includes(lowercasedValue) ||
    client.phoneNumber?.toLowerCase().includes(lowercasedValue) ||
    client.email?.toLowerCase().includes(lowercasedValue)
);

setFilteredClients(results);
};

// Handle view client action
const handleViewClient = (client) => {
navigate(`/client-profile/${client.clientID}`, { state: { client } });
};

if (loading) return <div>Loading clients...</div>;
if (error) return <div className="error">{error}</div>;

return (
<div className="clients-container">
    <h1>Clients Management</h1>

    {/* Search Section */}
    <div className="search-section">
    <h3>Search Clients</h3>
    <input
        type="text"
        placeholder="Search by Business Name, Phone Number, or Email"
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
