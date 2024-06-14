/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import "./FoodItem.css";
import { assets } from "../../Assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { Rate, Modal, Form, Input, Button, message } from "antd";

const FoodItem = ({ id, name, price, description, image }) => {
  const [cartItems, setCartItems] = useState({});
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const { url, token } = useContext(StoreContext);

  useEffect(() => {
    fetchCartItems();
    fetchAverageRating();
  }, []);

  const fetchCartItems = async () => {
    if (token) {
      try {
        const response = await axios.post(
          url + "/api/cart/get",
          {},
          { headers: { Authorization: `${token}` } }
        );
        const cartData = response.data.cartData;
        const updatedCartItems = {};
        cartData.forEach((item) => {
          updatedCartItems[item.itemId] = item.quantity;
        });
        setCartItems(updatedCartItems);
      } catch (error) {
        console.error(
          "Error fetching cart items:",
          error.response || error.message
        );
      }
    }
  };

  const fetchAverageRating = async () => {
    try {
      const response = await axios.get(`${url}/api/rating/average/${id}`);
      if (response.data.success) {
        setAverageRating(response.data.averageRating);
      }
    } catch (error) {
      console.error(
        "Error fetching average rating:",
        error.response || error.message
      );
    }
  };

  const addToCart = async (itemId) => {
    if (token) {
      try {
        await axios.post(
          url + "/api/cart/additem",
          { itemId, quantity: 1 },
          { headers: { Authorization: `${token}` } }
        );
        setCartItems((prev) => {
          const updatedCart = { ...prev };
          if (!updatedCart[itemId]) {
            updatedCart[itemId] = 1;
          } else {
            updatedCart[itemId] += 1;
          }
          return updatedCart;
        });
      } catch (error) {
        console.error(
          "Error adding item to cart:",
          error.response || error.message
        );
      }
    } else {
      console.error("No token found");
    }
  };

  const removeItemFromCart = async (itemId) => {
    if (token) {
      try {
        await axios.post(
          url + "/api/cart/removeitem",
          { itemId },
          { headers: { Authorization: `${token}` } }
        );
        setCartItems((prev) => {
          const updatedCart = { ...prev };
          if (updatedCart[itemId]) {
            updatedCart[itemId] -= 1;
            if (updatedCart[itemId] <= 0) {
              delete updatedCart[itemId];
            }
          }
          return updatedCart;
        });
      } catch (error) {
        console.error(
          "Error removing item from cart:",
          error.response || error.message
        );
      }
    } else {
      console.error("No token found");
    }
  };

  const handleRatingSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${url}/api/rating/review`,
        { foodId: id, rating, comment },
        { headers: { Authorization: `${token}` } }
      );
      if (response.data.success) {
        message.success("Rating submitted successfully");
        setRatingModalVisible(false);
      } else {
        message.error("Failed to submit rating");
      }
    } catch (error) {
      console.error(
        "Error submitting rating:",
        error.response || error.message
      );
      message.error("Failed to submit rating");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          className="food-item-image"
          src={url + "/images/" + image}
          alt={name}
        />
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets?.add_icon_white}
            alt="Add to cart"
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={() => removeItemFromCart(id)}
              src={assets?.remove_icon_red}
              alt="Remove from cart"
            />
            <p>{cartItems[id]}</p>
            <img
              onClick={() => addToCart(id)}
              src={assets?.add_icon_green}
              alt="Add more"
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <div className="food-item-rating">
            <Rate
              allowHalf
              value={averageRating}
              onClick={() => setRatingModalVisible(true)}
            />
            <span>({averageRating.toFixed(1)})</span>
          </div>
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
      <Modal
        title="Rate this food item"
        visible={ratingModalVisible}
        onCancel={() => setRatingModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setRatingModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleRatingSubmit}
            loading={loading}
          >
            Submit
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Rate">
            <Rate
              allowHalf
              value={rating}
              onChange={(value) => setRating(value)}
            />
          </Form.Item>
          <Form.Item label="Comment">
            <Input.TextArea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FoodItem;
