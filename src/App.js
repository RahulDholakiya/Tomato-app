import React, { useContext, useState } from "react";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Cart from "./Pages/Cart/Cart";
import PlaceOrder from "./Pages/PlaceOrder/PlaceOrder";
import Footer from "./Components/Footer/Footer";
import LoginPopup from "./Components/LoginPopup/LoginPopup";
import MyOrders from "./Pages/MyOrders/MyOrders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./Admin/Dashboard/Dashboard";
import { StoreContext } from "./Context/StoreContext";
import Add from "./Admin/Pages/Add/Add";
import List from "./Admin/Pages/List/List";
import Orders from "./Admin/Pages/Orders/Orders";
import CompletedOrders from "./Pages/CompletedOrders/CompletedOrders";
import Options from "./Admin/Pages/Options/Options";
import AddCategory from "./Admin/Pages/AddCategory/AddCategory";
import Review from "./Admin/Pages/Review/Review";
import SuperChat from "./Admin/Pages/SuperChat/SuperChat";
import OrderDetailsPage from "./Pages/OrderDetailsPage/OrderDetailsPage";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const { headerShow } = useContext(StoreContext);

  return (
    <>
      <ToastContainer />
      {headerShow && <Navbar setShowLogin={setShowLogin} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<PlaceOrder />} />
        <Route path="/myorders" element={<MyOrders />} />
        <Route path="/completed-orders" element={<CompletedOrders />} />
        <Route path="/order-details" element={<OrderDetailsPage />} />
        <Route
          path="/login"
          element={
            showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>
          }
        />
        <Route path="/admin/*" element={<Dashboard />}>
          <Route path="add" element={<Add />} />
          <Route path="list" element={<List />} />
          <Route path="orders" element={<Orders />} />
          <Route path="option" element={<Options />} />
          <Route path="add-category" element={<AddCategory />} />
          <Route path="review" element={<Review />} />
          <Route path="superchat" element={<SuperChat />} />
        </Route>
      </Routes>
      {headerShow && <Footer />}
    </>
  );
}

export default App;
