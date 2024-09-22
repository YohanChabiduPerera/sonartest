import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  useTheme,
} from "@mui/material";
import {
  Dashboard,
  Description,
  Assignment,
  People,
  Settings,
  ExitToApp,
  Build,
  Chat,
  CorporateFare,
  Troubleshoot,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { useAuth } from "../contexts/AuthContext";

const SideNavigation = ({ role, open, toggleDrawer }) => {
  // const [open, setOpen] = useState(true);
  const location = useLocation();
  const theme = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // const toggleDrawer = () => {
  //   setOpen(!open);
  // };

  const isRouteActive = (path) => {
    const currentPath = location.pathname;
    if (!path) return false;
    if (path === "/") return currentPath === "/";
    if (path.startsWith("/document"))
      return currentPath.startsWith("/document");
    if (path.startsWith("/case")) return currentPath.startsWith("/case");
    if (path.startsWith("/users")) {
      return (
        currentPath.startsWith("/users") ||
        currentPath.startsWith("/user-add") ||
        currentPath.startsWith("/user-update") ||
        currentPath.startsWith("/user-view")
      );
    }
    return currentPath.startsWith(path);
  };

  const adminMenuItems = [
    { text: "Dashboard", icon: <Dashboard />, link: "/dashboard" },
    { text: "Document Management", icon: <Description />, link: "/document" },
    { text: "Case Management", icon: <Assignment />, link: "/case" },
    { text: "Users", icon: <People />, link: "/users" },
    { text: "Chat", icon: <Chat />, link: "/chat" },
  ];

  const attorneyMenuItems = [
    { text: "Dashboard", icon: <Dashboard />, link: "/attDash" },
    { text: "My Cases", icon: <Assignment />, link: "/attorney" },
    { text: "My Documents", icon: <Description />, link: "/attDocument" },
    { text: "Chat", icon: <Chat />, link: "/chat" },
  ];
  const expertMenuItems = [
    { text: "Dashboard", icon: <Dashboard />, link: "/expDash" },
    { text: "My Cases", icon: <Assignment />, link: "/expert" },
    { text: "My Documents", icon: <Description />, link: "/expDocument" },
    { text: "Chat", icon: <Chat />, link: "/chat" },
  ];
  const superAdminMenuItems = [
    { text: "Dashboard", icon: <Dashboard />, link: "/superAdmin/dashboard" },
    { text: "Case Management", icon: <Assignment />, link: "/case" },
    { text: "Document Management", icon: <Description />, link: "/document" },
    { text: "Users", icon: <People />, link: "/users" },
    {
      text: "Audit Trail",
      icon: <Troubleshoot />,
      link: "/superAdmin/auditTrail",
    },
    { text: "Admins", icon: <People />, link: "/admin" },
    { text: "Companies", icon: <CorporateFare />, link: "/company" },
  ];

  const bottomMenuItems = [
    { text: "Support", icon: <Build />, link: "" },
    { text: "Settings", icon: <Settings />, link: "" },
    { text: "Logout", icon: <ExitToApp />, onClick: handleLogout },
  ];

  let menuItems = [];
  if (role === "admin") {
    menuItems = adminMenuItems;
  } else if (role === "attorney") {
    menuItems = attorneyMenuItems;
  } else if (role === "expert") {
    menuItems = expertMenuItems;
  } else if (role === "super_admin") {
    menuItems = superAdminMenuItems;
  }

  const renderListItems = (items) =>
    items.map((item) => (
      <ListItem
        button
        key={item.text}
        component={item.onClick ? "div" : Link}
        to={item.link}
        onClick={item.onClick}
        selected={item.link ? isRouteActive(item.link) : false}
        sx={{
          paddingLeft: open ? 3 : 2,
          justifyContent: open ? "flex-start" : "center",
          py: 2,
          backgroundColor:
            item.link && isRouteActive(item.link)
              ? theme.palette.action.selected
              : "transparent",
          "& .MuiListItemIcon-root": {
            color:
              item.link && isRouteActive(item.link)
                ? theme.palette.primary.main
                : theme.palette.text.primary,
          },
          "& .MuiListItemText-primary": {
            color:
              item.link && isRouteActive(item.link)
                ? theme.palette.primary.main
                : theme.palette.text.primary,
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            justifyContent: "center",
            marginRight: open ? 2 : 0,
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.text}
          sx={{ display: open ? "block" : "none" }}
        />
      </ListItem>
    ));

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? 300 : 80,
        transition: "width 0.3s",
        overflow: "hidden",
        "& .MuiDrawer-paper": {
          width: open ? 300 : 80,
          transition: "width 0.3s",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        },
      }}
    >
      <Box sx={{ flexGrow: 0 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          padding={1}
          ml={1.5}
        >
          <img
            src={logo}
            alt="Logo"
            onClick={toggleDrawer}
            style={{ cursor: "pointer", width: open ? "40px" : "40px" }}
          />
          <Typography
            variant="h6"
            noWrap
            sx={{
              display: open ? "block" : "none",
              flexGrow: 1,
              ml: 1,
              fontWeight: "bold",
              color: theme.palette.text.primary,
            }}
          >
            Medico Online
          </Typography>
        </Box>
        <List>{renderListItems(menuItems)}</List>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 0 }}>
        <Divider />
        <List>{renderListItems(bottomMenuItems)}</List>
      </Box>
    </Drawer>
  );
};

export default SideNavigation;
