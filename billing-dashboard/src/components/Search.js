import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../utils/config";
import "../styles/search.css";

const Search = () => {
const [formData, setFormData] = useState({
searchField: "businessName",
searchValue: "",
});

const [records, setRecords] = useState([]);
const [filteredRecords, setFilteredRecords] = useState([]);
const [loading, setLoading] = useState(true);
const navigate = useNavigate();

useEffect(() => {
const fetchRecords = async () => {
    try {
        const response = await fetch(`${config.baseURL}/api/data`);
        if (!response.ok) throw new Error("Failed to fetch records.");
        const data = await response.json();

        // Normalize phone numbers for easier comparison
        const normalizedRecords = data.map((record) => ({
            ...record,
            phoneNumber: record.phoneNumber?.replace(/[^0-9]/g, "") || "",
        }));

        setRecords(normalizedRecords);
        setFilteredRecords(normalizedRecords);
    } catch (error) {
        console.error("Error fetching records:", error.message);
    } finally {
        setLoading(false);
    }
};

fetchRecords();
}, []);

const handleInputChange = (e) => {
const { value } = e.target;
const searchField = formData.searchField;

setFormData({ ...formData, searchValue: value });

if (value === "") {
    setFilteredRecords(records);
    return;
}

const filtered = records.filter((record) => {
    const fieldValue = record[searchField]?.toString().toLowerCase() || "";

    // Handle phone number special case
    if (searchField === "phoneNumber") {
        return fieldValue.startsWith(value.replace(/[^0-9]/g, ""));
    }

    return fieldValue.startsWith(value.toLowerCase());
});

// Alphabetical ordering for name-based fields
if (["businessName", "contactName"].includes(searchField)) {
    filtered.sort((a, b) => (a[searchField]?.localeCompare(b[searchField]) || 0));
}

setFilteredRecords(filtered);
};

const handleSearchFieldChange = (e) => {
const { value } = e.target;
setFormData({ searchField: value, searchValue: "" });
setFilteredRecords(records);
};

const handleClear = () => {
setFormData({
    searchField: "businessName",
    searchValue: "",
});
setFilteredRecords(records);
};

const handleSelect = (record) => {
navigate(`/client-profile/${record.clientID}`, { state: { client: record } });
};

const placeholderText = {
businessName: "Search by Company Name",
contactName: "Search by Contact Name",
phoneNumber: "Search by Phone Number",
clientID: "Search by Account Number",
invoiceID: "Search by Invoice Number",
email: "Search by Email Address",
address: "Search by Address",
}[formData.searchField];

if (loading) return <div>Loading records...</div>;

return (
<div className="search-container">
    <h1>Search Records</h1>
    <div className="search-box">
        <select
            value={formData.searchField}
            onChange={handleSearchFieldChange}
            className="search-field-selector"
        >
            <option value="businessName">Company Name</option>
            <option value="contactName">Contact Name</option>
            <option value="phoneNumber">Phone Number</option>
            <option value="clientID">Account Number</option>
            <option value="invoiceID">Invoice Number</option>
            <option value="email">Email Address</option>
            <option value="address">Address</option>
        </select>
        <input
            type="text"
            value={formData.searchValue}
            onChange={handleInputChange}
            placeholder={placeholderText}
            className="search-input"
        />
        <button onClick={handleClear} className="clear-button">
            ✖
        </button>
    </div>
    <div className="results">
        {filteredRecords.length > 0 ? (
            <table>
                <thead>
                    <tr>
                        <th>Company Name</th>
                        <th>Contact Name</th>
                        <th>Phone Number</th>
                        <th>Account Number</th>
                        <th>Invoice Number</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRecords.map((record) => (
                        <tr key={record.invoiceID || record.clientID}>
                            <td>{record.businessName || "N/A"}</td>
                            <td>{record.contactName || "N/A"}</td>
                            <td>
                                {record.phoneNumber
                                    ? `${record.phoneNumber.slice(0, 3)}-${record.phoneNumber.slice(
                                            3,
                                            6
                                        )}-${record.phoneNumber.slice(6)}`
                                    : "N/A"}
                            </td>
                            <td>{record.clientID || "N/A"}</td>
                            <td>{record.invoiceID || "N/A"}</td>
                            <td>{record.email || "N/A"}</td>
                            <td>{record.address || "N/A"}</td>
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
