/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import "./ExploreMenu.css";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";

const ExploreMenu = () => {
  const { category, setCategory, url } = useContext(StoreContext);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(url + "/api/category/allcategory");
      if (response.data.success) {
        setCategories(response.data.categories);
      } else {
        console.error("Error fetching categories:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getImageUrl = (filename) => {
    return `${url}/images/${filename}`;
  };

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore Our Menu</h1>
      <p className="explore-menu-text">
        Choose from a diverse menu featuring a delectable array of dishes
        crafted with the finest ingredients and culinary expertise. Our satisfy
        your cravings and elevate your dining experience, one delicious meal at
        a time.
      </p>
      <div className="explore-menu-list">
        {categories.map((categoryItem) => (
          <div
            key={categoryItem._id}
            onClick={() =>
              setCategory((prev) =>
                prev === categoryItem.categoryName
                  ? "All"
                  : categoryItem.categoryName
              )
            }
            className="explore-menu-list-item"
          >
            <img
              className={category === categoryItem.categoryName ? "active" : ""}
              src={getImageUrl(categoryItem.image)}
              alt={categoryItem.categoryName}
            />
            <p>{categoryItem.categoryName}</p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
