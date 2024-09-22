import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axiosInstance from "../apis/AxiosInstance";
import { useDispatch } from "react-redux";
import { setLoading } from "../store/loaderSlice";
import WebSocketManager from "../utils/WebSocketManager";
import axios from "axios";
import WebSocketManagerChat from "../utils/WebSocketManagerChat";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken")
  );
  const [IdToken, setIdToken] = useState(localStorage.getItem("IdToken"));
  const [role, setRole] = useState(localStorage.getItem("userRole"));
  const [isConnected, setIsConnected] = useState(WebSocketManager.isConnected);
  const BASE_URI = process.env.REACT_APP_BASE_URL;
  const dispatch = useDispatch();

  const login = useCallback(
    (userData, authToken, refreshAuthToken, IdAuthToken, userRole) => {
      setUser(userData);
      setToken(authToken);
      setRefreshToken(refreshAuthToken);
      setIdToken(IdAuthToken);
      setRole(userRole);
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("refreshToken", refreshAuthToken);
      localStorage.setItem("IdToken", IdAuthToken);
      localStorage.setItem("userRole", userRole);

      // Connect WebSocket if not connected
      if (!WebSocketManager.isConnected) {
        WebSocketManager.connect();
      }

      if (!WebSocketManagerChat.isConnected) {
        WebSocketManagerChat.connect();
      }
    },
    []
  );

  const logout = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const response = await axios.post(`${BASE_URI}/common/logout`, {
        accessToken: token,
      });
      console.log("RES: ", response);
      setUser(null);
      setToken(null);
      setRefreshToken(null);
      setIdToken(null);
      setRole(null);
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("IdToken");
      localStorage.removeItem("userRole");

      // Disconnect WebSocket
      WebSocketManager.disconnect();
      WebSocketManagerChat.disconnect();
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error logging out:", error);
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("IdToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("wsConnected");
      localStorage.removeItem("wsConnectedChat");
      dispatch(setLoading(false));
    }
  }, [BASE_URI, dispatch, token]);

  const refreshAuthToken = async () => {
    try {
      const response = await fetch(`${BASE_URI}/common/login`, {
        method: "POST",
        headers: `Bearer ${token}`,
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const data = await response.json();
        const newAuthToken = data.AuthenticationResult.AccessToken;
        setToken(newAuthToken);
        localStorage.setItem("authToken", newAuthToken);
      } else {
        // logout();
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      logout();
    }
  };

  // Ensure WebSocket connects if logged in, and reconnect after refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      WebSocketManager.disconnect();
    };

    // Check if the user is still logged in
    if (token && !WebSocketManager.isConnected) {
      WebSocketManager.connect();
    }

    // Handle page refresh (unmount) - close the WebSocket
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // Cleanup event listener on unmount
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [token]);

  // Ensure WebSocket connects if logged in, and reconnect after refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      WebSocketManagerChat.disconnect();
    };

    // Check if the user is still logged in
    if (token && !WebSocketManagerChat.isConnected) {
      WebSocketManagerChat.connect();
    }

    // Handle page refresh (unmount) - close the WebSocket
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // Cleanup event listener on unmount
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [token]);

  const contextValue = {
    user,
    token,
    role,
    login,
    logout,
    isConnected,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
