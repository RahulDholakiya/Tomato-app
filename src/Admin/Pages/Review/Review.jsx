/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import "./Review.css";
import { StoreContext } from "../../../Context/StoreContext";
import axios from "axios";
import { Button, Input, message, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [searchText, setSearchText] = useState("");

  const { url, token } = useContext(StoreContext);

  useEffect(() => {
    if (token) {
      fetchReviews();
    }
  }, [token]);

  const fetchReviews = async (query = "") => {
    try {
      const response = await axios.get(`${url}/api/rating/reviews`, {
        headers: { Authorization: `${token}` },
        params: { search: query },
      });
      console.log(response);
      if (response.data.success) {
        setReviews(response.data.reviews);
      } else {
        message.error("Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error.response || error.message);
      message.error("Failed to fetch reviews");
    }
  };

  const columns = [
    {
      title: "Food Item",
      dataIndex: ["foodId", "name"],
      key: "foodId",
    },
    {
      title: "User",
      dataIndex: ["userId", "name"],
      key: "userId",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  const handleSearch = () => {
    fetchReviews(searchText);
  };

  return (
    <div>
      <h2>Customer Reviews</h2>
      <Input
        placeholder="Search Food Item"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 200, marginRight: 8 }}
      />
      <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
        Search
      </Button>
      <Table dataSource={reviews} columns={columns} rowKey="_id" />
    </div>
  );
};

export default Review;
