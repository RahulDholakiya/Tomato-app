/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Container } from "@mui/material";

const Cart = () => {
  const [getDataFromCart, setGetDataFromCart] = useState([]);
  const { url, token } = useContext(StoreContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      getCart();
    }
  }, [token]);

  const getCart = async () => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { Authorization: `${token}` } }
      );
      setGetDataFromCart(Object.values(response.data.cartData || []));
    } catch (error) {
      console.error("get cart error", error);
    }
  };

  const proceedToCheckout = () => {
    if (token) {
      navigate("/order", { state: { getDataFromCart: getDataFromCart } });
    } else {
      toast.error("Please Login");
    }
  };

  const removeFromCart = async (item) => {
    try {
      const response = await axios.post(
        url + "/api/cart/remove",
        { itemId: item.itemId },
        { headers: { Authorization: `${token}` } }
      );
      setGetDataFromCart(Object.values(response.data.cartData || []));
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Failed to remove item from cart");
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    getDataFromCart.forEach((item) => {
      totalAmount += item.product?.price * item?.quantity;
    });
    return totalAmount;
  };

  return (
    <>
    <Container maxWidth="lg">
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {getDataFromCart?.map((item, index) => {
          return (
            <div className="cart-items-title cart-items-item" key={index}>
              <img
                src={`${url}/images/${item?.product?.image}`}
                alt={item?.product?.name}
              />
              <p>{item?.product?.name}</p>
              <p>{item?.product?.price}</p>
              <p>{item?.quantity}</p>
              <p>${item?.product?.price * item?.quantity}</p>
              <p onClick={() => removeFromCart(item)} className="cross">
                x
              </p>
            </div>
          );
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>
                ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
              </p>
            </div>
          </div>
          <button onClick={proceedToCheckout}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it there</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo code" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Container>
    </>
  );
};

export default Cart;
