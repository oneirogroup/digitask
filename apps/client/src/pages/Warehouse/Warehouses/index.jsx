import { useEffect, useState } from "react";
import { Button, Modal, Table, message, Form, Radio, } from "antd";
import AddWarehouseModal from "../../../components/AddWarehouseModal";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import "../warehouse.css";

const Warehouses = () => {
  const [data, setData] = useState([]);
  const [isAddWarehouseModal, setIsAddWarehouseModal] = useState(false);
  const [tableLayout, setTableLayout] = useState('unset');

  const handleTableLayoutChange = (e) => {
    const layout = e.target.value;
    setTableLayout(layout);
  };


  const { confirm } = Modal;

  const columns = [
    {
      title: "Anbar adı",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a?.name - b?.name,
      filters: data.map(item => ({
        text: item.name,
        value: item.name
      })),
      onFilter: (value, record) => record.name.indexOf(value) === 0
    },
    {
      title: "Region",
      dataIndex: "region_name",
      key: "region_name"
    },
    {
      title: "Aktiv",
      key: "is_deleted",
      sorter: (a, b) => a?.is_deleted - b?.is_deleted,
      filters: Array.from(
        new Map(
          data.map(item => [
            item?.is_deleted,
            { text: !item?.is_deleted ? "Aktiv" : "Qeyri-aktiv", value: item?.is_deleted }
          ])
        ).values()
      ),
      onFilter: (value, record) => record.is_deleted === value,
      render: item => (
        <a>
          {!item?.is_deleted ? (
            <CheckCircleOutlined style={{ fontSize: "25px", color: 'green' }} />
          ) : (
            <CloseCircleOutlined style={{ fontSize: "25px", color: 'red' }} />
          )}
        </a>
      )
    },
    {
      title: "",
      key: "operation",
      fixed: "right",
      width: 100,
      render: item => (
        <div style={{ display: "flex", gap: "10px" }}>
          <DeleteOutlined onClick={() => !item?.is_deleted && showConfirm(item?.id)} style={{ fontSize: "22px", color: !item?.is_deleted ? 'blue' : 'gray' }} />
        </div>
      )
    }
  ];

  const getListData = async () => {
    const token = localStorage.getItem("access_token");
    await fetch("https://app.digitask.store/warehouse/warehouses/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(res => {
        console.log(res, "vvvvvvvvvvvvvv");
        setData(res);
      });
  };

  const removeWarehouse = async id => {
    await fetch(`https://app.digitask.store/warehouse/warehouses/${id}/`, {
      method: "DELETE"
    }).then(res => {
      if (res?.status == 204) {
        getListData();
        message.success("Uğurla silindi!");
      }
    });
  };

  useEffect(() => {
    getListData();
  }, []);

  const showConfirm = id => {
    confirm({
      title: "Təsdiqlə",
      icon: <ExclamationCircleOutlined />,
      content: "Anbar silindikdən sonra bərpası mümkündür!",
      okText: "Təsdiqlə",
      cancelText: "Ləğv et",
      onOk() {
        removeWarehouse(id);
      }
    });
  };

  const openAddWarehouseModal = () => {
    setIsAddWarehouseModal(true);
  };

  const closeAddWarehouseModal = () => {
    setIsAddWarehouseModal(false);
  };

  const handleWarehouseAdded = () => {
    getListData();
  };

  return (
    <div>
      {isAddWarehouseModal && (
        <AddWarehouseModal
          isOpen={isAddWarehouseModal}
          onClose={closeAddWarehouseModal}
          onWarehouseAdded={handleWarehouseAdded}
        />
      )}
      <div className="newWarehouse">
        <Form.Item>
          <Radio.Group value={tableLayout} onChange={handleTableLayoutChange}>
            <Radio.Button value="unset">Aktiv</Radio.Button>
            <Radio.Button value="fixed">Qeyri-aktiv</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Button onClick={openAddWarehouseModal}>Anbar əlavə et</Button>
      </div>

      <Table
        cellFontSize="20"
        dataSource={data.filter(item =>
          tableLayout === 'unset' ? !item.is_deleted : item.is_deleted
        )}
        columns={columns}
        pagination={false}
        scroll={{
          x: "calc(700px + 50%)"
        }}
      />

    </div>
  );
};

export default Warehouses;
