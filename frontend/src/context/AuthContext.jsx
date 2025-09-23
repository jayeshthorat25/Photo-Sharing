import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser } from "@/lib/api";

export const INITIAL_USER = {
	id: "",
	name: "",
	username: "",
	email: "",
	imageUrl: "",
	bio: "",
};

const INITIAL_STATE = {
	user: INITIAL_USER,
	isLoading: false,
	isAuthenticated: false,
	setUser: () => {},
	setIsAuthenticated: () => {},
	checkAuthUser: async () => false,
};

const AuthContext = createContext(INITIAL_STATE);

export function AuthProvider({ children }) {
	const navigate = useNavigate();
	const [user, setUser] = useState(INITIAL_USER);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const checkAuthUser = async () => {
		setIsLoading(true);
		try {
			const token = localStorage.getItem("jwt_access_token");
			if (!token) {
				setIsAuthenticated(false);
				return false;
			}

			const current = await getCurrentUser();
			if (current) {
				setUser({
					id: String(current.id),
					name: current.name,
					username: current.username,
					email: current.email,
					imageUrl: current.imageUrl,
					bio: current.bio,
				});
				setIsAuthenticated(true);
				return true;
			}
			return false;
		} catch (error) {
			console.error('Auth check failed:', error);
			// Clear invalid token
			localStorage.removeItem("jwt_access_token");
			setIsAuthenticated(false);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const token = localStorage.getItem("jwt_access_token");
		if (token) {
			checkAuthUser();
		} else {
			// Only redirect to landing if we're not already on auth pages, landing, or shared posts
			const currentPath = window.location.pathname;
			if (!currentPath.includes('/sign-in') && 
				!currentPath.includes('/sign-up') && 
				!currentPath.includes('/forgot-password') &&
				!currentPath.includes('/reset-password/') &&
				!currentPath.includes('/shared/') && 
				currentPath !== '/') {
				navigate("/");
			}
		}
	}, []);

	const value = {
		user,
		setUser,
		isLoading,
		isAuthenticated,
		setIsAuthenticated,
		checkAuthUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
