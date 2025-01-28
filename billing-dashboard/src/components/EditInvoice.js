import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import config from "../utils/config";

const EditInvoice = ({ records, onUpdateInvoice }) => {
const { invoiceID } = useParams();
const navigate = useNavigate();


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

const [loading, setLoading] = useState(false);

useEffect(() => {
if (invoice) {
    setFormData(invoice);
}
}, [invoice]);

const handleInputChange = (e) => {
const { name, value } = e.target;
setFormData({ ...formData, [name]: value });
};

const calculateFinalFields = () => {
const amountUSD = parseFloat(formData.amountUSD) || 0;
const taxRate = parseFloat(formData.taxRate) || 0;
const discountPercent = parseFloat(formData.discountPercent) || 0;

const taxAmount = (amountUSD * taxRate) / 100;
const discountAmount = (amountUSD * discountPercent) / 100;
const finalTotal = amountUSD + taxAmount - discountAmount;

return { taxAmount, discountAmount, finalTotal };
};

const handleSubmit = async (e) => {
e.preventDefault();
setLoading(true);

try {
    const { taxAmount, discountAmount, finalTotal } = calculateFinalFields();
    const updatedInvoice = {
    ...formData,
    taxAmount,
    discountAmount,
    finalTotal,
    };

    const response = await fetch(`${config.baseURL}${config.endpoints.updateInvoice}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedInvoice),
    });

    if (!response.ok) {
    const errorData = await response.json();
    console.error("Failed to update invoice:", errorData);
    alert(errorData.error || "Failed to update invoice. Please try again.");
    return;
    }

    const result = await response.json();
    alert(result.message || "Invoice updated successfully!");

    
    if (onUpdateInvoice) {
    onUpdateInvoice(updatedInvoice);
    }

    navigate("/"); 
} catch (error) {
    console.error("Error updating invoice:", error);
    alert("An error occurred while updating the invoice.");
} finally {
    setLoading(false);
}
};

if (!invoice) {
return <p>Invoice not found. Please go back and try again.</p>;
}

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
        required
        />
    </label>
    <label>
        Amount (USD):
        <input
        type="number"
        name="amountUSD"
        value={formData.amountUSD || ""}
        onChange={handleInputChange}
        required
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
        required
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
    <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
    </button>
    </form>
</div>
);
};

export default EditInvoice;
