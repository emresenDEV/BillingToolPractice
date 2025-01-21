import React from "react";

const Table = ({ records }) => {
console.log("Table records received:", records);

return (
<div>
    {records.length === 0 ? (
    <p>No records available to display.</p>
    ) : (
    <table border="1">
        <thead>
        <tr>
            <th>Invoice ID</th>
            <th>Business Name</th>
            <th>Phone Number</th>
            <th>Service</th>
            <th>Amount (USD)</th>
            <th>Tax Rate</th>
            <th>Discount (%)</th>
            <th>Status</th>
            <th>Tax Amount</th>
            <th>Discount Amount</th>
            <th>Final Total</th>
        </tr>
        </thead>
        <tbody>
        {records.map((record, index) => (
            <tr key={index}>
            <td>{record.invoiceID || "N/A"}</td>
            <td>{record.businessName || "N/A"}</td>
            <td>{record.phoneNumber || "N/A"}</td>
            <td>{record.service || "N/A"}</td>
            <td>{record.amountUSD ? record.amountUSD.toFixed(2) : "0.00"}</td>
            <td>{record.taxRate || "0%"}</td>
            <td>{record.discountPercent || "0%"}</td>
            <td>{record.status || "N/A"}</td>
            <td>{record.taxAmount ? record.taxAmount.toFixed(2) : "0.00"}</td>
            <td>{record.discountAmount ? record.discountAmount.toFixed(2) : "0.00"}</td>
            <td>{record.finalTotal ? record.finalTotal.toFixed(2) : "0.00"}</td>
            </tr>
        ))}
        </tbody>
    </table>
    )}
</div>
);
};

export default Table;
