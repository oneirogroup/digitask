import { Button, Form, Input, Select, message } from "antd";
import axios from "axios";
import { useEffect } from "react";

import language from "../../../language.json";
import tasklanguage from "../../../taskPermissionLanguage.json";
import reportPermissionLanguage from "../../../reportPermission.json";

const API_URL = "https://app.desgah.az/accounts/positions/positions/";

const EditPositionModal = ({ position, onClose, onPositionUpdated }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (position) {
      form.setFieldsValue(position);
    }
  }, [position, form]);

  const handleSubmit = async values => {
    try {
      const response = await axios.put(`${API_URL}${position.id}/`, values);

      message.success("Vəzifə uğurla yeniləndi");

      const storedUser = JSON.parse(localStorage.getItem("position"));
      if (storedUser && storedUser.id === position.id) {
        localStorage.setItem("position", JSON.stringify(response.data));
        window.location.reload();
      }

      onPositionUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating position:", error);
      message.error("Vəzifə yenilənərkən xəta baş verdi");
    }
  };

  return (
    <div className="position-modal-overlay" onClick={e => e.stopPropagation()}>
      <div className="position-modal-content">
        <div className="position-modal-title">
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
            <Select placeholder="Seçim edin">
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
              {Object.entries(tasklanguage).map(([key, value]) => (
                <Select.Option key={key} value={key}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Hesabat icazəsi" name="report_permission">
            <Select placeholder="Seçin">
              {Object.entries(reportPermissionLanguage).map(([key, value]) => (
                <Select.Option key={key} value={key}>
                  {value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <br />
          <div className="position-modal-buttons">
            <Button type="primary" htmlType="submit">
              Yenilə
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default EditPositionModal;
