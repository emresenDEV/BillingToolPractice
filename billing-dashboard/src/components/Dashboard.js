import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SummaryBox from "./SummaryBox";
import TasksWidget from "./TasksWidget";
import "../styles/dashboard.css";

const Dashboard = () => {
const [records, setRecords] = useState([]);
const [loading, setLoading] = useState(true);
const navigate = useNavigate();

// Fetch data from the backend
useEffect(() => {
const fetchData = async () => {
    try {
    const response = await fetch("http://localhost:5001/api/data");
    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const data = await response.json();
    setRecords(data);
    } catch (error) {
    console.error("Error fetching data:", error);
    } finally {
    setLoading(false);
    }
};

fetchData();
}, []);

// Calculate totals for each status
const calculateSummary = (status) => {
const filtered = records.filter((record) => record.status === status);
const total = filtered.reduce(
    (sum, record) => sum + (record.finalTotal || 0),
    0
);
return total.toFixed(2);
};

// Handle clicks on summary boxes
const handleSummaryBoxClick = (status) => {
navigate(`/chart?status=${status}`); // Redirect to chart with a query parameter
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
