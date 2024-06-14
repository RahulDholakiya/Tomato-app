/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { Table } from "antd";
import axios from "axios";
import { StoreContext } from "../../Context/StoreContext";
import "./CompletedOrders.css";
import CombineOrders from "../CombineOrders/CombineOrders";
import { Container } from "@mui/material";

const CompletedOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [completedOrders, setCompletedOrders] = useState([]);

  useEffect(() => {
    if (token) {
      fetchCompletedOrders();
    }
  }, [token, url]);

  const fetchCompletedOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list", {
        headers: { Authorization: `${token}` },
      });
      const orders = response.data.data;
      const completed = orders.filter((order) => order.status === "Delivered");
      setCompletedOrders(completed);
    } catch (error) {
      console.log("Completed Orders Error", error);
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
  ];

  return (
    <>
      <Container maxWidth="lg">
        <div className="my-orders">
          <h2>Completed Orders</h2>
          <CombineOrders />
          <Table columns={columns} dataSource={completedOrders} rowKey="_id" />
        </div>
      </Container>
    </>
  );
};

export default CompletedOrders;
