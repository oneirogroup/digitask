import { Button, Modal, Table } from "antd";
import { useEffect, useState } from "react";
import EditInternetPacksModal from './EditInternetPacksModal'
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import "../tasks.css";

function Index({ internetPacksModalOpan, closeInternetPacksModal }) {
    const [internetPacks, setInternetPacks] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [editedPack, setEditedPack] = useState(null) 

    const goOpenModal = (id) => {
        setEditedPack(id)
        setOpenModal(true)
    }
    
    const goCloseModal = () => {
        setEditedPack(null)
        setOpenModal(false)
    }

  const columns = [
    {
      title: "İnternet paketi",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Qiymət (azn)",
      dataIndex: "price",
      key: "price"
    },
    {
      title: "Sürət (mb/s)",
      dataIndex: "speed",
      key: "speed"
    },
    {
      title: "",
      dataIndex: "",
      key: "x",
      render: item => (
        <div className="internet-actions">
          <EditOutlined onClick={()=>goOpenModal(item?.id)}/>
          <DeleteOutlined onClick={() => deleteInternetPack(item?.id)} />
        </div>
      )
    }
  ];


  const fetchInternetPacks = async () => {
      const response = await fetch("http://37.61.77.5/services/services/internet_packs/");
      if (!response.ok) {
        throw new Error("Failed to fetch internet packs");
      }
      const data = await response.json();
      setInternetPacks(data);
   
  };

  const deleteInternetPack = async id => {
    const response = await fetch(`http://37.61.77.5/services/services/internet_packs/${id}/`, {
      method: "DELETE"
    });
    if (response.ok) {
      fetchInternetPacks();
    }
  };

  useEffect(() => {
    fetchInternetPacks();
  }, []);

  return (
    <>
  
      <Modal
        width={900}
        title="Internet paketləri"
        open={internetPacksModalOpan}
        onOk={closeInternetPacksModal}
        onCancel={closeInternetPacksModal}
        okText="Tamamla"
        cancelText="Ləğv et"
      >
        <EditInternetPacksModal openModal={openModal} goCloseModal={goCloseModal} editedPack={editedPack} fetchInternetPacks={fetchInternetPacks} />
          <div className="newPackButton"><Button onClick={()=>goOpenModal(null)} >Yeni internet paketi</Button></div>
        <Table columns={columns} dataSource={internetPacks} pagination={false} />
      </Modal>
    </>
  );
}

export default Index;
