import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  useTheme,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import WebSocketManager from "../utils/WebSocketManager";
import NotificationPanel from "./NotificationPanel";
import { getUserIdFromToken } from "../utils/auth";
import axios from "axios";
import axiosInstance from "../apis/AxiosInstance";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Header = ({ username, role, isSideNavOpen }) => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState([]);
  const { isConnected } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Africa/Johannesburg",
  });

  const getInitials = (name) => {
    const nameArray = name.split(" ");
    return nameArray.length >= 2
      ? `${nameArray[0][0]}${nameArray[1][0]}`
      : name[0];
  };

  const initials = getInitials(username);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userId = getUserIdFromToken();
        const response = await axiosInstance.get(`${BASE_URL}/notification/receiver/${userId}`);
        console.log("response", response)
        if (Array.isArray(response.data.data)) {
          setNotifications(response.data.data);
        } else {
          console.log("Received invalid notifications data:", response.data);
          setNotifications([]);
        }
      } catch (error) {
        console.log("Error fetching notifications:", error);
        setNotifications([]);
      }
    };

    fetchNotifications();

    const handleWebSocketEvent = (event, data) => {
      if (event === "message") {
        console.log("Received message:", data);
        const parsedData = JSON.parse(data);
        setNotifications(prevNotifications => [parsedData, ...prevNotifications]);
      }
    };

    if (!WebSocketManager.isConnected) {
      WebSocketManager.connect();
    }

    WebSocketManager.addListener(handleWebSocketEvent);

    return () => {
      WebSocketManager.removeListener(handleWebSocketEvent);
    };
  }, []);

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAllRead = async () => {
    try {
      const userId = getUserIdFromToken();
      await axiosInstance.put(`${BASE_URL}/notification/${userId}`);
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={4}
      sx={{
        width: { sm: `calc(100% - ${isSideNavOpen ? "300px" : "80px"})` },
        ml: { sm: isSideNavOpen ? "300px" : "80px" },
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <Typography variant="h6">{currentDate}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <NotificationPanel
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
            anchorEl={anchorEl}
            onMenuClose={handleMenuClose}
            onMarkAllRead={handleMarkAllRead}
          />
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            {username} | {role}
          </Typography>
          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
            {initials}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;