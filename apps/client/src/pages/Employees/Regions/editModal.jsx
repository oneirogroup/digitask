import { Button, Form, Input, Select, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

import language from "../../../language.json";

const API_URL = "https://app.desgah.az/accounts/regions/";

const EditRegionModal = ({ region, onClose, onRegionUpdated }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (region) {
      form.setFieldsValue(region);
    }
  }, [region, form]);

  const handleSubmit = async values => {
    try {
      await axios.put(`${API_URL}${region.id}/`, values);
      message.success("Region uğurla yeniləndi");
      onRegionUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating region:", error);
      message.error("Region yenilənərkən xəta baş verdi");
    }
  };

  return (
    <div className="region-modal-overlay" onClick={e => e.stopPropagation()}>
      <div className="region-modal-content">
        <div className="region-modal-title">
          <h5>Regionu Redaktə Et</h5>
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>
        <hr />
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Ad" name="name" rules={[{ required: true, message: "Ad daxil edin" }]}>
            <Input placeholder="Region adı" />
          </Form.Item>

          <div className="region-modal-buttons">
            <Button type="primary" htmlType="submit">
              Yenilə
            </Button>
          </div>
        </Form>
      </div >
    </div >
  );
};

export default EditRegionModal;
