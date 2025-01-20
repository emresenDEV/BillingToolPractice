import React from "react";
import { Bar } from "react-chartjs-2";
import {
Chart as ChartJS,
BarElement,
CategoryScale,
LinearScale,
Tooltip,
Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Chart = ({ records }) => {
const filteredRecords = records.filter((record) => typeof record.status === "string");

const data = {
labels: ["Paid", "Pending", "Overdue"],
datasets: [
    {
    label: "Invoice Status Count",
    data: [
        filteredRecords.filter((r) => r.status === "Paid").length,
        filteredRecords.filter((r) => r.status === "Pending").length,
        filteredRecords.filter((r) => r.status === "Overdue").length,
    ],
    backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
    },
],
};

const options = {
responsive: true,
plugins: {
    legend: {
    display: true,
    position: "top",
    },
},
};

return (
<div>
    {filteredRecords.length === 0 ? (
    <p>No data available for the chart.</p>
    ) : (
    <Bar data={data} options={options} />
    )}
</div>
);
};

export default Chart;
