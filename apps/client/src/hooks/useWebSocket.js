import { useEffect, useState } from "react";

const useWebSocket = () => {
  const [ws, setWs] = useState(null);
  const [status, setStatus] = useState({});

  useEffect(() => {
    const socket = new WebSocket("wss://app.desgah.az/ws/");
    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const updateStatus = (userId, newStatus) => {
    setStatus(prevStatus => ({ ...prevStatus, [userId]: newStatus }));
  };

  return { ws, setStatus: updateStatus };
};

export default useWebSocket;
