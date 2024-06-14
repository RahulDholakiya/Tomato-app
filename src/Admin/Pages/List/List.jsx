/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import "./List.css";
import { toast } from "react-toastify";
import { StoreContext } from "../../../Context/StoreContext";
import { Modal, Button, Form, Input } from "antd";
import Container from "@mui/material/Container";

const List = () => {
  const [list, setList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [form] = Form.useForm();

  const { url } = useContext(StoreContext);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      const response = await fetch(`${url}/api/food/list`);
      if (response.ok) {
        const data = await response.json();
        setList(data.data);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      console.error("Error fetching list:", error);
      toast.error("Error fetching list");
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await fetch(`${url}/api/food/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: foodId }),
      });
      if (response.ok) {
        await fetchList();
        toast.success("Food removed successfully");
      } else {
        toast.error("Error removing food");
      }
    } catch (error) {
      console.error("Error removing food:", error);
      toast.error("Error removing food");
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${url}/api/food/edit/${selectedFood._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form.getFieldsValue()),
      });
      if (response.ok) {
        toast.success("Food updated successfully");
        setModalVisible(false);
        await fetchList();
      } else {
        toast.error("Error updating food");
      }
    } catch (error) {
      console.error("Error updating food:", error);
      toast.error("Error updating food");
    }
  };

  const openEditModal = (food) => {
    setSelectedFood(food);
    setModalVisible(true);
    form.setFieldsValue({
      name: food.name,
      description: food.description,
      price: food.price,
      category: food.category,
    });
  };

  return (
    <>
      <Container maxWidth="lg">
        <div className="list add flex-col">
          <p>All Food List</p>
          <div className="list-table">
            <div className="list-table-format title">
              <b>Image</b>
              <b>Name</b>
              <b>Category</b>
              <b>Price</b>
              <b>Action</b>
            </div>
            {list.map((item, index) => {
              return (
                <div key={index} className="list-table-format">
                  <img src={`${url}/images/` + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>{item.category}</p>
                  <p>${item.price}</p>
                  <Button onClick={() => removeFood(item._id)}>Remove</Button>
                  <Button onClick={() => openEditModal(item)}>Update</Button>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
      <Modal
        title="Edit Food"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpdate}>
            Update
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="price" label="Price">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="category" label="Category">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default List;
