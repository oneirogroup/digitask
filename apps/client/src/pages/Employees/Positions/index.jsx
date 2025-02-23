import { message } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoAdd } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

import language from "../../../language.json";
import AddPositionModal from "./createModal.jsx";
import EditPositionModal from "./editModal.jsx";

const API_URL = "http://37.61.77.5/accounts/positions/positions/";

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
      setPositions(response.data);
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

  const openSmallModal = id => {
    setPositionModals(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setPositionModals({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getPermissionLabel = permission => {
    return language[permission] || "-";
  };

  const handlePositionAdded = newPosition => {
    fetchPositions();
    setIsAddPositionModal(false);
  };
  const handleEditClick = position => {
    setModalData(position);
    setIsEditModalOpen(true);
  };

  return (
    <div>
      <div className="position-add-button">
        <button onClick={openAddPositionModal}>
          <IoAdd />
          Vəzifə əlavə et
        </button>
      </div>
      <div className="position-table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ad</th>
              <th>Anbar icazəsi</th>
              <th>İşçi icazəsi</th>
              <th>Tapşırıq icazəsi</th>
              <th></th>
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
                        <button onClick={() => deletePosition(position.id)}>
                          <RiDeleteBin6Line />
                        </button>
                      </div>
                    </div>
                  )}
                </td>
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
