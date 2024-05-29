import React from "react";
import { useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const seachQuery = useSearchParams()[0];
  console.log(seachQuery);
  const referenceNum = seachQuery.get("reference");
  console.log(referenceNum);
  return (
    <div>
      <p>{referenceNum}</p>
      <p>Payment Successfull</p>
    </div>
  );
};

export default PaymentSuccess;
