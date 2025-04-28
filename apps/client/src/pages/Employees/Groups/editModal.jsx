import { Button, Form, Input, Select, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

import language from "../../../language.json";

const API_URL = "https://app.desgah.az/services/user_groups/";

const EditGroupModal = ({ group, onClose, onGroupUpdated }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (group) {
      form.setFieldsValue(group);
    }
  }, [group, form]);

  const [regions, setRegions] = useState([]);
  const [regionLoading, setRegionLoading] = useState(false);

  useEffect(() => {
    const fetchRegions = async () => {
      setRegionLoading(true);
      try {
        const response = await axios.get('https://app.desgah.az/accounts/regions/');
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
    try {
      await axios.put(`${API_URL}${group.id}/`, values);
      message.success("Qrup uğurla yeniləndi");
      onGroupUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating group:", error);
      message.error("Qrup yenilənərkən xəta baş verdi");
    }
  };

  return (
    <div className="group-modal-overlay" onClick={e => e.stopPropagation()}>
      <div className="group-modal-content">
        <div className="group-modal-title">
          <h5>Qrupu Redaktə Et</h5>
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>
        <hr />
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Ad" name="group" rules={[{ required: true, message: "Ad daxil edin" }]}>
            <Input placeholder="Qrup adı" />
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
            <Button type="primary" htmlType="submit">
              Yenilə
            </Button>
          </div>
        </Form>
      </div >
    </div >
  );
};

export default EditGroupModal;
