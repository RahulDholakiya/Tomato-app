/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { Table, Modal, Steps, Button } from "antd";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import "./MyOrders.css";
import CombineOrders from "../CombineOrders/CombineOrders";
import { Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const { url, token } = useContext(StoreContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token, url]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list", {
        headers: { Authorization: `${token}` },
      });
      const orders = response.data.data;
      const pendingOrders = orders.filter(
        (order) => order.status !== "Delivered"
      );
      setData(pendingOrders);
    } catch (error) {
      console.log("My Orders Error", error);
    }
  };

  const showModal = (order) => {
    setCurrentOrder(order);
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const getStatusIndex = (status) => {
    switch (status) {
      case "Food Processing":
        return 0;
      case "Out for delivery":
        return 1;
      case "Delivered":
        return 2;
      default:
        return 0;
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
            <span key={index}>
              <img
                src={url + "/images/" + item.image}
                alt={item.name}
                className="order-item-image"
              />
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
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => <span>${amount}.00</span>,
    },
    {
      title: "Total Items",
      dataIndex: "items",
      key: "totalItems",
      render: (items) => <span>{items.length}</span>,
    },
    {
      title: "Details",
      key: "details",
      render: (_, order) => (
        <Button
          onClick={() =>
            navigate("/order-details", { state: { order: order } })
          }
        >
          Order Details
        </Button>
      ),
    },
    {
      title: "Action",
      key: "track",
      render: (_, order) => (
        <Button onClick={() => showModal(order)}>Track Order</Button>
      ),
    },
  ];

  return (
    <>
      <Container maxWidth="lg">
        <div className="my-orders">
          <h2>My Orders</h2>
          <CombineOrders />
          <Table columns={columns} dataSource={data} rowKey="_id" />
          {currentOrder && (
            <Modal
              title="Track Order"
              open={open}
              onCancel={handleCancel}
              footer={null}
            >
              <Steps
                direction="vertical"
                size="small"
                current={getStatusIndex(currentOrder.status)}
                items={[
                  { title: "Food Processing" },
                  { title: "Out for delivery" },
                  { title: "Delivered" },
                ]}
              />
            </Modal>
          )}
        </div>
      </Container>
    </>
  );
};

export default MyOrders;
