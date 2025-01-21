import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/clientProfile.css";

const ClientProfile = () => {
const location = useLocation();
const navigate = useNavigate();
const clientData = location.state?.client;

const [isEditing, setIsEditing] = useState(false);
const [client, setClient] = useState(clientData);

if (!client) {
return <p>No client selected. Please go back to the search page.</p>;
}

const handleEditToggle = () => setIsEditing(!isEditing);

const handleInputChange = (e) => {
const { name, value } = e.target;
setClient({ ...client, [name]: value });
};

const handleSave = async () => {
try {
    const response = await fetch(
    "https://6chdvkf5aa.execute-api.us-east-2.amazonaws.com/clients",
    {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([client]), // Send client as an array for the API
    }
    );

    if (!response.ok) {
    throw new Error("Failed to save client details.");
    }

    setIsEditing(false);
    alert("Client details saved successfully!");
} catch (error) {
    console.error("Error saving client details:", error);
    alert("Error saving client details.");
}
};

return (
<div className="client-profile">
    <h1>Client Profile</h1>
    <div className="client-details">
    <label>
        Business Name:
        {isEditing ? (
        <input
            type="text"
            name="businessName"
            value={client.businessName}
            onChange={handleInputChange}
        />
        ) : (
        <span>{client.businessName}</span>
        )}
    </label>
    <label>
        Phone Number:
        {isEditing ? (
        <input
            type="text"
            name="phoneNumber"
            value={client.phoneNumber}
            onChange={handleInputChange}
        />
        ) : (
        <span>{client.phoneNumber}</span>
        )}
    </label>
    <label>
        Email:
        {isEditing ? (
        <input
            type="email"
            name="email"
            value={client.email}
            onChange={handleInputChange}
        />
        ) : (
        <span>{client.email}</span>
        )}
    </label>
    <label>
        Address:
        {isEditing ? (
        <input
            type="text"
            name="address"
            value={client.address}
            onChange={handleInputChange}
        />
        ) : (
        <span>{client.address}</span>
        )}
    </label>
    <label>
        State:
        {isEditing ? (
        <input
            type="text"
            name="state"
            value={client.state}
            onChange={handleInputChange}
        />
        ) : (
        <span>{client.state}</span>
        )}
    </label>
    <label>
        Zip Code:
        {isEditing ? (
        <input
            type="text"
            name="zipcode"
            value={client.zipcode}
            onChange={handleInputChange}
        />
        ) : (
        <span>{client.zipcode}</span>
        )}
    </label>
    </div>
    <div className="actions">
    {isEditing ? (
        <>
        <button onClick={handleSave}>Save</button>
        <button onClick={handleEditToggle}>Cancel</button>
        </>
    ) : (
        <button onClick={handleEditToggle}>Edit Profile</button>
    )}
    <button onClick={() => navigate(-1)}>Back to Search</button>
    </div>
</div>
);
};

export default ClientProfile;
