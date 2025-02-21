import { useEffect, useState } from "react";
import React from "react";
import ReactDOM from "react-dom";
import { RouterProvider } from "react-router-dom";

import { routers } from "../Routers.jsx";

import "./App.css";
import "./responsive.css";

const App = () => {
  const [location, setLocation] = useState(null);
  let ws;
  const connectWebSocket = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No access token found. Closing WebSocket and retrying connection in 5 seconds...");
      if (ws) {
        ws.close();
      }
      return;
    }
    const email = localStorage.getItem("saved_email");
    ws = new WebSocket(`ws://37.61.77.5/ws/?email=${email}&token=${token}`);

    // WebSocket event listeners
    ws.onopen = () => {};

    ws.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
      } catch (e) {
        console.error("Error parsing WebSocket message:", e);
      }
    };

    ws.onerror = error => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = event => {
      if (event.wasClean) {
      } else {
        console.error("WebSocket connection died unexpectedly");
      }
      // Attempt to reconnect after 5 seconds
      setTimeout(connectWebSocket, 5000);
    };
  };

  // Function to fetch the user's location
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          if (ws && ws.readyState === WebSocket.OPEN) {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            ws.send(JSON.stringify({ location })); // Send location through WebSocket
          }
        },
        error => {
          console.error("Error getting location: ", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 10000
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // Connect to WebSocket and fetch location on mount
  useEffect(() => {
    connectWebSocket();
    fetchLocation();
    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close(); // Close WebSocket on component unmount
      }
    };
  }, []);

  // Fetch location every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchLocation();
    }, 5000);
    return () => {
      clearInterval(intervalId); // Clear interval on unmount
    };
  }, []);

  return <RouterProvider router={routers} />;
};

export default App;
