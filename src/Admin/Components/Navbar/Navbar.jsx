import React, { useContext } from "react";
import "./Navbar.css";
import { assets } from "../../../Assets/assets";
import { Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../../Context/StoreContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { setToken, setHeaderShow } = useContext(StoreContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setHeaderShow(false);
    navigate("/login");
  };

  const items = [
    {
      key: "1",
      label: <p onClick={handleLogout}>Logout</p>,
    },
  ];

  return (
    <div className="navbars">
      <img className="logo" src={assets.logo} alt="" />
      <Dropdown
        menu={{
          items,
        }}
        placement="bottomRight"
        arrow
      >
        <img className="profile" src={assets.profile_icon} alt="" />
      </Dropdown>
    </div>
  );
};

export default Navbar;
