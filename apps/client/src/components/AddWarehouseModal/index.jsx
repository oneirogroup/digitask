import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message } from "antd";
import axios from "axios";

const API_URL = "https://app.digitask.store/warehouse/warehouses/";


const AddWarehouseModal = ({ onClose, onWarehouseAdded }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState([]);
  const [regionLoading, setRegionLoading] = useState(false);

  useEffect(() => {
    const fetchRegions = async () => {
      setRegionLoading(true);
      try {
        const response = await axios.get('https://app.digitask.store/accounts/regions/');
        setRegions(response.data);
      } catch (error) {
        message.error("Regionlər yüklənərkən xəta baş verdi");
      } finally {
        setRegionLoading(false);
      }
    };

    fetchRegions();
  }, []);

  const handleSubmit = async values => {
    setLoading(true);
    try {
      await axios.post(API_URL, values);
      message.success("Anbar uğurla əlavə edildi");
      onWarehouseAdded();
      onClose();
    } catch (error) {
      if (error.response?.status === 403) {
        message.error("Anbar əlavə edilərkən xəta baş verdi");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group-modal-overlay" onClick={e => e.stopPropagation()}>
      <div className="group-modal-content">
        <div className="group-modal-title">
          <h5>Yeni Anbar</h5>
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
            name: "",
            region: ""
          }}
        >
          <Form.Item label="Ad" name="name" rules={[{ required: true, message: "Ad daxil edin" }]}>
            <Input placeholder="Anbar adı" />
          </Form.Item>

          <Form.Item label="Region" name="region" rules={[{ required: true, message: "Region seçin" }]}>
            <Select placeholder="Seçin" loading={regionLoading}>
              {regions.map((region) => (
                <Select.Option key={region.id} value={region.id}>
                  {region.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div className="group-modal-buttons">
            <Button type="primary" htmlType="submit" loading={loading}>
              Əlavə et
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddWarehouseModal;
