import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import SummaryBox from "./SummaryBox";
import TasksWidget from "./TasksWidget";
import "../styles/dashboard.css";

const Dashboard = () => {
const [records, setRecords] = useState([]);
const [loading, setLoading] = useState(true);
const navigate = useNavigate();

useEffect(() => {
const fetchCSVData = async () => {
    try {
    // Fetch the CSV file from the public folder
    const response = await fetch("/billing_records.csv");
    const csvText = await response.text();

    // Parse CSV using PapaParse
    Papa.parse(csvText, {
        header: true, // Use the first row as headers
        skipEmptyLines: true,
        complete: (result) => {
        setRecords(result.data); // Set parsed CSV data
        },
    });
    } catch (error) {
    console.error("Error fetching CSV:", error);
    } finally {
    setLoading(false);
    }
};

fetchCSVData();
}, []);

const calculateSummary = (status) => {
const filtered = records.filter((record) => record.status === status);
const total = filtered.reduce(
    (sum, record) => sum + (parseFloat(record.finalTotal) || 0),
    0
);
return total.toFixed(2);
};

const handleSummaryBoxClick = (status) => {
navigate(`/chart?status=${status}`);
};

return (
<div className="dashboard">
    <h1>Billing Dashboard</h1>
    {loading ? (
    <p>Loading data, please wait...</p>
    ) : (
    <>
        <div className="summary">
        <SummaryBox
            title="Paid"
            total={calculateSummary("Paid")}
            onClick={() => handleSummaryBoxClick("Paid")}
        />
        <SummaryBox
            title="Pending"
            total={calculateSummary("Pending")}
            onClick={() => handleSummaryBoxClick("Pending")}
        />
        <SummaryBox
            title="Overdue"
            total={calculateSummary("Overdue")}
            onClick={() => handleSummaryBoxClick("Overdue")}
        />
        </div>
        <TasksWidget />
    </>
    )}
</div>
);
};

export default Dashboard;
