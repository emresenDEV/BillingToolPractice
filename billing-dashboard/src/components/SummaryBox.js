import React from "react";
import "../styles/summaryBox.css";

const SummaryBox = ({ title, total, onClick }) => {
return (
<div className="summary-box" onClick={onClick}>
    <h3 className="summary-title">{title}</h3>
    <p className="summary-total">${total}</p>
</div>
);
};

export default SummaryBox;
