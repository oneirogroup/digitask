import { message, Popconfirm } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoAdd } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

import language from "../../../language.json";
import tasklanguage from "../../../taskPermissionLanguage.json";
import AddPositionModal from "./createModal.jsx";
import EditPositionModal from "./editModal.jsx";

const API_URL = "https://app.digitask.store/accounts/positions/positions/";

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalData, setModalData] = useState(null);
  const [positionModals, setPositionModals] = useState({});
  const [isAddPositionModal, setIsAddPositionModal] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const modalRef = useRef(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const openAddPositionModal = () => {
    setIsAddPositionModal(true);
  };
  const closeAddPositionModal = () => {
    setIsAddPositionModal(false);
  };

  const fetchPositions = async () => {
    try {
      const response = await axios.get(API_URL);
      setPositions(response.data.sort((a, b) => a.name.localeCompare(b.name)));
      initializePositionModals(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response.status == 403) {
        await fetchPositions();
        message.error("Vəzifə göstərilərkən xəta baş verdi");
      }
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const deletePosition = async id => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      fetchPositions();
    } catch (error) {
      if (error.response.status == 403) {
        await fetchPositions();
        message.error("Vəzifə göstərilərkən xəta baş verdi");
      }
    }
  };

  const confirm = async (positionId) => {
    try {
      await deletePosition(positionId);
      setPositionModals({});
      message.success('Tapşırıq uğurla silindi');
    } catch (error) {
      if (error.status == 403) {
        deletePosition(positionId);
        setPositionModals({});
      }
    }
  };

  const cancel = () => {
    message.info('Silinmə ləğv edildi');
  };


  const openSmallModal = id => {
    setPositionModals(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const handleClickOutside = event => {
      const isInModal = modalRef.current && modalRef.current.contains(event.target);
      const isInPopconfirm = event.target.closest('.custom-popconfirm') !== null;

      if (!isInModal && !isInPopconfirm) {
        setPositionModals({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getPermissionLabel = permission => {
    return language[permission] || tasklanguage[permission] || "-";
  };

  const handlePositionAdded = newPosition => {
    fetchPositions();
    setIsAddPositionModal(false);
  };
  const handleEditClick = position => {
    setModalData(position);
    setIsEditModalOpen(true);
  };

  const positionPermission = JSON.parse(localStorage.getItem("position"));

  return (
    <div>
      {positionPermission && positionPermission.users_permission !== "read_only" && (
        <div className="position-add-button">
          <button onClick={openAddPositionModal}>
            <IoAdd />
            Vəzifə əlavə et
          </button>
        </div>
      )}
      <div className="position-table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ad</th>
              <th>Anbar icazəsi</th>
              <th>İşçi icazəsi</th>
              <th>Tapşırıq icazəsi</th>
              <th>Hesabat icazəsi</th>
              {positionPermission && positionPermission.users_permission !== "read_only" && <th></th>}
            </tr>
          </thead>
          <tbody>
            {positions.map((position, index) => (
              <tr key={position.id}>
                <td>{`#${(index + 1).toString().padStart(4, "0")}`}</td>
                <td>{position.name}</td>
                <td>{getPermissionLabel(position.warehouse_permission)}</td>
                <td>{getPermissionLabel(position.users_permission)}</td>
                <td>{getPermissionLabel(position.tasks_permission)}</td>
                <td>{getPermissionLabel(position.report_permission)}</td>
                {positionPermission && positionPermission.users_permission !== "read_only" && (
                  <td>
                    <button onClick={() => openSmallModal(position.id)}>
                      <BsThreeDotsVertical />
                    </button>

                    {positionModals[position.id] && (
                      <div className="small-modal-position active" ref={modalRef}>
                        <div className="small-modal-position-content">
                          <button onClick={() => handleEditClick(position)}>
                            <MdOutlineEdit />
                          </button>
                          <Popconfirm
                            title="Bu tapşırığı silmək istədiyinizə əminsiniz?"
                            onConfirm={() => confirm(position.id)}
                            onCancel={cancel}
                            okText="Bəli"
                            cancelText="Xeyr"
                            overlayClassName="custom-popconfirm"
                          >
                            <button><RiDeleteBin6Line /></button>
                          </Popconfirm>
                        </div>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isAddPositionModal && <AddPositionModal onClose={closeAddPositionModal} onPositionAdded={handlePositionAdded} />}
      {isEditModalOpen && (
        <EditPositionModal
          position={modalData}
          onClose={() => setIsEditModalOpen(false)}
          onPositionUpdated={fetchPositions}
        />
      )}
    </div>
  );
};

export default Positions;
