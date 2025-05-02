import { Button, Form, Input, Select, message } from "antd";
import axios from "axios";
import { useState } from "react";

import language from "../../../language.json";
import tasklanguage from "../../../taskPermissionLanguage.json";
import reportPermissionLanguage from "../../../reportPermission.json";

const API_URL = "https://app.desgah.az/accounts/positions/positions/";

const AddPositionModal = ({ onClose, onPositionAdded }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async values => {
    setLoading(true);
    try {
      await axios.post(API_URL, values);
      message.success("Vəzifə uğurla əlavə edildi");
      onPositionAdded();
      onClose();
    } catch (error) {
      if (response.status == 403) {
        await onPositionAdded();
        message.error("Vəzifə əlavə edilərkən xəta baş verdi");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="position-modal-overlay" onClick={e => e.stopPropagation()}>
      <div className="position-modal-content">
        <div className="position-modal-title">
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
            <Button type="primary" htmlType="submit" loading={loading}>
              Əlavə et
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddPositionModal;
