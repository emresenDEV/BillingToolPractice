import React, { useState } from "react";
import config from "../utils/config";
import "../styles/newClient.css";

const NewClient = ({ onClientAdded }) => {
    const [formData, setFormData] = useState({
        businessName: "",
        contactName: "",
        phoneNumber: "",
        email: "",
        address: "",
        state: "",
        zipcode: "",
        industry: "",
        notes: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${config.baseURL}/api/create-client`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error creating client:", errorData);
                alert("Failed to create client. Please try again.");
                return;
            }

            const createdClient = await response.json();
            alert("Client created successfully!");
            if (onClientAdded) onClientAdded(createdClient);

            // Reset the form
            setFormData({
                businessName: "",
                contactName: "",
                phoneNumber: "",
                email: "",
                address: "",
                state: "",
                zipcode: "",
                industry: "",
                notes: "",
            });
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while creating the client.");
        }
    };

    return (
        <div className="new-client-container">
            <h2>Add New Client</h2>
            <form onSubmit={handleSubmit} className="new-client-form">
                <label>Business Name</label>
                <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Business Name"
                    required
                />
                <label>Contact Name</label>
                <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    placeholder="Contact Name"
                    required
                />
                <label>Phone Number</label>
                <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    required
                />
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    required
                />
                <label>Address</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                    required
                />
                <label>State</label>
                <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State (e.g., TX)"
                    required
                />
                <label>Zipcode</label>
                <input
                    type="text"
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={handleInputChange}
                    placeholder="Zipcode"
                    required
                />
                <label>Industry</label>
                <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    placeholder="Industry"
                    required
                />
                <label>Notes (Optional)</label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Enter any additional notes (optional)"
                />
                <button type="submit" className="submit-button">
                    Add Client
                </button>
            </form>
        </div>
    );
};

export default NewClient;
