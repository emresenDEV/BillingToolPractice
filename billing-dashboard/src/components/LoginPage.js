import React, { useState } from "react";
import "../styles/login.css";

const LoginPage = ({ onLogin }) => {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");

const handleLogin = async (e) => {
e.preventDefault();
setError("");

try {
    const response = await fetch(
    "https://6chdvkf5aa.execute-api.us-east-2.amazonaws.com/login",
    {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    }
    );

    if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error || "Invalid login");
    }

    const data = await response.json();
    onLogin({ username }); // Pass username to parent
    alert(data.message);
} catch (err) {
    setError(err.message);
}
};

const handleForgotPassword = async () => {
setError("");

try {
    const response = await fetch(
    "https://6chdvkf5aa.execute-api.us-east-2.amazonaws.com/forgot-password",
    {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
    }
    );

    if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error || "Failed to send password.");
    }

    const data = await response.json();
    alert(data.message);
} catch (err) {
    setError(err.message);
}
};

return (
<div className="login-container">
    <h1>Login</h1>
    <form onSubmit={handleLogin}>
    <div>
        <label>Username:</label>
        <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        />
    </div>
    <div>
        <label>Password:</label>
        <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        />
    </div>
    <button type="submit">Login</button>
    <button type="button" onClick={handleForgotPassword}>
        Forgot Password
    </button>
    </form>
    {error && <p className="error">{error}</p>}
</div>
);
};

export default LoginPage;
