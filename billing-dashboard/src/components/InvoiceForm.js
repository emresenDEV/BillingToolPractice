import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import config from "../utils/config";
import "../styles/invoiceForm.css";

const DEFAULT_TAX_RATE = 8.0; // Fallback if no tax rate is found in the DB

const InvoiceForm = ({ clients, onCreateInvoice }) => {
    const location = useLocation();
    const prefilledInvoice = location.state?.invoice || null;

    const [formData, setFormData] = useState({
        clientID: "",
        businessName: "",
        contactName: "",
        phoneNumber: "",
        email: "",
        service: "",
        amountUSD: "",
        taxRate: DEFAULT_TAX_RATE,
        discountPercent: "",
        status: "Pending",
        notes: "",
        state: "",
    });

    const [searchQuery, setSearchQuery] = useState({
        businessName: "",
        phoneNumber: "",
        email: "",
    });
    const [filteredClients, setFilteredClients] = useState([]);

    useEffect(() => {
        if (prefilledInvoice) {
            setFormData(prefilledInvoice);
        }
    }, [prefilledInvoice]);

    const handleStateChange = async (state) => {
        try {
            const response = await fetch(`${config.baseURL}/api/tax-rates?state=${state}`);
            if (!response.ok) throw new Error("Failed to fetch tax rate.");
            const { rate } = await response.json();
            setFormData((prev) => ({
                ...prev,
                state,
                taxRate: rate || DEFAULT_TAX_RATE,
            }));
        } catch (error) {
            console.error("Error fetching tax rate:", error.message);
            setFormData((prev) => ({
                ...prev,
                state,
                taxRate: DEFAULT_TAX_RATE,
            }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "state") {
            handleStateChange(value);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSearchInput = (e) => {
        const { name, value } = e.target;
        setSearchQuery({ ...searchQuery, [name]: value });

        const results = clients.filter((client) =>
            client[name]?.toLowerCase().startsWith(value.toLowerCase())
        );
        setFilteredClients(results);
    };

    const handleClientSelect = (client) => {
        setFormData({
            clientID: client.clientID,
            businessName: client.businessName,
            contactName: client.contactName,
            phoneNumber: client.phoneNumber,
            email: client.email,
            service: "",
            amountUSD: "",
            taxRate: client.taxRate || DEFAULT_TAX_RATE,
            discountPercent: "",
            status: "Pending",
            notes: "",
            state: client.state,
        });
        setFilteredClients([]);
        handleStateChange(client.state);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure numeric fields are parsed as numbers
        const sanitizedData = {
            ...formData,
            amountUSD: parseFloat(formData.amountUSD) || 0,
            taxRate: parseFloat(formData.taxRate) || 0,
            discountPercent: parseFloat(formData.discountPercent) || 0,
        };

        const newInvoice = {
            ...sanitizedData,
            invoiceID: `INV-${Date.now()}`, // Generate unique invoice ID
        };

        try {
            const response = await fetch(`${config.baseURL}/api/create-invoice`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newInvoice),
            });

            if (response.ok) {
                const invoice = await response.json();
                onCreateInvoice(invoice);
                alert("Invoice created successfully!");
                setFormData({
                    clientID: "",
                    businessName: "",
                    contactName: "",
                    phoneNumber: "",
                    email: "",
                    service: "",
                    amountUSD: "",
                    taxRate: DEFAULT_TAX_RATE,
                    discountPercent: "",
                    status: "Pending",
                    notes: "",
                    state: "",
                });
            } else {
                const errorData = await response.json();
                console.error("Error creating invoice:", errorData);
                alert("Failed to create invoice.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while creating the invoice.");
        }
    };

    return (
        <div className="invoice-form-container">
            <div className="form-header">
                <h2>Create Invoice</h2>
            </div>

            <form onSubmit={handleSubmit} className="invoice-form">
                <div className="form-left">
                    <label>Client ID</label>
                    <input
                        type="text"
                        name="clientID"
                        value={formData.clientID}
                        onChange={handleInputChange}
                        placeholder="Client ID"
                        readOnly
                        required
                    />
                    <label>Business Name</label>
                    <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        placeholder="Business Name"
                        readOnly
                        required
                    />
                    <label>Contact Name</label>
                    <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        placeholder="Contact Name"
                        readOnly
                        required
                    />
                    <label>Phone Number</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Phone Number"
                        readOnly
                        required
                    />
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        readOnly
                        required
                    />
                    <label>State</label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Enter State (e.g., TX)"
                        readOnly
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
                        readOnly
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
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                    <label>Notes (Optional)</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Enter any notes here (optional)"
                    />
                    <button type="submit" className="submit-button">
                        Create Invoice
                    </button>
                </div>
            </form>

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
                {filteredClients.length > 0 && (
                    <div className="search-results">
                        {filteredClients.map((client) => (
                            <div key={client.clientID} className="client-result">
                                <p>
                                    <strong>{client.businessName}</strong>
                                </p>
                                <p>Client ID: {client.clientID}</p>
                                <p>Phone: {client.phoneNumber}</p>
                                <p>Email: {client.email}</p>
                                <button
                                    onClick={() => handleClientSelect(client)}
                                    className="create-invoice-button"
                                >
                                    Use Client
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvoiceForm;
