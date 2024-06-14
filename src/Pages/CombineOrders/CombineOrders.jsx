import React from "react";
import { useNavigate } from "react-router-dom";
const CombineOrders = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="sum-boxes">
        <div className="sum-box" onClick={() => navigate("/myorders")}>
          <h4>Order Pending</h4>
        </div>
        <div className="sum-box" onClick={() => navigate("/completed-orders")}>
          <h4>Order Complete</h4>
        </div>
      </div>
    </div>
  );
};

export default CombineOrders;
