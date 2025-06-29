import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message } from "antd";
import axios from "axios";

const API_URL = "https://app.digitask.store/accounts/regions/";


const AddRegionModal = ({ onClose, onRegionAdded }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async values => {
    setLoading(true);
    try {
      await axios.post(API_URL, values);
      message.success("Region uğurla əlavə edildi");
      onRegionAdded();
      onClose();
    } catch (error) {
      if (error.response?.status === 403) {
        message.error("Region əlavə edilərkən xəta baş verdi");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="region-modal-overlay" onClick={e => e.stopPropagation()}>
      <div className="region-modal-content">
        <div className="region-modal-title">
          <h5>Yeni Region</h5>
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>
        <hr />
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            name: ""
          }}
        >
          <Form.Item label="Ad" name="name" rules={[{ required: true, message: "Ad daxil edin" }]}>
            <Input placeholder="Region adı" />
          </Form.Item>

          <div className="region-modal-buttons">
            <Button type="primary" htmlType="submit" loading={loading}>
              Əlavə et
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddRegionModal;
