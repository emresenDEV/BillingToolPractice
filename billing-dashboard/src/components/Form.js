import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import config from "../utils/config";

const Form = ({ records, setRecords }) => {
const [formData, setFormData] = useState({
customerName: "",
service: "",
amount: "",
taxRate: "",
discount: "",
status: "",
});

const DEFAULT_TAX_RATE = 8.0; // Default tax rate


const handleChange = (e) => {
const { name, value } = e.target;
setFormData({ ...formData, [name]: value });
};


const handleSubmit = async (e) => {
e.preventDefault();

const newInvoice = {
    ...formData,
    taxRate: parseFloat(formData.taxRate) || DEFAULT_TAX_RATE,
    amount: parseFloat(formData.amount) || 0,
    discount: parseFloat(formData.discount) || 0,
    status: formData.status || "Pending",
};

try {
    const response = await fetch(
    `${config.baseURL}${config.endpoints.createInvoice}`,
    {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInvoice),
    }
    );

    if (response.ok) {
    const invoice = await response.json();
    console.log("Invoice created successfully:", invoice);
    setRecords((prev) => [...prev, invoice]); // Update records state
    alert("Invoice added successfully!");
    setFormData({
        customerName: "",
        service: "",
        amount: "",
        taxRate: "",
        discount: "",
        status: "",
    }); // Reset form
    } else {
    const errorData = await response.json();
    console.error("Failed to create invoice:", errorData);
    alert("Failed to add invoice. Please try again.");
    }
} catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
}
};

// Export records to Excel
const saveToExcel = (updatedRecords) => {
if (!updatedRecords || updatedRecords.length === 0) {
    alert("No records to export.");
    return;
}

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(updatedRecords);
XLSX.utils.book_append_sheet(wb, ws, "Invoices");
const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
const blob = new Blob([buffer], { type: "application/octet-stream" });
saveAs(blob, "billing_records.xlsx");
};

return (
<form onSubmit={handleSubmit}>
    <input
    name="customerName"
    placeholder="Customer Name"
    value={formData.customerName}
    onChange={handleChange}
    required
    />
    <input
    name="service"
    placeholder="Service"
    value={formData.service}
    onChange={handleChange}
    required
    />
    <input
    name="amount"
    type="number"
    placeholder="Amount"
    value={formData.amount}
    onChange={handleChange}
    required
    />
    <input
    name="taxRate"
    type="number"
    placeholder="Tax Rate"
    value={formData.taxRate}
    onChange={handleChange}
    />
    <input
    name="discount"
    type="number"
    placeholder="Discount"
    value={formData.discount}
    onChange={handleChange}
    />
    <select name="status" value={formData.status} onChange={handleChange} required>
    <option value="">Status</option>
    <option value="Paid">Paid</option>
    <option value="Pending">Pending</option>
    <option value="Overdue">Overdue</option>
    </select>
    <button type="submit">Add Record</button>
    <button type="button" onClick={() => saveToExcel(records)}>
    Export to Excel
    </button>
</form>
);
};

export default Form;
