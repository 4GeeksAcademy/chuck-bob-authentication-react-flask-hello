import React, { useState } from "react";

export const Signup = () => {
    const [email, setEmail] = useState(""); // State for email
    const [password, setPassword] = useState(""); // State for password
    const [message, setMessage] = useState(""); // State for feedback message

    // Handle form submission
    const handleSubmit = async () => {
        try {
            const response = await fetch("https://potential-space-spoon-wr96qxw99x79fgrj5-3001.app.github.dev/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, is_active: true }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage("User created successfully!");
                setEmail(""); // Clear email input
                setPassword(""); // Clear password input
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || "Error creating user.");
            }
        } catch (error) {
            setMessage("An unexpected error occurred.");
        }
    };

    return (
        <div id="signup-container">
            <h2>Signup</h2>
            <form id="signup-form" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="button" id="signup-button" onClick={handleSubmit}>
                    Signup
                </button>
            </form>
            <div id="message" style={{ color: message === "User created successfully!" ? "green" : "red" }}>
                {message}
            </div>
        </div>
    );
};
