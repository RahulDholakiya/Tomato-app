import React from "react";
import { ToastContainer } from "react-toastify";
import Navbar from "../../Admin/Components/Navbar/Navbar";
import Sidebar from "../../Admin/Components/Sidebar/Sidebar";
import {  Route, Routes } from "react-router-dom";
import Add from "../Pages/Add/Add";
import Orders from "../Pages/List/List";
import List from "../Pages/Orders/Orders";

const Dashboard = () => {
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
          <Routes>
            <Route path="/add" element={<Add />} />
            <Route path="/list" element={<List />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
