import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Typography,
  Avatar,
  CircularProgress,
  Snackbar,
  Checkbox,
  FormControlLabel,
  Badge,
} from "@mui/material";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
import { LuSendHorizonal } from "react-icons/lu";
import { Search, AttachFile, EmojiEmotions } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import WebSocketManagerChat from "../utils/WebSocketManagerChat";
import { getUserIdFromToken, getUserRoleFromToken } from "../utils/auth";
import { GetAllAttorneys, GetAllExperts } from "../apis/UserManagementAPI";
import { GetAllAdmins } from "../apis/AdminManagementAPI";
import axiosInstance from "../apis/AxiosInstance";

const drawerWidth = 280;

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: drawerWidth,
  height: "100%",
  overflow: "auto",
  borderRight: `1px solid ${theme.palette.divider}`,
  "&::-webkit-scrollbar": {
    width: "0.4em",
  },
  "&::-webkit-scrollbar-track": {
    boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0,0,0,.1)",
    outline: "1px solid slategrey",
  },
}));

const MessageBubble = styled(Paper)(({ theme, isUser }) => ({
  padding: theme.spacing(1, 2),
  maxWidth: "70%",
  borderRadius: 20,
  backgroundColor: isUser
    ? theme.palette.primary.main
    : theme.palette.background.paper,
  color: isUser
    ? theme.palette.primary.contrastText
    : theme.palette.text.primary,
  alignSelf: isUser ? "flex-end" : "flex-start",
  marginBottom: theme.spacing(1),
}));

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [chatList, setChatList] = useState([]);
  const messagesEndRef = useRef(null);
  const currentUserRole = getUserRoleFromToken();

  const [showAttorneys, setShowAttorneys] = useState(true);
  const [showExperts, setShowExperts] = useState(true);

  const fetchUserLists = async (role) => {
    setIsLoading(true);
    try {
      let users = [];
      if (role === "admin") {
        const attorneys = await GetAllAttorneys();
        const experts = await GetAllExperts();
        users = [
          ...attorneys.data.data.map((a) => ({
            id: a.attorney_id,
            name: `${a.first_name} ${a.last_name}`,
            role: "attorney",
          })),
          ...experts.data.data.map((e) => ({
            id: e.expert_id,
            name: `${e.first_name} ${e.last_name}`,
            role: "expert",
          })),
        ];
      } else if (role === "attorney" || role === "expert") {
        const admins = await GetAllAdmins();
        console.log("admins", admins);
        users = admins.data.map((a) => ({
          id: a.admin_id,
          name: `${a.first_name} ${a.last_name}`,
          role: "admin",
        }));
      }
      setChatList(users);
    } catch (error) {
      console.error("Error fetching user lists:", error);
      setError("Failed to fetch user lists. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const currentUserId = getUserIdFromToken();
    setUserId(currentUserId);
    setUserRole(currentUserRole);
    fetchUserLists(currentUserRole);
    setUserId(currentUserId);

    if (!WebSocketManagerChat.isConnected) {
      WebSocketManagerChat.connect();
    }
  }, []);

  const [unreadMessages, setUnreadMessages] = useState({});

  useEffect(() => {
    const handleWebSocketMessage = (event, data) => {
      console.log("receivedMessage", data);
      if (event === "message") {
        const receivedMessage = JSON.parse(data);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: receivedMessage.messageText,
            sender: receivedMessage.senderId === userId ? "user" : "other",
            recipient: receivedMessage.receiverId,
            timestamp: receivedMessage.timestamp,
          },
        ]);

        if (receivedMessage.senderId !== userId) {
          setUnreadMessages((prev) => ({
            ...prev,
            [receivedMessage.senderId]:
              (prev[receivedMessage.senderId] || 0) + 1,
          }));
        }
      }
    };

    WebSocketManagerChat.addListener(handleWebSocketMessage);

    return () => {
      WebSocketManagerChat.removeListener(handleWebSocketMessage);
    };
  }, [userId]);

  const handleSendMessage = useCallback(() => {
    console.log("currentMessage", currentMessage);

    if (
      currentMessage.trim() !== "" &&
      WebSocketManagerChat.isConnected && 
      selectedPerson &&
      userId &&
      WebSocketManagerChat.socket
    ) {
      setIsLoading(true);
      const messageData = {
        action: "sendMessage",
        senderId: userId,
        receiverId: selectedPerson.id,
        messageText: currentMessage,
      };

      console.log("messageData", messageData);
      WebSocketManagerChat.socket.send(JSON.stringify(messageData)); 

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: currentMessage,
          sender: "user",
          recipient: selectedPerson.id,
          timestamp: new Date().toISOString(), 
        },
      ]);
      setCurrentMessage("");
      setIsLoading(false);
    } else {
      setError("Message or connection is invalid.");
    }
  }, [currentMessage, selectedPerson, userId]);

  const handleChatClick = useCallback(
    async (person) => {
      setSelectedPerson(person);
      setIsLoading(true);
      navigate("/chat");

      setUnreadMessages((prev) => ({
        ...prev,
        [person.id]: 0,
      }));

      const requestData = {
        senderId: userId,
        receiverId: person.id,
      };

      try {
        const response = await axiosInstance.post(
          `https://l6hs8gg5ki.execute-api.af-south-1.amazonaws.com/dev/v1/notification/conversation`,
          requestData
        );

        const chatHistory = response.data.data;

        if (Array.isArray(chatHistory) && chatHistory.length > 0) {
          const formattedMessages = chatHistory.map((message) => ({
            text: message.messageText,
            sender: message.senderId === userId ? "user" : "other",
            recipient: message.receiverId,
            timestamp: message.timestamp,
          }));

          setMessages(formattedMessages);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
        setError("Failed to load chat history. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [userId, navigate, setMessages, setError, setIsLoading]
  );

  const filteredChatList = chatList.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      ((userRole === "admin" &&
        ((showAttorneys && person.role === "attorney") ||
          (showExperts && person.role === "expert"))) ||
        userRole !== "admin")
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ display: "flex", height: "90vh", bgcolor: "background.default" }}
      >
        <StyledPaper elevation={3}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Chats
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Search chats"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search color="action" />,
              }}
            />
            {userRole === "admin" && (
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showAttorneys}
                      onChange={(e) => setShowAttorneys(e.target.checked)}
                    />
                  }
                  label="Attorneys"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showExperts}
                      onChange={(e) => setShowExperts(e.target.checked)}
                    />
                  }
                  label="Experts"
                />
              </Box>
            )}
          </Box>
          <List>
            {filteredChatList.map((person) => (
              <ListItem
                key={person.id}
                button
                onClick={() => handleChatClick(person)}
                selected={selectedPerson?.id === person.id}
              >
                <Badge
                  badgeContent={unreadMessages[person.id] || 0}
                  color="primary"
                  sx={{ mr: 2 }}
                >
                  <Avatar sx={{ width: 40, height: 40, bgcolor: "black" }}>
                    {person.name.charAt(0)}
                  </Avatar>
                </Badge>
                <ListItemText
                  primary={person.name}
                  secondary={person.role}
                  primaryTypographyProps={{ fontWeight: "medium" }}
                  secondaryTypographyProps={{ noWrap: true }}
                />
              </ListItem>
            ))}
          </List>
        </StyledPaper>

        <Box
          sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 2 }}
        >
          {selectedPerson ? (
            <>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                {selectedPerson.name}
              </Typography>
              <Paper sx={{ flexGrow: 1, overflow: "auto", p: 2, mb: 2 }}>
                {isLoading ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <List>
                    {messages.map((message, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent:
                            message.sender === "user"
                              ? "flex-end"
                              : "flex-start",
                        }}
                      >
                        <MessageBubble isUser={message.sender === "user"}>
                          <Typography>{message.text}</Typography>
                          <Typography
                            variant="caption"
                            display="block"
                            textAlign="right"
                            mt={0.5}
                          >
                            {moment(message.timestamp).format("LT")}
                          </Typography>
                        </MessageBubble>
                      </ListItem>
                    ))}
                    <div ref={messagesEndRef} />
                  </List>
                )}
              </Paper>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  fullWidth
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && !e.shiftKey && handleSendMessage()
                  }
                  placeholder="Type a message..."
                  variant="outlined"
                  size="small"
                  multiline
                  maxRows={4}
                  InputProps={{
                    endAdornment: (
                      <>
                        <EmojiEmotions
                          color="action"
                          sx={{ cursor: "pointer", mr: 1 }}
                        />
                      </>
                    ),
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  sx={{ ml: 1, minWidth: "auto" }}
                >
                  <LuSendHorizonal
                    size={24}
                    color={theme.palette.primary.main}
                  />
                </Button>
              </Box>
            </>
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <Typography variant="h6" color="text.secondary">
                Select a chat to start messaging
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
    </ThemeProvider>
  );
};

export default Chat;
