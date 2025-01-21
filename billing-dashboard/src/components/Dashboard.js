import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
        const response = await fetch("https://6chdvkf5aa.execute-api.us-east-2.amazonaws.com/billing-records", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        });
    
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        setRecords(data);
    } catch (error) {
        console.error("Error fetching data:", error);
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
