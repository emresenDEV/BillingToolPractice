import React from "react";
import "../styles/summaryBox.css";

const SummaryBox = ({ title = "Title", total = "0.00", onClick }) => {

const formattedTotal = parseFloat(total).toFixed(2);

return (
<div
    className="summary-box"
    onClick={onClick}
    onKeyDown={(e) => e.key === "Enter" && onClick && onClick()}
    tabIndex="0"
    aria-label={`Summary box for ${title} with a total of $${formattedTotal}`}
>
    <h3 className="summary-title">{title}</h3>
    <p className="summary-total">${formattedTotal}</p>
</div>
);
};

export default SummaryBox;
