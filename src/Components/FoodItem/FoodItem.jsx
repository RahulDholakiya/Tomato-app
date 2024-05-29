import React, { useContext, useState } from "react";
import "./FoodItem.css";
import { assets } from "../../Assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";

const FoodItem = ({ id, name, price, description, image }) => {
  const {  url, token } = useContext(StoreContext);
  const [cartItems, setCartItems] = useState({})

  const addToCart = async (itemId) => {
    if (token) {
      try {
        const response = await axios.post(
          url + "/api/cart/add",
          { itemId, quantity: 1 },
          { headers: { Authorization: `${token}` } }
        );
        console.log(response);
        setCartItems((prev) => {
          const updatedCart = { ...prev };
          if (!updatedCart[itemId]) {
            updatedCart[itemId] = 1;
          } else {
            updatedCart[itemId] += 1;
          }
          return updatedCart;
        });
        console.log("Item added to cart successfully");
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
        const response = await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { Authorization: `${token}` } }
        );
        console.log(response);
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
        console.log("Item removed from cart successfully");
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
          <img src={assets?.rating_starts} alt="Rating" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
