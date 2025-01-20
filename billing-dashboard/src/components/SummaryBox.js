import React from "react";

const SummaryBox = ({ title, total, onClick }) => {
return (
<div className="summary-box" onClick={onClick}>
    <h3>{title}</h3>
    <p>${total}</p>
</div>
);
};

export default SummaryBox;
