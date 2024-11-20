import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const Login = () => {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        try {
            // Send POST request to retrieve the token
            const response = await fetch("https://potential-space-spoon-wr96qxw99x79fgrj5-3001.app.github.dev/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Indicate JSON data
                },
                body: JSON.stringify({ email, password }), // Send email and password
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Invalid email or password");
                } else {
                    throw new Error("An error occurred during login");
                }
            }

            const data = await response.json(); // Parse JSON response
            localStorage.setItem("jwt-token", data.token); // Store token in localStorage

            // Save user information (if needed) into the global store
            actions.setUser({ id: data.user_id, email }); // Replace setUid with setUser

            setError(""); // Clear any errors
            alert("Login successful!"); // Notify user
            navigate("/"); // Redirect to home page
        } catch (err) {
            setError(err.message); // Display error message
        }
    };

    return (
        <div id="login-container">
            <h2>Login</h2>
            <form id="login-form" onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
<button type="submit" id="login-button">
    <Link to="/protectedpage" style={{ textDecoration: "none", color: "inherit" }}>
        Login
    </Link>
</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};
