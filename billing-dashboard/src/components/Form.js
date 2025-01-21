import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Form = ({ records, setRecords }) => {
const [formData, setFormData] = useState({
customerName: "",
service: "",
amount: "",
taxRate: "",
discount: "",
status: "",
});

const handleChange = (e) => {
const { name, value } = e.target;
setFormData({ ...formData, [name]: value });
};

const handleSubmit = async (e) => {
e.preventDefault();
const newRecord = {
    customerName: formData.customerName,
    service: formData.service,
    amountUSD: parseFloat(formData.amount),
    taxRate: parseFloat(formData.taxRate),
    discountPercent: parseFloat(formData.discount),
    status: formData.status,
};

try {
    const response = await fetch(
    "https://6chdvkf5aa.execute-api.us-east-2.amazonaws.com/update-records",
    {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([newRecord]), // API expects an array
    }
    );

    if (response.ok) {
    console.log("Record added successfully!");
    const updatedRecords = await response.json();
    setRecords(updatedRecords); // Update the records state
    } else {
    console.error("Error updating record:", await response.json());
    }
} catch (error) {
    console.error("Error:", error);
}
};

const saveToExcel = (updatedRecords) => {
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(updatedRecords);
XLSX.utils.book_append_sheet(wb, ws, "BillingRecords");
const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
const blob = new Blob([buffer], { type: "application/octet-stream" });
saveAs(blob, "billing_records.xlsx");
};

const triggerPythonScript = () => {
fetch(
    "https://6chdvkf5aa.execute-api.us-east-2.amazonaws.com/run-python-script",
    {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    }
)
    .then((response) => response.json())
    .then((data) => {
    if (data.status === "success") {
        console.log("Python script executed successfully:", data.output);
    } else {
        console.error("Error executing Python script:", data.output);
    }
    })
    .catch((error) => {
    console.error("Error triggering script:", error);
    });
};

return (
<form onSubmit={handleSubmit}>
    <input
    name="customerName"
    placeholder="Customer Name"
    value={formData.customerName}
    onChange={handleChange}
    />
    <input
    name="service"
    placeholder="Service"
    value={formData.service}
    onChange={handleChange}
    />
    <input
    name="amount"
    type="number"
    placeholder="Amount"
    value={formData.amount}
    onChange={handleChange}
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
    <select name="status" value={formData.status} onChange={handleChange}>
    <option value="">Status</option>
    <option value="Paid">Paid</option>
    <option value="Pending">Pending</option>
    <option value="Overdue">Overdue</option>
    </select>
    <button type="submit">Add Record</button>
    <button type="button" onClick={() => saveToExcel(records)}>
    Save to Excel
    </button>
    <button type="button" onClick={triggerPythonScript}>
    Run Python Script
    </button>
</form>
);
};

export default Form;
