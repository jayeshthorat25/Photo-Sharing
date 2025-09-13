import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/assets/images/')) return imageUrl; // Local frontend path
  return `${API_BASE_URL}${imageUrl}`;
};

export const api = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: false,
});

export const setAuthToken = (token) => {
	if (token) {
		api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		localStorage.setItem("jwt_access_token", token);
	} else {
		delete api.defaults.headers.common["Authorization"];
		localStorage.removeItem("jwt_access_token");
	}
};


const saved = localStorage.getItem("jwt_access_token");
if (saved) setAuthToken(saved);
