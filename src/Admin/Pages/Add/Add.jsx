// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useContext, useEffect, useState } from "react";
// import "./Add.css";
// import { assets } from "../../Assets/assets";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { StoreContext } from "../../../Context/StoreContext";
// import { Container } from "@mui/material";

// const Add = () => {
//   const [image, setImage] = useState(false);
//   const [data, setData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "Salad",
//   });
//   const [categories, setCategories] = useState([]);

//   const { url } = useContext(StoreContext);

//   useEffect(() => {
//     getAllCategories();
//   }, []);

//   const onChangeHandler = (event) => {
//     const name = event.target.name;
//     const value = event.target.value;
//     setData((data) => ({ ...data, [name]: value }));
//   };

//   const getAllCategories = async () => {
//     try {
//       const response = await axios.get(`${url}/api/category/allcategory`);
//       if (response.data.success) {
//         setCategories(response.data.categories);
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       toast.error("Error fetching categories");
//     }
//   };

//   const onSubmitHandler = async (event) => {
//     event.preventDefault();
//     const formData = new FormData();
//     formData.append("name", data.name);
//     formData.append("description", data.description);
//     formData.append("price", Number(data.price));
//     formData.append("category", data.category);
//     formData.append("image", image);
     
//     const response = await axios.post(`${url}/api/food/add`, formData);
//     console.log(response.data);
//     if (response.data.success) {
//       setData({
//         name: "",
//         description: "",
//         price: "",
//         category: "",
//       });
//       setImage(false);
//       toast.success(response.data.message);
//     } else {
//       toast.error(response.data.message);
//     }
//   };

//   return (
//     <Container maxWidth="sm" className="add-container">
//       <div className="add">
//         <form className="flex-col" onSubmit={onSubmitHandler}>
//           <div className="add-img-upload flex-col">
//             <p>Upload Image</p>
//             <label htmlFor="image">
//               <img
//                 src={image ? URL.createObjectURL(image) : assets.upload_area}
//                 alt=""
//               />
//             </label>
//             <input
//               onChange={(e) => setImage(e.target.files[0])}
//               type="file"
//               id="image"
//               hidden
//               required
//             />
//           </div>
//           <div className="add-product-name flex-col">
//             <p>Product Name</p>
//             <input
//               onChange={onChangeHandler}
//               value={data.name}
//               type="text"
//               name="name"
//               placeholder="Type here"
//               required
//             />
//           </div>
//           <div className="add-product-description flex-col">
//             <p>Product Description</p>
//             <textarea
//               onChange={onChangeHandler}
//               value={data.description}
//               name="description"
//               rows="4"
//               placeholder="Write content here"
//               required
//             ></textarea>
//           </div>
//           <div className="add-category-price">
//             <div className="add-category flex-col">
//               <p>Product Category</p>
//               <select
//                 onChange={onChangeHandler}
//                 name="category"
//               >
//                 <option value="">Select Category</option>
//                 {categories.map((category) => (
//                   <option key={category._id} value={category.categoryName}>
//                     {category.categoryName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="add-price flex-col">
//               <p>Product Price</p>
//               <input
//                 onChange={onChangeHandler}
//                 value={data.price}
//                 type="number"
//                 name="price"
//                 placeholder="$20"
//                 required
//               />
//             </div>
//           </div>
//           <button type="submit" className="add-btn">
//             ADD
//           </button>
//         </form>
//       </div>
//     </Container>
//   );
// };

// export default Add;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import "./Add.css";
import { assets } from "../../Assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../../Context/StoreContext";
import { Container } from "@mui/material";

const Add = () => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const [categories, setCategories] = useState([]);

  const { url } = useContext(StoreContext);

  useEffect(() => {
    getAllCategories();
  }, []);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const getAllCategories = async () => {
    try {
      const response = await axios.get(`${url}/api/category/allcategory`);
      if (response.data.success) {
        setCategories(response.data.categories);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error fetching categories");
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    // Validate form fields
    if (!data.category) {
      toast.error("Please select a category");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);

    console.log("Form data before sending:", {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      image: image,
    });

    try {
      const response = await axios.post(`${url}/api/food/add`, formData);
      console.log(response.data);
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "",
        });
        setImage(null);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding food:", error);
      toast.error("Error adding food");
    }
  };

  return (
    <Container maxWidth="sm" className="add-container">
      <div className="add">
        <form className="flex-col" onSubmit={onSubmitHandler}>
          <div className="add-img-upload flex-col">
            <p>Upload Image</p>
            <label htmlFor="image">
              <img
                src={image ? URL.createObjectURL(image) : assets.upload_area}
                alt=""
              />
            </label>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
              required
            />
          </div>
          <div className="add-product-name flex-col">
            <p>Product Name</p>
            <input
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              name="name"
              placeholder="Type here"
              required
            />
          </div>
          <div className="add-product-description flex-col">
            <p>Product Description</p>
            <textarea
              onChange={onChangeHandler}
              value={data.description}
              name="description"
              rows="4"
              placeholder="Write content here"
              required
            ></textarea>
          </div>
          <div className="add-category-price">
            <div className="add-category flex-col">
              <p>Product Category</p>
              <select
                onChange={onChangeHandler}
                name="category"
                value={data.category}
                required
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categories.map((category) => (
                  <option key={category._id} value={category.categoryName}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <div className="add-price flex-col">
              <p>Product Price</p>
              <input
                onChange={onChangeHandler}
                value={data.price}
                type="number"
                name="price"
                placeholder="$20"
                required
              />
            </div>
          </div>
          <button type="submit" className="add-btn">
            ADD
          </button>
        </form>
      </div>
    </Container>
  );
};

export default Add;
