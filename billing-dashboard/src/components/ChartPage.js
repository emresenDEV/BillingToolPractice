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
import config from "../utils/config";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ChartPage = () => {
const location = useLocation();
const navigate = useNavigate();
const [records, setRecords] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [status, setStatus] = useState("");

useEffect(() => {
const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
    // Extract status from query parameters
    const queryParams = new URLSearchParams(location.search);
    const statusParam = queryParams.get("status") || "";
    setStatus(statusParam);

    // Fetch data from the backend
    const response = await fetch(
        `${config.baseURL}${config.endpoints.billingRecords}?status=${statusParam}`
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    setRecords(data);
    } catch (err) {
    console.error("Error fetching data:", err);
    setError("Failed to load data. Please try again later.");
    } finally {
    setLoading(false);
    }
};

fetchData();
}, [location]);

// Chart data configuration
const chartData = {
labels: records.map((record) => record.businessName || "Unknown"),
datasets: [
    {
    label: `${status} Invoices`,
    data: records.map((record) => record.finalTotal || 0),
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
        label: (tooltipItem) =>
        `Total: $${tooltipItem.raw ? tooltipItem.raw.toFixed(2) : 0}`,
    },
    },
},
onClick: (event, elements) => {
    if (elements.length > 0) {
    const index = elements[0].index;
    const businessName = chartData.labels[index];
    navigate(`/clients?businessName=${businessName}`); // Nav to Client's Profile
    }
},
};

if (loading) return <p>Loading data, please wait...</p>;
if (error) return <p className="error">{error}</p>;

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
