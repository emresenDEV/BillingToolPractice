import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SummaryBox from "./SummaryBox";
import TasksWidget from "./TasksWidget";
import config from "../utils/config";
import "../styles/dashboard.css";

const Dashboard = () => {
const [records, setRecords] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null); 
const navigate = useNavigate();

useEffect(() => {
const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
    const response = await fetch(`${config.baseURL}${config.endpoints.billingRecords}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch records: ${response.statusText}`);
    }
    const data = await response.json();
    setRecords(data); 
    } catch (err) {
    console.error("Error fetching records:", err);
    setError("Failed to load data. Please try again later.");
    } finally {
    setLoading(false);
    }
};

fetchRecords();
}, []);

const calculateSummary = (status) => {
const filtered = records.filter((record) => record.status === status);
const total = filtered.reduce((sum, record) => {
    const finalTotal = parseFloat(record.finalTotal);
    return sum + (isNaN(finalTotal) ? 0 : finalTotal);
}, 0);
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
    ) : error ? (
    <p className="error">{error}</p> 
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
