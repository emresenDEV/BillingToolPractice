import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../utils/config";

const ClientProfile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const clientData = location.state?.client;

    const [client, setClient] = useState(clientData || {});
    const [isEditing, setIsEditing] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInvoices = async () => {
            if (!client || !client.clientID) return;
            try {
                const response = await fetch(
                    `${config.baseURL}${config.endpoints.billingRecords}?clientID=${client.clientID}`
                );
                if (!response.ok) {
                    throw new Error(`Failed to fetch invoices: ${response.statusText}`);
                }
                const data = await response.json();
                setInvoices(data);
            } catch (error) {
                console.error("Error fetching invoices:", error);
                setError("Failed to fetch invoices. Please try again.");
            }
        };

        fetchInvoices();
    }, [client]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setClient((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!client.businessName || !client.contactName || !client.email) {
            alert("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        try {
            const updatedClient = {
                ...client,
                modifiedBy: "admin",
                modifiedDate: new Date().toISOString(),
            };

            const response = await fetch(`${config.baseURL}${config.endpoints.updateClient}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedClient),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to save client profile.");
            }

            const result = await response.json();
            setClient(result || updatedClient); // Fallback to local update
            setIsEditing(false);
            alert("Client details saved successfully!");
        } catch (error) {
            console.error("Error saving client:", error);
            alert(error.message || "Failed to save client details.");
        } finally {
            setLoading(false);
        }
    };

    if (!client || !client.clientID) {
        return <p>No client selected. Please go back to the search page.</p>;
    }

    return (
        <div className="client-profile">
            <div style={{ textAlign: "right", color: "gray", marginBottom: "10px" }}>
                Last modified by {client.modifiedBy || "Unknown"} on{" "}
                {client.modifiedDate || "N/A"}
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
                        value={client.businessName || ""}
                        onChange={handleInputChange}
                        required
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
                        value={client.contactName || ""}
                        onChange={handleInputChange}
                        required
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
                        value={client.phoneNumber || ""}
                        onChange={handleInputChange}
                        required
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
                        value={client.email || ""}
                        onChange={handleInputChange}
                        required
                    />
                ) : (
                    <span>{client.email}</span>
                )}
            </div>

            <div>
                {isEditing ? (
                    <>
                        <button onClick={handleSave} disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </button>
                        <button onClick={() => setIsEditing(false)} disabled={loading}>
                            Cancel
                        </button>
                    </>
                ) : (
                    <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                )}
                <button onClick={() => navigate(-1)}>Back to Search</button>
            </div>

            <h2>Invoices</h2>
            {error ? (
                <p className="error">{error}</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Invoice ID</th>
                            <th>Service</th>
                            <th>Amount (USD)</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <tr key={invoice.invoiceID}>
                                <td>{invoice.invoiceID}</td>
                                <td>{invoice.service || "N/A"}</td>
                                <td>{invoice.amountUSD ? `$${invoice.amountUSD.toFixed(2)}` : "N/A"}</td>
                                <td>{invoice.status || "N/A"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ClientProfile;
