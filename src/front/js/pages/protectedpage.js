import React, { useEffect, useState } from "react";

const ProtectedPage = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("jwt-token");

            try {
                const response = await fetch("https://potential-space-spoon-wr96qxw99x79fgrj5-3001.app.github.dev/protected", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    if (response.status === 403) {
                        throw new Error("Invalid or expired token");
                    }
                    throw new Error("Failed to fetch protected data");
                }

                const result = await response.json();
                setData(result); // Store fetched data
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
           <p>Hi!</p>
        </div>
    );
};

export default ProtectedPage;