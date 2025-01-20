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
            <td>{record.invoiceID}</td>
            <td>{record.businessName}</td>
            <td>{record.phoneNumber}</td>
            <td>{record.service}</td>
            <td>{record.amountUSD?.toFixed(2)}</td>
            <td>{record.taxRate}</td>
            <td>{record.discountPercent}</td>
            <td>{record.status}</td>
            <td>{record.taxAmount?.toFixed(2)}</td>
            <td>{record.discountAmount?.toFixed(2)}</td>
            <td>{record.finalTotal?.toFixed(2)}</td>
            </tr>
        ))}
        </tbody>
    </table>
    )}
</div>
);
};

export default Table;
