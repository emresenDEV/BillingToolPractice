import React from "react";
import "../styles/table.css";

const Table = ({ records = [] }) => {
console.log("Table records received:", records);


const formatCurrency = (value) => (typeof value === "number" ? value.toFixed(2) : "0.00");

return (
<div>
    {records.length === 0 ? (
    <p>No records available to display.</p>
    ) : (
    <table className="records-table">
        <thead>
        <tr>
            <th>Invoice ID</th>
            <th>Business Name</th>
            <th>Phone Number</th>
            <th>Service</th>
            <th>Amount (USD)</th>
            <th>Tax Rate (%)</th>
            <th>Discount (%)</th>
            <th>Status</th>
            <th>Tax Amount (USD)</th>
            <th>Discount Amount (USD)</th>
            <th>Final Total (USD)</th>
            <th>Notes</th>
        </tr>
        </thead>
        <tbody>
        {records.map((record) => (
            <tr key={record.invoiceID || Math.random()}>
            <td>{record.invoiceID || "N/A"}</td>
            <td>{record.businessName || "N/A"}</td>
            <td>{record.phoneNumber || "N/A"}</td>
            <td>{record.service || "N/A"}</td>
            <td>${formatCurrency(record.amountUSD)}</td>
            <td>{record.taxRate || "0.00"}</td>
            <td>{record.discountPercent || "0.00"}</td>
            <td>{record.status || "N/A"}</td>
            <td>${formatCurrency(record.taxAmount)}</td>
            <td>${formatCurrency(record.discountAmount)}</td>
            <td>${formatCurrency(record.finalTotal)}</td>
            <td>{record.notes || "N/A"}</td>
            </tr>
        ))}
        </tbody>
    </table>
    )}
</div>
);
};

export default Table;
