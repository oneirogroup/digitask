import { Button, Form, Input, Select, message } from "antd";
import axios from "axios";
import { useEffect } from "react";

import language from "../../../language.json";

const API_URL = "https://app.desgah.az/services/groups/";

const EditGroupModal = ({ group, onClose, onGroupUpdated }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (group) {
      form.setFieldsValue(group);
    }
  }, [group, form]);

  const handleSubmit = async values => {
    try {
      await axios.put(`${API_URL}${group.id}/`, values);
      message.success("Vəzifə uğurla yeniləndi");
      onGroupUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating group:", error);
      message.error("Vəzifə yenilənərkən xəta baş verdi");
    }
  };

  return (
    <div className="group-modal-overlay" onClick={e => e.stopPropagation()}>
      <div className="group-modal-content">
        <div className="group-modal-title">
          <h5>Vəzifəni Redaktə Et</h5>
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>
        <hr />
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
            <Button type="primary" htmlType="submit">
              Yenilə
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default EditGroupModal;
