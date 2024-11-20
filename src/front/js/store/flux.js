const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            user: null, // Stores the logged-in user's data
            token: localStorage.getItem("jwt-token") || null, // Stores JWT token
        },
        actions: {
            setUser: (user) => {
                setStore({ user }); // Save user info in the store
            },
            logout: () => {
                localStorage.removeItem("jwt-token"); // Clear the token from localStorage
                setStore({ user: null, token: null }); // Clear user and token in the store
            },
            
            login: async (email, password) => {
                const response = await fetch("https://potential-space-spoon-wr96qxw99x79fgrj5-3001.app.github.dev/token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (!response.ok) {
                    if (response.status === 401) throw new Error("Invalid credentials");
                    throw new Error("An error occurred during login");
                }

                const data = await response.json();
                localStorage.setItem("jwt-token", data.token); // Save token
                setStore({ user: { id: data.user_id, email }, token: data.token }); // Update global store
                return data;
            },
        },
    };
};

export default getState;
