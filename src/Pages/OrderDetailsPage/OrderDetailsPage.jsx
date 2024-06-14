import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { Table, Descriptions, Card, Input, Button, Col, Row } from "antd";
import "./OrderDetailsPage.css";
import { StoreContext } from "../../Context/StoreContext";

const { TextArea } = Input;

const OrderDetailsPage = () => {
  const location = useLocation();
  const { order } = location.state;

  const { url } = useContext(StoreContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showQuestions, setShowQuestions] = useState(false);

  const inquiryQuestions = [
    "Hi, I have a question about my order.",
    "Sure, how can I help you?",
    "Can I change the delivery address?",
    "Yes, please provide the new address.",
    "Can you provide me with the status of my order?",
    "How do I cancel or modify my order?",
    "Can I track my order delivery?",
    "What is your return or refund policy?",
  ];

  const columns = [
    {
      title: "Item Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={`${url}/images/${image}`}
          alt="item"
          className="item-image"
          width={100}
        />
      ),
    },
    {
      title: "Item Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => <span>${price}.00</span>,
    },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { sender: "user", text: newMessage }]);
      setNewMessage("");
    }
  };

  const handleShowMessage = (message) => {
    setNewMessage(message);
  };

  const handleShowQuestions = () => {
    setShowQuestions(!showQuestions);
  };

  return (
    <div className="order-details-page">
      <Card className="order-details-card card-container">
        <Descriptions title="Order Details" bordered>
          <Descriptions.Item label="Order ID">{order._id}</Descriptions.Item>
          <Descriptions.Item label="Customer Name">
            {order.address.firstName} {order.address.lastName}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {order.address.street}, {order.address.city}, {order.address.state},{" "}
            {order.address.country}, {order.address.zipcode}
          </Descriptions.Item>
          <Descriptions.Item label="Contact No">
            {order.address.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Total Amount">
            ${order.amount}.00
          </Descriptions.Item>
          <Descriptions.Item label="Order Status">
            {order.status}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card className="order-items-card card-container">
        <Table
          columns={columns}
          dataSource={order.items}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Card className="chat-card card-container">
        <div className="chat-header">Chat with Support</div>
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`chat-bubble ${message.sender}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <TextArea
              rows={1}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message"
            />
            <Button type="primary" onClick={handleSendMessage}>
              Send
            </Button>
          </div>
          <div className="show-questions">
            <Button onClick={handleShowQuestions}>
              {showQuestions ? "Hide Questions" : "Show Questions"}
            </Button>
          </div>
          {showQuestions ? (
            <div className="inquiry-questions">
              <Row gutter={[8, 8]}>
                {inquiryQuestions.map((message, index) => (
                  <Col key={index} span={12}>
                    <Button
                      className="inquiry-question-button"
                      onClick={() => handleShowMessage(message)}
                    >
                      {message}
                    </Button>
                  </Col>
                ))}
              </Row>
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
};

export default OrderDetailsPage;
