/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Col, Modal, Row, Table } from "antd";
import "./Options.css";

const Options = ({ url }) => {
  const [stats, setStats] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const userCountResponse = await axios.get(`${url}/api/user/count/users`);
      const productCountResponse = await axios.get(`${url}/api/food/list`);
      const orderCountResponse = await axios.get(`${url}/api/order/list`);

      setStats({
        userCount: userCountResponse.data.count,
        totalAdmins: userCountResponse.data.adminCount,
        totalItems: productCountResponse.data.totalItems,
        totalOrders: orderCountResponse.data.totalOrders,
        totalAmount: orderCountResponse.data.totalAmount,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchCategoryData = async () => {
    try {
      const response = await axios.get(`${url}/api/food/categories`);
      console.log(response);
      setCategoryData(response.data.categories);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  const handleCardClick = async () => {
    await fetchCategoryData();
    setModalVisible(true);
  };

  const columns = [
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Count",
      dataIndex: "count",
      key: "count",
    },
  ];

  return (
    <div className="options-container">
      <Row gutter={[16,16]}>
        <Col span={8}>
          <Card className="custom-card" title="Total Users">
            <div className="card-content">{stats.userCount}</div>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="custom-card" title="Total Admins">
            <div className="card-content">{stats.totalAdmins}</div>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            className="custom-card"
            title="Total Items"
            onClick={handleCardClick}
            style={{ cursor: "pointer" }}
          >
            <div className="card-content">{stats.totalItems}</div>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="custom-card" title="Total Orders">
            <div className="card-content">{stats.totalOrders}</div>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="custom-card" title="Total Amount">
            <div className="card-content">{stats.totalAmount}</div>
          </Card>
        </Col>
      </Row>
      <Modal
        title="Category Data"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Table dataSource={categoryData} columns={columns} rowKey="category" />
      </Modal>
    </div>
  );
};

export default Options;
