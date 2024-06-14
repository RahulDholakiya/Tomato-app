/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [headerShow, setHeaderShow] = useState(true);
  const [category, setCategory] = useState("All");

  const url = "http://localhost:4000";

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(
        url + `/api/food/list?category=${category}`
      );
      if (response.data.success) {
        setFoodList(response.data.data || []);
      } else {
        console.log("Error");
      }
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  };

  const contextValue = {
    food_list,
    url,
    token,
    setToken,
    headerShow,
    setHeaderShow,
    category,
    setCategory,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;