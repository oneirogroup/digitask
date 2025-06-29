import { Button, Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";

import "./internetPack.css";

function Index({ openModal, goCloseModal, editedPack, fetchInternetPacks }) {
  const [internetPack, setInternetPack] = useState({});
  const [form] = Form.useForm();

  const fetchInternetPack = async () => {
    if (editedPack) {
      const response = await fetch(`https://app.digitask.store/services/services/internet_packs/${editedPack}`);
      if (!response.ok) {
        throw new Error("Failed to fetch internet packs");
      }
      const data = await response.json();
      form.setFieldsValue(data);
      setInternetPack(data);
    } else {
      form.setFieldsValue({ name: "", speed: "", price: "" });
      setInternetPack({});
    }
  };

  useEffect(() => {
    fetchInternetPack();
  }, [editedPack]);

  const updateInternetPack = async updatedData => {
    const response = await fetch(`https://app.digitask.store/services/services/internet_packs/${editedPack}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedData)
    });

    if (response.ok) {
      fetchInternetPacks();
      return true;
    } else {
      return false;
    }
  };

  const createInternetPack = async updatedData => {
    const response = await fetch(`https://app.digitask.store/services/services/internet_packs/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedData)
    });

    if (response.ok) {
      fetchInternetPacks();
      return true;
    } else {
      return false;
    }
  };

  const onFinish = values => {
    let response;
    if (editedPack) {
      response = updateInternetPack(values);
    } else {
      response = createInternetPack(values);
    }
    if (response) {
      form.setFieldsValue({ name: "", speed: "", price: "" });
      setInternetPack({});
      goCloseModal();
    }
  };

  return (
    <Modal
      footer={false}
      title=""
      open={openModal}
      onOk={goCloseModal}
      onCancel={goCloseModal}
      okText="Tamamla"
      cancelText="Ləğv et"
    >
      <div className="internet-pack-edit-modal">
        {" "}
        <Form initialValues={internetPack} onFinish={onFinish} form={form}>
          <Form.Item
            rules={[{ required: true, message: "Bu sahə boş ola bilməz" }]}
            validateTrigger="onSubmit"
            label="Internet paketi"
            name="name"
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: "Bu sahə boş ola bilməz" }]}
            validateTrigger="onSubmit"
            label="Qiymət (azn)"
            name="price"
          >
            <Input />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: "Bu sahə boş ola bilməz" }]}
            validateTrigger="onSubmit"
            label="Sürət (mb/s)"
            name="speed"
          >
            <Input />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Təsdiqlə
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}

export default Index;
