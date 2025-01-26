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

const DEFAULT_TAX_RATE = 8.0; //Adjust as needed. This is default if no tax rate is provided

// Handle input changes
const handleChange = (e) => {
const { name, value } = e.target;
setFormData({ ...formData, [name]: value });
};

// Submit data to the database via API
const handleSubmit = async (e) => {
    e.preventDefault();

const newInvoice = {
    ...formData,
    taxRate: formData.taxRate || DEFAULT_TAX_RATE, // Ensure taxRate is set
    status: formData.status || "Pending", // Default to "Pending"
};

try {
    const response = await fetch(`${config.baseURL}/api/create-invoice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newInvoice),
    });

    if (response.ok) {
    const invoice = await response.json();
    console.log("Invoice created successfully", invoice);
    } else {
    console.error("Failed to create invoice:", await response.json());
    }
} catch (error) {
    console.error("Error:", error);
}
};

// Export records to Excel
const saveToExcel = (updatedRecords) => {
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
    required
    />
    <input
    name="discount"
    type="number"
    placeholder="Discount"
    value={formData.discount}
    onChange={handleChange}
    required
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
