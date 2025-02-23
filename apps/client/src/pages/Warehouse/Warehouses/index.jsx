import { Button, Modal, Table, message } from "antd";
import { useEffect, useState } from "react";

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";

import AddWarehouseModal from "../../../components/AddWarehouseModal";

import "../warehouse.css";

const Warehouses = () => {
  const [data, setData] = useState([]);
  const [isAddWarehouseModal, setIsAddWarehouseModal] = useState(false);
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
      dataIndex: "region",
      key: "region"
    },
    {
      title: "Aktiv",
      key: "is_deleted",
      sorter: (a, b) => a?.is_deleted - b?.is_deleted,
      filters: Array.from(
        new Map(
          data.map(item => [
            item?.is_deleted,
            { text: item?.is_deleted ? "Aktiv" : "Qeyri-aktiv", value: item?.is_deleted }
          ])
        ).values()
      ),
      onFilter: (value, record) => record.is_deleted === value,
      render: item => (
        <a>
          {item?.is_deleted ? (
            <CheckCircleOutlined style={{ fontSize: "25px" }} />
          ) : (
            <CloseCircleOutlined style={{ fontSize: "25px" }} />
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
          <DeleteOutlined onClick={() => showConfirm(item?.id)} style={{ fontSize: "22px", color: "blue" }} />
        </div>
      )
    }
  ];

  const getListData = async () => {
    const token = localStorage.getItem("access_token");
    await fetch("http://37.61.77.5/warehouse/warehouses/", {
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
    await fetch(`http://37.61.77.5/warehouse/warehouses/${id}/`, {
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
        <Button onClick={openAddWarehouseModal}>Anbar əlavə et</Button>
      </div>

      <Table
      cellFontSize='20'
        dataSource={data}
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
