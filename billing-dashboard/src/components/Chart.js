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

const Chart = ({ records = [] }) => {

const statusCounts = records.reduce(
(counts, record) => {
    if (record.status === "Paid") counts.paid += 1;
    if (record.status === "Pending") counts.pending += 1;
    if (record.status === "Overdue") counts.overdue += 1;
    return counts;
},
{ paid: 0, pending: 0, overdue: 0 }
);

const data = {
labels: ["Paid", "Pending", "Overdue"],
datasets: [
    {
    label: "Invoice Status Count",
    data: [statusCounts.paid, statusCounts.pending, statusCounts.overdue],
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
    {records.length === 0 ? (
    <p>No data available for the chart.</p>
    ) : (
    <Bar data={data} options={options} />
    )}
</div>
);
};

export default Chart;
