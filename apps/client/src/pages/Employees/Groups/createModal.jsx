import { Button, Form, Input, Select, message } from "antd";
import axios from "axios";
import { useState } from "react";

import language from "../../../language.json";

const API_URL = "https://app.desgah.az/accounts/groups/";

const AddGroupModal = ({ onClose, onGroupAdded }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async values => {
    setLoading(true);
    try {
      await axios.post(API_URL, values);
      message.success("Vəzifə uğurla əlavə edildi");
      onGroupAdded();
      onClose();
    } catch (error) {
      if (response.status == 403) {
        await onGroupAdded();
        message.error("Vəzifə əlavə edilərkən xəta baş verdi");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group-modal-overlay" onClick={e => e.stopPropagation()}>
      <div className="group-modal-content">
        <div className="group-modal-title">
          <h5>Yeni Vəzifə</h5>
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
            warehouse_permission: "",
            users_permission: "",
            tasks_permission: ""
          }}
        >
          <Form.Item label="Ad" name="name" rules={[{ required: true, message: "Ad daxil edin" }]}>
            <Input placeholder="Vəzifə adı" />
          </Form.Item>

          <Form.Item label="Anbar icazəsi" name="warehouse_permission">
            <Select placeholder="Seçin">
              {Object.entries(language).map(([key, value]) => (
                <Select.Option key={key} value={key}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="İşçi icazəsi" name="users_permission">
            <Select placeholder="Seçin">
              {Object.entries(language).map(([key, value]) => (
                <Select.Option key={key} value={key}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Tapşırıq icazəsi" name="tasks_permission">
            <Select placeholder="Seçin">
              {Object.entries(language).map(([key, value]) => (
                <Select.Option key={key} value={key}>
                  {value}
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

export default AddGroupModal;
