/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./SuperChat.css";

const URL = "ws://localhost:4000";

const SuperChat = () => {
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const newWebSocket = connectWebSocket();
    return () => {
      if (newWebSocket) newWebSocket.close();
    };
  }, []);

  const connectWebSocket = () => {
    const newWebSocket = new WebSocket(URL);

    newWebSocket.onopen = () => {
      console.log("WebSocket Connected", newWebSocket);
      setWs(newWebSocket);
    };

    newWebSocket.onmessage = (e) => {
      const data = e.data;
      if (typeof data === "string") {
        try {
          const message = JSON.parse(data);
          setMessages((prevMessages) => [message, ...prevMessages]);
        } catch (error) {
          console.error("Failed to parse message as JSON:", error);
        }
      } else {
        console.log("Received non-JSON data:", data);
      }
    };

    newWebSocket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    newWebSocket.onclose = () => {
      console.log("WebSocket Closed");
      setTimeout(connectWebSocket, 1000);
    };

    return newWebSocket;
  };

  const sendMessage = (msg) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message = {
        user: "Admin",
        message: msg,
        id: Date.now(),
      };
      ws.send(JSON.stringify(message));
      setMessages((prevMessages) => [message, ...prevMessages]);
    }
  };

  return (
    <div className="chat_page">
      <div className="chat_box">
        <div className="chat_box_header">ADMIN MESSAGES</div>
        <div className="chat_box_body">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat_box_body_${
                message.user === "Admin" ? "self" : "other"
              }`}
            >
              <span>
                <b>{message.user}</b>: {message.message}
                {message.image && <img src={message.image} alt="Uploaded" width={100}/>}
              </span>
            </div>
          ))}
        </div>
        <div className="chat_box_footer">
          <input
            type="text"
            placeholder="Enter Message"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value) {
                sendMessage(e.target.value);
                e.target.value = "";
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.querySelector(".chat_box_footer input");
              if (input && input.value) {
                sendMessage(input.value);
                input.value = "";
              }
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperChat;
