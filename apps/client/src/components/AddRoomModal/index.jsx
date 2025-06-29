import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import axios from "axios";
import useRefreshToken from "../../common/refreshToken";
import "./addRoomModal.css";

const { Option } = Select;

const AddRoomModal = ({ onClose }) => {
  const [form] = Form.useForm();
  const [memberOptions, setMemberOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const refreshAccessToken = useRefreshToken();

  useEffect(() => {
    const fetchMembers = async (isRetry = false) => {
      try {
        const response = await axios.get("https://app.digitask.store/accounts/users/");
        const token = localStorage.getItem("access_token");
        const currentUserId = token ? JSON.parse(atob(token.split(".")[1])).user_id : null;
        const filtered = response.data.filter(user => user.id !== currentUserId);
        setMemberOptions(filtered);
      } catch (error) {
        if (error.response?.status === 403 && !isRetry) {
          await refreshAccessToken();
          fetchMembers(true);
        } else {
          message.error("İstifadəçilər yüklənərkən xəta baş verdi.");
        }
      }
    };

    fetchMembers();
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        "https://app.digitask.store/accounts/add_group/",
        {
          name: values.name,
          members: values.members
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      message.success("Qrup uğurla əlavə edildi");
      onClose();
    } catch (error) {
      if (error?.response?.status === 403) {
        await refreshAccessToken();
        form.submit(); // Yenidən cəhd et
      } else {
        message.error("Serverdə bir xəta baş verdi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group-modal-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="group-modal-content">
        <div className="group-modal-title">
          <h5>Yeni Qrup</h5>
          <span className="close" onClick={onClose}>&times;</span>
        </div>
        <hr />
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ name: "", members: [] }}
        >
          <Form.Item
            label="Ad"
            name="name"
            rules={[{ required: true, message: "Otaq adı boş ola bilməz." }]}
          >
            <Input placeholder="Qrup adı" />
          </Form.Item>

          <Form.Item
            label="Üzvlər"
            name="members"
            rules={[{ required: true, message: "Ən azı bir üzv seçilməlidir." }]}
          >
            <Select
              mode="multiple"
              placeholder="Üzvləri seçin"
              allowClear
              optionFilterProp="children"
              showSearch
              maxTagCount={4}
            >
              {memberOptions.map((member) => (
                <Option key={member.id} value={member.id}>
                  {member.first_name} {member.last_name}
                </Option>
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

export default AddRoomModal;
