import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ClientProfile = ({ onUpdateClient, onCreateInvoice }) => {
const location = useLocation();
const navigate = useNavigate();
const clientData = location.state?.client;

const [client, setClient] = useState(clientData);
const [isEditing, setIsEditing] = useState(false);
const [selectedInvoice, setSelectedInvoice] = useState(null);
const [invoices, setInvoices] = useState([]);

useEffect(() => {
const fetchInvoices = async () => {
    try {
    const response = await fetch("/billing_records.csv"); // Replace with actual API for invoices
    const data = await response.json();
    setInvoices(data.filter((invoice) => invoice.clientID === client.clientID));
    } catch (error) {
    console.error("Error fetching invoices:", error);
    }
};

if (client) fetchInvoices();
}, [client]);

const handleInputChange = (e) => {
const { name, value } = e.target;
setClient({ ...client, [name]: value });
};

const handleSave = async () => {
const updatedClient = {
    ...client,
    modifiedBy: "admin", // Replace with dynamic user info if available
    modifiedDate: new Date().toLocaleString(),
};

try {
    await onUpdateClient(updatedClient); // Call the parent function to update
    setClient(updatedClient);
    setIsEditing(false);
    alert("Client details saved successfully!");
} catch (error) {
    console.error("Error saving client:", error);
    alert("Failed to save client details.");
}
};

const handleCreateInvoice = () => {
const prefilledInvoice = {
    clientID: client.clientID,
    businessName: client.businessName,
    contactName: client.contactName,
    phoneNumber: client.phoneNumber,
    email: client.email,
    service: "",
    amountUSD: "",
    taxRate: "",
    discountPercent: "",
    status: "Pending",
};

onCreateInvoice(prefilledInvoice); // Pass the prefilled invoice data to the parent function
navigate("/invoice", { state: { invoice: prefilledInvoice } });
};

if (!client) {
return <p>No client selected. Please go back to the search page.</p>;
}

return (
<div className="client-profile">
    {/* Display Last Updated Info */}
    <div style={{ textAlign: "right", color: "gray", marginBottom: "10px" }}>
    Last modified by {client.modifiedBy || "Unknown"} on {client.modifiedDate || "N/A"}
    </div>

    <h1>Client Profile</h1>

    <div>
    <label>Client ID: {client.clientID}</label>
    </div>

    <div>
    <label>Business Name:</label>
    {isEditing ? (
        <input
        type="text"
        name="businessName"
        value={client.businessName}
        onChange={handleInputChange}
        />
    ) : (
        <span>{client.businessName}</span>
    )}
    </div>

    <div>
    <label>Contact Name:</label>
    {isEditing ? (
        <input
        type="text"
        name="contactName"
        value={client.contactName}
        onChange={handleInputChange}
        />
    ) : (
        <span>{client.contactName}</span>
    )}
    </div>

    <div>
    <label>Phone Number:</label>
    {isEditing ? (
        <input
        type="text"
        name="phoneNumber"
        value={client.phoneNumber}
        onChange={handleInputChange}
        />
    ) : (
        <span>{client.phoneNumber}</span>
    )}
    </div>

    <div>
    <label>Email:</label>
    {isEditing ? (
        <input
        type="email"
        name="email"
        value={client.email}
        onChange={handleInputChange}
        />
    ) : (
        <span>{client.email}</span>
    )}
    </div>

    <div>
    {isEditing ? (
        <>
        <button onClick={handleSave}>Save</button>
        <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
    ) : (
        <>
        <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        <button onClick={handleCreateInvoice}>Create Invoice</button>
        </>
    )}
    <button onClick={() => navigate(-1)}>Back to Search</button>
    </div>

    {/* Associated Invoices */}
    <h2>Invoices</h2>
    <table>
    <thead>
        <tr>
        <th>Invoice ID</th>
        <th>Service</th>
        <th>Amount (USD)</th>
        <th>Status</th>
        <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        {invoices.map((invoice) => (
        <tr key={invoice.invoiceID}>
            <td>{invoice.invoiceID}</td>
            <td>{invoice.service}</td>
            <td>{invoice.amountUSD}</td>
            <td>{invoice.status}</td>
            <td>
            <button onClick={() => setSelectedInvoice(invoice)}>
                Edit Invoice
            </button>
            </td>
        </tr>
        ))}
    </tbody>
    </table>

    {/* Invoice Edit Modal */}
    {selectedInvoice && (
    <div className="modal">
        <h3>Edit Invoice</h3>
        <form>
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
        <label>Amount (USD)</label>
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
        <select
            name="status"
            value={selectedInvoice.status}
            onChange={(e) =>
            setSelectedInvoice({
                ...selectedInvoice,
                status: e.target.value,
            })
            }
        >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
        </select>
        <button type="submit">Save Changes</button>
        <button type="button" onClick={() => setSelectedInvoice(null)}>
            Cancel
        </button>
        </form>
    </div>
    )}
</div>
);
};

export default ClientProfile;
