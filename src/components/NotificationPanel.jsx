import React, { useState } from "react";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  List,
  ListItem,
  Typography,
  Paper,
  Collapse,
  Divider,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DoneAllIcon from "@mui/icons-material/DoneAll";

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    width: 400,
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
}));

const StyledListItem = styled(ListItem)(({ theme, isRead }) => ({
  backgroundColor: isRead ? "transparent" : theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  padding: theme.spacing(2),
  transition: theme.transitions.create(["background-color", "box-shadow"]),
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

const ScrollableBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: 8,
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0,0,0,.2)",
    borderRadius: 4,
  },
}));

const NotificationPanel = ({ notifications, onNotificationClick, anchorEl, onMenuClose, onMarkAllRead }) => {
  const [expandedNotificationId, setExpandedNotificationId] = useState(null);

  const handleExpandClick = (notificationId) => {
    setExpandedNotificationId((prevId) =>
      prevId === notificationId ? null : notificationId
    );
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Ensure notifications is an array and handle edge cases
  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadCount = safeNotifications.filter(notification => notification && !notification.isRead).length;

  return (
    <>
      <IconButton color="inherit" onClick={onNotificationClick}>
        <Badge
          badgeContent={unreadCount}
          color="error"
          variant="standard"
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Notifications</Typography>
          <Button
            startIcon={<DoneAllIcon />}
            onClick={onMarkAllRead}
            size="small"
            sx={{ textTransform: "none" }}
          >
            Mark all as read
          </Button>
        </Box>
        <ScrollableBox>
          {safeNotifications.length === 0 ? (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                No new notifications
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 2 }}>
              {safeNotifications.slice().reverse().map((notification) => (
                <StyledListItem
                  key={notification?.notificationId || Math.random()}
                  read={notification?.isRead}
                  disablePadding
                >
                  <Box sx={{ width: "100%" }}>
                    <Box sx={{ mb: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: notification?.isRead ? 400 : 600,
                        }}
                      >
                        {notification?.title || "New Notification"}
                      </Typography>
                    </Box>
                    <Collapse
                      in={expandedNotificationId === notification?.notificationId}
                      collapsedSize={40}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {notification?.message || "No message content"}
                      </Typography>
                    </Collapse>
                    <Box
                      sx={{
                        mt: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        size="small"
                        onClick={() => handleExpandClick(notification?.notificationId)}
                        endIcon={
                          expandedNotificationId === notification?.notificationId ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )
                        }
                      >
                        {expandedNotificationId === notification?.notificationId
                          ? "Show less"
                          : "Read more"}
                      </Button>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(notification?.timestamp)}
                      </Typography>
                    </Box>
                  </Box>
                </StyledListItem>
              ))}
            </List>
          )}
        </ScrollableBox>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={onMenuClose}
          >
            Close
          </Button>
        </Box>
      </StyledMenu>
    </>
  );
};

export default NotificationPanel;