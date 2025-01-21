import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/search.css";

const Search = () => {
const [formData, setFormData] = useState({
businessName: "",
phoneNumber: "",
email: "",
invoiceID: "",
});

const [records, setRecords] = useState([]);
const [filteredRecords, setFilteredRecords] = useState([]);
const navigate = useNavigate();

// Fetch records from the backend API
useEffect(() => {
const fetchRecords = async () => {
    try {
    const response = await fetch(
        "https://6chdvkf5aa.execute-api.us-east-2.amazonaws.com/billing-records"
    );

    if (!response.ok) {
        throw new Error(`Error fetching records: ${response.statusText}`);
    }

    const data = await response.json();
    setRecords(data);
    setFilteredRecords(data); // Initialize filtered records with all records
    } catch (error) {
    console.error("Error fetching records:", error);
    }
};

fetchRecords();
}, []);

// Update filtered records whenever the form data changes
useEffect(() => {
const results = records.filter((record) =>
    Object.keys(formData).every((key) => {
    if (!formData[key]) return true; // Skip empty fields
    return record[key]
        ?.toString()
        .toLowerCase()
        .includes(formData[key].toLowerCase());
    })
);
setFilteredRecords(results);
}, [formData, records]);

const handleInputChange = (e) => {
const { name, value } = e.target;
setFormData({ ...formData, [name]: value });
};

const handleClear = () => {
setFormData({
    businessName: "",
    phoneNumber: "",
    email: "",
    invoiceID: "",
});
setFilteredRecords(records); // Reset to all records
};

const handleSelect = (record) => {
navigate(`/client-profile/${record.invoiceID}`, { state: { client: record } });
};

return (
<div className="search-container">
    <h1>Search Records</h1>
    <form className="search-form">
    <input
        type="text"
        name="businessName"
        placeholder="Business Name"
        value={formData.businessName}
        onChange={handleInputChange}
    />
    <input
        type="text"
        name="phoneNumber"
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={handleInputChange}
    />
    <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleInputChange}
    />
    <input
        type="text"
        name="invoiceID"
        placeholder="Invoice ID"
        value={formData.invoiceID}
        onChange={handleInputChange}
    />
    <button type="button" onClick={handleClear} className="clear-button">
        Clear
    </button>
    </form>
    <div className="results">
    {filteredRecords.length > 0 ? (
        <table>
        <thead>
            <tr>
            <th>Business Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Invoice ID</th>
            <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {filteredRecords.map((record, index) => (
            <tr key={index}>
                <td>{record.businessName}</td>
                <td>{record.phoneNumber}</td>
                <td>{record.email}</td>
                <td>{record.invoiceID}</td>
                <td>
                <button
                    onClick={() => handleSelect(record)}
                    className="select-button"
                >
                    Select
                </button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    ) : (
        <p>No results found.</p>
    )}
    </div>
</div>
);
};

export default Search;
