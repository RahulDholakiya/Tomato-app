/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import "./Chat.css";
import { StoreContext } from "../../Context/StoreContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

const URL = "ws://localhost:4000";

const Chat = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [user, setUser] = useState("User");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [image, setImage] = useState(null);

  const { url } = useContext(StoreContext);

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

  const openChatBox = () => {
    setIsChatOpen(!isChatOpen);
  };

  const imageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const submitMessage = async () => {
    if (
      ws &&
      ws.readyState === WebSocket.OPEN &&
      (message || image) &&
      !isSending
    ) {
      setIsSending(true);

      const formData = new FormData();
      formData.append("user", user);
      formData.append("message", message);
      if (image) {
        formData.append("image", image);
      }

      fetch(url + "/api/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          const messageData = {
            user: user,
            message: message,
            image: data.filename,
          };
          ws.send(JSON.stringify(messageData));
          setMessages((prevMessages) => [messageData, ...prevMessages]);
          setMessage("");
          setImage(null);
          setIsSending(false);
        })
        .catch((error) => {
          console.error("Error uploading message:", error);
          setIsSending(false);
        });
    }
  };

  return (
    <div className="chat_page">
      <button onClick={openChatBox} className="chat_button">
        {isChatOpen ? "Close Chat" : "Open Chat"}
      </button>
      {isChatOpen && (
        <div className="chat_box">
          <div className="chat_box_header">MESSAGES</div>
          <div className="chat_box_body">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat_box_body_${
                  message.user === user ? "self" : "other"
                }`}
              >
                <div
                  className={`chat_message_${
                    message.user === user ? "self" : "other"
                  }`}
                >
                  <span>
                    <b>{message.user}</b>: {message.message}
                    {message.image && (
                      <img
                        src={`http://localhost:4000/images/${message.image}`}
                        alt="Uploaded"
                        width={100}
                      />
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="chat_box_footer">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter Message"
            />
            <input
              type="file"
              id="fileInput"
              onChange={imageUpload}
              style={{ display: "none" }}
            />
            <label htmlFor="fileInput" className="upload_icon">
              <FontAwesomeIcon icon={faUpload} />
            </label>
            <button
              onClick={submitMessage}
              disabled={(!message && !image) || isSending}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
