/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { Form, Input, Button, Upload, message, Table } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { StoreContext } from "../../../Context/StoreContext";

const AddCategory = () => {
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [categoryData, setCategoryData] = useState([]);

  const [form] = Form.useForm();

  const { url } = useContext(StoreContext);

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    try {
      const response = await fetch(`${url}/api/category/allcategory`);

      const data = await response.json();

      const updatedCategoryData = data.categories.map((category) => ({
        ...category,
        key: category.categoryName,
      }));

      setCategoryData(updatedCategoryData);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (!image) {
        message.error("Please upload a category image");
        return;
      }

      const formData = new FormData();

      formData.append("categoryName", values.categoryName);
      formData.append("image", image);

      const response = await fetch(`${url}/api/category/add`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        message.success(data.message);
        form.resetFields();
        setImage(null);
        setImageName("");
        fetchCategoryData();
      } else {
        message.error(data.error);
      }
    } catch (error) {
      message.error("Failed to add category");
      console.error("Failed to add category", error);
    }
  };

  const handleRemoveCategory = async (record) => {
    try {
      const response = await fetch(
        `${url}/api/category/delete/${record.categoryName}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (data.success) {
        message.success(data.message);
        fetchCategoryData();
      } else {
        message.error(data.message);
      }
    } catch (error) {
      message.error("Failed to delete category");
      console.error("Failed to delete category", error);
    }
  };

  const handleImageChange = ({ file }) => {
    const isImage = file.type.startsWith("image/");

    if (!isImage) {
      message.error("You can only upload image files!");
      return;
    }

    setImage(file);
    setImageName(file.name);
  };

  const handleImageRemove = () => {
    setImage(null);
    setImageName("");
  };

  const transformImagePath = (path) => {
    return `${url}/images/${path}`;
  };

  const columns = [
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text, record) => (
        <>
          <img
            src={transformImagePath(record.image)}
            alt={record.categoryName}
            style={{ width: "50px", height: "50px" }}
          />
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button type="link" onClick={() => handleRemoveCategory(record)}>
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div className="add-category-container">
      <h2>Add New Category</h2>
      <Form onFinish={handleSubmit} form={form} layout="vertical">
        <Form.Item
          label="Category Name"
          name="categoryName"
          rules={[
            { required: true, message: "Please input the category name!" },
          ]}
        >
          <Input placeholder="Enter category name" />
        </Form.Item>
        <Form.Item
          label="Category Image"
          name="image"
          rules={[{ required: true, message: "Please upload an image!" }]}
        >
          <Upload
            name="image"
            listType="picture"
            beforeUpload={() => false}
            showUploadList={false}
            onChange={handleImageChange}
            onRemove={handleImageRemove}
          >
            <Button icon={<UploadOutlined />}>
              {imageName || "Click to Upload"}
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Category
          </Button>
        </Form.Item>
      </Form>
      <h2>Category List</h2>
      <Table
        dataSource={categoryData}
        columns={columns}
        rowKey="categoryName"
      />
    </div>
  );
};
export default AddCategory;
