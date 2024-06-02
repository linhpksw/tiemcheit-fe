"use client";
import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "@/hooks";

// Initial user state when not logged in
const INIT_USER_STATE = {
    data: null,
};

// Create a context
const UserContext = createContext({
    user: INIT_USER_STATE,
    login: () => { },
    logout: () => { },
    updateUser: () => { },
});


// Custom hook to use the user context
export const useUserContext = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};

// Provider component that encapsulates the user logic
export const UserProvider = ({ children }) => {
    // Use a custom hook for persisting user data to localStorage
    const [user, setUser] = useLocalStorage("user", INIT_USER_STATE);

    // Function to handle user login
    const login = (userData) => {
        setUser({ data: userData });
    };

    // Function to handle user logout
    const logout = () => {
        setUser(INIT_USER_STATE);
    };

    // Function to update user data
    const updateUser = (updates) => {
        setUser((currentUser) => ({
            ...currentUser,
            data: { ...currentUser.data, ...updates },
        }));
    };

    // Memoizing the context value to optimize performance
    const value = useMemo(() => ({
        user,
        login,
        logout,
        updateUser
    }), [user]);

    // Provider component that passes the user state and control methods down the component tree
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
