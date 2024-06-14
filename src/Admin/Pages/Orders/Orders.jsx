/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { Table, Button, Select } from "antd";
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

  const { url } = useContext(StoreContext);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        const ordersData = response.data.data;
        setOrders(ordersData);
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
      title: "Item Quantity",
      dataIndex: "items",
      key: "itemQuantity",
      render: (items) => (
        <span>
          {items.map((item, index) => (
            <span key={index}>
              {item?.quantity}
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
  ];

  return (
    <>
      <Container maxWidth="lg">
        <div className="order add">
          <h3>Order Page</h3>
          <div className="summary-boxes">
            <div className="summary-box">
              <h4>Total Amount</h4>
              <p>${summary.totalAmount.toFixed(2)}</p>
            </div>
            <div className="summary-box">
              <h4>Food Processing</h4>
              <p>{summary.foodProcessing}</p>
            </div>
            <div className="summary-box">
              <h4>Out for Delivery</h4>
              <p>{summary.outForDelivery}</p>
            </div>
            <div className="summary-box">
              <h4>Delivered</h4>
              <p>{summary.delivered}</p>
            </div>
          </div>
          <Table columns={columns} dataSource={orders} rowKey="_id" />
        </div>
      </Container>
    </>
  );
};

export default Orders;
