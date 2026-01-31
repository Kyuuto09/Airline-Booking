import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loginUser = async (username, password) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (response.status === 200) {
            setAuthTokens(data);
            setUser({ username }); // In a real app, decode JWT or fetch user profile
            localStorage.setItem('authTokens', JSON.stringify(data));
            return { success: true };
        } else {
            return { success: false, error: data.detail || 'Something went wrong' };
        }
    };

    const registerUser = async (username, email, password) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        if (response.status === 201) {
            return { success: true };
        } else {
            const data = await response.json();
            // Format error messages
            let errorMessage = 'Registration failed';
            if (data.username) errorMessage = `Username: ${data.username[0]}`;
            else if (data.email) errorMessage = `Email: ${data.email[0]}`;
            else if (data.password) errorMessage = `Password: ${data.password[0]}`;
            
            return { success: false, error: errorMessage };
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        navigate('/');
    };

    const contextData = {
        user,
        authTokens,
        loginUser,
        registerUser,
        logoutUser
    };

    useEffect(() => {
        if (authTokens) {
            setUser({ username: "User" }); // Simple placeholder
        }
        setLoading(false);
    }, [authTokens]);

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
