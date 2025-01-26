import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SummaryBox from "./SummaryBox";
import TasksWidget from "./TasksWidget";
import config from "../utils/config";
import "../styles/dashboard.css";

const Dashboard = () => {
const [records, setRecords] = useState([]);
const [loading, setLoading] = useState(true);
const navigate = useNavigate();

useEffect(() => {
const fetchRecords = async () => {
    try {
    // Fetch records from the Flask backend
    const response = await fetch(`${config.baseURL}/api/data`);
    if (!response.ok) {
        throw new Error("Failed to fetch records.");
    }
    const data = await response.json();
    setRecords(data); // Update state with the fetched records
    } catch (error) {
    console.error("Error fetching records:", error);
    } finally {
    setLoading(false);
    }
};

fetchRecords();
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
