/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContext";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container } from "@mui/material";

const PlaceOrder = () => {
  const { token, url } = useContext(StoreContext);

  const location = useLocation();

  const totalAmountData = location.state.getDataFromCart;

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    totalAmountData.forEach((item) => {
      totalAmount += item.product.price * item.quantity;
    });
    return totalAmount;
  };

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    if (!window.Razorpay) {
      alert(
        "Razorpay SDK not loaded. Make sure to include the script in your HTML."
      );
      return;
    }

    const orderItems = totalAmountData.map((item) => ({
      ...item.product,
      quantity: item.quantity,
    }));

    const deliveryFee = getTotalCartAmount() === 0 ? 0 : 2;

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + deliveryFee,
    };

    try {
      const {
        data: { key },
      } = await axios.get(url + "/api/getkey", {
        headers: { Authorization: { token } },
      });

      const checkoutHandler = async (total) => {
        try {
          const response = await fetch(`${url}/api/payment/checkout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({ orderDataAmount: orderData.amount }),
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          return data.data.id;
        } catch (error) {
          console.error("Error during checkout:", error);
        }
      };

      const order_id = await checkoutHandler(orderData.amount);

      if (!order_id) {
        console.error("Order ID not received");
        return;
      }

      const options = {
        key: key,
        amount: orderData.amount * 100,
        currency: "INR",
        name: "Tomato",
        description: "Tutorial of RazorPay",
        image: "https://avatars.githubusercontent.com/u/25058652?v=4",
        order_id: order_id,
        callback_url: url + "/api/payment/paymentverification",
        prefill: {
          name: data.firstName + " " + data.lastName,
          email: data.email,
          contact: data.phone,
        },
        notes: {
          address:
            data.street +
            ", " +
            data.city +
            ", " +
            data.state +
            ", " +
            data.zipcode +
            ", " +
            data.country,
        },
        theme: {
          color: "#121212",
        },
        handler: async (response) => {
          try {
            const verificationResponse = await fetch(
              url + "/api/payment/paymentverification",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderData: orderData,
                }),
              }
            );
            if (verificationResponse.ok) {
              navigate("/");
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("Payment verification failed. Please try again.");
          }
        },
      };
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Error creating order: ", error);
    }
  };

  return (
    <>
    <Container maxWidth="lg">
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First name"
            required
          />
          <input
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last name"
            required
          />
        </div>
        <input
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email address"
          required
        />
        <input
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
          required
        />
        <div className="multi-fields">
          <input
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
            required
          />
          <input
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="State"
            required
          />
        </div>
        <div className="multi-fields">
          <input
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            type="text"
            placeholder="Zip code"
            required
          />
          <input
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="Country"
            required
          />
        </div>
        <input
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Phone"
          required
        />
      </div>
      <div className="place-order-right">
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
          <button type="submit">PROCEED TO CHECKOUT</button>
        </div>
      </div>
    </form>
    </Container>
    </>
  );
};

export default PlaceOrder;
