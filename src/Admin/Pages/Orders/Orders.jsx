/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { Table, Button, Select, Modal, Input } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../../Context/StoreContext";
import "./Orders.css";
import { Container } from "@mui/material";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({
    totalAmount: 0,
    foodProcessing: 0,
    outForDelivery: 0,
    delivered: 0,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState({
    userId: "",
    username: "",
  });
  const [filterStatus, setFilterStatus] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const { url } = useContext(StoreContext);

  useEffect(() => {
    fetchAllOrders();
  }, [filterStatus]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        const ordersData = response.data.data;
        setOrders(
          filterStatus
            ? ordersData.filter((order) => order.status === filterStatus)
            : ordersData
        );
        calculateSummary(ordersData);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      console.log("Fetch order error", error);
    }
  };

  const calculateSummary = (ordersData) => {
    let totalAmount = 0;
    let foodProcessing = 0;
    let outForDelivery = 0;
    let delivered = 0;

    ordersData.forEach((order) => {
      totalAmount += order.amount;
      if (order.status === "Food Processing") {
        foodProcessing += 1;
      } else if (order.status === "Out for delivery") {
        outForDelivery += 1;
      } else if (order.status === "Delivered") {
        delivered += 1;
      }
    });

    setSummary({
      totalAmount,
      foodProcessing,
      outForDelivery,
      delivered,
    });
  };

  const statusHandler = async (orderId, status) => {
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status,
      });
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log("status handle error", error);
    }
  };

  const handleAccepted = async (orderId) => {
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: "Accepted",
      });
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log("Error accepting order", error);
    }
  };

  const handleRejected = async (orderId) => {
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: "Rejected",
      });
      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Order Rejected");
      }
    } catch (error) {
      console.log("Error rejecting order", error);
    }
  };

  const viewChat = (items, record) => {
    setSelectedUser({
      userId: record._id,
      username: record.address?.firstName + " " + record.address?.lastName,
    });
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedUser({ userId: "", username: "" });
  };

  const sendMessage = () => {};

  const columns = [
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: (items) => (
        <span>
          {items.map((item, index) => (
            <span key={index} className="order-item-image-span">
              <img
                src={url + "/images/" + item?.image}
                alt={item?.name}
                className="order-item-image"
              />
            </span>
          ))}
        </span>
      ),
    },
    {
      title: "Item Name",
      dataIndex: "items",
      key: "itemName",
      render: (items) => (
        <span>
          {items.map((item, index) => (
            <span key={index}>
              {item?.name}
              {index < items.length - 1 && ", "}
            </span>
          ))}
        </span>
      ),
    },
    {
      title: "Customer",
      dataIndex: "address",
      key: "address",
      render: (address) => (
        <div>
          <p>
            <span className="name">Name:</span>{" "}
            {address?.firstName + " " + address?.lastName}
          </p>
          <p>
            <span className="name">Address:</span> {address?.street},{" "}
            {address?.city}, {address?.state}, {address?.country},{" "}
            {address?.zipcode}
          </p>
          <p>
            <span className="name">Contact No:</span> {address?.phone}
          </p>
        </div>
      ),
    },
    {
      title: "Total Items",
      dataIndex: "items",
      key: "totalItems",
      render: (items) => <span>{items.length}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => <span>${amount}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <div>
          {status === "awaiting approval !" ? (
            <div className="accepted-btn">
              <Button
                onClick={() => handleAccepted(record._id)}
                className="accept-btn"
              >
                Accept
              </Button>
              <Button
                onClick={() => handleRejected(record._id)}
                className="accept-btn"
              >
                Reject
              </Button>
            </div>
          ) : (
            <Select
              value={status}
              onChange={(value) => statusHandler(record._id, value)}
            >
              <Select.Option value="Food Processing">
                Food Processing
              </Select.Option>
              <Select.Option value="Out for delivery">
                Out for delivery
              </Select.Option>
              <Select.Option value="Delivered">Delivered</Select.Option>
            </Select>
          )}
        </div>
      ),
    },
    {
      title: "View Chat",
      dataIndex: "view chat",
      key: "view chat",
      render: (items, record) => (
        <Button onClick={() => viewChat(items, record)}>View Chat</Button>
      ),
    },
  ];

  return (
    <>
      <Container maxWidth="lg">
        <div className="order add">
          <h3>Order Page</h3>
          <div className="summary-boxes">
            <div
              className="summary-box"
              onClick={() => setFilterStatus("")}
              style={{ cursor: "pointer" }}
            >
              <h4>Total Amount</h4>
              <p>${summary.totalAmount.toFixed(2)}</p>
            </div>
            <div
              className="summary-box"
              onClick={() => setFilterStatus("Food Processing")}
              style={{ cursor: "pointer" }}
            >
              <h4>Food Processing</h4>
              <p>{summary.foodProcessing}</p>
            </div>
            <div
              className="summary-box"
              onClick={() => setFilterStatus("Out for delivery")}
              style={{ cursor: "pointer" }}
            >
              <h4>Out for Delivery</h4>
              <p>{summary.outForDelivery}</p>
            </div>
            <div
              className="summary-box"
              onClick={() => setFilterStatus("Delivered")}
              style={{ cursor: "pointer" }}
            >
              <h4>Delivered</h4>
              <p>{summary.delivered}</p>
            </div>
          </div>
          <Table columns={columns} dataSource={orders} rowKey="_id" />
        </div>
      </Container>
      <Modal
        title="User Chat Details"
        visible={isModalVisible}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        footer={[
          <Button key="back" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
      >
        <div className="chat-container">
          <div className="message-list">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sentByUser ? "sent" : "received"}`}
              >
                <span className="message-content">{msg.content}</span>
              </div>
            ))}
          </div>
          <div className="input-container">
            <Input
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="primary" onClick={sendMessage}>
              Send
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Orders;