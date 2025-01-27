import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../utils/config";

const ClientProfile = () => {
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
                const response = await fetch(
                    `${config.baseURL}/api/data?clientID=${client.clientID}`
                );
                if (!response.ok) throw new Error("Failed to fetch invoices.");
                const data = await response.json();
                setInvoices(data);
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
        try {
            const updatedClient = {
                ...client,
                modifiedBy: "admin",
                modifiedDate: new Date().toLocaleString(),
            };
            const response = await fetch(`${config.baseURL}/api/update-client`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedClient),
            });

            if (!response.ok) throw new Error("Failed to save client profile.");

            const result = await response.json();
            setClient(result);
            setIsEditing(false);
            alert("Client details saved successfully!");
        } catch (error) {
            console.error("Error saving client:", error);
            alert("Failed to save client details.");
        }
    };

    const handleEditInvoice = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${config.baseURL}/api/update-invoice`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedInvoice),
            });

            if (!response.ok) throw new Error("Failed to update invoice.");

            const updatedInvoice = await response.json();

            setInvoices((prevInvoices) =>
                prevInvoices.map((invoice) =>
                    invoice.invoiceID === updatedInvoice.invoiceID
                        ? updatedInvoice
                        : invoice
                )
            );
            setSelectedInvoice(null);
            alert("Invoice updated successfully!");
        } catch (error) {
            console.error("Error updating invoice:", error);
            alert("Failed to update invoice.");
        }
    };

    if (!client) {
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
                    </>
                )}
                <button onClick={() => navigate(-1)}>Back to Search</button>
            </div>

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
                            <button
                                onClick={() =>
                                    navigate(`/edit-invoice/${invoice.invoiceID}`, { state: { invoice } })
                                }
                            >
                                Edit Invoice
                            </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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
                        <button type="submit" onClick={handleEditInvoice}>
                            Save Changes
                        </button>
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
