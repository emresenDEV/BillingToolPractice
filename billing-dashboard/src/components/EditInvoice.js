import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import config from "../utils/config";

const EditInvoice = ({ records, onUpdateInvoice }) => {
    const { invoiceID } = useParams();
    const navigate = useNavigate();

    // Fetch the invoice from records
    const invoice = records.find((rec) => rec.invoiceID === parseInt(invoiceID));

    const [formData, setFormData] = useState(
        invoice || {
            service: "",
            amountUSD: "",
            taxRate: "",
            discountPercent: "",
            status: "Pending",
            taxAmount: "",
            discountAmount: "",
            finalTotal: "",
            notes: "",
        }
    );

    useEffect(() => {
        if (invoice) {
            setFormData(invoice);
        }
    }, [invoice]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${config.baseURL}/api/update-invoice`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Failed to update invoice:", errorData);
                alert("Failed to update invoice. Please try again.");
                return;
            }

            const result = await response.json();
            alert(result.message);

            // Call onUpdateInvoice to update state in parent component
            if (onUpdateInvoice) {
                onUpdateInvoice(formData);
            }

            navigate("/"); // Navigate back to the dashboard or relevant page
        } catch (error) {
            console.error("Error updating invoice:", error);
            alert("An error occurred while updating the invoice.");
        }
    };

    return (
        <div>
            <h1>Edit Invoice</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Service:
                    <input
                        type="text"
                        name="service"
                        value={formData.service || ""}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Amount (USD):
                    <input
                        type="number"
                        name="amountUSD"
                        value={formData.amountUSD || ""}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Tax Rate (%):
                    <input
                        type="number"
                        name="taxRate"
                        value={formData.taxRate || ""}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Discount Percent (%):
                    <input
                        type="number"
                        name="discountPercent"
                        value={formData.discountPercent || ""}
                        onChange={handleInputChange}
                    />
                </label>
                <label>
                    Status:
                    <select
                        name="status"
                        value={formData.status || "Pending"}
                        onChange={handleInputChange}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                </label>
                <label>
                    Notes:
                    <textarea
                        name="notes"
                        value={formData.notes || ""}
                        onChange={handleInputChange}
                    />
                </label>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default EditInvoice;
