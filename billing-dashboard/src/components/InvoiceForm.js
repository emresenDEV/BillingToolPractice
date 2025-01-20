import React, { useState } from "react";
import "../styles/invoiceForm.css";

const InvoiceForm = ({ clients }) => {
const [formData, setFormData] = useState({
clientID: "",
businessName: "",
contactName: "",
phoneNumber: "",
email: "",
service: "",
amountUSD: "",
taxRate: "",
discountPercent: "",
status: "",
});

const [isNewClient, setIsNewClient] = useState(false);
const [searchQuery, setSearchQuery] = useState({
businessName: "",
phoneNumber: "",
email: "",
});
const [filteredClients, setFilteredClients] = useState([]);

// Handle input changes for the form
const handleInputChange = (e) => {
const { name, value } = e.target;
setFormData({ ...formData, [name]: value });
};

// Handle the toggle for new/existing client
const handleNewClientToggle = () => {
setIsNewClient(!isNewClient);

if (!isNewClient) {
    const newClientID = clients.length + 1;
    setFormData({ ...formData, clientID: newClientID });
} else {
    setFormData({ ...formData, clientID: "" });
}
};

// Handle search inputs for the widget
const handleSearchInput = (e) => {
const { name, value } = e.target;
setSearchQuery({ ...searchQuery, [name]: value });
};

// Perform search when clicking the Search button
const handleSearch = () => {
const results = clients.filter((client) =>
    Object.keys(searchQuery).some((key) =>
    searchQuery[key]
        ? client[key]?.toLowerCase().includes(searchQuery[key].toLowerCase())
        : false
    )
);
setFilteredClients(results);
};

// Handle selecting a client from the search results
const handleClientSelect = (client) => {
setFormData({
    clientID: client.clientID,
    businessName: client.businessName,
    contactName: client.contactName,
    phoneNumber: client.phoneNumber,
    email: client.email,
    service: "",
    amountUSD: "",
    taxRate: "",
    discountPercent: "",
    status: "",
});
setFilteredClients([]); // Clear search results after selection
};

const handleSubmit = (e) => {
e.preventDefault();
console.log("New Invoice Created:", formData);
setFormData({
    clientID: "",
    businessName: "",
    contactName: "",
    phoneNumber: "",
    email: "",
    service: "",
    amountUSD: "",
    taxRate: "",
    discountPercent: "",
    status: "",
});
};

return (
<div className="invoice-form-container">
    {/* Header Section */}
    <div className="form-header">
    <h2>Create Invoice</h2>
    <div className="new-client-toggle">
        <label>
        <input
            type="checkbox"
            checked={isNewClient}
            onChange={handleNewClientToggle}
        />
        New Client
        </label>
    </div>
    </div>

    {/* Form Section */}
    <form onSubmit={handleSubmit} className="invoice-form">
    <div className="form-left">
        <label>Client ID</label>
        <input
        type="text"
        name="clientID"
        value={formData.clientID}
        onChange={handleInputChange}
        placeholder="Client ID"
        readOnly={isNewClient}
        required
        />

        <label>Business Name</label>
        <input
        type="text"
        name="businessName"
        value={formData.businessName}
        onChange={handleInputChange}
        placeholder="Business Name"
        required
        />

        <label>Contact Name</label>
        <input
        type="text"
        name="contactName"
        value={formData.contactName}
        onChange={handleInputChange}
        placeholder="Contact Name"
        required
        />

        <label>Phone Number</label>
        <input
        type="text"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleInputChange}
        placeholder="Phone Number"
        required
        />

        <label>Email</label>
        <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Email"
        required
        />
    </div>

    <div className="form-right">
        <label>Service</label>
        <input
        type="text"
        name="service"
        value={formData.service}
        onChange={handleInputChange}
        placeholder="Service"
        required
        />

        <label>Amount (USD)</label>
        <input
        type="number"
        name="amountUSD"
        value={formData.amountUSD}
        onChange={handleInputChange}
        placeholder="Amount in USD"
        required
        />

        <label>Tax Rate</label>
        <input
        type="number"
        name="taxRate"
        value={formData.taxRate}
        onChange={handleInputChange}
        placeholder="Tax Rate (%)"
        required
        />

        <label>Discount Percent</label>
        <input
        type="number"
        name="discountPercent"
        value={formData.discountPercent}
        onChange={handleInputChange}
        placeholder="Discount Percent (%)"
        required
        />

        <label>Status</label>
        <select
        name="status"
        value={formData.status}
        onChange={handleInputChange}
        required
        >
        <option value="">Select Status</option>
        <option value="Pending">Pending</option>
        <option value="Paid">Paid</option>
        <option value="Overdue">Overdue</option>
        </select>

        <button type="submit" className="submit-button">
        Create Invoice
        </button>
    </div>
    </form>

    {/* Search Clients Widget */}
    <div className="search-widget">
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
    <button onClick={handleSearch} className="search-button">
        Search
    </button>

    {filteredClients.length > 0 && (
        <div className="search-results">
        {filteredClients.map((client) => (
            <div
            key={client.clientID}
            className="client-result"
            onClick={() => handleClientSelect(client)}
            >
            <p>
                <strong>{client.businessName}</strong>
            </p>
            <p>Client ID: {client.clientID}</p>
            <p>Phone: {client.phoneNumber}</p>
            <p>Email: {client.email}</p>
            </div>
        ))}
        </div>
    )}
    </div>
</div>
);
};

export default InvoiceForm;
