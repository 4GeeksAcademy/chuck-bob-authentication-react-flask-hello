import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
    const { actions } = useContext(Context); // Access global actions
    const navigate = useNavigate(); // Hook for navigation

    const handleLogout = () => {
        actions.logout(); // Call the logout action to clear the token
        navigate("/"); // Redirect the user to the / landing page page
    };

    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <span className="navbar-brand mb-0 h1">ChuckBob's Page</span>
                <div className="ml-auto">
                    <button className="btn btn-danger" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};
