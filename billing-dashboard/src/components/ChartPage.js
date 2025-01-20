import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import Papa from "papaparse"; 
import {
Chart as ChartJS,
BarElement,
CategoryScale,
LinearScale,
Tooltip,
Legend,
} from "chart.js";
import "../styles/chartPage.css";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ChartPage = () => {
const location = useLocation();
const navigate = useNavigate();
const [records, setRecords] = useState([]);
const [loading, setLoading] = useState(true);
const [status, setStatus] = useState("");

// Extract the status from the query parameter
useEffect(() => {
const queryParams = new URLSearchParams(location.search);
const statusParam = queryParams.get("status");
setStatus(statusParam || "");
}, [location]);

// Fetch data from the CSV file
useEffect(() => {
const fetchCSVData = async () => {
    try {
    // Fetch the CSV file
    const response = await fetch("/billing_records.csv");
    const csvText = await response.text();

    // Parse CSV using PapaParse
    Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
        const filteredRecords = result.data.filter(
            (record) => record.status === status
        );
        setRecords(filteredRecords);
        },
    });
    } catch (error) {
    console.error("Error fetching CSV:", error);
    } finally {
    setLoading(false);
    }
};

if (status) {
    fetchCSVData();
}
}, [status]);

// Prepare data for the chart
const chartData = {
labels: records.map((record) => record.businessName),
datasets: [
    {
    label: `${status} Invoices`,
    data: records.map((record) => parseFloat(record.finalTotal) || 0),
    backgroundColor: "#4CAF50",
    hoverBackgroundColor: "#FFC107",
    },
],
};

const chartOptions = {
responsive: true,
maintainAspectRatio: false, // Allow the chart to scale
plugins: {
    legend: {
    display: true,
    position: "top",
    },
    tooltip: {
    callbacks: {
        label: (tooltipItem) =>
        `Total: $${tooltipItem.raw.toFixed(2)}`, // Format tooltip value
    },
    },
},
onClick: (event, elements) => {
    if (elements.length > 0) {
    const index = elements[0].index; // Get clicked bar index
    const businessName = chartData.labels[index];
    navigate(`/clients?businessName=${businessName}`); // Navigate to client page
    }
},
};

return (
<div className="chart-page">
    <h1>{status} Invoices</h1>
    {loading ? (
    <p>Loading data, please wait...</p>
    ) : records.length === 0 ? (
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
