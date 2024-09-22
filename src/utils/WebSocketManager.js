import { getUserIdFromToken } from "./auth";

class WebSocketManager {
  constructor() {
    this.socket = null;
    this.listeners = new Set();
    this.isConnected = false;

    // Check for an existing connection in localStorage
    const wsConnected = localStorage.getItem("wsConnected");
    if (wsConnected) {
      this.isConnected = true;
    }
  }

  connect() {
    // Check if there's already an active connection
    if (this.isConnected || this.socket) {
      console.log("WebSocket is already connected or in progress");
      return;
    }

    // this.socket = new WebSocket('ws://localhost:8080');
    this.socket = new WebSocket(`wss://whcdzgax28.execute-api.af-south-1.amazonaws.com/dev?userId=${getUserIdFromToken()}&type=notification`);
    // this.socket = new WebSocket(`wss://jkzj4cucyh.execute-api.af-south-1.amazonaws.com/dev?userId=${getUserIdFromToken()}`);


    this.socket.onopen = () => {
      console.log("Connected to the WebSocket server");
      this.isConnected = true;
      localStorage.setItem("wsConnected", true); // Mark the connection in localStorage
      this.notifyListeners('open');
    };

    this.socket.onmessage = (event) => {
      console.log("Received message:", event.data);
      this.notifyListeners('message', event.data);
    };

    this.socket.onclose = () => {
      console.log("WebSocket connection closed");
      this.isConnected = false;
      localStorage.removeItem("wsConnected"); // Remove connection status on close
      this.socket = null;
      this.notifyListeners('close');
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.isConnected = false;
      localStorage.removeItem("wsConnected");
      this.socket = null;
      this.notifyListeners('error', error);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.isConnected = false;
      localStorage.removeItem("wsConnected");
    }
  }

  addListener(listener) {
    this.listeners.add(listener);
  }

  removeListener(listener) {
    this.listeners.delete(listener);
  }

  notifyListeners(event, data) {
    this.listeners.forEach(listener => listener(event, data));
  }
}

export default new WebSocketManager();
