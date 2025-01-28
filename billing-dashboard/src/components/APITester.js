import React from "react";
import config from "../utils/config";

const APITester = () => {
const testAPI = async () => {
try {
    const response = await fetch(`${config.baseURL}${config.endpoints.clients}`);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
    const data = await response.json();
    console.log("Test API Response:", data);
} catch (error) {
    console.error("Error testing API:", error);
}
};

return (
<div>
    <h1>API Tester</h1>
    <button onClick={testAPI}>Test API</button>
</div>
);
};

export default APITester;
