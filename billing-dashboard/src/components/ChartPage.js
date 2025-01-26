import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
Chart as ChartJS,
BarElement,
CategoryScale,
LinearScale,
Tooltip,
Legend,
} from "chart.js";
import config from "../utils/config"; // Import config for baseURL

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ChartPage = () => {
const location = useLocation();
const navigate = useNavigate();
const [records, setRecords] = useState([]);
const [loading, setLoading] = useState(true);
const [status, setStatus] = useState("");

// Extract status from query parameters
useEffect(() => {
const queryParams = new URLSearchParams(location.search);
const statusParam = queryParams.get("status");
setStatus(statusParam || "");
}, [location]);

// Fetch filtered data from the backend
useEffect(() => {
const fetchData = async () => {
    try {
    const response = await fetch(`${config.baseURL}/api/data`);
    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const data = await response.json();
    const filteredData = data.filter((record) => record.status === status);
    setRecords(filteredData);
    } catch (error) {
    console.error("Error fetching data:", error);
    } finally {
    setLoading(false);
    }
};

fetchData();
}, [status]);

// Chart data configuration
const chartData = {
labels: records.map((record) => record.businessName),
datasets: [
    {
    label: `${status} Invoices`,
    data: records.map((record) => record.finalTotal),
    backgroundColor: "#4CAF50",
    hoverBackgroundColor: "#FFC107",
    },
],
};

// Chart options configuration
const chartOptions = {
responsive: true,
plugins: {
    legend: {
    display: true,
    position: "top",
    },
    tooltip: {
    callbacks: {
        label: (tooltipItem) => `Total: $${tooltipItem.raw.toFixed(2)}`,
    },
    },
},
onClick: (event, elements) => {
    if (elements.length > 0) {
    const index = elements[0].index;
    const businessName = chartData.labels[index];
    navigate(`/clients?businessName=${businessName}`); // Navigate to client page
    }
},
};

if (loading) return <p>Loading data, please wait...</p>;

return (
<div className="chart-page">
    <h1>{status} Invoices</h1>
    {records.length === 0 ? (
    <p>No {status} invoices available.</p>
    ) : (
    <div style={{ height: "500px", width: "100%" }}>
        <Bar data={chartData} options={chartOptions} />
    </div>
    )}
</div>
);
};

export default ChartPage;
